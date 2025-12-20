import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Calendar, Clock, User } from "lucide-react";

/**
 * @intent Modal showing all meetings for an appointment
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {function} props.onOpenChange - Open state change handler
 * @param {object} props.appointment - Appointment data
 */
function MeetingsModal({ open, onOpenChange, appointment }) {
    // Mock meetings data
    const meetings = [
        { id: 1, date: "Dec 20, 2024", time: "9:00 AM", visitor: "John Doe", status: "confirmed" },
        { id: 2, date: "Dec 21, 2024", time: "2:00 PM", visitor: "Jane Smith", status: "pending" },
        { id: 3, date: "Dec 22, 2024", time: "10:30 AM", visitor: "Mike Johnson", status: "confirmed" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Meetings for {appointment?.name || "Appointment"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-3">
                    {meetings.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            No meetings scheduled for this appointment.
                        </div>
                    ) : (
                        meetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="flex items-center justify-between rounded-lg border bg-white p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{meeting.visitor}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {meeting.date}
                                            <Clock className="ml-2 h-3.5 w-3.5" />
                                            {meeting.time}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={meeting.status === "confirmed" ? "success" : "secondary"}>
                                    {meeting.status}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { MeetingsModal };

