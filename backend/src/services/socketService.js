import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} httpServer - HTTP server instance
 */
export function initializeSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175',
                'http://localhost:5176'
            ],
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            // Allow anonymous connections for slot viewing
            socket.user = null;
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            socket.user = decoded;
            next();
        } catch (err) {
            // Allow connection but mark as unauthenticated
            socket.user = null;
            next();
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}${socket.user ? ` (User: ${socket.user.email})` : ' (Anonymous)'}`);

        // Subscribe to slot updates for a specific date/service
        socket.on('subscribe-slots', ({ date, serviceId }) => {
            const room = `slots:${date}:${serviceId || 'all'}`;
            socket.join(room);
            console.log(`📡 ${socket.id} joined room: ${room}`);
        });

        // Unsubscribe from slot updates
        socket.on('unsubscribe-slots', ({ date, serviceId }) => {
            const room = `slots:${date}:${serviceId || 'all'}`;
            socket.leave(room);
            console.log(`📴 ${socket.id} left room: ${room}`);
        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
        });
    });

    console.log('✅ Socket.IO initialized');
    return io;
}

/**
 * Get the Socket.IO instance
 */
export function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

/**
 * Emit slot update to all subscribed clients
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} serviceId - Service ID
 * @param {object} slotData - Updated slot information
 */
export function emitSlotUpdate(date, serviceId, slotData) {
    if (!io) return;

    const room = `slots:${date}:${serviceId}`;
    const allRoom = `slots:${date}:all`;

    const payload = {
        slotId: slotData.id,
        available: slotData.available,
        bookedCount: slotData.bookedCount,
        capacity: slotData.capacity,
        timestamp: new Date().toISOString()
    };

    io.to(room).emit('slot-update', payload);
    io.to(allRoom).emit('slot-update', payload);

    console.log(`📢 Emitted slot-update to ${room}: ${JSON.stringify(payload)}`);
}

/**
 * Emit booking confirmation to specific user
 * @param {string} userId - User ID
 * @param {object} bookingData - Booking details
 */
export function emitBookingConfirmation(userId, bookingData) {
    if (!io) return;

    // Find sockets for this user
    const sockets = io.sockets.sockets;
    sockets.forEach((socket) => {
        if (socket.user?.id === userId) {
            socket.emit('booking-confirmed', bookingData);
        }
    });
}

/**
 * Emit slot unavailable notification
 * @param {string} userId - User ID
 * @param {object} slotData - Slot details
 */
export function emitSlotUnavailable(userId, slotData) {
    if (!io) return;

    const sockets = io.sockets.sockets;
    sockets.forEach((socket) => {
        if (socket.user?.id === userId) {
            socket.emit('slot-unavailable', slotData);
        }
    });
}

export default { initializeSocket, getIO, emitSlotUpdate, emitBookingConfirmation, emitSlotUnavailable };
