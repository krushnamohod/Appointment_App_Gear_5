/**
 * Smart Scheduling Helper
 * AI-powered slot suggestions and natural language date parsing
 */

import prisma from '../../prisma/client.js';

/**
 * Parse natural language dates from user messages
 * @param {string} message - User message
 * @returns {string|null} - ISO date string (YYYY-MM-DD) or null
 */
export function parseNaturalDate(message) {
    const lowerMessage = message.toLowerCase();
    const today = new Date();

    // Today
    if (lowerMessage.includes('today')) {
        return formatDateToISO(today);
    }

    // Tomorrow
    if (lowerMessage.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return formatDateToISO(tomorrow);
    }

    // Day after tomorrow
    if (lowerMessage.includes('day after tomorrow')) {
        const dayAfter = new Date(today);
        dayAfter.setDate(today.getDate() + 2);
        return formatDateToISO(dayAfter);
    }

    // Next week
    if (lowerMessage.includes('next week')) {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return formatDateToISO(nextWeek);
    }

    // Specific weekdays (next Monday, this Friday, etc.)
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < weekdays.length; i++) {
        if (lowerMessage.includes(weekdays[i])) {
            const targetDay = i;
            const currentDay = today.getDay();
            let daysUntil = targetDay - currentDay;

            // If the day has passed this week, or it's today and they say "next", go to next week
            if (daysUntil <= 0 || lowerMessage.includes('next')) {
                daysUntil += 7;
            }

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + daysUntil);
            return formatDateToISO(targetDate);
        }
    }

    // Try to match explicit dates like "January 20", "20th January", "Jan 20"
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    // Pattern: "January 20" or "Jan 20"
    const datePattern1 = /(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?/i;
    const match1 = message.match(datePattern1);
    if (match1) {
        const monthStr = match1[1].toLowerCase();
        const day = parseInt(match1[2]);
        let monthIndex = monthNames.indexOf(monthStr);
        if (monthIndex === -1) monthIndex = monthShort.indexOf(monthStr);

        if (monthIndex !== -1 && day >= 1 && day <= 31) {
            const year = today.getFullYear();
            const targetDate = new Date(year, monthIndex, day);
            // If the date is in the past, assume next year
            if (targetDate < today) {
                targetDate.setFullYear(year + 1);
            }
            return formatDateToISO(targetDate);
        }
    }

    // Pattern: "20th January" or "20 Jan"
    const datePattern2 = /(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)/i;
    const match2 = message.match(datePattern2);
    if (match2) {
        const day = parseInt(match2[1]);
        const monthStr = match2[2].toLowerCase();
        let monthIndex = monthNames.indexOf(monthStr);
        if (monthIndex === -1) monthIndex = monthShort.indexOf(monthStr);

        if (monthIndex !== -1 && day >= 1 && day <= 31) {
            const year = today.getFullYear();
            const targetDate = new Date(year, monthIndex, day);
            if (targetDate < today) {
                targetDate.setFullYear(year + 1);
            }
            return formatDateToISO(targetDate);
        }
    }

    // Pattern: YYYY-MM-DD or DD/MM/YYYY or MM/DD/YYYY
    const isoPattern = /(\d{4})-(\d{2})-(\d{2})/;
    const isoMatch = message.match(isoPattern);
    if (isoMatch) {
        return isoMatch[0];
    }

    return null;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
function formatDateToISO(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Get available slots for a service on a given date
 * @param {string} serviceId 
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<Array>}
 */
export async function getAvailableSlotsForService(serviceId, date) {
    const slots = await prisma.slot.findMany({
        where: {
            serviceId,
            startTime: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`),
            },
        },
        include: {
            provider: { select: { id: true, name: true } },
            resource: { select: { id: true, name: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    // Filter to only available slots
    return slots
        .filter(slot => slot.bookedCount < slot.capacity)
        .map(slot => ({
            id: slot.id,
            time: new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            startTime: slot.startTime,
            endTime: slot.endTime,
            available: true,
            remainingCapacity: slot.capacity - slot.bookedCount,
            provider: slot.provider,
            resource: slot.resource
        }));
}

/**
 * Get user's booking history to learn preferences
 * @param {string} userId 
 * @returns {Promise<Object>} - Preference analysis
 */
export async function getUserBookingPreferences(userId) {
    if (!userId || userId === 'anonymous') {
        return { preferredTimeRange: null, preferredProvider: null };
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId,
            status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        include: {
            slot: {
                include: {
                    provider: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 10 // Last 10 bookings
    });

    if (bookings.length === 0) {
        return { preferredTimeRange: null, preferredProvider: null };
    }

    // Analyze preferred time of day
    const hours = bookings.map(b => new Date(b.slot.startTime).getHours());
    const avgHour = hours.reduce((a, b) => a + b, 0) / hours.length;

    let preferredTimeRange;
    if (avgHour < 12) {
        preferredTimeRange = 'morning';
    } else if (avgHour < 17) {
        preferredTimeRange = 'afternoon';
    } else {
        preferredTimeRange = 'evening';
    }

    // Find most frequently booked provider
    const providerCounts = {};
    bookings.forEach(b => {
        if (b.slot.provider) {
            providerCounts[b.slot.provider.id] = (providerCounts[b.slot.provider.id] || 0) + 1;
        }
    });

    let preferredProvider = null;
    let maxCount = 0;
    for (const [providerId, count] of Object.entries(providerCounts)) {
        if (count > maxCount) {
            maxCount = count;
            preferredProvider = providerId;
        }
    }

    return { preferredTimeRange, preferredProvider, bookingCount: bookings.length };
}

/**
 * Get optimal slots using AI-based ranking
 * @param {string} serviceId 
 * @param {string} date 
 * @param {string} userId - Optional user ID for personalization
 * @param {string} preferredTime - Optional preferred time (morning/afternoon/evening)
 * @returns {Promise<Array>} - Ranked slots with scores
 */
export async function getOptimalSlots(serviceId, date, userId = null, preferredTime = null) {
    const availableSlots = await getAvailableSlotsForService(serviceId, date);

    if (availableSlots.length === 0) {
        return [];
    }

    // Get user preferences if logged in
    let userPrefs = { preferredTimeRange: null, preferredProvider: null };
    if (userId && userId !== 'anonymous') {
        userPrefs = await getUserBookingPreferences(userId);
    }

    // Override with explicit preference if provided
    const timePreference = preferredTime || userPrefs.preferredTimeRange;

    // Score each slot
    const scoredSlots = availableSlots.map(slot => {
        let score = 50; // Base score
        const hour = new Date(slot.startTime).getHours();

        // Time preference scoring
        if (timePreference) {
            if (timePreference === 'morning' && hour >= 9 && hour < 12) {
                score += 30;
            } else if (timePreference === 'afternoon' && hour >= 12 && hour < 17) {
                score += 30;
            } else if (timePreference === 'evening' && hour >= 17 && hour < 21) {
                score += 30;
            }
        }

        // Preferred provider bonus
        if (userPrefs.preferredProvider && slot.provider?.id === userPrefs.preferredProvider) {
            score += 20;
        }

        // Higher remaining capacity = slightly better (less crowded)
        score += Math.min(slot.remainingCapacity * 2, 10);

        // Prefer mid-day slots slightly (10 AM - 4 PM generally popular)
        if (hour >= 10 && hour <= 16) {
            score += 5;
        }

        return {
            ...slot,
            score,
            recommended: score >= 70
        };
    });

    // Sort by score descending
    scoredSlots.sort((a, b) => b.score - a.score);

    // Return top 5 recommendations
    return scoredSlots.slice(0, 5);
}

/**
 * Get user's upcoming bookings for chatbot context
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getUserUpcomingBookings(userId) {
    console.log(`📋 Fetching bookings for user: ${userId}`);

    if (!userId || userId === 'anonymous') {
        console.log('📋 No user ID or anonymous - returning empty');
        return [];
    }

    // Get bookings from start of today onwards (include today's appointments even if time passed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
        where: {
            userId,
            status: { in: ['CONFIRMED', 'PENDING'] },
            slot: {
                startTime: { gte: today }
            }
        },
        include: {
            slot: {
                include: {
                    service: true,
                    provider: true,
                    resource: true
                }
            }
        },
        orderBy: {
            slot: { startTime: 'asc' }
        },
        take: 10
    });

    console.log(`📋 Found ${bookings.length} bookings for user ${userId}`);

    return bookings.map(b => ({
        id: b.id,
        shortId: b.id.slice(0, 8),
        serviceName: b.slot.service?.name || 'Service',
        date: new Date(b.slot.startTime).toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }),
        time: new Date(b.slot.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
        provider: b.slot.provider?.name,
        resource: b.slot.resource?.name,
        status: b.status,
        slotId: b.slotId
    }));
}

/**
 * Find service by name (fuzzy match)
 * @param {string} query 
 * @returns {Promise<Object|null>}
 */
export async function findServiceByName(query) {
    const services = await prisma.service.findMany({
        where: { isPublished: true }
    });

    const lowerQuery = query.toLowerCase();

    // Exact match first
    let match = services.find(s => s.name.toLowerCase() === lowerQuery);
    if (match) return match;

    // Partial match
    match = services.find(s => s.name.toLowerCase().includes(lowerQuery));
    if (match) return match;

    // Word match
    const queryWords = lowerQuery.split(/\s+/);
    match = services.find(s => {
        const serviceWords = s.name.toLowerCase().split(/\s+/);
        return queryWords.some(qw => serviceWords.some(sw => sw.includes(qw) || qw.includes(sw)));
    });

    return match || null;
}

/**
 * Extract service name from user message
 * @param {string} message 
 * @param {Array} services - Available services
 * @returns {Object|null}
 */
export function extractServiceFromMessage(message, services) {
    const lowerMessage = message.toLowerCase();

    for (const service of services) {
        const serviceName = service.name.toLowerCase();
        if (lowerMessage.includes(serviceName)) {
            return service;
        }

        // Check individual words
        const serviceWords = serviceName.split(/\s+/);
        for (const word of serviceWords) {
            if (word.length > 3 && lowerMessage.includes(word)) {
                return service;
            }
        }
    }

    return null;
}
