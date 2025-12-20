import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Calendar, Clock, ExternalLink, Eye, MapPin, Users } from "lucide-react";

/**
 * @intent Preview modal showing how the booking page will look
 */
function PreviewModal({ open, onOpenChange, appointment }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Booking Page Preview
                    </DialogTitle>
                </DialogHeader>

                {/* Preview Content */}
                <div className="mt-4 rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        {/* Header */}
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {appointment?.title || "Dental care"}
                            </h2>
                            <p className="mt-1 text-gray-500">Book your appointment online</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock className="h-5 w-5 text-primary" />
                                <span>{appointment?.duration || "00:30"} Hours</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>{appointment?.location || "Doctor's Office"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Users className="h-5 w-5 text-primary" />
                                <span>Select your preferred staff member</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6">
                            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                                <Calendar className="mr-2 h-4 w-4" />
                                Select Date & Time
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary">Preview Mode</Badge>
                    <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Open in New Tab
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { PreviewModal };

