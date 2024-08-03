// bbsit-deploy/components/FamilySettingsForm.tsx

'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DeleteFamilyButton from './DeleteFamilyButton';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string;
  name: string | null;
  email: string;
  isAdmin: boolean;
}

interface Child {
  id: string;
  name: string;
}

interface Family {
  id: string;
  name: string;
  homeAddress: string;
  image: string | null;
  members: User[];
  children: Child[];
  adminOfGroups: any[];
}

interface FamilySettingsFormProps {
  family: Family | null;
  currentUser: User;
  hasGroups: boolean;
}

export default function FamilySettingsForm({ family, currentUser, hasGroups }: FamilySettingsFormProps) {
  const [familyName, setFamilyName] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (family) {
      setFamilyName(family.name);
      setHomeAddress(family.homeAddress);
      setChildren(family.children);
      setPreviewUrl(family.image || '');
    }
  }, [family]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) return;

    const formData = new FormData();
    formData.append('familyId', family.id);
    formData.append('name', familyName);
    formData.append('homeAddress', homeAddress);
    formData.append('children', JSON.stringify(children.map(child => ({ id: child.id, name: child.name }))));
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/family/update', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Family Updated', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.refresh();
      } else {
        throw new Error('Failed to update family');
      }
    } catch (error) {
      console.error('Failed to update family:', error);
      toast.error('Failed to update family. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!family) return;

    try {
      const response = await fetch(`/api/family/remove-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId: family.id, memberId }),
      });

      if (response.ok) {
        toast.success('Member removed successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.refresh();
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (!family) {
    return <div>Loading family data...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 text-white max-w-3xl mx-auto">
        <div className="bg-gray-950 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Family Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="familyImage" className="block text-sm font-medium mb-1">Family Image</label>
              <div className="flex items-center space-x-4">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Family"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                )}
                <input
                  type="file"
                  id="familyImage"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="familyName" className="block text-sm font-medium mb-1">Family Name</label>
              <input
                id="familyName"
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label htmlFor="homeAddress" className="block text-sm font-medium mb-1">Home Address</label>
              <input
                id="homeAddress"
                type="text"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                required
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-950 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Children</h2>
          <div className="space-y-3">
            {children.map((child, index) => (
              <div key={child.id}>
                <input
                  type="text"
                  value={child.name}
                  onChange={(e) => {
                    const newChildren = [...children];
                    newChildren[index].name = e.target.value;
                    setChildren(newChildren);
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder={`Child ${index + 1} name`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-950 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Family Members</h2>
          <div className="space-y-3">
            {family?.members.map((member) => (
              <div key={member.id} className="flex justify-between items-center">
                <span>{member.name} ({member.email})</span>
                {member.id !== currentUser.id && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button type="submit" className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
            Update Family
          </button>
          <DeleteFamilyButton 
            familyId={family?.id} 
            isAdmin={currentUser.isAdmin} 
            hasGroups={hasGroups} 
          />
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
