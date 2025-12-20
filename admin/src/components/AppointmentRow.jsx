import { ResourcePill } from "@/components/ResourcePill";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, generateShareLink } from "@/lib/utils";
import { Clock, Edit, Share2, Users } from "lucide-react";

/**
 * @intent Individual appointment row with all details and actions
 * @param {object} props - Component props
 * @param {object} props.appointment - Appointment data object
 * @param {function} props.onEdit - Edit callback
 */
function AppointmentRow({ appointment, onEdit, className }) {
    const { id, name, duration, resources, upcomingMeetings, isPublished } = appointment;

    const handleShare = async () => {
        const shareUrl = generateShareLink(id);
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert(`Share link copied: ${shareUrl}`);
        } catch {
            prompt("Copy this link:", shareUrl);
        }
    };

    return (
        <div
            className={cn(
                "group grid grid-cols-12 gap-4 items-center px-6 py-4 transition-all hover:bg-slate-50",
                className
            )}
            role="article"
            aria-label={`Appointment: ${name}`}
        >
            {/* Col 1: Service Name & Status */}
            <div className="col-span-4 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-medium text-gray-900">{name}</h3>
                    <StatusBadge isPublished={isPublished} className="scale-90" />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    {upcomingMeetings} Upcoming Booking{upcomingMeetings !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Col 2: Duration */}
            <div className="col-span-2 flex items-center text-sm text-gray-600">
                <Clock className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <span>{duration} min</span>
            </div>

            {/* Col 3: Resources */}
            <div className="col-span-3">
                <div className="flex flex-wrap gap-1">
                    {resources && resources.length > 0 ? (
                        resources.map((resource) => (
                            <ResourcePill key={resource} label={resource} />
                        ))
                    ) : (
                        <span className="text-xs text-gray-400 italic">No providers</span>
                    )}
                </div>
            </div>

            {/* Col 4: Actions */}
            <div className="col-span-3 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                    title="Share Link"
                >
                    <Share2 className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(appointment)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600"
                    title="Edit Service"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export { AppointmentRow };

