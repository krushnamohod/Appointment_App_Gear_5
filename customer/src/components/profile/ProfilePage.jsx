import { useEffect, useState } from 'react';
import {
  getMyAppointments,
  cancelAppointment
} from '../../services/appointmentService';
import ProfileHeader from './ProfileHeader';
import AppointmentCard from './AppointmentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await cancelAppointment(id);
    toast.success('Appointment cancelled');
    fetchAppointments();
  };

  const upcoming = appointments.filter(
    (a) => a.status === 'CONFIRMED'
  );
  const past = appointments.filter(
    (a) => a.status !== 'CONFIRMED'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ProfileHeader />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {upcoming.length === 0 && (
                <p className="text-gray-500">
                  No upcoming appointments
                </p>
              )}
              {upcoming.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancel}
                  onReschedule={() =>
                    toast('Reschedule coming soon')
                  }
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">
              Past Appointments
            </h2>
            <div className="space-y-4">
              {past.length === 0 && (
                <p className="text-gray-500">
                  No past appointments
                </p>
              )}
              {past.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
