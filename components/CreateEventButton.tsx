// components/CreateEventButton.tsx

'use client'

import { useState } from 'react';

const CreateEventButton = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    const formContainer = document.getElementById('createEventFormContainer');
    if (formContainer) {
      formContainer.classList.toggle('hidden');
    }
  };

  return (
    <button
      onClick={toggleForm}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      {isFormVisible ? 'Hide Create Event' : 'Create Event'}
    </button>
  );
};

export default CreateEventButton;