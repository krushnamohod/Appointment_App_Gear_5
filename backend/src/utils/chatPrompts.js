/**
 * System prompts and context builders for the AI chatbot
 */

/**
 * Build the system prompt with available services context
 * @param {Array} services - List of available services
 * @param {Array} providers - List of available providers
 * @returns {string} - System prompt
 */
export function buildSystemPrompt(services = [], providers = []) {
  const servicesInfo = services.map(s => ({
    name: s.name,
    duration: `${s.duration} minutes`,
    price: s.price > 0 ? `₹${s.price}` : 'Free',
    available: s.isPublished
  }));

  const providersInfo = providers.map(p => ({
    name: p.name,
    service: p.service?.name || 'General'
  }));

  return `You are a friendly and helpful appointment booking assistant for a healthcare/service center.

Your role is to:
1. Help users find the right service based on their needs or symptoms
2. Answer questions about services, pricing, and availability
3. Guide users through the booking process
4. Be empathetic and professional

AVAILABLE SERVICES:
${JSON.stringify(servicesInfo, null, 2)}

AVAILABLE PROVIDERS:
${JSON.stringify(providersInfo, null, 2)}

GUIDELINES:
- Be concise but friendly
- If a user describes symptoms, suggest relevant services
- When user wants to book, confirm the service name
- If unsure about something, ask clarifying questions
- Don't make up information about services not in the list
- For booking requests, extract: service name, preferred date (if mentioned), preferred time (if mentioned)

RESPONSE FORMAT:
- Keep responses under 150 words
- Use simple, clear language
- If suggesting a booking action, end with a question like "Would you like me to help you book this?"`;
}

/**
 * Common FAQ responses for quick answers
 */
export const FAQ_RESPONSES = {
  hours: "Our services are typically available Monday to Saturday, 9 AM to 6 PM. Specific availability may vary by provider.",
  booking: "To book an appointment, you can tell me what service you need and your preferred date/time, or use the booking button to start the process.",
  cancel: "To cancel or reschedule an appointment, please go to your Profile page where you can manage all your bookings.",
  payment: "Payment is typically collected at the time of service. Some services may require advance booking fees."
};

/**
 * Intent detection keywords
 */
export const INTENT_KEYWORDS = {
  booking: ['book', 'appointment', 'schedule', 'reserve', 'slot', 'available'],
  symptoms: ['pain', 'ache', 'fever', 'cold', 'cough', 'headache', 'stomach', 'back', 'feeling', 'sick', 'hurt'],
  pricing: ['price', 'cost', 'fee', 'charge', 'how much', 'payment'],
  hours: ['hours', 'timing', 'when', 'open', 'close', 'available'],
  cancel: ['cancel', 'reschedule', 'change', 'modify']
};

/**
 * Detect primary intent from user message
 * @param {string} message - User message
 * @returns {string} - Detected intent
 */
export function detectIntent(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
}
