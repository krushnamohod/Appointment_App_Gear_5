import { useEffect, useState } from 'react';
import { Users, User, Briefcase, Loader2 } from 'lucide-react';
import { getProviders, getResources } from '../../services/appointmentService';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Paper Planner styled resource/provider selection with 2-column grid
 */
const SelectProviderStep = () => {
  const { booking, updateBooking, setStep } = useBookingStore();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const service = booking.service;

    if (service?.resourceType) {
      getResources(service.resourceType)
        .then((res) => {
          setProviders(res.data?.resources || []);
        })
        .catch((err) => {
          console.error('Failed to load resources', err);
          setError('Failed to load available resources');
        })
        .finally(() => setLoading(false));
    } else {
      getProviders(service?.id)
        .then((res) => {
          setProviders(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to load providers', err);
          setError('Failed to load available experts');
        })
        .finally(() => setLoading(false));
    }
  }, [booking.service]);

  // Generate avatar initials
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PR';
  };

  // Generate random pastel color based on name
  const getAvatarColor = (name) => {
    const colors = ['bg-sage', 'bg-terracotta/70', 'bg-gold', 'bg-dusty-rose', 'bg-ink/20'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-terracotta" size={32} />
        <span className="ml-3 text-ink/60">Loading resources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-error">
        {error}
        <button onClick={() => setStep(1)} className="block mx-auto mt-4 text-terracotta">
          Go Back
        </button>
      </div>
    );
  }

  // Build selection options
  const isResource = !!booking.service?.resourceType;
  const resourceOptions = [
    { id: 'ANY', name: 'Any Available', isAny: true },
    ...providers.map(p => ({ ...p, isAny: false }))
  ];

  const handleSelect = (item) => {
    if (isResource) {
      updateBooking({ resource: item.isAny ? 'ANY' : item, provider: null });
    } else {
      updateBooking({ provider: item.isAny ? 'ANY' : item, resource: null });
    }
  };

  const isSelected = (item) => {
    if (isResource) {
      return (item.isAny && booking.resource === 'ANY') || (!item.isAny && booking.resource?.id === item.id);
    }
    return (item.isAny && booking.provider === 'ANY') || (!item.isAny && booking.provider?.id === item.id);
  };

  return (
    <div className="card-planner p-6">
      {/* Header */}
      <h2 className="font-serif text-2xl text-ink text-center mb-6">Select user/ Resource</h2>

      {/* Resources Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {resourceOptions.map((resource) => (
          <button
            key={resource.id}
            onClick={() => handleSelect(resource)}
            className={`
              card-planner p-6 flex flex-col items-center justify-center min-h-[160px] transition-all hover:shadow-md
              ${isSelected(resource)
                ? 'ring-2 ring-terracotta'
                : 'hover:border-terracotta/50'
              }
            `}
          >
            {/* Resource Icon/Avatar */}
            {resource.isAny ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage to-gold flex items-center justify-center mb-3">
                <Users className="text-white" size={28} />
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-full ${getAvatarColor(resource.name)} flex items-center justify-center mb-3`}>
                {resource.avatar ? (
                  <img src={resource.avatar} alt={resource.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-white font-serif text-2xl">{getInitials(resource.name)}</span>
                )}
              </div>
            )}

            {/* Name */}
            <h3 className="font-serif text-xl text-terracotta">
              {isResource ? (resource.isAny ? 'C1' : `C${providers.indexOf(resource) + 2}`) : (resource.isAny ? 'A1' : `A${providers.indexOf(resource) + 2}`)}
            </h3>
            <p className="text-sm text-ink/60 mt-1">{resource.name}</p>

            {/* Speciality if available */}
            {resource.speciality && (
              <p className="text-xs text-ink/40 mt-1 flex items-center gap-1">
                <Briefcase size={10} />
                {resource.speciality}
              </p>
            )}

            {/* Selected indicator */}
            {isSelected(resource) && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Introduction Message */}
      <div className="text-center py-4 border-t border-ink/10">
        <p className="text-ink/60 italic text-sm">
          Schedule your visit today and experience expert care brought right to your doorstep.
        </p>
        <p className="text-xs text-ink/40 mt-1">↓ Introduction message</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setStep(1)}
          className="btn-secondary"
        >
          Back
        </button>

        <button
          onClick={() => setStep(3)}
          disabled={!booking.provider && !booking.resource}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectProviderStep;

