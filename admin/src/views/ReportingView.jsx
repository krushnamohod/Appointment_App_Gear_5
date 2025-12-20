import { cn } from "@/lib/utils";
import { useReportsStore } from "@/store/reportsStore";
import { BarChart3, Calendar, Clock, Loader2, Phone, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/**
 * @intent Reporting view with line chart, stats, and meetings table
 */
function ReportingView() {
    const { stats, chartData, meetings, loading, error, fetchDashboardData } = useReportsStore();
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Filter meetings
    const filteredMeetings = meetings.filter(m => {
        const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || m.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: "bg-sage text-white",
            completed: "bg-sage text-white",
            upcoming: "bg-blue-100 text-blue-700",
            pending: "bg-gold text-ink",
            cancelled: "bg-red-100 text-red-700",
        };
        return styles[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-paper">
                <div className="flex items-center gap-3 text-ink-light">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-terracotta" />
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-ink">Reporting</h1>
                            <p className="text-sm text-ink-light">View all meetings and appointment analytics</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Total</p>
                        <p className="font-heading text-3xl font-bold text-ink">{stats.total}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Completed</p>
                        <p className="font-heading text-3xl font-bold text-sage">{stats.completed}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Pending</p>
                        <p className="font-heading text-3xl font-bold text-terracotta">{stats.pending}</p>
                    </div>
                    <div className="card-paper text-center">
                        <p className="text-sm text-ink-light">Cancelled</p>
                        <p className="font-heading text-3xl font-bold text-red-500">{stats.cancelled}</p>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="card-paper mb-8">
                    <h2 className="font-heading text-xl font-bold text-ink mb-4">Appointments Trend (Last 7 Days)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#5A5A5A"
                                    fontSize={12}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis stroke="#5A5A5A" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#E07A5F"
                                    strokeWidth={2}
                                    dot={{ fill: '#E07A5F', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#E07A5F' }}
                                    name="Appointments"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Meetings Section */}
                <div className="card-paper">
                    {/* Section Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-heading text-xl font-bold text-ink">Meetings</h2>

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
                        {["all", "confirmed", "pending", "cancelled"].map((tab) => (
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
                                        <input type="checkbox" className="rounded" />
                                    </th>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Name
                                        </div>
                                    </th>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Time
                                        </div>
                                    </th>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Resource
                                        </div>
                                    </th>
                                    <th>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Contact
                                        </div>
                                    </th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMeetings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-ink-light py-8">
                                            No meetings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMeetings.map((meeting) => (
                                        <tr key={meeting.id} className="group">
                                            <td>
                                                <input type="checkbox" className="rounded" />
                                            </td>
                                            <td className="font-medium text-ink">{meeting.name}</td>
                                            <td>
                                                <span className="text-terracotta font-medium">{meeting.date}</span>
                                                <span className="text-ink-light ml-2">{meeting.time}</span>
                                            </td>
                                            <td className="text-ink-light">{meeting.resource || "—"}</td>
                                            <td className="mono-text text-ink-light">{meeting.phone || meeting.email || "—"}</td>
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

