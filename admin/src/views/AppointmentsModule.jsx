import { AppointmentsList } from "@/components/AppointmentsList";
import { HeaderControls } from "@/components/HeaderControls";
import { AppointmentFormView } from "@/views/AppointmentFormView";
import { useState } from "react";

/**
 * @intent Module for managing appointments (List + Form views)
 */
function AppointmentsModule() {
    const [currentView, setCurrentView] = useState("list");
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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

    if (currentView === "form") {
        return (
            <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
                <AppointmentFormView
                    appointment={selectedAppointment}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
            <main className="mx-auto max-w-6xl pt-8">
                <HeaderControls onNewClick={handleNewAppointment} />
                <AppointmentsList onEditAppointment={handleEditAppointment} />
            </main>
        </div>
    );
}

export { AppointmentsModule };

