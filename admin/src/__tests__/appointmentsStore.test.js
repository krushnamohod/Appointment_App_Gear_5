import useAppointmentsStore from '@/store/appointmentsStore';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('appointmentsStore', () => {
    beforeEach(() => {
        // Reset store to initial state
        useAppointmentsStore.setState({
            appointments: [
                { id: '1', name: 'Dental care', duration: 30, resources: ['A1'], upcomingMeetings: 1, isPublished: true },
                { id: '2', name: 'Tennis court', duration: 60, resources: ['R1'], upcomingMeetings: 0, isPublished: false },
            ],
            searchQuery: '',
        });
    });

    it('filters appointments by search query', () => {
        const { setSearchQuery, getFilteredAppointments } = useAppointmentsStore.getState();

        act(() => {
            setSearchQuery('dental');
        });

        const filtered = useAppointmentsStore.getState().getFilteredAppointments();
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Dental care');
    });

    it('returns all appointments when search is empty', () => {
        const filtered = useAppointmentsStore.getState().getFilteredAppointments();
        expect(filtered).toHaveLength(2);
    });

    it('toggles publish status', () => {
        const { togglePublishStatus } = useAppointmentsStore.getState();

        act(() => {
            togglePublishStatus('1');
        });

        const appointments = useAppointmentsStore.getState().appointments;
        expect(appointments.find(a => a.id === '1').isPublished).toBe(false);
    });

    it('adds new appointment', () => {
        const { addAppointment } = useAppointmentsStore.getState();

        act(() => {
            addAppointment({ name: 'New Apt', duration: 15, resources: [], upcomingMeetings: 0, isPublished: false });
        });

        const appointments = useAppointmentsStore.getState().appointments;
        expect(appointments).toHaveLength(3);
        expect(appointments[2].name).toBe('New Apt');
    });
});
