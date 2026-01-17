/**
 * System prompts and context builders for the AI chatbot
 * Enhanced with smart scheduling, booking confirmation, and reschedule/cancel support
 */

/**
 * Build the system prompt with available services context
 * @param {Array} services - List of available services
 * @param {Array} providers - List of available providers
 * @param {Array} resources - List of available resources
 * @param {Array} userBookings - Optional user's upcoming bookings
 * @returns {string} - System prompt
 */
export function buildSystemPrompt(services = [], providers = [], resources = [], userBookings = []) {
  const servicesInfo = services.map(s => ({
    name: s.name,
    duration: `${s.duration} minutes`,
    price: s.price > 0 ? `₹${s.price}` : 'Free',
    available: s.isPublished,
    requiresResource: !!s.resourceType,
    resourceType: s.resourceType
  }));

  const providersInfo = providers.map(p => ({
    name: p.name,
    service: p.service?.name || 'General'
  }));

  const resourcesInfo = resources.map(r => ({
    name: r.name,
    type: r.type,
    capacity: r.capacity
  }));

  let bookingsContext = '';
  if (userBookings && userBookings.length > 0) {
    bookingsContext = `
USER'S UPCOMING BOOKINGS:
${JSON.stringify(userBookings.map(b => ({
      id: b.shortId,
      service: b.serviceName,
      date: b.date,
      time: b.time,
      provider: b.provider
    })), null, 2)}
`;
  }

  return `You are a friendly and helpful appointment booking assistant for a healthcare/service center that also offers sports facilities (like Badminton/Cricket courts).
Internal Code References: C1, C2 etc are Courts. A1, A2 etc are Specialists/Experts.

Your role is to:
1. Help users find the right service based on their needs, symptoms, or interests
2. Answer questions about services, pricing, resources, and availability
3. Guide users through the booking process (both for human experts and physical resources like courts)
4. Help users manage their bookings - view, cancel, or reschedule appointments
5. Be empathetic and professional

AVAILABLE SERVICES:
${JSON.stringify(servicesInfo, null, 2)}

AVAILABLE PROVIDERS (Specialists):
${JSON.stringify(providersInfo, null, 2)}

AVAILABLE RESOURCES (Courts/Venues/etc):
${JSON.stringify(resourcesInfo, null, 2)}
${bookingsContext}
SMART SCHEDULING CAPABILITIES:
- You can suggest optimal time slots based on availability
- When a user wants to book, ask for the service and preferred date
- You can show their upcoming appointments and help them manage bookings
- You can help cancel or reschedule appointments

GUIDELINES:
- Be concise but friendly
- If a user wants to book a court (like Badminton or Cricket), suggest the relevant service
- When user wants to book, confirm the service name and date
- If user asks to cancel or reschedule, show their upcoming bookings
- If unsure about something, ask clarifying questions
- Don't make up information about services not in the list
- For booking requests, extract: service name, preferred date (if mentioned), preferred time (if mentioned)
- For cancel/reschedule requests, identify which booking they're referring to

RESPONSE FORMAT:
- Keep responses under 150 words
- Use simple, clear language
- If suggesting a booking action, end with a question like "Would you like me to help you book this?"
- For slot suggestions, list the top 3 available times`;
}

/**
 * Common FAQ responses for quick answers
 */
export const FAQ_RESPONSES = {
  hours: "Our services are typically available Monday to Saturday, 9 AM to 6 PM. Specific availability may vary by provider.",
  booking: "To book an appointment, just tell me the service you need and your preferred date. I'll suggest the best available time slots for you!",
  cancel: "I can help you cancel your appointment! Just say 'show my bookings' and I'll display your upcoming appointments with cancel options.",
  reschedule: "I can help you reschedule! Just say 'show my bookings' to see your appointments, then tell me which one you'd like to reschedule.",
  payment: "Payment is typically collected at the time of service. Some services may require advance booking fees."
};

/**
 * Intent detection keywords - Enhanced for smart scheduling
 */
export const INTENT_KEYWORDS = {
  booking: ['book', 'appointment', 'schedule', 'reserve', 'slot', 'available', 'want to book'],
  symptoms: ['pain', 'ache', 'fever', 'cold', 'cough', 'headache', 'stomach', 'back', 'feeling', 'sick', 'hurt'],
  pricing: ['price', 'cost', 'fee', 'charge', 'how much', 'payment'],
  hours: ['hours', 'timing', 'when', 'open', 'close', 'available time'],
  cancel: ['cancel', 'remove booking', 'delete appointment', 'cancel my', 'don\'t want'],
  reschedule: ['reschedule', 'change time', 'modify booking', 'move appointment', 'different time', 'change my', 'move my'],
  myBookings: ['my appointments', 'my bookings', 'what did i book', 'upcoming appointments', 'show my', 'my schedule', 'booked'],
  confirmBooking: ['yes book', 'confirm', 'proceed', 'yes please', 'book it', 'go ahead', 'sounds good']
};

/**
 * Detect primary intent from user message
 * @param {string} message - User message
 * @returns {string} - Detected intent
 */
export function detectIntent(message) {
  const lowerMessage = message.toLowerCase();

  // Check intents in priority order
  const priorityOrder = ['confirmBooking', 'cancel', 'reschedule', 'myBookings', 'booking', 'symptoms', 'pricing', 'hours'];

  for (const intent of priorityOrder) {
    const keywords = INTENT_KEYWORDS[intent];
    if (keywords && keywords.some(keyword => lowerMessage.includes(keyword))) {
      return intent;
    }
  }

  return 'general';
}

/**
 * Build a booking confirmation message
 * @param {Object} booking - Booking details
 * @returns {string} - Formatted confirmation message
 */
export function buildConfirmationMessage(booking) {
  const lines = [
    '✅ **Booking Confirmed!**',
    '',
    `📅 **Date:** ${booking.date}`,
    `⏰ **Time:** ${booking.time}`,
    `🏷️ **Service:** ${booking.serviceName}`
  ];

  if (booking.provider) {
    lines.push(`👤 **Provider:** ${booking.provider}`);
  }

  if (booking.resource) {
    lines.push(`📍 **Location:** ${booking.resource}`);
  }

  lines.push('');
  lines.push(`Your booking ID is: \`${booking.shortId}\``);
  lines.push('');
  lines.push('Need to make changes? Just say "show my bookings" to view or manage your appointments.');

  return lines.join('\n');
}

/**
 * Build a cancellation confirmation message
 * @param {Object} booking - Cancelled booking details
 * @returns {string} - Formatted cancellation message
 */
export function buildCancellationMessage(booking) {
  return `❌ **Booking Cancelled**

Your appointment for **${booking.serviceName}** on **${booking.date}** at **${booking.time}** has been cancelled.

Would you like to book a new appointment?`;
}

/**
 * Build a reschedule confirmation message
 * @param {Object} oldBooking - Original booking
 * @param {Object} newBooking - New booking details
 * @returns {string} - Formatted reschedule message
 */
export function buildRescheduleMessage(oldBooking, newBooking) {
  return `🔄 **Appointment Rescheduled!**

Your **${newBooking.serviceName}** appointment has been moved:

~~${oldBooking.date} at ${oldBooking.time}~~

📅 **New Date:** ${newBooking.date}
⏰ **New Time:** ${newBooking.time}

Your booking ID remains: \`${newBooking.shortId}\``;
}

/**
 * Build a message showing user's bookings
 * @param {Array} bookings - User's bookings
 * @returns {string} - Formatted bookings list
 */
export function buildBookingsListMessage(bookings) {
  if (!bookings || bookings.length === 0) {
    return `📋 **Your Appointments**

You don't have any upcoming appointments.

Would you like to book one? Just tell me what service you need!`;
  }

  const lines = ['📋 **Your Upcoming Appointments**', ''];

  bookings.forEach((b, i) => {
    lines.push(`${i + 1}. **${b.serviceName}**`);
    lines.push(`   📅 ${b.date} at ${b.time}`);
    if (b.provider) lines.push(`   👤 ${b.provider}`);
    lines.push(`   🆔 ID: \`${b.shortId}\``);
    lines.push('');
  });

  lines.push('To cancel or reschedule, just tell me which appointment (by number or service name).');

  return lines.join('\n');
}

/**
 * Build smart slot suggestions message
 * @param {Array} slots - Suggested slots
 * @param {string} serviceName - Service name
 * @param {string} date - Date string
 * @returns {string} - Formatted suggestions
 */
export function buildSlotSuggestionsMessage(slots, serviceName, date) {
  if (!slots || slots.length === 0) {
    return `😔 Sorry, there are no available slots for **${serviceName}** on **${date}**.

Would you like to try a different date?`;
  }

  const lines = [
    `🗓️ **Available slots for ${serviceName} on ${date}:**`,
    ''
  ];

  slots.slice(0, 5).forEach((slot, i) => {
    const recommended = slot.recommended ? ' ⭐ Recommended' : '';
    const provider = slot.provider ? ` (${slot.provider.name})` : '';
    lines.push(`${i + 1}. **${slot.time}**${provider}${recommended}`);
  });

  lines.push('');
  lines.push('Which time works best for you? Just say the number or time!');

  return lines.join('\n');
}
