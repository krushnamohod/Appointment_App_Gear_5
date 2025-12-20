'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

const SelectProviderStep = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState(null);
  const providers = ['Dr. Sarah Smith', 'Dr. John Doe', 'Dr. Emily Brown'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Provider</h2>
      <div className="space-y-4 mb-8">
        {providers.map(provider => (
          <button
            key={provider}
            onClick={() => setSelected(provider)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all
              ${selected === provider
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{provider}</h3>
                <p className="text-sm text-gray-600">Available today</p>
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
          Back
        </button>
        <button
          onClick={() => selected && onNext({ provider: selected })}
          disabled={!selected}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectProviderStep;