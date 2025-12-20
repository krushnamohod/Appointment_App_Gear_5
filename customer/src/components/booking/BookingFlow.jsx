import { useBookingStore } from '../../context/BookingContext';
import ProgressSteps from './ProgressSteps';
import SelectServiceStep from './SelectServiceStep';
import SelectProviderStep from './SelectProviderStep';
import SelectDateTimeStep from './SelectDateTimeStep';
import DetailsPaymentStep from './DetailsPaymentStep';
import { useEffect, useState } from 'react';
import { getServices } from '../../services/appointmentService';

const BookingFlow = () => {
  const { step } = useBookingStore();
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then((res) => setServices(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ProgressSteps currentStep={step} />

      {step === 1 && (
        <SelectServiceStep services={services} />
      )}
      {step === 2 && <SelectProviderStep />}
      {step === 3 && <SelectDateTimeStep />}
      {step === 4 && <DetailsPaymentStep />}
    </div>
  );
};

export default BookingFlow;
