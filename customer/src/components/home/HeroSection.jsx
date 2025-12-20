import { Search } from 'lucide-react';

/**
 * @intent Odoo-style search header with search bar and type filters
 * @param {string} search - Current search query
 * @param {function} onSearchChange - Search input handler
 * @param {string} priceType - Current price filter ('All', 'Free', 'Paid')
 * @param {function} onPriceTypeChange - Price filter handler
 */
const HeroSection = ({ search, onSearchChange, priceType, onPriceTypeChange }) => {
  const priceTypes = ['All', 'Free', 'Paid'];

  return (
    <section className="bg-white border-b py-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors text-gray-700"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Type:</span>
          <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden">
            {priceTypes.map((type) => (
              <button
                key={type}
                onClick={() => onPriceTypeChange(type)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${priceType === type
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
