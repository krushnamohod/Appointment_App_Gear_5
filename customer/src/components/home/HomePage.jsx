import { useEffect, useMemo, useState } from 'react';
import { getServices } from '../../services/appointmentService';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import HeroSection from './HeroSection';
import ServiceCard from './ServiceCard';

/**
 * @intent Main appointments page with Odoo-style layout
 */
const HomePage = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceType, setPriceType] = useState('All');
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
      const matchesPriceType =
        priceType === 'All' ||
        (priceType === 'Free' && s.price === 0) ||
        (priceType === 'Paid' && s.price > 0);

      return matchesSearch && matchesCategory && matchesPriceType;
    });
  }, [services, search, category, priceType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Odoo-style Search Header */}
      <HeroSection
        search={search}
        onSearchChange={setSearch}
        priceType={priceType}
        onPriceTypeChange={setPriceType}
      />

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm border-2 transition ${category === cat
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-red-500 text-lg font-medium mb-6">Appointments</h2>

      {/* Appointments Grid */}
      <section id="services">
        {loading ? (
          <LoadingSpinner />
        ) : filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No appointments match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
