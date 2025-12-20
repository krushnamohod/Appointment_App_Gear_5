// Mock Appointment Service - All data hardcoded for testing
// No backend required

// ============ MOCK DATA ============

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Hair Cut',
    category: 'Hair',
    description: 'Professional haircut by expert stylists',
    duration: 30,
    price: 25,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    manageCapacity: true,
    maxCapacity: 5
  },
  {
    id: 2,
    name: 'Hair Coloring',
    category: 'Hair',
    description: 'Full hair coloring with premium dyes',
    duration: 90,
    price: 80,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    manageCapacity: true,
    maxCapacity: 3
  },
  {
    id: 3,
    name: 'Facial Treatment',
    category: 'Skin',
    description: 'Deep cleansing facial for glowing skin',
    duration: 60,
    price: 55,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    manageCapacity: false,
    maxCapacity: 1
  },
  {
    id: 4,
    name: 'Massage Therapy',
    category: 'Wellness',
    description: 'Relaxing full body massage',
    duration: 60,
    price: 70,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    manageCapacity: true,
    maxCapacity: 8
  },
  {
    id: 5,
    name: 'Manicure',
    category: 'Nails',
    description: 'Professional nail care and polish',
    duration: 45,
    price: 0,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    manageCapacity: true,
    maxCapacity: 4
  },
  {
    id: 6,
    name: 'Pedicure',
    category: 'Nails',
    description: 'Relaxing foot care treatment',
    duration: 45,
    price: 40,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400',
    manageCapacity: true,
    maxCapacity: 6
  }
];

const MOCK_PROVIDERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    speciality: 'Hair Specialist',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Michael Chen',
    speciality: 'Senior Stylist',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Emily Davis',
    speciality: 'Skin Care Expert',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4.7
  }
];

const MOCK_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: false },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true }
];

let MOCK_APPOINTMENTS = [
  {
    id: 1,
    service: MOCK_SERVICES[0],
    provider: MOCK_PROVIDERS[0],
    date: '2025-12-25',
    time: '10:00 AM',
    status: 'CONFIRMED'
  },
  {
    id: 2,
    service: MOCK_SERVICES[2],
    provider: MOCK_PROVIDERS[2],
    date: '2025-12-20',
    time: '02:00 PM',
    status: 'COMPLETED'
  }
];

// ============ MOCK API FUNCTIONS ============

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getServices = async () => {
  await delay();
  return { data: MOCK_SERVICES };
};

export const getProviders = async (serviceId) => {
  await delay();
  return { data: MOCK_PROVIDERS };
};

export const getAvailableSlots = async (providerId, date) => {
  await delay();
  // Randomize some slot availability based on date
  const slots = MOCK_SLOTS.map(slot => ({
    ...slot,
    available: slot.available && Math.random() > 0.3
  }));
  return { data: slots };
};

export const createBooking = async (data) => {
  await delay(500);
  const newAppointment = {
    id: MOCK_APPOINTMENTS.length + 1,
    service: data.service,
    provider: data.provider === 'ANY' ? MOCK_PROVIDERS[0] : data.provider,
    date: data.date,
    time: data.time,
    status: 'CONFIRMED'
  };
  MOCK_APPOINTMENTS = [newAppointment, ...MOCK_APPOINTMENTS];
  return { data: newAppointment };
};

export const getMyAppointments = async () => {
  await delay();
  return { data: MOCK_APPOINTMENTS };
};

export const cancelAppointment = async (id) => {
  await delay();
  MOCK_APPOINTMENTS = MOCK_APPOINTMENTS.map(apt =>
    apt.id === id ? { ...apt, status: 'CANCELLED' } : apt
  );
  return { data: { success: true } };
};

export const rescheduleAppointment = async (id, data) => {
  await delay();
  MOCK_APPOINTMENTS = MOCK_APPOINTMENTS.map(apt =>
    apt.id === id ? { ...apt, ...data } : apt
  );
  return { data: { success: true } };
};
