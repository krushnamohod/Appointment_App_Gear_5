import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, Eye, Globe, Plus } from "lucide-react";

/**
 * @intent Secondary action bar for appointment form actions
 * @param {object} props - Component props
 * @param {function} props.onNew - New action handler
 * @param {function} props.onPreview - Preview action handler
 * @param {function} props.onPublish - Publish action handler
 * @param {function} props.onMeetings - Meetings action handler
 * @param {function} props.onBack - Back action handler (optional)
 * @param {boolean} props.isPublished - Current publish status
 */
function SecondaryActionBar({ onNew, onPreview, onPublish, onMeetings, onBack, isPublished }) {
    return (
        <div className="border-b bg-white px-6 py-2 shadow-sm flex items-center justify-between sticky top-0 z-10">
            {/* Left Actions */}
            <div className="flex items-center space-x-2">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <Button variant="outline" size="sm" onClick={onNew}>
                    <Plus className="mr-2 h-4 w-4" /> New
                </Button>
                <Button variant="outline" size="sm" onClick={onPreview}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Preview
                </Button>
                <Button
                    variant={isPublished ? "default" : "outline"}
                    size="sm"
                    onClick={onPublish}
                    className={isPublished ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                >
                    <Globe className="mr-1.5 h-3.5 w-3.5" />
                    Publish
                </Button>
            </div>

            {/* Right Actions */}
            <Button variant="outline" size="sm" onClick={onMeetings}>
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                Meetings
            </Button>
        </div>
    );
}

export { SecondaryActionBar };

