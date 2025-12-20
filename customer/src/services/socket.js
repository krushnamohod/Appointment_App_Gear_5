import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socket;

export const connectSocket = () => {
  const token = localStorage.getItem('token');

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
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
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
