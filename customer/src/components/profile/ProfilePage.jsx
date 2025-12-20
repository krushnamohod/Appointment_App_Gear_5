import {
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';
import {
  cancelAppointment,
  getMyAppointments
} from '../../services/appointmentService';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * @intent Paper Planner styled profile page with warm, stationery-inspired design
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

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

  const upcoming = appointments.filter((a) => a.status === 'CONFIRMED');
  const completed = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-sage/20 text-sage-dark border-sage';
      case 'COMPLETED': return 'bg-gold/30 text-gold-dark border-gold';
      case 'CANCELLED': return 'bg-error/10 text-error border-error/30';
      default: return 'bg-paper text-ink/60 border-ink/20';
    }
  };

  const filteredAppointments = activeTab === 'upcoming' ? upcoming
    : activeTab === 'completed' ? completed
      : cancelled;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header Section */}
      <div className="bg-white border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-terracotta rounded-planner flex items-center justify-center text-3xl font-serif text-white"
              style={{ boxShadow: '3px 3px 0px rgba(45, 45, 45, 0.1)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="font-serif text-3xl text-ink mb-2">{user?.name || 'User'}</h1>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-ink/60 text-sm">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={14} /> {user?.email || 'email@example.com'}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={14} /> {user?.phone || '+91 1234567890'}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={() => navigate('/book')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card border-l-4 border-l-sage">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ink/50 text-sm">Upcoming</p>
                <p className="font-serif text-3xl text-ink">{upcoming.length}</p>
              </div>
              <div className="w-12 h-12 rounded-planner bg-sage/20 flex items-center justify-center">
                <Calendar className="text-sage-dark" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card border-l-4 border-l-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ink/50 text-sm">Completed</p>
                <p className="font-serif text-3xl text-ink">{completed.length}</p>
              </div>
              <div className="w-12 h-12 rounded-planner bg-gold/30 flex items-center justify-center">
                <CheckCircle className="text-gold-dark" size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card border-l-4 border-l-error">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ink/50 text-sm">Cancelled</p>
                <p className="font-serif text-3xl text-ink">{cancelled.length}</p>
              </div>
              <div className="w-12 h-12 rounded-planner bg-error/10 flex items-center justify-center">
                <XCircle className="text-error" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="card-planner overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-ink/10">
            {[
              { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
              { id: 'completed', label: 'Completed', count: completed.length },
              { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium transition-colors relative
                  ${activeTab === tab.id ? 'text-ink' : 'text-ink/50 hover:text-ink/70'}
                `}
              >
                <span className="font-serif">{tab.label}</span>
                <span className={`
                  ml-2 px-2 py-0.5 rounded-planner text-xs
                  ${activeTab === tab.id ? 'bg-gold/40 text-ink' : 'bg-paper text-ink/50'}
                `}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-terracotta"></div>
                )}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="p-6">
            {loading ? (
              <LoadingSpinner />
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-planner bg-paper flex items-center justify-center mx-auto mb-4 border border-ink/10">
                  <Calendar className="text-ink/30" size={32} />
                </div>
                <p className="text-ink/50 font-serif text-lg">No {activeTab} appointments</p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => navigate('/book')}
                    className="btn-primary mt-4"
                  >
                    Book an Appointment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-ink/10 rounded-card p-5 hover:border-ink/20 transition-colors bg-white"
                    style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.04)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Service Image */}
                      <div className="w-full md:w-20 h-20 rounded-planner overflow-hidden bg-paper flex-shrink-0 border border-ink/10">
                        {appt.service?.image ? (
                          <img
                            src={appt.service.image}
                            alt={appt.service.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink/30">
                            <Calendar size={32} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-serif text-lg text-ink">
                            {appt.service?.name || 'Appointment'}
                          </h3>
                          <span className={`
                            flex items-center gap-1 px-2 py-1 rounded-planner text-xs font-medium border
                            ${getStatusStyle(appt.status)}
                          `}>
                            {appt.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-ink/60">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-ink/40" />
                            {appt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-ink/40" />
                            {appt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={14} className="text-ink/40" />
                            {appt.provider?.name || 'Any'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-ink/40" />
                            Office
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      {appt.status === 'CONFIRMED' && (
                        <div className="flex gap-2 md:flex-col">
                          <button
                            onClick={() => toast('Reschedule coming soon')}
                            className="flex-1 px-4 py-2 border border-sage text-sage-dark rounded-planner text-sm font-medium hover:bg-sage/10 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="flex-1 px-4 py-2 border border-error/30 text-error rounded-planner text-sm font-medium hover:bg-error/5 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
