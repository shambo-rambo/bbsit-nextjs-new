'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { DashboardSummary, DashboardFamily } from '@/types/app';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const FamilyInfo = dynamic(() => import('@/components/FamilyInfo'), { 
  loading: () => <LoadingSpinner />,
  ssr: false 
});
const InvitationList = dynamic(() => import('@/components/InvitationList'), { 
  loading: () => <LoadingSpinner />,
  ssr: false 
});
const InviteForm = dynamic(() => import('@/components/InviteForm'), { 
  loading: () => <LoadingSpinner />,
  ssr: false 
});
const CreateFamilyForm = dynamic(() => import('@/components/CreateFamilyForm'), { ssr: false });
const FamilyEditForm = dynamic(() => import('@/components/FamilyEditForm'), { ssr: false });

interface FamilyDashboardClientProps {
  dashboardSummary: DashboardSummary;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Oops! </strong>
      <span className="block sm:inline">Something went wrong:</span>
      <pre className="mt-2 text-sm">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Try again
      </button>
    </div>
  );
}

export default function FamilyDashboardClient({ dashboardSummary }: FamilyDashboardClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [familyData, setFamilyData] = useState<DashboardFamily | null>(dashboardSummary.family);

  useEffect(() => {
    console.log('Dashboard Summary:', dashboardSummary);
    console.log('Family Data:', familyData);
    console.log('Children in Dashboard Summary:', dashboardSummary.family?.children);
    console.log('Children in Family Data:', familyData?.children);
  }, [dashboardSummary, familyData]);

  const handleEditToggle = () => {
    console.log('Edit toggled. Current family data:', familyData);
    setIsEditing(!isEditing);
  };

  const handleFamilyUpdate = (updatedFamily: DashboardFamily) => {
    console.log('Family update received:', updatedFamily);
    setFamilyData(updatedFamily);
    setIsEditing(false);
    toast.success('Family Updated Successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen bg-gray-950 text-white p-8 flex justify-center items-start">
          <div className="max-w-3xl w-full bg-gray-950 rounded-lg shadow-lg p-6 border-2 border-accent">
            {!familyData ? (
              <>
                <h1 className="text-3xl font-extrabold mb-6">Create Your Family</h1>
                <CreateFamilyForm user={dashboardSummary.user} />
                {dashboardSummary.pendingInvitationsCount > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Pending Invitations</h2>
                    <InvitationList userId={dashboardSummary.user.id} />
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold mb-6">{familyData.name}</h1>

                <div className="mb-8 relative">
                  {familyData.image ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={familyData.image}
                        alt={`${familyData.name} family photo`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-all duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-gray-400">No family photo yet</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    <h2 className="text-xl font-semibold">{familyData.name}</h2>
                    <p className="text-sm text-gray-300">{familyData.homeAddress}</p>
                  </div>
                </div>

                {isEditing ? (
                  <>
                    {console.log('Rendering FamilyEditForm with data:', familyData)}
                    <FamilyEditForm 
                      family={familyData}
                      currentUser={dashboardSummary.user}
                      hasGroups={familyData.groups?.length > 0 || false}
                      onUpdate={handleFamilyUpdate}
                      onCancel={() => setIsEditing(false)}
                    />
                  </>
                ) : (
                  <>
                    <FamilyInfo 
                      family={familyData}
                      upcomingEvents={dashboardSummary.upcomingEvents}
                    />

                    {dashboardSummary.user.isAdmin && (
                      <div className="mt-6">
                        <h2 className="text-2xl font-semibold mb-4">Invite Partner</h2>
                        <InviteForm familyId={familyData.id} />
                      </div>
                    )}

                    <button 
                      onClick={handleEditToggle} 
                      className="w-full mt-6 px-6 py-2 bg-accent text-black font-semibold rounded-lg transition duration-300 ease-in-out hover:opacity-90"
                    >
                      Edit Family
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <ToastContainer />
      </Suspense>
    </ErrorBoundary>
  );
}