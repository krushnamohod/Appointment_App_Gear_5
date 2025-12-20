'use client';

import { useState } from 'react';
import SelectServiceStep from './booking-steps/SelectServiceStep';
import SelectProviderStep from './booking-steps/SelectProviderStep';
import SelectDateTimeStep from './booking-steps/SelectDateTimeStep';
import DetailsPaymentStep from './booking-steps/DetailsPaymentStep';

const BookingFlow = ({ bookingData, setBookingData, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, title: 'Select Service' },
    { number: 2, title: 'Choose Provider' },
    { number: 3, title: 'Pick Date & Time' },
    { number: 4, title: 'Details & Payment' }
  ];

  const handleNext = (data) => {
    setBookingData({ ...bookingData, ...data });
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, idx) => (
            <div key={s.number} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold
                  ${step >= s.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {s.number}
                </div>
                <span className="text-xs mt-2 text-gray-600 hidden md:block">{s.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${step > s.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        {step === 1 && <SelectServiceStep onNext={handleNext} onBack={handleBack} />}
        {step === 2 && <SelectProviderStep onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <SelectDateTimeStep onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <DetailsPaymentStep onNext={handleNext} onBack={handleBack} />}
      </div>
    </div>
  );
};

export default BookingFlow;