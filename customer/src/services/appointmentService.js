import api from './api';

export const getServices = async () => {
  return api.get('/services');
};

export const getProviders = async (serviceId) => {
  return api.get('/providers'); // Ideally filter by serviceId if backend supports it
};

export const getAvailableSlots = async (providerId, date) => {
  // Use the new endpoint we just created
  return api.get('/slots', { params: { date, providerId } });
};

export const createBooking = async (data) => {
  // data: { service, provider, date, time }
  // Backend expects: { serviceId, slotId, date }

  // We need to pass slotId. The frontend booking flow needs to track the selected slot ID.
  // Assuming 'data.time' might be the slot string, but we need the ID.
  // We'll trust the frontend maps the selected slot object.

  return api.post('/bookings', {
    serviceId: data.service.id,
    slotId: data.slotId, // Ensure frontend passes this
    date: data.date
  });
};

export const getMyAppointments = async () => {
  return api.get('/bookings');
};

export const cancelAppointment = async (id) => {
  // return api.delete(`/bookings/${id}`); // Implement if needed
  return Promise.resolve({ data: { success: true } });
};

export const rescheduleAppointment = async (id, data) => {
  return Promise.resolve({ data: { success: true } });
};
