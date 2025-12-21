import prisma from "../../prisma/client.js";
import { initiatePhonePePayment, checkPhonePeStatus } from "../services/paymentService.js";
import { v4 as uuidv4 } from 'uuid';

export async function initiatePayment(req, res, next) {
    try {
        const { serviceId, slotId, date, capacity = 1, answers = {} } = req.body;
        const userId = req.user.id;

        // 1. Fetch Service to get price
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return res.status(404).json({ message: "Service not found" });

        const totalAmount = service.price * capacity;
        if (totalAmount <= 0) return res.status(400).json({ message: "Invalid amount for payment" });

        // 2. Create a PENDING Booking
        // In a real app, you might want to lock the slot or check availability first
        const booking = await prisma.booking.create({
            data: {
                userId,
                slotId,
                status: "PENDING",
                capacity,
                answers,
                totalPrice: totalAmount
            }
        });

        // 3. Create a PENDING Transaction
        const merchantTransactionId = `TXN_${uuidv4().replace(/-/g, '').slice(0, 15)}`;
        const transaction = await prisma.transaction.create({
            data: {
                bookingId: booking.id,
                userId,
                amount: totalAmount,
                status: "PENDING",
                merchantTransactionId,
                provider: "PHONEPE"
            }
        });

        // 4. Call PhonePe
        const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-status?txnId=${merchantTransactionId}`;
        const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/callback`;

        const paymentInitRes = await initiatePhonePePayment({
            amount: totalAmount,
            merchantTransactionId,
            merchantUserId: userId,
            mobileNumber: req.user.phone || '9999999999',
            redirectUrl,
            callbackUrl
        });

        if (paymentInitRes.success) {
            res.json({
                success: true,
                paymentUrl: paymentInitRes.data.instrumentResponse.redirectInfo.url,
                transactionId: transaction.id
            });
        } else {
            throw new Error(paymentInitRes.message || "Payment initiation failed");
        }

    } catch (error) {
        next(error);
    }
}

export async function handleCallback(req, res, next) {
    try {
        // PhonePe sends the status in a base64 encoded payload or via redirect parameters
        // For simplicity in this demo, we'll implement a status check endpoint that the frontend calls
        // But a real production app MUST verify the callback signature.

        console.log("📥 PhonePe Callback Received:", req.body);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

export async function verifyPaymentStatus(req, res, next) {
    try {
        const { txnId } = req.params;
        const statusRes = await checkPhonePeStatus(txnId);

        const transaction = await prisma.transaction.findUnique({
            where: { merchantTransactionId: txnId },
            include: { booking: true }
        });

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        if (statusRes.success && statusRes.code === "PAYMENT_SUCCESS") {
            // Update Transaction
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: "SUCCESS",
                    providerReferenceId: statusRes.data.transactionId,
                    paymentMode: statusRes.data.paymentInstrument?.type
                }
            });

            // Update Booking
            await prisma.booking.update({
                where: { id: transaction.bookingId },
                data: { status: "CONFIRMED" }
            });

            res.json({ success: true, status: "SUCCESS" });
        } else {
            // Update Transaction to Failed
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "FAILED" }
            });

            // Update Booking
            await prisma.booking.update({
                where: { id: transaction.bookingId },
                data: { status: "PAYMENT_FAILED" }
            });

            res.json({ success: false, status: "FAILED", message: statusRes.message });
        }
    } catch (error) {
        next(error);
    }
}

export async function getTransactions(req, res, next) {
    try {
        const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                booking: {
                    include: {
                        slot: {
                            include: { service: true }
                        }
                    }
                },
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        next(error);
    }
}
鼓
