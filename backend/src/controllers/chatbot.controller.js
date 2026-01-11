import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../../prisma/client.js';
import { buildSystemPrompt, detectIntent } from '../utils/chatPrompts.js';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash"; // Using available 2.0 Flash model

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

        console.log(`🤖 Chat request from ${userId}: "${message}" (intent: ${intent})`);

        // Get Generative Model
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt
        });

        // Convert internal history to Gemini format
        // Internal: { role: 'user'/'assistant', content: '...' }
        // Gemini: { role: 'user'/'model', parts: [{ text: '...' }] }
        const geminiHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start Chat Session
        const chat = model.startChat({
            history: geminiHistory,
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
            },
        });

        // Send message
        const result = await chat.sendMessage(message);
        const assistantMessage = result.response.text();

        // Update internal conversation history (keep last 10 exchanges)
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

        // Handle errors gracefully
        if (error.message?.includes('API key')) {
            return res.status(500).json({
                error: 'AI service configuration error.',
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
        // Simple check if API key is present
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not found associated with the backend.");
        }

        res.json({
            status: 'ok',
            model: MODEL_NAME,
            modelAvailable: true
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'AI service unavailable',
            error: error.message
        });
    }
}
