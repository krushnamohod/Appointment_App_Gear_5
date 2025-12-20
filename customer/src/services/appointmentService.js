import api from './api';

export const getServices = (params = {}) =>
  api.get('/services', { params });

export const getProviders = (serviceId) =>
  api.get(`/services/${serviceId}/providers`);
