import {
  Camera,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
  Users,
  XCircle,
  Filter,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';
import {
  cancelAppointment,
  getMyAppointments
} from '../../services/appointmentService';
import { uploadImage, updateProfile } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * @intent Paper Planner styled profile page with search, filters, and appointment cards
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile: updateLocalProfile } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, free, paid

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getMyAppointments();
      setAppointments(res.data || []);
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadRes = await uploadImage(file);
      const imageUrl = uploadRes.data.url;

      await updateProfile({ avatar: imageUrl });
      updateLocalProfile({ avatar: imageUrl });
      toast.success('Avatar updated!');
    } catch (error) {
      console.error('Failed to update avatar', error);
    } finally {
      setUploading(false);
    }
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

  // Filter appointments by tab
  let filteredAppointments = activeTab === 'upcoming' ? upcoming
    : activeTab === 'completed' ? completed
      : cancelled;

  // Apply search filter
  if (searchQuery) {
    filteredAppointments = filteredAppointments.filter((appt) =>
      appt.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply type filter (free/paid)
  if (typeFilter !== 'all') {
    filteredAppointments = filteredAppointments.filter((appt) => {
      const isFree = (appt.service?.price || 0) === 0;
      return typeFilter === 'free' ? isFree : !isFree;
    });
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header Section */}
      <div className="bg-white border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 bg-terracotta rounded-planner flex items-center justify-center text-3xl font-serif text-white overflow-hidden"
                style={{ boxShadow: '3px 3px 0px rgba(45, 45, 45, 0.1)' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-ink/10 rounded-full flex items-center justify-center text-ink/60 hover:text-terracotta cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
              </label>
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

      {/* Search & Filter Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-planner pl-11 w-full"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-ink/30" size={18} />
            <span className="text-sm text-ink/50">Type:</span>
            <div className="flex border border-ink/15 rounded-planner overflow-hidden bg-white">
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTypeFilter(type.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${typeFilter === type.id
                    ? 'bg-terracotta text-white'
                    : 'text-ink/60 hover:text-ink hover:bg-paper'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Section Title */}
        <h2 className="font-serif text-2xl text-ink mb-4">Appointments</h2>

        {/* Tabs */}
        <div className="card-planner overflow-hidden">
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

          {/* Appointments Grid */}
          <div className="p-6">
            {loading ? (
              <LoadingSpinner />
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-planner bg-paper flex items-center justify-center mx-auto mb-4 border border-ink/10">
                  <Calendar className="text-ink/30" size={32} />
                </div>
                <p className="text-ink/50 font-serif text-lg">
                  {searchQuery || typeFilter !== 'all'
                    ? 'No appointments match your filters'
                    : `No ${activeTab} appointments`}
                </p>
                {activeTab === 'upcoming' && !searchQuery && typeFilter === 'all' && (
                  <button
                    onClick={() => navigate('/book')}
                    className="btn-primary mt-4"
                  >
                    Book an Appointment
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border border-ink/10 rounded-card overflow-hidden hover:border-ink/20 transition-colors bg-white"
                    style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.04)' }}
                  >
                    {/* Card Header with Service Name */}
                    <div className="px-5 py-3 bg-paper border-b border-ink/10 flex items-center justify-between">
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

                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Picture/Image */}
                        <div className="w-24 h-24 rounded-planner overflow-hidden bg-paper flex-shrink-0 border border-ink/10">
                          {appt.service?.image ? (
                            <img
                              src={appt.service.image}
                              alt={appt.service.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/30 bg-gradient-to-br from-sage/10 to-terracotta/10">
                              <Calendar size={32} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-ink/70">
                            <Calendar size={14} className="text-terracotta" />
                            <span>{appt.date || 'Date TBD'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-ink/70">
                            <Clock size={14} className="text-gold-dark" />
                            <span>{appt.time || 'Time TBD'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-ink/70">
                            <MapPin size={14} className="text-sage-dark" />
                            <span>{appt.service?.venue || "Our Office"}</span>
                          </div>
                          {appt.capacity > 1 && (
                            <div className="flex items-center gap-2 text-sm text-ink/70">
                              <Users size={14} className="text-blue-500" />
                              <span>{appt.capacity} People</span>
                            </div>
                          )}
                        </div>

                        {/* Resources */}
                        <div className="text-right">
                          <p className="text-xs text-ink/50 mb-1">Resources</p>
                          <div className="flex flex-col gap-1 items-end">
                            {appt.resource?.name ? (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-planner">
                                {appt.resource.name}
                              </span>
                            ) : appt.provider?.name ? (
                              <span className="px-2 py-1 bg-sage/20 text-sage-dark text-xs rounded-planner">
                                {appt.provider.name}
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-paper text-ink/50 text-xs rounded-planner border border-ink/10">
                                Any
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink/50 mt-2">Price</p>
                          <span className={`text-sm font-medium ${(appt.service?.price || 0) === 0 ? 'text-sage-dark' : 'text-terracotta'
                            }`}>
                            {(appt.service?.price || 0) === 0 ? 'Free' : `₹${appt.service?.price}`}
                          </span>
                        </div>
                      </div>

                      {/* Introduction/Notes */}
                      <div className="mt-4 pt-4 border-t border-ink/10">
                        <p className="text-sm text-ink/60 italic">
                          {appt.service?.confirmationMessage || "Thank you for booking with us. We look forward to meeting you!"}
                        </p>
                      </div>

                      {/* Actions */}
                      {appt.status === 'CONFIRMED' && (
                        <div className="flex gap-2 mt-4">
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

