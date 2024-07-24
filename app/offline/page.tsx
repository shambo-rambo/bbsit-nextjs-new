// bbsit-deploy/app/offline/page.tsx

export default function Offline() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">
          You&apos;re offline
        </h1>
  
        <p className="mt-3 text-2xl">
          Please check your internet connection and try again.
        </p>
      </div>
    )
  }