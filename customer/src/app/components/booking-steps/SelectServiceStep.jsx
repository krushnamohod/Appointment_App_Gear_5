'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { mockServices } from '../../data/mockData';

const SelectServiceStep = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
      <div className="space-y-4 mb-8">
        {mockServices.map(service => (
          <button
            key={service.id}
            onClick={() => setSelected(service)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all
              ${selected?.id === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.duration} min
                  <span className="ml-4 font-semibold text-blue-600">₹{service.price}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => selected && onNext({ service: selected })}
          disabled={!selected}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectServiceStep;