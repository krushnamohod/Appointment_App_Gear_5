import prisma from "../../prisma/client.js";
import { autoAssignProvider } from "../utils/providerAssigner.js";
import { acquireLock, releaseLock, generateRequestId } from "../services/bookingQueue.js";
import { emitSlotUpdate, emitBookingConfirmation } from "../services/socketService.js";

/**
 * Create a booking with distributed locking to prevent double-booking
 */
export async function createBooking(req, res, next) {
  const requestId = generateRequestId();
  let slotToBook = null;

  try {
    const { serviceId, slotId, date } = req.body;
    const userId = req.user.id;

    let finalSlotId = slotId;

    // 🔁 AUTO ASSIGN if slot not provided
    if (!slotId) {
      const assignment = await autoAssignProvider({ serviceId, date });

      if (!assignment) {
        return res.status(400).json({
          message: "No available providers for selected date",
        });
      }

      finalSlotId = assignment.slot.id;
    }

    // 🔒 Acquire distributed lock for slot
    const lockAcquired = await acquireLock(finalSlotId, requestId);

    if (!lockAcquired) {
      return res.status(409).json({
        message: "Slot is being processed by another request. Please try again.",
        retryable: true
      });
    }

    try {
      // ✅ Transaction-safe booking with Atomic Check
      const booking = await prisma.$transaction(async (tx) => {
        // 1. Fetch slot to get capacity and service info
        const slot = await tx.slot.findUnique({
          where: { id: finalSlotId },
          include: {
            service: true,
            provider: true
          }
        });

        if (!slot) {
          const error = new Error("Slot unavailable");
          error.status = 400;
          throw error;
        }

        slotToBook = slot;

        // 2. Atomic Update: Only increment if bookedCount < capacity
        const updatedBatch = await tx.slot.updateMany({
          where: {
            id: finalSlotId,
            bookedCount: { lt: slot.capacity },
          },
          data: {
            bookedCount: { increment: 1 },
          },
        });

        if (updatedBatch.count === 0) {
          const error = new Error("Slot is fully booked");
          error.status = 400;
          throw error;
        }

        // 3. Create Booking
        const newBooking = await tx.booking.create({
          data: {
            userId,
            slotId: finalSlotId,
            status: "CONFIRMED",
          },
          include: {
            slot: {
              include: {
                service: true,
                provider: true
              }
            }
          }
        });

        return newBooking;
      });

      // 🔓 Release lock after successful booking
      await releaseLock(finalSlotId, requestId);

      // 📢 Emit real-time slot update
      if (slotToBook) {
        const updatedSlot = await prisma.slot.findUnique({
          where: { id: finalSlotId }
        });

        const dateStr = new Date(slotToBook.startTime).toISOString().split('T')[0];

        emitSlotUpdate(dateStr, slotToBook.serviceId, {
          id: finalSlotId,
          available: updatedSlot.bookedCount < updatedSlot.capacity,
          bookedCount: updatedSlot.bookedCount,
          capacity: updatedSlot.capacity
        });
      }

      // 📧 Send booking confirmation to user via socket
      emitBookingConfirmation(userId, {
        service: booking.slot?.service?.name || 'Service',
        date: booking.slot?.startTime,
        provider: booking.slot?.provider?.name
      });

      return res.status(201).json({
        message: "Booking confirmed",
        slotId: finalSlotId,
        booking
      });

    } catch (transactionError) {
      // 🔓 Release lock on transaction failure
      await releaseLock(finalSlotId, requestId);
      throw transactionError;
    }

  } catch (error) {
    // Ensure lock is released on any error
    if (slotToBook?.id) {
      await releaseLock(slotToBook.id, requestId);
    }
    next(error);
  }
}

/**
 * Get user's bookings
 */
export async function getUserBookings(req, res, next) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        slot: {
          include: {
            service: true,
            provider: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform bookings to expected format
    const formattedBookings = bookings.map(b => ({
      id: b.id,
      date: b.slot?.startTime ? new Date(b.slot.startTime).toISOString().split('T')[0] : null,
      time: b.slot?.startTime ? new Date(b.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      status: b.status,
      service: b.slot?.service,
      provider: b.slot?.provider,
      createdAt: b.createdAt
    }));

    res.json(formattedBookings);
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find booking
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId
      },
      include: {
        slot: {
          include: { service: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Update booking and decrement slot count
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      await tx.slot.update({
        where: { id: booking.slotId },
        data: {
          bookedCount: { decrement: 1 }
        }
      });
    });

    // 📢 Emit slot update (slot now has more capacity)
    const updatedSlot = await prisma.slot.findUnique({
      where: { id: booking.slotId }
    });

    if (updatedSlot) {
      const dateStr = new Date(booking.slot.startTime).toISOString().split('T')[0];

      emitSlotUpdate(dateStr, booking.slot.serviceId, {
        id: booking.slotId,
        available: updatedSlot.bookedCount < updatedSlot.capacity,
        bookedCount: updatedSlot.bookedCount,
        capacity: updatedSlot.capacity
      });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    next(error);
  }
}

