import prisma from "../../prisma/client.js";

/**
 * @intent Get dashboard stats and chart data for reporting
 */
export async function getDashboardStats(req, res, next) {
    try {
        // Get total bookings count
        const totalBookings = await prisma.booking.count();

        // Get counts by status
        const completedCount = await prisma.booking.count({
            where: { status: "CONFIRMED" }
        });

        const pendingCount = await prisma.booking.count({
            where: { status: "PENDING" }
        });

        const cancelledCount = await prisma.booking.count({
            where: { status: "CANCELLED" }
        });

        // Get bookings grouped by date for chart (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentBookings = await prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true,
                status: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Group by date for chart
        const chartDataMap = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            chartDataMap[dateKey] = { date: dateKey, count: 0 };
        }

        recentBookings.forEach(booking => {
            const dateKey = booking.createdAt.toISOString().split('T')[0];
            if (chartDataMap[dateKey]) {
                chartDataMap[dateKey].count++;
            }
        });

        const chartData = Object.values(chartDataMap);

        // Get recent meetings list
        const meetings = await prisma.booking.findMany({
            take: 20,
            orderBy: {
                scheduledAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                appointment: {
                    select: {
                        name: true
                    }
                },
                resource: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Format meetings for frontend
        const formattedMeetings = meetings.map(m => ({
            id: m.id,
            name: m.user?.name || m.visitorName || "Unknown",
            email: m.user?.email || m.visitorEmail || "",
            phone: m.visitorPhone || "",
            date: m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "",
            time: m.scheduledAt ? new Date(m.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : "",
            resource: m.resource?.name || null,
            appointment: m.appointment?.name || "",
            status: m.status?.toLowerCase() || "pending"
        }));

        res.json({
            stats: {
                total: totalBookings,
                completed: completedCount,
                pending: pendingCount,
                cancelled: cancelledCount
            },
            chartData,
            meetings: formattedMeetings
        });
    } catch (error) {
        next(error);
    }
}
