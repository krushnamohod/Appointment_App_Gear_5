import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  step: 1,
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

  updateBooking: (data) =>
    set((state) => ({
      booking: { ...state.booking, ...data }
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
