import { MeetingsModal } from "@/components/MeetingsModal";
import { PreviewModal } from "@/components/PreviewModal";
import { SecondaryActionBar } from "@/components/SecondaryActionBar";
import { AppointmentHeader } from "@/components/form/AppointmentHeader";
import { CoreDetailsSection } from "@/components/form/CoreDetailsSection";
import { MiscTab } from "@/components/form/MiscTab";
import { OptionsTab } from "@/components/form/OptionsTab";
import { QuestionsTab } from "@/components/form/QuestionsTab";
import { ScheduleTab } from "@/components/form/ScheduleTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useAppointmentsStore from "@/store/appointmentsStore";
import { useState } from "react";

/**
 * @intent Main appointment form view for editing appointment types
 * @param {object} props - Component props
 * @param {object} props.appointment - Appointment data to edit
 * @param {function} props.onBack - Back/close handler
 * @param {function} props.onReporting - Reporting handler
 * @param {function} props.onSettings - Settings handler
 */
function AppointmentFormView({ appointment, onBack, onReporting, onSettings }) {
    // Store actions
    const publishAppointment = useAppointmentsStore((state) => state.publishAppointment);
    const addAppointment = useAppointmentsStore((state) => state.addAppointment);

    // Parse duration from appointment (e.g., 30 -> "00:30")
    const formatDuration = (mins) => {
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Parse duration string to minutes (e.g., "00:30" -> 30)
    const parseDuration = (str) => {
        const [hours, minutes] = str.split(':').map(Number);
        return (hours * 60) + minutes;
    };

    // Form state
    const [formData, setFormData] = useState({
        title: appointment?.name || "New Appointment",
        picture: appointment?.image || null,
        duration: formatDuration(appointment?.duration || 30),
        location: appointment?.venue || "Doctor's Office",
        bookType: appointment?.resourceType ? 'resources' : 'user',
        selectedUsers: appointment?.resources || ["A1", "A2"],
        availableUsers: [
            { id: "A1", code: "A1", name: "User 1" },
            { id: "A2", code: "A2", name: "User 2" },
        ],
        assignment: "automatically",
        manageCapacity: appointment?.manageCapacity || false,
        simultaneousAppointments: appointment?.capacity || 1,
    });

    // Options tab state
    const [optionsData, setOptionsData] = useState({
        manualConfirmation: appointment?.manualConfirmation || false,
        capacityLimit: appointment?.capacityLimit || 50,
        paidBooking: appointment?.paidBooking || false,
        bookingFee: appointment?.bookingFee || 200,
        slotCreation: appointment?.slotCreation || "00:30",
        cancellationHours: appointment?.cancellationHours || "01:00"
    });

    // Misc tab state
    const [miscData, setMiscData] = useState({
        introductionMessage: appointment?.introductionMessage || "Schedule your visit today and experience expert care brought right to your doorstep.",
        confirmationMessage: appointment?.confirmationMessage || "Thank you for your trust, we look forward to meeting you."
    });

    const [schedules, setSchedules] = useState([
        { id: 1, day: "Monday", from: "9:00", to: "12:00" },
        { id: 2, day: "Monday", from: "14:00", to: "17:00" },
        { id: 3, day: "Tuesday", from: "9:00", to: "12:00" },
        { id: 4, day: "Tuesday", from: "14:00", to: "17:00" },
        { id: 5, day: "Wednesday", from: "9:00", to: "12:00" },
        { id: 6, day: "Wednesday", from: "14:00", to: "17:00" },
        { id: 7, day: "Thursday", from: "9:00", to: "12:00" },
        { id: 8, day: "Thursday", from: "14:00", to: "17:00" },
        { id: 9, day: "Friday", from: "9:00", to: "12:00" },
        { id: 10, day: "Friday", from: "14:00", to: "17:00" },
    ]);

    const [isPublished, setIsPublished] = useState(appointment?.isPublished || false);
    const [showMeetings, setShowMeetings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Handlers
    const handleTitleChange = (title) => setFormData((prev) => ({ ...prev, title }));
    const handlePictureUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setFormData((prev) => ({ ...prev, picture: url }));
            }
        };
        input.click();
    };
    const handlePictureRemove = () => setFormData((prev) => ({ ...prev, picture: null }));
    const handleFormChange = (data) => setFormData(data);
    const handleOptionsChange = (data) => setOptionsData(data);
    const handleMiscChange = (data) => setMiscData(data);

    const handleNew = () => {
        setFormData({
            title: "New Appointment",
            picture: null,
            duration: "00:30",
            location: "",
            bookType: "user",
            selectedUsers: [],
            availableUsers: [
                { id: "A1", code: "A1", name: "User 1" },
                { id: "A2", code: "A2", name: "User 2" },
            ],
            assignment: "automatically",
            manageCapacity: false,
            simultaneousAppointments: 1,
        });
        setOptionsData({
            manualConfirmation: false,
            capacityLimit: 50,
            paidBooking: false,
            bookingFee: 200,
            slotCreation: "00:30",
            cancellationHours: "01:00"
        });
        setMiscData({
            introductionMessage: "",
            confirmationMessage: ""
        });
        setSchedules([{ id: 1, day: "Monday", from: "9:00", to: "12:00" }]);
        setIsPublished(false);
    };

    const handlePreview = () => setShowPreview(true);
    const handleMeetings = () => setShowMeetings(true);

    // PUBLISH: Save all data to backend and navigate back
    const handlePublish = () => {
        const appointmentData = {
            // Core details
            name: formData.title,
            duration: parseDuration(formData.duration),
            venue: formData.location,
            image: formData.picture,
            capacity: formData.simultaneousAppointments,
            manageCapacity: formData.manageCapacity,

            // Resource type - determines if shown in Resources section on customer page
            resourceType: formData.bookType === 'resources' ? 'COURT' : null,

            // Options tab
            manualConfirmation: optionsData.manualConfirmation,
            capacityLimit: optionsData.capacityLimit,
            paidBooking: optionsData.paidBooking,
            bookingFee: optionsData.bookingFee,
            slotCreation: optionsData.slotCreation,
            cancellationHours: optionsData.cancellationHours,

            // Misc tab
            introductionMessage: miscData.introductionMessage,
            confirmationMessage: miscData.confirmationMessage,

            // Publish status
            isPublished: true,
        };

        if (appointment?.id) {
            // Update existing appointment
            publishAppointment(appointment.id, appointmentData);
        } else {
            // Add new appointment
            addAppointment(appointmentData);
        }

        // Navigate back to list view
        onBack?.();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
            <SecondaryActionBar
                onNew={handleNew}
                onPreview={handlePreview}
                onPublish={handlePublish}
                onMeetings={handleMeetings}
                onBack={onBack}
                isPublished={isPublished}
            />

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <AppointmentHeader
                        title={formData.title}
                        onTitleChange={handleTitleChange}
                        picture={formData.picture}
                        onPictureUpload={handlePictureUpload}
                        onPictureRemove={handlePictureRemove}
                    />
                </div>

                {/* Core Details Card */}
                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-800">Core Details</h2>
                        <p className="text-sm text-slate-500">Configure appointment settings and resources</p>
                    </div>
                    <CoreDetailsSection data={formData} onChange={handleFormChange} />
                </div>

                {/* Tabs Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                    <div className="px-4 py-4 sm:px-6">
                        <Tabs defaultValue="schedule">
                            <TabsList className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-1">
                                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                <TabsTrigger value="question">Question</TabsTrigger>
                                <TabsTrigger value="options">Options</TabsTrigger>
                                <TabsTrigger value="misc">Misc</TabsTrigger>
                            </TabsList>

                            <TabsContent value="schedule" className="mt-6">
                                <ScheduleTab schedules={schedules} onSchedulesChange={setSchedules} />
                            </TabsContent>

                            <TabsContent value="question" className="mt-6">
                                <QuestionsTab />
                            </TabsContent>

                            <TabsContent value="options" className="mt-6">
                                <OptionsTab options={optionsData} onChange={handleOptionsChange} />
                            </TabsContent>

                            <TabsContent value="misc" className="mt-6">
                                <MiscTab messages={miscData} onChange={handleMiscChange} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>

            <MeetingsModal
                open={showMeetings}
                onOpenChange={setShowMeetings}
                appointment={{ name: formData.title }}
            />
            <PreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
                appointment={formData}
            />
        </div>
    );
}

export { AppointmentFormView };

