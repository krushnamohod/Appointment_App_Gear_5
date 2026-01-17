import express from 'express';
import {
    handleChatMessage,
    resetConversation,
    getQuickSuggestions,
    checkHealth,
    getSmartSlotSuggestions,
    bookViaChat,
    cancelViaChat,
    rescheduleViaChat,
    getUserAppointmentsForChat
} from '../controllers/chatbot.controller.js';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Health check (public)
router.get('/health', checkHealth);

// Quick suggestions (public)
router.get('/suggestions', getQuickSuggestions);

// Smart slot suggestions (auth optional - personalized if logged in)
router.get('/smart-slots', optionalAuth, getSmartSlotSuggestions);

// Chat message (auth optional - tracks conversation per user)
router.post('/message', optionalAuth, handleChatMessage);

// Reset conversation (auth optional)
router.post('/reset', optionalAuth, resetConversation);

// Booking actions via chatbot (requires auth)
router.post('/book', authMiddleware, bookViaChat);
router.post('/cancel/:bookingId', authMiddleware, cancelViaChat);
router.post('/reschedule/:bookingId', authMiddleware, rescheduleViaChat);

// Get user's appointments for chatbot context
router.get('/my-bookings', authMiddleware, getUserAppointmentsForChat);

export default router;

