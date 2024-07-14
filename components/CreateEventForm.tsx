// components/CreateEventForm.tsx

'use client'

import React, { useState, useEffect } from 'react';
import EventDateTimePicker from './EventDateTimePicker';
import PointsInput from './PointsInput';
import { Event } from '@/types/app';

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
      alert('Please select start and end times for the event.');
      return;
    }

    try {
      const url = editingEvent 
        ? `/api/event/${editingEvent.id}/update`
        : '/api/event/create';

      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          points,
          groupId,
          familyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create/update event');
      }

      setName('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setPoints(minPoints);
      setCalculatedPoints(minPoints);

      onEventCreated();

      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');

    } catch (error) {
      console.error('Error creating/updating event:', error);
      if (error instanceof Error && error.message === 'Not authorized to update this event') {
        alert('You are not authorized to update this event. Only the event creator can make changes.');
      } else {
        alert(`Failed to ${editingEvent ? 'update' : 'create'} event: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Event Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
          className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          rows={3}
        />
      </div>
      <EventDateTimePicker onDateTimeChange={handleDateTimeChange} />
      <div>
        <label htmlFor="points" className="block text-sm font-medium text-gray-300">
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
        className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {editingEvent ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventForm;