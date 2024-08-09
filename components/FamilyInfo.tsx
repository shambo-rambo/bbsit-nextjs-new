// bbsit-deploy/components/FamilyInfo.tsx

import { useState, useEffect } from 'react';
import { FamilyDashboardData } from '@/types/app';

interface FamilyInfoProps {
  family: FamilyDashboardData;
  currentUserId: string;
}

export default function FamilyInfo({ family, currentUserId }: FamilyInfoProps) {
  const [members, setMembers] = useState(family.members.slice(0, 10));
  const [children, setChildren] = useState(family.children.slice(0, 10));
  const [memberPage, setMemberPage] = useState(1);
  const [childrenPage, setChildrenPage] = useState(1);

  const loadMoreMembers = () => {
    const nextPage = memberPage + 1;
    setMembers(family.members.slice(0, nextPage * 10));
    setMemberPage(nextPage);
  };

  const loadMoreChildren = () => {
    const nextPage = childrenPage + 1;
    setChildren(family.children.slice(0, nextPage * 10));
    setChildrenPage(nextPage);
  };

  return (
    <div className="family-info space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Family Information</h2>
        <p><strong>Name:</strong> {family.name}</p>
        <p><strong>Address:</strong> {family.homeAddress}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul className="list-disc pl-5">
          {members.map(member => (
            <li key={member.id}>
              {member.name || member.email}
              {member.id === family.currentAdminId && ' (Admin)'}
            </li>
          ))}
        </ul>
        {members.length < family.members.length && (
          <button onClick={loadMoreMembers}>Load More Members</button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Children</h3>
        <ul className="list-disc pl-5">
          {children.map(child => (
            <li key={child.id}>{child.name}</li>
          ))}
        </ul>
        {children.length < family.children.length && (
          <button onClick={loadMoreChildren}>Load More Children</button>
        )}
      </div>
    </div>
  );
}
