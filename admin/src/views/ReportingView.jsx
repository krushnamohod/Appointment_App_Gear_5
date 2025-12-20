import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Clock, Loader2, RefreshCw, Search, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api";

/**
 * @intent Custom SVG Line Chart component for booking trends
 */
function BookingChart({ data, isLoading }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
            </div>
        );
    }

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    // Calculate points
    const points = data.map((item, index) => ({
        x: padding.left + (index / (data.length - 1)) * innerWidth,
        y: padding.top + innerHeight - (item.count / maxCount) * innerHeight,
        ...item
    }));

    // Create smooth curve path
    const linePath = points.reduce((path, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const prev = points[index - 1];
        const cpX = (prev.x + point.x) / 2;
        return `${path} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, "");

    // Create area path (for gradient fill)
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto max-w-2xl mx-auto"
                style={{ minHeight: "250px" }}
            >
                <defs>
                    {/* Gradient for area fill */}
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#E07A5F" stopOpacity="0.05" />
                    </linearGradient>
                    {/* Gradient for line */}
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E07A5F" />
                        <stop offset="50%" stopColor="#81B29A" />
                        <stop offset="100%" stopColor="#3D405B" />
                    </linearGradient>
                    {/* Glow filter for hover */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            y1={padding.top + innerHeight * ratio}
                            x2={chartWidth - padding.right}
                            y2={padding.top + innerHeight * ratio}
                            stroke="#E5E7EB"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={padding.left - 8}
                            y={padding.top + innerHeight * ratio + 4}
                            textAnchor="end"
                            fill="#5A5A5A"
                            fontSize={10}
                        >
                            {Math.round(maxCount * (1 - ratio))}
                        </text>
                    </g>
                ))}

                {/* Area fill */}
                <path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    className="transition-all duration-500"
                />

                {/* Line path */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                />

                {/* Data points */}
                {points.map((point, index) => (
                    <g
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="cursor-pointer"
                    >
                        {/* Invisible larger hit area */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={20}
                            fill="transparent"
                        />

                        {/* Outer ring on hover */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? 12 : 0}
                            fill="#E07A5F"
                            opacity={0.2}
                            className="transition-all duration-200"
                        />

                        {/* Data point */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={hoveredIndex === index ? 6 : 4}
                            fill="#E07A5F"
                            stroke="white"
                            strokeWidth={2}
                            filter={hoveredIndex === index ? "url(#glow)" : undefined}
                            className="transition-all duration-200"
                        />

                        {/* Tooltip */}
                        {hoveredIndex === index && (
                            <g>
                                <rect
                                    x={point.x - 25}
                                    y={point.y - 35}
                                    width={50}
                                    height={24}
                                    rx={4}
                                    fill="#2D2D2D"
                                />
                                <text
                                    x={point.x}
                                    y={point.y - 18}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize={12}
                                    fontWeight={600}
                                >
                                    {point.count} bookings
                                </text>
                            </g>
                        )}

                        {/* Day label */}
                        <text
                            x={point.x}
                            y={chartHeight - 10}
                            textAnchor="middle"
                            fill={hoveredIndex === index ? "#E07A5F" : "#5A5A5A"}
                            fontSize={11}
                            fontWeight={hoveredIndex === index ? 600 : 400}
                            className="transition-all duration-200"
                        >
                            {point.day}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}


/**
 * @intent Reporting view with meetings table, stats dashboard, and chart
 */
function ReportingView() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data from API
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, cancelled: 0, confirmed: 0 });
    const [chartData, setChartData] = useState([]);
    const [meetings, setMeetings] = useState([]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchReportingData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/reporting/stats`, {
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader(),
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch reporting data");
            }

            const data = await res.json();
            setStats(data.stats);
            setChartData(data.chartData);
            setMeetings(data.meetings);
        } catch (err) {
            setError(err.message);
            // Use fallback mock data if API fails
            setChartData([
                { day: "Mon", count: 5 },
                { day: "Tue", count: 8 },
                { day: "Wed", count: 12 },
                { day: "Thu", count: 7 },
                { day: "Fri", count: 15 },
                { day: "Sat", count: 10 },
                { day: "Sun", count: 3 },
            ]);
            setMeetings([
                { id: 1, name: "Vipin Jindal", date: "Dec 12", time: "4:00 PM", provider: null, email: "vipin@example.com", status: "completed" },
                { id: 2, name: "Tarak Gor", date: "Dec 13", time: "9:00 AM", provider: "Court 1", email: "tarak@example.com", status: "confirmed" },
                { id: 3, name: "Rahul Sharma", date: "Dec 14", time: "2:30 PM", provider: "Court 2", email: "rahul@example.com", status: "pending" },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReportingData();
    }, []);

    // Filter meetings
    const filteredMeetings = meetings.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || m.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-sage text-white",
            confirmed: "bg-blue-100 text-blue-700",
            pending: "bg-gold text-ink",
            cancelled: "bg-red-100 text-red-700",
        };
        return styles[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-paper">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-terracotta" />
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-ink">Reporting</h1>
                            <p className="text-sm text-ink-light">Booking analytics and meeting overview</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchReportingData}
                        className="btn-outline flex items-center gap-2 text-sm"
                        disabled={isLoading}
                    >
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Total</p>
                        <p className="font-heading text-3xl font-bold text-ink">{stats.total}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Confirmed</p>
                        <p className="font-heading text-3xl font-bold text-blue-600">{stats.confirmed}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Completed</p>
                        <p className="font-heading text-3xl font-bold text-sage">{stats.completed}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Pending</p>
                        <p className="font-heading text-3xl font-bold text-terracotta">{stats.pending}</p>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="card-paper mb-8">
                    <div className="mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-terracotta" />
                        <h2 className="font-heading text-xl font-bold text-ink">Bookings This Week</h2>
                    </div>
                    <BookingChart data={chartData} isLoading={isLoading} />
                </div>

                {/* Meetings Section */}
                <div className="card-paper">
                    {/* Section Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-terracotta" />
                            <h2 className="font-heading text-xl font-bold text-ink">Recent Meetings</h2>
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-4 flex gap-2 overflow-x-auto border-b pb-2">
                        {["all", "confirmed", "completed", "pending", "cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                    activeTab === tab
                                        ? "bg-terracotta text-white"
                                        : "text-ink-light hover:bg-paper hover:text-ink"
                                )}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table-paper">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Name
                                        </div>
                                    </th>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Date & Time
                                        </div>
                                    </th>
                                    <th>Service</th>
                                    <th>Provider</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-terracotta" />
                                        </td>
                                    </tr>
                                ) : filteredMeetings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-ink-light py-8">
                                            No meetings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMeetings.map((meeting) => (
                                        <tr key={meeting.id} className="group">
                                            <td>
                                                <div>
                                                    <p className="font-medium text-ink">{meeting.name}</p>
                                                    <p className="text-xs text-ink-light">{meeting.email}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-terracotta font-medium">{meeting.date}</span>
                                                <span className="text-ink-light ml-2">{meeting.time}</span>
                                            </td>
                                            <td className="text-ink">{meeting.service || "—"}</td>
                                            <td className="text-ink-light">{meeting.provider || "—"}</td>
                                            <td>
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                                    getStatusBadge(meeting.status)
                                                )}>
                                                    {meeting.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export { ReportingView };

