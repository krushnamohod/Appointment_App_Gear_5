import express from 'express';
import {
    handleChatMessage,
    resetConversation,
    getQuickSuggestions,
    checkHealth
} from '../controllers/chatbot.controller.js';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Health check (public)
router.get('/health', checkHealth);

// Quick suggestions (public)
router.get('/suggestions', getQuickSuggestions);

// Chat message (auth optional - tracks conversation per user)
router.post('/message', optionalAuth, handleChatMessage);

// Reset conversation (auth optional)
router.post('/reset', optionalAuth, resetConversation);

export default router;
