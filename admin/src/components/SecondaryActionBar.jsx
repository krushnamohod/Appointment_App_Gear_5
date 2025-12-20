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
        <div className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                {/* Left Actions */}
                <div className="flex items-center gap-1.5 overflow-x-auto sm:gap-2">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0 rounded-xl hover:bg-slate-100">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div className="hidden h-6 w-px bg-slate-200 sm:block" />
                    <Button variant="outline" size="sm" onClick={onNew} className="flex-shrink-0 rounded-xl border-slate-200 hover:bg-slate-50">
                        <Plus className="mr-1.5 h-4 w-4" />
                        <span className="hidden sm:inline">New</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={onPreview} className="flex-shrink-0 rounded-xl border-slate-200 hover:bg-slate-50">
                        <Eye className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">Preview</span>
                    </Button>
                    <Button
                        variant={isPublished ? "default" : "outline"}
                        size="sm"
                        onClick={onPublish}
                        className={isPublished
                            ? "flex-shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-200/50 hover:from-emerald-600 hover:to-teal-600"
                            : "flex-shrink-0 rounded-xl border-slate-200 hover:bg-slate-50"
                        }
                    >
                        <Globe className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">Publish</span>
                    </Button>
                </div>

                {/* Right Actions */}
                <Button variant="outline" size="sm" onClick={onMeetings} className="flex-shrink-0 rounded-xl border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                    <Calendar className="h-3.5 w-3.5 text-blue-600 sm:mr-1.5" />
                    <span className="hidden text-blue-700 sm:inline">Meetings</span>
                </Button>
            </div>
        </div>
    );
}

export { SecondaryActionBar };

