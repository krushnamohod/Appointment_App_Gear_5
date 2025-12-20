import { AppointmentRow } from '@/components/AppointmentRow';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockAppointment = {
    id: '1',
    name: 'Dental care',
    duration: 30,
    resources: ['A1', 'A2'],
    upcomingMeetings: 1,
    isPublished: true,
};

describe('AppointmentRow', () => {
    it('renders appointment name correctly', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('Dental care')).toBeInTheDocument();
    });

    it('renders duration correctly', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('30 Min Duration')).toBeInTheDocument();
    });

    it('renders resource pills', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('A1')).toBeInTheDocument();
        expect(screen.getByText('A2')).toBeInTheDocument();
    });

    it('renders upcoming meetings count', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('1 Meeting Upcoming')).toBeInTheDocument();
    });

    it('shows Published badge when published', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('Published')).toBeInTheDocument();
    });

    it('shows Unpublished badge when not published', () => {
        render(<AppointmentRow appointment={{ ...mockAppointment, isPublished: false }} />);
        expect(screen.getByText('Unpublished')).toBeInTheDocument();
    });

    it('calls onEdit when Edit button clicked', () => {
        const onEdit = vi.fn();
        render(<AppointmentRow appointment={mockAppointment} onEdit={onEdit} />);
        fireEvent.click(screen.getByText('Edit'));
        expect(onEdit).toHaveBeenCalledWith(mockAppointment);
    });

    it('has Share button', () => {
        render(<AppointmentRow appointment={mockAppointment} />);
        expect(screen.getByText('Share')).toBeInTheDocument();
    });
});
