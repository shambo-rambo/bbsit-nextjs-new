import Link from 'next/link';

export default function InvitationSent() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Invitation Sent!</h1>
      <p className="mb-4">An invitation has been sent to the partner&apos;s email address.</p>      <Link href="/family/dashboard" className="text-blue-500 hover:underline">
        Return to Dashboard
      </Link>
    </div>
  );
}