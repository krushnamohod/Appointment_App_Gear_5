import api from './api';

/**
 * Send a chat message and get AI response
 * @param {string} message - User message
 * @returns {Promise} - AI response with suggested actions
 */
export const sendChatMessage = async (message) => {
    const response = await api.post('/chat/message', { message });
    return response.data;
};

/**
 * Reset the conversation history
 * @returns {Promise}
 */
export const resetConversation = async () => {
    const response = await api.post('/chat/reset');
    return response.data;
};

/**
 * Get quick suggestion prompts
 * @returns {Promise<string[]>}
 */
export const getQuickSuggestions = async () => {
    const response = await api.get('/chat/suggestions');
    return response.data.suggestions;
};

/**
 * Check AI service health
 * @returns {Promise}
 */
export const checkChatHealth = async () => {
    const response = await api.get('/chat/health');
    return response.data;
};

export default {
    sendChatMessage,
    resetConversation,
    getQuickSuggestions,
    checkChatHealth
};
