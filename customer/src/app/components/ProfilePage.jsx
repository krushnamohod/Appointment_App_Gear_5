import { Calendar, User, Phone, Mail } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

const ProfilePage = () => {
  const upcomingAppointments = [
    { id: 1, service: 'General Consultation', date: 'Dec 22', time: '10:00 AM', provider: 'Dr. Sarah Smith', status: 'Confirmed' },
    { id: 2, service: 'Dental Checkup', date: 'Dec 25', time: '02:30 PM', provider: 'Dr. John Doe', status: 'Confirmed' }
  ];

  const pastAppointments = [
    { id: 3, service: 'Physical Therapy', date: 'Dec 15', time: '11:00 AM', provider: 'Dr. Emily Brown', status: 'Completed' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">John Smith</h2>
            <p className="text-gray-600">john.smith@email.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="flex items-center text-gray-900">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              +91 98765 43210
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center text-gray-900">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              john.smith@email.com
            </div>
          </div>
        </div>

        <button className="mt-4 text-blue-600 font-medium hover:text-blue-700">
          Edit Profile
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {upcomingAppointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      </div>

      {/* Past Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Past Appointments</h3>
        <div className="space-y-4">
          {pastAppointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} isPast />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;