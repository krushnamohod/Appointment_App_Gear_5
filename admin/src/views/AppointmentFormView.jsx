import { MeetingsModal } from "@/components/MeetingsModal";
import { PreviewModal } from "@/components/PreviewModal";
import { SecondaryActionBar } from "@/components/SecondaryActionBar";
import { AppointmentHeader } from "@/components/form/AppointmentHeader";
import { CoreDetailsSection } from "@/components/form/CoreDetailsSection";
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* TopNavBar removed from here */}

            <SecondaryActionBar
                onNew={handleNew}
                onPreview={handlePreview}
                onPublish={handlePublish}
                onMeetings={handleMeetings}
                onBack={onBack}
                isPublished={isPublished}
            />

            <main className="mx-auto max-w-6xl">
                <AppointmentHeader
                    title={formData.title}
                    onTitleChange={handleTitleChange}
                    picture={formData.picture}
                    onPictureUpload={handlePictureUpload}
                    onPictureRemove={handlePictureRemove}
                />

                <CoreDetailsSection data={formData} onChange={handleFormChange} />

                <div className="px-6 py-4">
                    <Tabs defaultValue="schedule">
                        <TabsList>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            <TabsTrigger value="question">Question</TabsTrigger>
                            <TabsTrigger value="options">Options</TabsTrigger>
                            <TabsTrigger value="misc">Misc</TabsTrigger>
                        </TabsList>

                        <TabsContent value="schedule" className="mt-4">
                            <ScheduleTab schedules={schedules} onSchedulesChange={setSchedules} />
                        </TabsContent>

                        <TabsContent value="question" className="mt-4">
                            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                                Configure questions for this appointment type.
                            </div>
                        </TabsContent>

                        <TabsContent value="options" className="mt-4">
                            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                                Configure appointment options and pricing.
                            </div>
                        </TabsContent>

                        <TabsContent value="misc" className="mt-4">
                            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                                Miscellaneous settings and configurations.
                            </div>
                        </TabsContent>
                    </Tabs>
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

