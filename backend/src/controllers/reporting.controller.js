import prisma from "../config/db.config.js";

/**
 * Get booking statistics for reporting dashboard
 */
export async function getBookingStats(req, res, next) {
    try {
        // Get counts by status
        const statusCounts = await prisma.booking.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        // Get bookings per day for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyBookings = await prisma.booking.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: { gte: sevenDaysAgo }
            },
            _count: { id: true }
        });

        // Get all bookings with user and slot info for the table
        const recentBookings = await prisma.booking.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                slot: {
                    include: {
                        service: { select: { name: true } },
                        provider: { select: { name: true } }
                    }
                }
            }
        });

        // Calculate totals
        const stats = {
            total: 0,
            confirmed: 0,
            pending: 0,
            completed: 0,
            cancelled: 0
        };

        statusCounts.forEach(item => {
            stats.total += item._count.status;
            const key = item.status.toLowerCase();
            if (stats[key] !== undefined) {
                stats[key] = item._count.status;
            }
        });

        // Process daily data for chart (last 7 days)
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            // Count bookings for this day
            const count = dailyBookings.filter(b =>
                b.createdAt.toISOString().split('T')[0] === dateStr
            ).reduce((sum, b) => sum + b._count.id, 0);

            chartData.push({
                day: dayName,
                date: dateStr,
                count
            });
        }

        // Format recent bookings for table
        const meetings = recentBookings.map(booking => ({
            id: booking.id,
            name: booking.user.name,
            email: booking.user.email,
            date: booking.slot.startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: booking.slot.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            service: booking.slot.service.name,
            provider: booking.slot.provider?.name || null,
            status: booking.status.toLowerCase()
        }));

        res.json({
            stats,
            chartData,
            meetings
        });
    } catch (error) {
        next(error);
    }
}
