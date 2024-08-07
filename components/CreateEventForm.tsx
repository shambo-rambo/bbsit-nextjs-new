// components/CreateEventForm.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventDateTimePicker from './EventDateTimePicker';
import PointsInput from './PointsInput';
import { Event, Group } from '@/types/app';
import { LoadingSpinner } from './LoadingSpinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateEventFormProps {
  groups: Group[];
  familyId: string;
  onEventCreated: () => void;
  editingEvent?: Event | null;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ groups, familyId, onEventCreated, editingEvent }) => {
  const [name, setName] = useState(editingEvent?.name || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [startDate, setStartDate] = useState<Date | null>(editingEvent ? new Date(editingEvent.startTime) : null);
  const [endDate, setEndDate] = useState<Date | null>(editingEvent ? new Date(editingEvent.endTime) : null);
  const [points, setPoints] = useState(editingEvent?.points || 4);
  const [calculatedPoints, setCalculatedPoints] = useState(4);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(editingEvent?.groupId || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const minPoints = 4;

  const handleDateTimeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      const newCalculatedPoints = Math.max(Math.round(durationInHours), minPoints);
      setCalculatedPoints(newCalculatedPoints);
      setPoints(newCalculatedPoints);
    }
  }, [startDate, endDate]);

  const handlePointsChange = (newPoints: number) => {
    setPoints(Math.max(newPoints, calculatedPoints));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error('Please select start and end times for the event.');
      return;
    }

    if (!selectedGroupId) {
      toast.error('Please select a group for the event.');
      return;
    }

    setIsLoading(true);

    try {
      const url = editingEvent ? `/api/event/${editingEvent.id}/update` : '/api/event/create';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          points,
          groupId: selectedGroupId,
          familyId
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create/update event');

      toast.success(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      onEventCreated();
      router.push(`/groups/${selectedGroupId}`);
    } catch (error) {
      console.error('Error creating/updating event:', error);
      toast.error(`Failed to ${editingEvent ? 'update' : 'create'} event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 relative">
          <label htmlFor="group-select" className="block text-sm font-medium text-gray-300">
            Select Group
          </label>
          <select
            id="group-select"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            required
          >
            <option value="">Select a group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="event-name" className="block text-sm font-medium text-gray-300">
            Event Name
          </label>
          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="event-description" className="block text-sm font-medium text-gray-300">
            Event Description
          </label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <EventDateTimePicker onDateTimeChange={handleDateTimeChange} initialStart={startDate} initialEnd={endDate} />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Points (minimum {calculatedPoints})
          </label>
          <PointsInput
            value={points}
            onChange={handlePointsChange}
            minPoints={calculatedPoints}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : (editingEvent ? 'Update Event' : 'Create Event')}
        </button>
      </form>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </div>
  );
};

export default CreateEventForm;
