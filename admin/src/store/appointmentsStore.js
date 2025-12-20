import { create } from 'zustand';
import { useAdminAuthStore } from './authStore';

const API_URL = "http://localhost:3000/api";

/**
 * @intent Manages global state for appointments (services dashboard) list
 * Fetches real data from backend
 */
const useAppointmentsStore = create((set, get) => ({
    appointments: [],
    searchQuery: '',
    isLoading: false,
    error: null,

    setSearchQuery: (query) => set({ searchQuery: query }),

    fetchAppointments: async () => {
        set({ isLoading: true, error: null });
        try {
            // Access token from auth store
            const token = useAdminAuthStore.getState().token;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(`${API_URL}/services?dashboard=true`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch appointments");

            const data = await res.json();
            set({ appointments: data, isLoading: false });
        } catch (error) {
            console.error("Fetch appointments error:", error);
            set({ error: error.message, isLoading: false });
        }
    },

    getFilteredAppointments: () => {
        const { appointments, searchQuery } = get();
        if (!searchQuery.trim()) return appointments;
        return appointments.filter((apt) =>
            apt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },

    togglePublishStatus: async (id) => {
        const { appointments } = get();
        const appointment = appointments.find(a => a.id === id);
        if (!appointment) return;

        const newStatus = !appointment.isPublished;

        // Optimistic update
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, isPublished: newStatus } : apt
            ),
        }));

        try {
            const token = useAdminAuthStore.getState().token;
            await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isPublished: newStatus })
            });
        } catch (error) {
            console.error("Toggle status error:", error);
            // Revert on error
            set((state) => ({
                appointments: state.appointments.map((apt) =>
                    apt.id === id ? { ...apt, isPublished: !newStatus } : apt
                ),
            }));
        }
    },

    // Create a new appointment/service
    addAppointment: async (appointmentData) => {
        try {
            const token = useAdminAuthStore.getState().token;
            const res = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            if (!res.ok) throw new Error("Failed to create appointment");

            const newAppointment = await res.json();
            set((state) => ({
                appointments: [...state.appointments, newAppointment],
            }));
            return { success: true, data: newAppointment };
        } catch (error) {
            console.error("Create appointment error:", error);
            return { success: false, error: error.message };
        }
    },

    updateAppointment: (id, updates) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, ...updates } : apt
            ),
        })),

    // Publish/update appointment with all data
    publishAppointment: async (id, appointmentData) => {
        try {
            const token = useAdminAuthStore.getState().token;
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...appointmentData, isPublished: true })
            });

            if (!res.ok) throw new Error("Failed to publish appointment");

            const updated = await res.json();
            set((state) => ({
                appointments: state.appointments.map((apt) =>
                    apt.id === id ? { ...apt, ...updated } : apt
                ),
            }));
            return { success: true, data: updated };
        } catch (error) {
            console.error("Publish appointment error:", error);
            return { success: false, error: error.message };
        }
    }
}));

export default useAppointmentsStore;
