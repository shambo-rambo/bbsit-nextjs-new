// hooks/useFamilyData.ts

import { useState, useEffect } from 'react';
import { DashboardSummary, FamilyWithFullDetails } from '@/types/app';
import { toast } from 'react-toastify';

async function fetchFullFamilyData(familyId: string): Promise<FamilyWithFullDetails> {
  const response = await fetch(`/api/family/${familyId}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch family data');
  }
  return response.json();
}

async function updateFamily(familyId: string, updatedData: Partial<FamilyWithFullDetails>): Promise<FamilyWithFullDetails> {
  const response = await fetch('/api/family/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ familyId, ...updatedData }),
  });
  if (!response.ok) {
    throw new Error('Failed to update family');
  }
  return response.json();
}

export function useFamilyData(initialData: DashboardSummary) {
  const [familyData, setFamilyData] = useState<FamilyWithFullDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialData.family !== null) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchFullFamilyData(initialData.family!.id);
          setFamilyData(data);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          toast.error('Failed to fetch full family data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
      setFamilyData(null);
    }
  }, [initialData.family]);

  const updateFamilyData = async (updatedData: Partial<FamilyWithFullDetails>) => {
    if (!familyData) return;
    setLoading(true);
    try {
      const updatedFamily = await updateFamily(familyData.id, updatedData);
      setFamilyData(updatedFamily);
      toast.success('Family updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      toast.error('Failed to update family');
    } finally {
      setLoading(false);
    }
  };

  return { 
    familyData, 
    loading, 
    error, 
    updateFamilyData,
    initialFamilyData: initialData.family 
  };
}