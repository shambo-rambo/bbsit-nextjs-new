'use client'

import React, { useState, useEffect } from 'react';
import EventDateTimePicker from './EventDateTimePicker';
import PointsInput from './PointsInput';
import { Event } from '@/types/app';
import { LoadingSpinner } from './LoadingSpinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateEventFormProps {
  groupId: string;
  familyId: string;
  onEventCreated: () => void;
  editingEvent?: Event | null;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ groupId, familyId, onEventCreated, editingEvent }) => {
  const [name, setName] = useState(editingEvent?.name || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [startDate, setStartDate] = useState<Date | null>(editingEvent ? new Date(editingEvent.startTime) : null);
  const [endDate, setEndDate] = useState<Date | null>(editingEvent ? new Date(editingEvent.endTime) : null);
  const [points, setPoints] = useState(editingEvent?.points || 4);
  const [calculatedPoints, setCalculatedPoints] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    try {
      const url = editingEvent ? `/api/event/${editingEvent.id}/update` : '/api/event/create';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, startTime: startDate.toISOString(), endTime: endDate.toISOString(), points, groupId, familyId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create/update event');

      setName('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setPoints(minPoints);
      setCalculatedPoints(minPoints);

      onEventCreated();
      toast.success(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
    } catch (error) {
      console.error('Error creating/updating event:', error);
      toast.error(`Failed to ${editingEvent ? 'update' : 'create'} event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <EventDateTimePicker onDateTimeChange={handleDateTimeChange} />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
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