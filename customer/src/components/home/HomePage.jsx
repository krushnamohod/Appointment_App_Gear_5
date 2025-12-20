import { Calendar, Clock, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../../services/appointmentService';

/**
 * @intent Paper Planner styled homepage with service cards and search
 */
const HomePage = () => {
  const navigate = useNavigate();
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

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true :
        filter === 'free' ? s.price === 0 :
          s.price > 0;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <div className="bg-white border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">
              Book Your Appointment
            </h1>
            <p className="text-ink/60 text-lg max-w-xl mx-auto">
              Simple and elegant scheduling. Find the perfect time that works for you.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services..."
                  className="input-planner pl-12"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'free', label: 'Free' },
                  { id: 'paid', label: 'Paid' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`
                      px-4 py-3 rounded-planner text-sm font-medium transition-colors border
                      ${filter === f.id
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-white text-ink/60 border-ink/15 hover:border-ink/30'
                      }
                    `}
                    style={filter === f.id ? { boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.1)' } : {}}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-ink">Available Services</h2>
          <span className="text-sm text-ink/50">{filteredServices.length} services</span>
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
                onClick={() => navigate('/book', { state: { preSelectedService: service } })}
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
