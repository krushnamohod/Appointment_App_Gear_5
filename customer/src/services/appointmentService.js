// import api from './api';
// 
// export const getServices = (params = {}) =>
  // api.get('/services', { params });
// 
// export const getProviders = (serviceId) =>
  // api.get(`/services/${serviceId}/providers`);
// 

export const getAvailableSlots = (providerId, date) =>
  api.get('/appointments/slots', {
    params: { providerId, date }
  });

export const createBooking = (data) =>
  api.post('/appointments', data);
