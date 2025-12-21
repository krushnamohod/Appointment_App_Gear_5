import { Calendar, Clock, Filter, Plus, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBookingStore } from '../../context/BookingContext';
import { getServices } from '../../services/appointmentService';

/**
 * @intent Paper Planner styled homepage with service cards and search
 */
const HomePage = () => {
  const { openDrawer, updateBooking, setStep, resetBooking } = useBookingStore();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  }, []);

  const handleBookService = (service) => {
    // Reset booking first, then set new service
    // This prevents old court/provider data from persisting when switching services
    resetBooking();
    updateBooking({ service });
    setStep(2); // Skip straight to provider selection
    openDrawer();
  };


  const courts = services.filter(s => s.resourceType === 'COURT');
  const otherServices = services.filter(s => s.resourceType !== 'COURT');

  const filteredServices = otherServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true :
        filter === 'free' ? s.price === 0 :
          s.price > 0;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-ink/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-5xl md:text-7xl text-ink mb-6 leading-tight">
                Premium <span className="text-terracotta italic">Facilities</span>
                <br />At Your Fingertips
              </h1>
              <p className="text-ink/60 text-xl max-w-xl mb-8 leading-relaxed">
                Premium Facilities At Your Fingertips
                From luxury badminton courts to dental care, healthcare to babysitting. Experience elite sports infrastructure and essential lifestyle services with seamless, real-time booking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const element = document.getElementById('courts-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-ink text-white px-8 py-4 rounded-full font-bold hover:bg-ink/90 transition-all shadow-xl active:scale-95"
                >
                  Reserve Space
                </button>
                <button
                  onClick={() => openDrawer()}
                  className="bg-white text-ink border-2 border-ink/10 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                  Find Specialists
                </button>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 bg-gray-200 border-8 border-white">
                <img
                  src="/landing_banner.png"
                  alt="Premium Sports Court"
                  className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-terracotta/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Courts Section (Prominent) */}
      {courts.length > 0 && (
        <div id="courts-section" className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl text-ink">Sports & Courts</h2>
              <div className="h-1 w-20 bg-terracotta mt-2 rounded-full"></div>
            </div>
            <p className="text-ink/40 text-sm italic font-medium">Real-time availability enabled</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.map((court) => (
              <div
                key={court.id}
                className="group relative bg-white rounded-[2rem] overflow-hidden border-2 border-transparent hover:border-terracotta/20 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col h-full"
                onClick={() => handleBookService(court)}
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={court.image || '/badminton_court.jpeg'}
                    alt={court.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <span className="text-white font-bold text-xl">{court.name}</span>
                  </div>
                  {court.price > 0 && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-ink shadow-lg">
                      ₹{court.price}/hr
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-ink/60 mb-6 line-clamp-2">
                    {court.venue || "Premium indoor facility with modern specialized flooring."}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-ink/40 font-bold uppercase tracking-wider">
                      <Users size={14} className="text-terracotta" />
                      <span>Up to {court.capacity} players</span>
                    </div>
                    <button className="bg-terracotta text-white p-3 rounded-2xl hover:bg-terracotta-dark shadow-lg shadow-terracotta/20 transition-all">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Services Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 border-t border-ink/10 mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="font-serif text-3xl text-ink">Specialist Services</h2>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experts..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-ink/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all"
              />
            </div>
            <div className="flex bg-white p-1 rounded-full border border-ink/10 shadow-sm">
              {['all', 'free', 'paid'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1 rounded-full text-xs font-bold capitalize transition-all ${filter === f ? 'bg-terracotta text-white shadow-md' : 'text-ink/40'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-ink/50">Loading...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-planner bg-paper border border-ink/10 flex items-center justify-center mx-auto mb-4">
              <Search className="text-ink/30" size={32} />
            </div>
            <p className="text-ink/50 font-serif text-lg">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="card-planner overflow-hidden cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
                onClick={() => handleBookService(service)}
              >
                {/* Image */}
                <div className="h-40 bg-paper border-b border-ink/10 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink/20">
                      <Calendar size={48} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-ink">{service.name}</h3>
                    <span className={`
                      px-2 py-1 rounded-planner text-xs font-medium
                      ${service.price === 0
                        ? 'bg-sage/20 text-sage-dark'
                        : 'bg-gold/30 text-gold-dark'
                      }
                    `}>
                      {service.price === 0 ? 'Free' : `₹${service.price}`}
                    </span>
                  </div>

                  <p className="text-sm text-ink/60 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-ink/50">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Filter size={14} />
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <div className="px-5 pb-5">
                  <button className="w-full py-3 bg-terracotta text-white rounded-planner font-medium hover:bg-terracotta-dark transition-colors"
                    style={{ boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.1)' }}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
