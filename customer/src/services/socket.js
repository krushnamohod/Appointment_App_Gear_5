import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

let socket = null;
let slotUpdateCallbacks = [];

export const connectSocket = () => {
  if (socket?.connected) return socket;

  const token = localStorage.getItem('token');

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('booking-confirmed', (data) => {
    toast.success(`Booking confirmed for ${data.service}`);
  });

  socket.on('appointment-reminder', (data) => {
    toast(`Reminder: Appointment at ${data.time}`);
  });

  socket.on('slot-unavailable', () => {
    toast.error('Selected slot just became unavailable');
  });

  socket.on('appointment-cancelled', () => {
    toast.error('Your appointment was cancelled by provider');
  });

  // Real-time slot updates
  socket.on('slot-update', (data) => {
    console.log('📡 Slot update received:', data);

    // Notify all registered callbacks
    slotUpdateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error('Slot update callback error:', err);
      }
    });

    // Show toast if slot became unavailable
    if (!data.available) {
      toast('A slot just became unavailable', { icon: '⏰' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    slotUpdateCallbacks = [];
  }
};

/**
 * Subscribe to slot updates for a specific date/service
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} serviceId - Service ID (optional)
 */
export const subscribeToSlots = (date, serviceId = null) => {
  if (!socket?.connected) {
    connectSocket();
  }

  const room = { date, serviceId: serviceId || 'all' };
  socket?.emit('subscribe-slots', room);
  console.log('📡 Subscribed to slots:', room);
};

/**
 * Unsubscribe from slot updates
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} serviceId - Service ID (optional)
 */
export const unsubscribeFromSlots = (date, serviceId = null) => {
  const room = { date, serviceId: serviceId || 'all' };
  socket?.emit('unsubscribe-slots', room);
  console.log('📴 Unsubscribed from slots:', room);
};

/**
 * Register a callback for slot updates
 * @param {function} callback - Function to call when slot updates arrive
 * @returns {function} - Unregister function
 */
export const onSlotUpdate = (callback) => {
  slotUpdateCallbacks.push(callback);

  // Return unregister function
  return () => {
    slotUpdateCallbacks = slotUpdateCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Get the socket instance
 */
export const getSocket = () => socket;

export default {
  connectSocket,
  disconnectSocket,
  subscribeToSlots,
  unsubscribeFromSlots,
  onSlotUpdate,
  getSocket
};

