import { AppointmentRow } from "@/components/AppointmentRow";
import { cn } from "@/lib/utils";
import useAppointmentsStore from "@/store/appointmentsStore";
import { Calendar } from "lucide-react";
import { useMemo } from "react";

/**
 * @intent Container for appointment rows with empty state handling
 */
function AppointmentsList({ className, onEditAppointment }) {
    const appointments = useAppointmentsStore((state) => state.appointments);
    const searchQuery = useAppointmentsStore((state) => state.searchQuery);

    const filteredAppointments = useMemo(() => {
        if (!searchQuery.trim()) return appointments;
        return appointments.filter((apt) =>
            apt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [appointments, searchQuery]);

    if (filteredAppointments.length === 0) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center py-16 text-center",
                    className
                )}
                role="status"
                aria-live="polite"
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Calendar className="h-8 w-8 text-gray-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or create a new appointment type.
                </p>
            </div>
        );
    }

    return (
        <div
            className={cn("flex flex-col gap-3 px-6 py-4", className)}
            role="list"
            aria-label="Appointments list"
        >
            {filteredAppointments.map((appointment) => (
                <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={onEditAppointment}
                />
            ))}
        </div>
    );
}

export { AppointmentsList };

