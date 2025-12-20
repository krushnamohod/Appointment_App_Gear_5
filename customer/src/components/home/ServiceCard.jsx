import { MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Odoo-style appointment card with picture, users, location, intro
 * @param {object} service - Service data object
 */
const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { updateBooking, setStep } = useBookingStore();

  const handleBook = () => {
    updateBooking({ service });
    setStep(2);
    navigate('/book');
  };

  // Mock data for users/resources
  const users = ['A1', 'A2'];
  const location = service.category || 'Office';

  return (
    <div
      className="border-2 border-red-400 rounded-lg p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleBook}
    >
      {/* Title */}
      <h3 className="text-red-500 font-medium mb-4">{service.name}</h3>

      <div className="flex gap-4">
        {/* Picture Area */}
        <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden flex-shrink-0">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Picture
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-between text-sm">
          {/* Users/Resources */}
          <div>
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <Users size={14} />
              <span>Users</span>
            </p>
            <div className="space-y-1">
              {users.map((user) => (
                <p key={user} className="text-red-500 font-medium">{user}</p>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mt-3">
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <MapPin size={14} />
              <span>Location</span>
            </p>
            <p className="text-gray-700">{location}</p>
          </div>
        </div>
      </div>

      {/* Introduction Message */}
      <p className="text-red-500 mt-4 text-sm">
        {service.description || 'Introduction message'}
      </p>

      {/* Price Badge */}
      <div className="mt-3 flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded ${service.price === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
          {service.price === 0 ? 'Free' : `₹${service.price}`}
        </span>
        <span className="text-xs text-gray-500">{service.duration} mins</span>
      </div>
    </div>
  );
};

export default ServiceCard;
