import { create } from 'zustand';

const API_URL = "http://localhost:3000/api";

/**
 * @intent Reports store with API integration for dashboard data
 */
export const useReportsStore = create((set, get) => ({
    stats: { total: 0, completed: 0, pending: 0, cancelled: 0 },
    chartData: [],
    meetings: [],
    loading: false,
    error: null,

    // Get auth token from localStorage
    getAuthHeader: () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    // Fetch dashboard data
    fetchDashboardData: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/reports/dashboard`, {
                headers: {
                    "Content-Type": "application/json",
                    ...get().getAuthHeader(),
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch dashboard data");
            }

            set({
                stats: data.stats,
                chartData: data.chartData,
                meetings: data.meetings,
                loading: false
            });
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false, error: error.message };
        }
    },
}));
