import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  step: 1,
  isOpen: false, // Drawer open state
  booking: {
    service: null,
    provider: null,
    date: null,
    time: null,
    details: {}
  },
  availableSlots: [],
  loadingSlots: false,

  setStep: (step) => set({ step }),

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

  updateBooking: (data) =>
    set((state) => ({
      booking: { ...state.booking, ...data }
    })),

  // Set selected service and move to step 2 (for AI chat integration)
  setSelectedService: (service) =>
    set((state) => ({
      booking: { ...state.booking, service },
      step: 2
    })),

  setSlots: (slots) => set({ availableSlots: slots }),

  setLoadingSlots: (loading) => set({ loadingSlots: loading }),

  resetBooking: () =>
    set({
      step: 1,
      booking: {
        service: null,
        provider: null,
        date: null,
        time: null,
        details: {}
      },
      availableSlots: []
    })
}));

