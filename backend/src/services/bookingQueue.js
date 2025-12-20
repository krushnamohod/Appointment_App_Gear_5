import redis from '../utils/redis.js';

const LOCK_EXPIRY = 30; // seconds
const locks = new Map(); // In-memory fallback if Redis is unavailable

/**
 * Booking Queue Service using Redis for distributed locking
 * Prevents double-booking by ensuring only one booking can process a slot at a time
 */

/**
 * Acquire a lock for a specific slot
 * @param {string} slotId - The slot ID to lock
 * @param {string} requestId - Unique request identifier
 * @returns {Promise<boolean>} - True if lock acquired, false otherwise
 */
export async function acquireLock(slotId, requestId) {
    const lockKey = `lock:slot:${slotId}`;

    try {
        // Try Redis-based distributed lock (SET NX with expiry)
        const result = await redis.set(lockKey, requestId, 'EX', LOCK_EXPIRY, 'NX');

        if (result === 'OK') {
            console.log(`🔒 Lock acquired for slot ${slotId} by ${requestId}`);
            return true;
        }

        console.log(`⏳ Lock denied for slot ${slotId} - already held`);
        return false;
    } catch (err) {
        // Fallback to in-memory lock if Redis is unavailable
        console.warn('⚠️ Redis unavailable, using in-memory lock');

        if (locks.has(slotId)) {
            return false;
        }

        locks.set(slotId, {
            requestId,
            expiresAt: Date.now() + LOCK_EXPIRY * 1000
        });

        // Auto-cleanup expired locks
        setTimeout(() => {
            const lock = locks.get(slotId);
            if (lock && lock.requestId === requestId) {
                locks.delete(slotId);
            }
        }, LOCK_EXPIRY * 1000);

        return true;
    }
}

/**
 * Release a lock for a specific slot
 * @param {string} slotId - The slot ID to unlock
 * @param {string} requestId - The request ID that owns the lock
 * @returns {Promise<boolean>} - True if lock released successfully
 */
export async function releaseLock(slotId, requestId) {
    const lockKey = `lock:slot:${slotId}`;

    try {
        // Only release if we own the lock (Lua script for atomicity)
        const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

        const result = await redis.eval(luaScript, 1, lockKey, requestId);

        if (result === 1) {
            console.log(`🔓 Lock released for slot ${slotId} by ${requestId}`);
            return true;
        }

        return false;
    } catch (err) {
        // Fallback to in-memory
        const lock = locks.get(slotId);
        if (lock && lock.requestId === requestId) {
            locks.delete(slotId);
            return true;
        }
        return false;
    }
}

/**
 * Check if a slot is currently locked
 * @param {string} slotId - The slot ID to check
 * @returns {Promise<boolean>} - True if locked
 */
export async function isLocked(slotId) {
    const lockKey = `lock:slot:${slotId}`;

    try {
        const result = await redis.exists(lockKey);
        return result === 1;
    } catch (err) {
        // Fallback to in-memory
        const lock = locks.get(slotId);
        if (lock && lock.expiresAt > Date.now()) {
            return true;
        }
        locks.delete(slotId);
        return false;
    }
}

/**
 * Generate a unique request ID
 */
export function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Wait for lock with timeout (polling)
 * @param {string} slotId - The slot ID to lock
 * @param {string} requestId - Unique request identifier
 * @param {number} maxWaitMs - Maximum wait time in milliseconds
 * @returns {Promise<boolean>} - True if lock acquired within timeout
 */
export async function waitForLock(slotId, requestId, maxWaitMs = 5000) {
    const startTime = Date.now();
    const pollInterval = 100; // ms

    while (Date.now() - startTime < maxWaitMs) {
        const acquired = await acquireLock(slotId, requestId);
        if (acquired) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    console.log(`⌛ Timeout waiting for lock on slot ${slotId}`);
    return false;
}

export default {
    acquireLock,
    releaseLock,
    isLocked,
    generateRequestId,
    waitForLock
};
