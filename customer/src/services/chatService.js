import api from './api';

/**
 * Send a chat message and get AI response
 * @param {string} message - User message
 * @returns {Promise} - AI response with suggested actions
 */
export const sendChatMessage = async (message) => {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
};

/**
 * Reset the conversation history
 * @returns {Promise}
 */
export const resetConversation = async () => {
    const response = await api.post('/chatbot/reset');
    return response.data;
};

/**
 * Get quick suggestion prompts
 * @returns {Promise<string[]>}
 */
export const getQuickSuggestions = async () => {
    const response = await api.get('/chatbot/suggestions');
    return response.data.suggestions;
};

/**
 * Check AI service health
 * @returns {Promise}
 */
export const checkChatHealth = async () => {
    const response = await api.get('/chatbot/health');
    return response.data;
};

/**
 * Get AI-suggested optimal slots for a service and date
 * @param {string} serviceId - Service ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} preferredTime - Optional: 'morning', 'afternoon', or 'evening'
 * @returns {Promise} - Slots with AI ranking
 */
export const getSmartSlots = async (serviceId, date, preferredTime = null) => {
    const params = { serviceId, date };
    if (preferredTime) params.preferredTime = preferredTime;
    const response = await api.get('/chatbot/smart-slots', { params });
    return response.data;
};

/**
 * Book an appointment via chatbot
 * @param {string} slotId - Slot ID to book
 * @param {string} serviceId - Service ID
 * @param {number} capacity - Number of spots to book (default 1)
 * @returns {Promise} - Booking confirmation
 */
export const bookViaChat = async (slotId, serviceId, capacity = 1) => {
    const response = await api.post('/chatbot/book', { slotId, serviceId, capacity });
    return response.data;
};

/**
 * Cancel a booking via chatbot
 * @param {string} bookingId - Booking ID to cancel
 * @returns {Promise} - Cancellation confirmation
 */
export const cancelViaChat = async (bookingId) => {
    const response = await api.post(`/chatbot/cancel/${bookingId}`);
    return response.data;
};

/**
 * Reschedule a booking via chatbot
 * @param {string} bookingId - Booking ID to reschedule
 * @param {string} newSlotId - New slot ID
 * @returns {Promise} - Reschedule confirmation
 */
export const rescheduleViaChat = async (bookingId, newSlotId) => {
    const response = await api.post(`/chatbot/reschedule/${bookingId}`, { newSlotId });
    return response.data;
};

/**
 * Get user's bookings for chat context
 * @returns {Promise} - User's upcoming bookings with formatted message
 */
export const getMyBookingsForChat = async () => {
    const response = await api.get('/chatbot/my-bookings');
    return response.data;
};

export default {
    sendChatMessage,
    resetConversation,
    getQuickSuggestions,
    checkChatHealth,
    getSmartSlots,
    bookViaChat,
    cancelViaChat,
    rescheduleViaChat,
    getMyBookingsForChat
};

