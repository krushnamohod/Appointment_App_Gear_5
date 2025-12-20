import { Calendar, User, MapPin } from 'lucide-react';

const ConfirmationPage = ({ bookingData, onBackToHome }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-8">Your appointment has been successfully booked</p>

        <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">{bookingData.date} at {bookingData.time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium">{bookingData.provider}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-medium">Health Center, Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          A confirmation has been sent to your email and phone
        </p>

        <button
          onClick={onBackToHome}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;