// app/api/auth/[...nextauth]/options.ts

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorization error: Missing email or password");
          return null;
        }
      
        const email = credentials.email.trim().toLowerCase();
        console.log("Attempting to find user with email:", email);
      
        try {
          const user = await prisma.user.findUnique({
            where: { email }
          });
      
          if (!user) {
            console.log("Authorization error: No user found with this email", email);
            return null;
          }
      
          if (!user.password) {
            console.log("Authorization error: User has no password set", email);
            return null;
          }
      
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.log("Authorization error: Password does not match for email:", email);
            return null;
          }
      
          console.log("User found and authenticated:", user);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error) {
            throw new Error(`Authorization error: ${error.message}`);
          } else {
            throw new Error('An unknown error occurred during authorization');
          }
        }
      }      
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email != null) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
    
        if (!existingUser) {
          console.log("Creating new user for Google account");
          const newUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
          console.log("New user created:", newUser);
          user.id = newUser.id;
        } else {
          console.log("Updating existing user for Google account");
          const updatedData: any = {
            name: user.name,
          };
          
          // Only update the image if the user doesn't already have a custom image
          if (!existingUser.image || existingUser.image.includes('googleusercontent.com')) {
            updatedData.image = user.image;
          }
    
          const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: updatedData,
          });
          console.log("User updated:", updatedUser);
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        const latestUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true, image: true, familyId: true }
        });
    
        if (latestUser) {
          session.user.name = latestUser.name;
          session.user.email = latestUser.email;
          session.user.image = latestUser.image;
          (session.user as any).familyId = latestUser.familyId;
        }
          }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
};
