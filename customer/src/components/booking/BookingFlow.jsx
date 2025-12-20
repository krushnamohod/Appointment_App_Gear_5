import { useEffect, useState } from 'react';
import { useBookingStore } from '../../context/BookingContext';
import { getServices } from '../../services/appointmentService';
import ConfirmationStep from './ConfirmationStep';
import DetailsPaymentStep from './DetailsPaymentStep';
import PaymentStep from './PaymentStep';
import ProgressSteps from './ProgressSteps';
import SelectDateTimeStep from './SelectDateTimeStep';
import SelectProviderStep from './SelectProviderStep';
import SelectServiceStep from './SelectServiceStep';

/**
 * @intent Booking flow with 6 steps: Service, Provider, DateTime, Details, Confirmation/Payment
 * Free: Service → Provider → DateTime → Details → Confirmation
 * Paid: Service → Provider → DateTime → Details → Payment → Confirmation
 */
const BookingFlow = () => {
  const { step } = useBookingStore();
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        setError("Failed to load services. Please check your connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading services...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Only show progress steps for steps 1-4 */}
      {step <= 4 && <ProgressSteps currentStep={step} />}

      {step === 1 && <SelectServiceStep services={services} />}
      {step === 2 && <SelectProviderStep />}
      {step === 3 && <SelectDateTimeStep />}
      {step === 4 && <DetailsPaymentStep />}
      {step === 5 && <ConfirmationStep />}
      {step === 6 && <PaymentStep />}
    </div>
  );
};

export default BookingFlow;
