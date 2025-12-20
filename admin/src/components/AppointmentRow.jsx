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
        <Card
            className={cn(
                "flex items-center justify-between gap-4 p-4 transition-all hover:shadow-md",
                className
            )}
            role="article"
            aria-label={`Appointment: ${name}`}
        >
            {/* Left Section: Name + Duration + Resources */}
            <div className="flex flex-1 items-center gap-6">
                {/* Name */}
                <div className="min-w-[160px]">
                    <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>{duration} Min Duration</span>
                </div>

                {/* Resources */}
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    <div className="flex gap-1">
                        {resources.map((resource) => (
                            <ResourcePill key={resource} label={resource} />
                        ))}
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="text-sm text-gray-500">
                    {upcomingMeetings} Meeting{upcomingMeetings !== 1 ? "s" : ""} Upcoming
                </div>
            </div>

            {/* Right Section: Actions + Status */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    aria-label={`Share ${name}`}
                >
                    <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Share
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(appointment)}
                    aria-label={`Edit ${name}`}
                >
                    <Edit className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                </Button>

                <StatusBadge isPublished={isPublished} />
            </div>
        </Card>
    );
}

export { AppointmentRow };

