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
            where: { status: "COMPLETED" }
        });

        const confirmedCount = await prisma.booking.count({
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

        // Get recent bookings list with related data
        const bookings = await prisma.booking.findMany({
            take: 20,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                slot: {
                    include: {
                        service: {
                            select: {
                                name: true
                            }
                        },
                        provider: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        // Format meetings for frontend
        const formattedMeetings = bookings.map(b => ({
            id: b.id,
            name: b.user?.name || "Unknown",
            email: b.user?.email || "",
            phone: "",
            date: b.slot?.startTime ? new Date(b.slot.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: b.slot?.startTime ? new Date(b.slot.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : "",
            resource: b.slot?.provider?.name || null,
            service: b.slot?.service?.name || "",
            status: b.status?.toLowerCase() || "pending"
        }));

        res.json({
            stats: {
                total: totalBookings,
                completed: completedCount + confirmedCount,
                pending: pendingCount,
                cancelled: cancelledCount
            },
            chartData,
            meetings: formattedMeetings
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        next(error);
    }
}
