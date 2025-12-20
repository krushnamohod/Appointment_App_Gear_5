import { User, Clock } from 'lucide-react';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">
            {service.category}
          </span>
          <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{service.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          {service.provider}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {service.duration} minutes
        </div>
        <div className="flex items-center text-sm font-semibold text-gray-900">
          <span className="text-blue-600 text-lg">₹{service.price}</span>
        </div>
      </div>

      <button
        onClick={onBook}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;