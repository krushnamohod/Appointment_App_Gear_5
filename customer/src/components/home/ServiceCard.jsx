import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../context/BookingContext';
import Button from '../common/Button';

/**
 * @intent Displays a service card with book button that navigates to booking flow
 */
const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { updateBooking, setStep } = useBookingStore();

  const handleBook = () => {
    updateBooking({ service });
    setStep(2); // Skip to provider selection since service is already selected
    navigate('/book');
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {service.image && (
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">
            {service.name}
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-primary">
            {service.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {service.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-700">
          <span>⏱ {service.duration} mins</span>
          <span className="font-semibold text-primary">₹{service.price}</span>
        </div>

        <Button onClick={handleBook}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
