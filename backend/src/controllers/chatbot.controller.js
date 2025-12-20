import { Ollama } from 'ollama';
import prisma from '../../prisma/client.js';
import { buildSystemPrompt, detectIntent, FAQ_RESPONSES } from '../utils/chatPrompts.js';

// Initialize Ollama client
const ollama = new Ollama({
    host: process.env.OLLAMA_URL || 'http://localhost:11434'
});

const MODEL_NAME = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b-instruct-q5_K_M';

// In-memory conversation store (per user)
// In production, use Redis for persistence
const conversations = new Map();

/**
 * Get or create conversation history for a user
 */
function getConversation(userId) {
    if (!conversations.has(userId)) {
        conversations.set(userId, []);
    }
    return conversations.get(userId);
}

/**
 * Fetch services context for AI
 */
async function getServicesContext() {
    const services = await prisma.service.findMany({
        where: { isPublished: true },
        select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            image: true,
            isPublished: true,
            resourceType: true
        }
    });

    const providers = await prisma.provider.findMany({
        select: {
            id: true,
            name: true,
            avatar: true,
            serviceId: true,
            service: {
                select: { name: true }
            }
        }
    });

    const resources = await prisma.resource.findMany({
        select: {
            id: true,
            name: true,
            type: true,
            capacity: true
        }
    });

    return { services, providers, resources };
}

/**
 * Handle chat message
 * POST /api/chat/message
 */
export async function handleChatMessage(req, res, next) {
    try {
        const { message } = req.body;
        const userId = req.user?.id || 'anonymous';

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get conversation history
        const history = getConversation(userId);

        // Fetch services context
        const { services, providers, resources } = await getServicesContext();
        const systemPrompt = buildSystemPrompt(services, providers, resources);

        // Detect intent for potential quick actions
        const intent = detectIntent(message);

        // Build messages array for Ollama
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        console.log(`🤖 Chat request from ${userId}: "${message}" (intent: ${intent})`);

        // Call Ollama
        const response = await ollama.chat({
            model: MODEL_NAME,
            messages: messages,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                num_predict: 300
            }
        });

        const assistantMessage = response.message.content;

        // Update conversation history (keep last 10 exchanges)
        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: assistantMessage });

        if (history.length > 20) {
            history.splice(0, 2); // Remove oldest exchange
        }

        // Determine if there's a suggested action
        let suggestedAction = null;
        const lowerResponse = assistantMessage.toLowerCase();
        const lowerMessage = message.toLowerCase();

        // Check if bot is suggesting booking
        if (
            (lowerResponse.includes('book') || lowerResponse.includes('appointment')) &&
            (lowerResponse.includes('would you like') || lowerResponse.includes('shall i') || lowerResponse.includes('want me to'))
        ) {
            // Try to find which service was mentioned
            const mentionedService = services.find(s =>
                lowerResponse.includes(s.name.toLowerCase()) ||
                lowerMessage.includes(s.name.toLowerCase())
            );

            if (mentionedService) {
                suggestedAction = {
                    type: 'book',
                    serviceId: mentionedService.id,
                    serviceName: mentionedService.name
                };
            } else {
                suggestedAction = { type: 'open_booking' };
            }
        }

        res.json({
            message: assistantMessage,
            intent,
            suggestedAction,
            conversationLength: history.length / 2
        });

    } catch (error) {
        console.error('🤖 Chat error:', error);

        // Handle Ollama connection errors gracefully
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'AI service is currently unavailable. Please try again later.',
                fallback: true
            });
        }

        next(error);
    }
}

/**
 * Reset conversation history
 * POST /api/chat/reset
 */
export async function resetConversation(req, res) {
    const userId = req.user?.id || 'anonymous';
    conversations.delete(userId);

    res.json({ message: 'Conversation reset successfully' });
}

/**
 * Get quick suggestions based on available services
 * GET /api/chat/suggestions
 */
export async function getQuickSuggestions(req, res, next) {
    try {
        const services = await prisma.service.findMany({
            where: { isPublished: true },
            select: { name: true },
            take: 5
        });

        const suggestions = [
            "What services do you offer?",
            "I'd like to book an appointment",
            "What are your working hours?",
            ...services.slice(0, 2).map(s => `Tell me about ${s.name}`)
        ];

        res.json({ suggestions });
    } catch (error) {
        next(error);
    }
}

/**
 * Health check for AI service
 * GET /api/chat/health
 */
export async function checkHealth(req, res) {
    try {
        // Quick ping to Ollama
        const tags = await ollama.list();
        const modelAvailable = tags.models?.some(m => m.name.includes('qwen'));

        res.json({
            status: 'ok',
            model: MODEL_NAME,
            modelAvailable
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'AI service unavailable',
            error: error.message
        });
    }
}
