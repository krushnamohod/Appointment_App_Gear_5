import api from './api';

export const getServices = async () => {
  return api.get('/services');
};

export const getProviders = async (serviceId) => {
  const params = serviceId ? { serviceId } : {};
  return api.get('/providers', { params });
};

export const getResources = async (type) => {
  const params = type ? { type } : {};
  return api.get('/resources', { params });
};

export const getAvailableSlots = async (providerId, resourceId, date, serviceId) => {
  const params = { date };
  if (providerId) params.providerId = providerId;
  if (resourceId) params.resourceId = resourceId;
  if (serviceId) params.serviceId = serviceId;
  return api.get('/slots', { params });
};

export const createBooking = async (data) => {
  // data: { service, provider, date, time }
  // Backend expects: { serviceId, slotId, date }

  // We need to pass slotId. The frontend booking flow needs to track the selected slot ID.
  // Assuming 'data.time' might be the slot string, but we need the ID.
  // We'll trust the frontend maps the selected slot object.

  return api.post('/bookings', {
    serviceId: data.service.id,
    slotId: data.slotId,
    date: data.date,
    capacity: data.capacity,
    answers: data.answers
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

export const generateSlots = async (data) => {
  // data: { providerId, serviceId, date }
  return api.post('/slots/generate', data);
};
