// components/FamilyEditForm.tsx
'use client'

import { useState, useRef } from 'react';
import Image from 'next/image';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-toastify';
import DeleteFamilyButton from './DeleteFamilyButton';
import { DashboardFamily, SimpleUser } from '@/types/app';

interface FamilyEditFormProps {
  family: DashboardFamily;
  currentUser: SimpleUser;
  hasGroups: boolean;
  onUpdate: (updatedFamily: DashboardFamily) => void;
  onCancel: () => void;
}

export default function FamilyEditForm({ family, currentUser, hasGroups, onUpdate, onCancel }: FamilyEditFormProps) {
  const [familyName, setFamilyName] = useState(family.name);
  const [homeAddress, setHomeAddress] = useState(family.homeAddress);
  const [children, setChildren] = useState(family.children);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(family.image || '');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddChild = () => {
    const newChild = {
      id: `new-${Date.now()}`,
      name: '',
      familyId: family.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChildren([...children, newChild]);
  };

  const handleChildNameChange = (index: number, name: string) => {
    const newChildren = [...children];
    newChildren[index].name = name;
    newChildren[index].updatedAt = new Date();
    setChildren(newChildren);
  };

  const handleRemoveChild = (index: number) => {
    const newChildren = [...children];
    newChildren.splice(index, 1);
    setChildren(newChildren);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsImageUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/family/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPreviewUrl(data.imageUrl);
          toast.success('Image uploaded successfully');
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('familyId', family.id);
    formData.append('name', familyName);
    formData.append('homeAddress', homeAddress);
    formData.append('children', JSON.stringify(children));
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/family/update', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const updatedFamily = await response.json();
        onUpdate(updatedFamily);
        toast.success('Family updated successfully');
      } else {
        throw new Error('Failed to update family');
      }
    } catch (error) {
      console.error('Failed to update family:', error);
      toast.error('Failed to update family. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      <div className="bg-gray-950 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Family Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="familyImage" className="block text-sm font-medium mb-1">Family Image</label>
            <div className="flex items-center space-x-4">
              {isImageUploading ? (
                <LoadingSpinner />
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Family"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-700 rounded-full" />
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
            <div key={child.id} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={child.name}
                onChange={(e) => handleChildNameChange(index, e.target.value)}
                className="flex-grow bg-gray-700 text-white border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder={`Child ${index + 1} name`}
              />
              <button 
                type="button"
                onClick={() => handleRemoveChild(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button 
          type="button" 
          onClick={handleAddChild}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Child
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
          Update Family
        </button>
        <DeleteFamilyButton 
          familyId={family.id} 
          isAdmin={currentUser.isAdmin} 
          hasGroups={hasGroups} 
        />
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}