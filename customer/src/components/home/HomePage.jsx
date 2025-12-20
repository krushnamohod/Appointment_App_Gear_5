import { useEffect, useMemo, useState } from 'react';
import { getServices } from '../../services/appointmentService';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import HeroSection from './HeroSection';
import ServiceCard from './ServiceCard';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === 'All' || s.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <HeroSection
        onCTAClick={() =>
          document
            .getElementById('services')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search services..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <section id="services">
        {loading ? (
          <LoadingSpinner />
        ) : filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No services match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
