import { create } from 'zustand';

/**
 * @intent Manages global state for appointments list
 */
const useAppointmentsStore = create((set, get) => ({
    appointments: [
        {
            id: '1',
            name: 'Dental care',
            duration: 30,
            resources: ['A1', 'A2'],
            upcomingMeetings: 1,
            isPublished: true,
        },
        {
            id: '2',
            name: 'Tennis court',
            duration: 60,
            resources: ['R1', 'R2'],
            upcomingMeetings: 0,
            isPublished: false,
        },
        {
            id: '3',
            name: 'Interviews',
            duration: 45,
            resources: ['A1'],
            upcomingMeetings: 3,
            isPublished: true,
        },
    ],
    searchQuery: '',

    setSearchQuery: (query) => set({ searchQuery: query }),

    getFilteredAppointments: () => {
        const { appointments, searchQuery } = get();
        if (!searchQuery.trim()) return appointments;
        return appointments.filter((apt) =>
            apt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },

    togglePublishStatus: (id) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, isPublished: !apt.isPublished } : apt
            ),
        })),

    addAppointment: (appointment) =>
        set((state) => ({
            appointments: [...state.appointments, { ...appointment, id: Date.now().toString() }],
        })),

    updateAppointment: (id, updates) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, ...updates } : apt
            ),
        })),

    publishAppointment: (id, appointmentData) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id
                    ? { ...apt, ...appointmentData, isPublished: true }
                    : apt
            ),
        })),
}));

export default useAppointmentsStore;
