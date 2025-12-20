import { MeetingsModal } from "@/components/MeetingsModal";
import { PreviewModal } from "@/components/PreviewModal";
import { SecondaryActionBar } from "@/components/SecondaryActionBar";
import { AppointmentHeader } from "@/components/form/AppointmentHeader";
import { CoreDetailsSection } from "@/components/form/CoreDetailsSection";
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
        picture: null,
        duration: formatDuration(appointment?.duration || 30),
        location: "Doctor's Office",
        bookType: "user",
        selectedUsers: appointment?.resources || ["A1", "A2"],
        availableUsers: [
            { id: "A1", code: "A1", name: "User 1" },
            { id: "A2", code: "A2", name: "User 2" },
        ],
        assignment: "automatically",
        manageCapacity: false,
        simultaneousAppointments: 1,
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
        setSchedules([{ id: 1, day: "Monday", from: "9:00", to: "12:00" }]);
        setIsPublished(false);
    };

    const handlePreview = () => setShowPreview(true);
    const handleMeetings = () => setShowMeetings(true);

    // PUBLISH: Save data to store and navigate back
    const handlePublish = () => {
        const appointmentData = {
            name: formData.title,
            duration: parseDuration(formData.duration),
            resources: formData.selectedUsers,
            location: formData.location,
            isPublished: true,
        };

        if (appointment?.id) {
            // Update existing appointment
            publishAppointment(appointment.id, appointmentData);
        } else {
            // Add new appointment
            addAppointment({
                ...appointmentData,
                upcomingMeetings: 0,
            });
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
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-xl">⚙️</span>
                                    </div>
                                    <p className="font-medium text-slate-600">Configure appointment options and pricing</p>
                                    <p className="mt-1 text-sm text-slate-400">Coming soon</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="misc" className="mt-6">
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                        <span className="text-xl">📋</span>
                                    </div>
                                    <p className="font-medium text-slate-600">Miscellaneous settings and configurations</p>
                                    <p className="mt-1 text-sm text-slate-400">Coming soon</p>
                                </div>
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

