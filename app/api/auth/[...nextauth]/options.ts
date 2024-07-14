// app/api/auth/[...nextauth]/options.ts

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,  // Add this line at the top of the configuration
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
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email != null) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { family: true },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
          user.id = newUser.id;
        } else {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name,
              image: user.image,
            },
          });
          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        const latestUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true, familyId: true }
        });
  
        if (latestUser) {
          session.user.name = latestUser.name;
          session.user.email = latestUser.email;
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
}