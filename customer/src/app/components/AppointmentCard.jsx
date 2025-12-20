import { Calendar } from 'lucide-react';

const AppointmentCard = ({ appointment, isPast = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{appointment.service}</h4>
          <p className="text-sm text-gray-600">{appointment.provider}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${isPast ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
          {appointment.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-2" />
        {appointment.date} at {appointment.time}
      </div>
      {!isPast && (
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
            Reschedule
          </button>
          <button className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 text-sm font-medium">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;