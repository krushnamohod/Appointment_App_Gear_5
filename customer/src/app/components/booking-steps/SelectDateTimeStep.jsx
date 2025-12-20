'use client';

import { useState } from 'react';
import { mockTimeSlots } from '../../data/mockData';

const SelectDateTimeStep = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const dates = ['Dec 21', 'Dec 22', 'Dec 23', 'Dec 24', 'Dec 25'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Choose Date</label>
        <div className="grid grid-cols-5 gap-2">
          {dates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-lg border-2 font-medium transition-all
                ${selectedDate === date
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {mockTimeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border-2 font-medium transition-all text-sm
                  ${selectedTime === time
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => selectedDate && selectedTime && onNext({ date: selectedDate, time: selectedTime })}
          disabled={!selectedDate || !selectedTime}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectDateTimeStep;