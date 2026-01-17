import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../../prisma/client.js';
import {
    buildSystemPrompt,
    detectIntent,
    buildConfirmationMessage,
    buildCancellationMessage,
    buildRescheduleMessage,
    buildBookingsListMessage,
    buildSlotSuggestionsMessage
} from '../utils/chatPrompts.js';
import {
    parseNaturalDate,
    getOptimalSlots,
    getUserUpcomingBookings,
    findServiceByName,
    extractServiceFromMessage,
    getAvailableSlotsForService
} from '../utils/schedulingHelper.js';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.0-flash"; // Using available 2.0 Flash model

// In-memory conversation store (per user)
// In production, use Redis for persistence
const conversations = new Map();

// Store pending booking context per user
const pendingBookings = new Map();

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
 * POST /api/chatbot/message
 */
export async function handleChatMessage(req, res, next) {
    try {
        const { message } = req.body;
        const userId = req.user?.id || 'anonymous';

        console.log(`🔐 Chat auth check - User: ${userId}, Has token: ${!!req.headers.authorization}`);

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get conversation history
        const history = getConversation(userId);

        // Fetch services context
        const { services, providers, resources } = await getServicesContext();

        // Get user's upcoming bookings for context
        const userBookings = await getUserUpcomingBookings(userId);

        // Build system prompt with user bookings context
        const systemPrompt = buildSystemPrompt(services, providers, resources, userBookings);

        // Detect intent for potential quick actions
        const intent = detectIntent(message);

        console.log(`🤖 Chat request from ${userId}: "${message}" (intent: ${intent})`);

        // Handle special intents directly
        let directResponse = null;
        let suggestedAction = null;
        let suggestedSlots = null;

        // Handle "show my bookings" intent
        if (intent === 'myBookings') {
            directResponse = buildBookingsListMessage(userBookings);
            if (userBookings.length > 0) {
                suggestedAction = {
                    type: 'show_bookings',
                    bookings: userBookings
                };
            }
        }

        // Handle booking intent - extract service and date
        if (intent === 'booking') {
            const extractedDate = parseNaturalDate(message);
            const extractedService = extractServiceFromMessage(message, services);

            if (extractedService && extractedDate) {
                // Get smart slot suggestions
                suggestedSlots = await getOptimalSlots(
                    extractedService.id,
                    extractedDate,
                    userId
                );

                if (suggestedSlots.length > 0) {
                    // Store pending booking context
                    pendingBookings.set(userId, {
                        serviceId: extractedService.id,
                        serviceName: extractedService.name,
                        date: extractedDate,
                        slots: suggestedSlots
                    });

                    suggestedAction = {
                        type: 'slot_suggestions',
                        serviceId: extractedService.id,
                        serviceName: extractedService.name,
                        date: extractedDate,
                        slots: suggestedSlots.slice(0, 5)
                    };
                }
            }
        }

        // Handle confirm booking intent
        if (intent === 'confirmBooking') {
            const pending = pendingBookings.get(userId);
            if (pending && pending.slots && pending.slots.length > 0) {
                // Extract which slot they want (number or time)
                const slotIndex = extractSlotChoice(message, pending.slots);
                if (slotIndex !== null && pending.slots[slotIndex]) {
                    suggestedAction = {
                        type: 'quick_book',
                        slotId: pending.slots[slotIndex].id,
                        serviceId: pending.serviceId,
                        serviceName: pending.serviceName,
                        time: pending.slots[slotIndex].time
                    };
                }
            }
        }

        // Handle cancel intent
        if (intent === 'cancel' && userBookings.length > 0) {
            const bookingToCancel = extractBookingChoice(message, userBookings);
            if (bookingToCancel) {
                suggestedAction = {
                    type: 'cancel_booking',
                    bookingId: bookingToCancel.id,
                    serviceName: bookingToCancel.serviceName
                };
            } else {
                directResponse = buildBookingsListMessage(userBookings) +
                    '\n\nWhich appointment would you like to cancel?';
            }
        }

        // Handle reschedule intent
        if (intent === 'reschedule' && userBookings.length > 0) {
            const bookingToReschedule = extractBookingChoice(message, userBookings);
            if (bookingToReschedule) {
                suggestedAction = {
                    type: 'reschedule_booking',
                    bookingId: bookingToReschedule.id,
                    serviceName: bookingToReschedule.serviceName
                };
            } else {
                directResponse = buildBookingsListMessage(userBookings) +
                    '\n\nWhich appointment would you like to reschedule?';
            }
        }

        // Get AI response
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt
        });

        // Convert internal history to Gemini format
        const geminiHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Start Chat Session
        const chat = model.startChat({
            history: geminiHistory,
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.7,
            },
        });

        // If we have a direct response, combine it with AI enhancement
        let assistantMessage;
        if (directResponse) {
            assistantMessage = directResponse;
        } else {
            // Send message to AI
            const result = await chat.sendMessage(message);
            assistantMessage = result.response.text();
        }

        // Update internal conversation history (keep last 10 exchanges)
        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: assistantMessage });

        if (history.length > 20) {
            history.splice(0, 2); // Remove oldest exchange
        }

        // If no action was set, check if bot is suggesting booking
        if (!suggestedAction) {
            const lowerResponse = assistantMessage.toLowerCase();
            const lowerMessage = message.toLowerCase();

            if (
                (lowerResponse.includes('book') || lowerResponse.includes('appointment')) &&
                (lowerResponse.includes('would you like') || lowerResponse.includes('shall i') || lowerResponse.includes('want me to'))
            ) {
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
        }

        res.json({
            message: assistantMessage,
            intent,
            suggestedAction,
            suggestedSlots: suggestedSlots?.slice(0, 5) || null,
            hasBookings: userBookings.length > 0,
            conversationLength: history.length / 2
        });

    } catch (error) {
        console.error('🤖 Chat error:', error);

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
 * Extract slot choice from message (e.g., "1", "first", "10:00 AM")
 */
function extractSlotChoice(message, slots) {
    const lowerMessage = message.toLowerCase();

    // Check for number mentions
    const numberWords = ['first', 'second', 'third', 'fourth', 'fifth'];
    for (let i = 0; i < numberWords.length; i++) {
        if (lowerMessage.includes(numberWords[i]) || lowerMessage.includes(`${i + 1}`)) {
            return i;
        }
    }

    // Check for time mentions
    for (let i = 0; i < slots.length; i++) {
        if (lowerMessage.includes(slots[i].time.toLowerCase())) {
            return i;
        }
    }

    // Default to first slot if they just say "yes" or "confirm"
    if (lowerMessage.includes('yes') || lowerMessage.includes('confirm') || lowerMessage.includes('book it')) {
        return 0;
    }

    return null;
}

/**
 * Extract booking choice from message
 */
function extractBookingChoice(message, bookings) {
    const lowerMessage = message.toLowerCase();

    // Check for number mentions
    const match = message.match(/(\d+)/);
    if (match) {
        const index = parseInt(match[1]) - 1;
        if (index >= 0 && index < bookings.length) {
            return bookings[index];
        }
    }

    // Check for service name mentions
    for (const booking of bookings) {
        if (lowerMessage.includes(booking.serviceName.toLowerCase())) {
            return booking;
        }
    }

    // Check for booking ID
    for (const booking of bookings) {
        if (lowerMessage.includes(booking.shortId.toLowerCase())) {
            return booking;
        }
    }

    // If there's only one booking, assume that one
    if (bookings.length === 1) {
        return bookings[0];
    }

    return null;
}

/**
 * Reset conversation history
 * POST /api/chatbot/reset
 */
export async function resetConversation(req, res) {
    const userId = req.user?.id || 'anonymous';
    conversations.delete(userId);
    pendingBookings.delete(userId);

    res.json({ message: 'Conversation reset successfully' });
}

/**
 * Get quick suggestions based on available services
 * GET /api/chatbot/suggestions
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
            "Show my appointments",
            ...services.slice(0, 2).map(s => `Book ${s.name} for tomorrow`)
        ];

        res.json({ suggestions });
    } catch (error) {
        next(error);
    }
}

/**
 * Get smart slot suggestions
 * GET /api/chatbot/smart-slots
 */
export async function getSmartSlotSuggestions(req, res, next) {
    try {
        const { serviceId, date, preferredTime } = req.query;
        const userId = req.user?.id || 'anonymous';

        if (!serviceId || !date) {
            return res.status(400).json({ error: 'serviceId and date are required' });
        }

        const slots = await getOptimalSlots(serviceId, date, userId, preferredTime);

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { name: true }
        });

        res.json({
            serviceName: service?.name || 'Service',
            date,
            slots,
            message: buildSlotSuggestionsMessage(slots, service?.name || 'Service', date)
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Book appointment via chatbot
 * POST /api/chatbot/book
 */
export async function bookViaChat(req, res, next) {
    try {
        const { slotId, serviceId, capacity = 1 } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required to book' });
        }

        if (!slotId) {
            return res.status(400).json({ error: 'slotId is required' });
        }

        // Fetch slot details
        const slot = await prisma.slot.findUnique({
            where: { id: slotId },
            include: {
                service: true,
                provider: true,
                resource: true
            }
        });

        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        if (slot.bookedCount >= slot.capacity) {
            return res.status(400).json({ error: 'Slot is fully booked' });
        }

        // Create booking
        const booking = await prisma.$transaction(async (tx) => {
            // Update slot
            await tx.slot.update({
                where: { id: slotId },
                data: { bookedCount: { increment: capacity } }
            });

            // Create booking
            return tx.booking.create({
                data: {
                    userId,
                    slotId,
                    status: 'CONFIRMED',
                    capacity,
                    totalPrice: (slot.service.price || 0) * capacity
                },
                include: {
                    slot: {
                        include: {
                            service: true,
                            provider: true,
                            resource: true
                        }
                    }
                }
            });
        });

        // Clear pending booking
        pendingBookings.delete(userId);

        // Build confirmation message
        const confirmationDetails = {
            id: booking.id,
            shortId: booking.id.slice(0, 8),
            date: new Date(slot.startTime).toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            }),
            time: new Date(slot.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
            serviceName: slot.service.name,
            provider: slot.provider?.name,
            resource: slot.resource?.name
        };

        res.json({
            success: true,
            booking: confirmationDetails,
            message: buildConfirmationMessage(confirmationDetails)
        });

    } catch (error) {
        console.error('🤖 Book via chat error:', error);
        next(error);
    }
}

/**
 * Cancel booking via chatbot
 * POST /api/chatbot/cancel/:bookingId
 */
export async function cancelViaChat(req, res, next) {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Find booking
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId
            },
            include: {
                slot: {
                    include: { service: true }
                }
            }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Booking already cancelled' });
        }

        // Cancel booking
        await prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: 'CANCELLED' }
            });

            await tx.slot.update({
                where: { id: booking.slotId },
                data: { bookedCount: { decrement: booking.capacity } }
            });
        });

        const cancellationDetails = {
            serviceName: booking.slot.service.name,
            date: new Date(booking.slot.startTime).toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            time: new Date(booking.slot.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        res.json({
            success: true,
            message: buildCancellationMessage(cancellationDetails)
        });

    } catch (error) {
        console.error('🤖 Cancel via chat error:', error);
        next(error);
    }
}

/**
 * Reschedule booking via chatbot
 * POST /api/chatbot/reschedule/:bookingId
 */
export async function rescheduleViaChat(req, res, next) {
    try {
        const { bookingId } = req.params;
        const { newSlotId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!newSlotId) {
            return res.status(400).json({ error: 'newSlotId is required' });
        }

        // Find original booking
        const oldBooking = await prisma.booking.findFirst({
            where: { id: bookingId, userId },
            include: {
                slot: { include: { service: true, provider: true } }
            }
        });

        if (!oldBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Find new slot
        const newSlot = await prisma.slot.findUnique({
            where: { id: newSlotId },
            include: { service: true, provider: true, resource: true }
        });

        if (!newSlot || newSlot.bookedCount >= newSlot.capacity) {
            return res.status(400).json({ error: 'New slot not available' });
        }

        // Perform reschedule
        await prisma.$transaction(async (tx) => {
            // Free up old slot
            await tx.slot.update({
                where: { id: oldBooking.slotId },
                data: { bookedCount: { decrement: oldBooking.capacity } }
            });

            // Book new slot
            await tx.slot.update({
                where: { id: newSlotId },
                data: { bookedCount: { increment: oldBooking.capacity } }
            });

            // Update booking
            await tx.booking.update({
                where: { id: bookingId },
                data: { slotId: newSlotId }
            });
        });

        const oldDetails = {
            date: new Date(oldBooking.slot.startTime).toLocaleDateString('en-IN'),
            time: new Date(oldBooking.slot.startTime).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
            })
        };

        const newDetails = {
            shortId: oldBooking.id.slice(0, 8),
            serviceName: newSlot.service.name,
            date: new Date(newSlot.startTime).toLocaleDateString('en-IN', {
                weekday: 'short', month: 'short', day: 'numeric'
            }),
            time: new Date(newSlot.startTime).toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
            })
        };

        res.json({
            success: true,
            message: buildRescheduleMessage(oldDetails, newDetails)
        });

    } catch (error) {
        console.error('🤖 Reschedule via chat error:', error);
        next(error);
    }
}

/**
 * Get user's bookings for chatbot context
 * GET /api/chatbot/my-bookings
 */
export async function getUserAppointmentsForChat(req, res, next) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const bookings = await getUserUpcomingBookings(userId);

        res.json({
            bookings,
            message: buildBookingsListMessage(bookings)
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Health check for AI service
 * GET /api/chatbot/health
 */
export async function checkHealth(req, res) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY not found associated with the backend.");
        }

        res.json({
            status: 'ok',
            model: MODEL_NAME,
            modelAvailable: true,
            features: ['smart-scheduling', 'booking', 'cancellation', 'reschedule']
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'AI service unavailable',
            error: error.message
        });
    }
}
