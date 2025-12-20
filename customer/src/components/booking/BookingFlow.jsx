import { useEffect, useState } from 'react';
import { Calendar, X } from 'lucide-react';
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
 * @intent Global Booking Widget
 * - Floating Action Button (Bottom Right)
 * - Sidebar Drawer (Right on Desktop, Bottom on Mobile)
 */
const BookingFlow = () => {
  const { step, isOpen, closeDrawer, openDrawer, resetBooking } = useBookingStore();
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

  const handleClose = () => {
    closeDrawer();
  };

  // Determine current component
  const renderStep = () => {
    switch (step) {
      case 1: return <SelectServiceStep services={services} />;
      case 2: return <SelectProviderStep />;
      case 3: return <SelectDateTimeStep />;
      case 4: return <DetailsPaymentStep />;
      case 5: return <ConfirmationStep />;
      case 6: return <PaymentStep />;
      default: return null;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={openDrawer}
        className={`
          fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-terracotta text-white shadow-lg 
          flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        aria-label="Book Appointment"
      >
        <Calendar size={28} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Drawer Container */}
      <div
        className={`
          fixed z-50 bg-paper shadow-2xl transition-transform duration-300 ease-out flex flex-col
          /* Mobile: Bottom Sheet */
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh] h-[85vh]
          md:translate-y-0 ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          
          /* Desktop: Right Sidebar */
          md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[480px] md:h-full md:rounded-none
          ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink/10">
          <h2 className="font-serif text-xl text-ink">Book Appointment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-ink/5 rounded-full transition-colors text-ink/60 hover:text-ink"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar (Sticky) */}
        {step <= 4 && (
          <div className="px-6 pt-4 pb-2 bg-paper/50 backdrop-blur-sm z-10">
            <ProgressSteps currentStep={step} />
          </div>
        )}

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="p-8 text-center text-ink/50">Loading services...</div>
          ) : error ? (
            <div className="p-8 text-center text-error">{error}</div>
          ) : (
            renderStep()
          )}
        </div>
      </div>
    </>
  );
};

export default BookingFlow;
