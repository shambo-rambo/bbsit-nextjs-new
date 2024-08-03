// components/FriendlyError.tsx

import React from 'react';

interface FriendlyErrorProps {
  message: string;
  suggestion?: string;
}

const FriendlyError: React.FC<FriendlyErrorProps> = ({ message, suggestion }) => {
  return (
    <div className="bg-gray-950 border border-accent rounded-lg p-4 my-4 text-white">
      <p className="text-accent font-semibold mb-2">{message}</p>
      {suggestion && <p className="text-gray-300">{suggestion}</p>}
    </div>
  );
};

export default FriendlyError;