'use client'

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EventDateTimePickerProps {
  onDateTimeChange: (startDate: Date, endDate: Date) => void;
}

const EventDateTimePicker: React.FC<EventDateTimePickerProps> = ({ onDateTimeChange }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date ?? undefined);
    if (date && (!endDate || date > endDate)) {
      setEndDate(date);
    }
    if (date && endDate) {
      onDateTimeChange(date, endDate);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date ?? undefined);
    if (date && startDate) {
      onDateTimeChange(startDate, date);
    }
  };

  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Start date and time"
          filterTime={filterPassedTime}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center space-x-4">
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="End date and time"
          filterTime={filterPassedTime}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default EventDateTimePicker;