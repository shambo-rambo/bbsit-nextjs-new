'use client'

import React from 'react';

interface PointsInputProps {
  value: number;
  onChange: (value: number) => void;
  minPoints: number;
}

const PointsInput: React.FC<PointsInputProps> = ({ value, onChange, minPoints }) => {
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    if (value > minPoints) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={decrement}
        className="px-3 py-2 bg-accent rounded-l-md text-black"
        disabled={value <= minPoints}
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = Math.max(minPoints, parseInt(e.target.value) || minPoints);
          onChange(newValue);
        }}
        className="w-16 text-center p-2 border-t border-b border-gray-300"
        min={minPoints}
      />
      <button
        type="button"
        onClick={increment}
        className="px-3 py-2 bg-accent rounded-r-md text-black"
      >
        +
      </button>
    </div>
  );
};

export default PointsInput;