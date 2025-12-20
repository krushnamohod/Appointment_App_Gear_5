import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";

/**
 * @intent Appointment header with editable title and picture upload
 * @param {object} props - Component props
 * @param {string} props.title - Appointment title
 * @param {function} props.onTitleChange - Title change handler
 * @param {string} props.picture - Picture URL (optional)
 * @param {function} props.onPictureUpload - Picture upload handler
 * @param {function} props.onPictureRemove - Picture remove handler
 */
function AppointmentHeader({ className, title, onTitleChange, picture, onPictureUpload, onPictureRemove }) {
    return (
        <div className={cn("flex flex-col-reverse gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6", className)}>
            {/* Editable Title */}
            <div className="flex-1 min-w-0">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Appointment Title</p>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    className="border-0 border-b-2 border-slate-200 rounded-none text-xl font-bold h-auto py-3 px-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary sm:text-2xl lg:text-3xl transition-colors"
                    placeholder="Enter appointment name..."
                />
            </div>

            {/* Picture Upload Box */}
            <div className="flex flex-shrink-0 items-center gap-3 sm:flex-col">
                <div className="relative flex h-20 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-200 hover:border-primary/40 hover:bg-slate-50 sm:h-24 sm:w-28">
                    {picture ? (
                        <>
                            <img src={picture} alt="Appointment" className="h-full w-full object-cover rounded-xl" />
                            <button
                                onClick={onPictureRemove}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110 hover:bg-red-600"
                                aria-label="Remove picture"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-1 rounded-full bg-slate-200/80 p-2">
                                <Upload className="h-4 w-4 text-slate-500" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">Add Image</span>
                            <div className="mt-2 flex gap-1.5">
                                <button
                                    onClick={onPictureUpload}
                                    className="rounded-lg bg-primary/10 p-1.5 text-primary transition-colors hover:bg-primary/20"
                                    aria-label="Upload picture"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={onPictureRemove}
                                    className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition-colors hover:bg-slate-200"
                                    aria-label="Clear"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export { AppointmentHeader };

