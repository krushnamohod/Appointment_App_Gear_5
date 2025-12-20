import { AppointmentsList } from "@/components/AppointmentsList";
import { HeaderControls } from "@/components/HeaderControls";
import { AppointmentFormView } from "@/views/AppointmentFormView";
import useAppointmentsStore from "@/store/appointmentsStore";
import { useEffect, useState } from "react";

/**
 * @intent Module for managing appointments (List + Form views)
 */
function AppointmentsModule() {
    const [currentView, setCurrentView] = useState("list");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const { fetchAppointments } = useAppointmentsStore();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleNewAppointment = () => {
        setSelectedAppointment(null);
        setCurrentView("form");
    };

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setCurrentView("form");
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectedAppointment(null);
    };

    // Calculate Stats
    const { appointments } = useAppointmentsStore();

    // Derived stats
    const totalServices = appointments.length;

    // Unique providers count
    const uniqueProviders = new Set(
        appointments.flatMap(apt => apt.resources || [])
    ).size;

    // Total upcoming meetings
    const totalMeetings = appointments.reduce((acc, apt) => acc + (apt.upcomingMeetings || 0), 0);

    if (currentView === "form") {
        return (
            <div className="h-full bg-slate-50 overflow-auto">
                <AppointmentFormView
                    appointment={selectedAppointment}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 overflow-auto">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <dt className="truncate text-sm font-medium text-gray-500">Total Services</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalServices}</dd>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <dt className="truncate text-sm font-medium text-gray-500">Active Providers</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{uniqueProviders}</dd>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <dt className="truncate text-sm font-medium text-gray-500">Upcoming Meetings</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{totalMeetings}</dd>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
                    <div className="border-b border-gray-100 bg-white px-6 py-5">
                        <HeaderControls onNewClick={handleNewAppointment} />
                    </div>
                    <AppointmentsList onEditAppointment={handleEditAppointment} className="p-0" />
                </div>
            </main>
        </div>
    );
}

export { AppointmentsModule };

