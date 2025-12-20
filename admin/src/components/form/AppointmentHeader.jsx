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
        <div className={cn("flex items-start justify-between gap-6 px-6 py-4", className)}>
            {/* Editable Title */}
            <div className="flex-1">
                <p className="mb-1 text-xs text-muted-foreground">Appointment title</p>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    className="border-0 border-b rounded-none text-3xl font-bold h-auto py-2 px-0 focus-visible:ring-0 focus-visible:border-primary"
                    placeholder="Enter appointment name..."
                />
            </div>

            {/* Picture Upload Box */}
            <div className="flex flex-col items-center">
                <div className="relative flex h-24 w-28 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                    {picture ? (
                        <>
                            <img src={picture} alt="Appointment" className="h-full w-full object-cover rounded-lg" />
                            <button
                                onClick={onPictureRemove}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                aria-label="Remove picture"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-sm font-medium text-gray-500">Picture</span>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={onPictureUpload}
                                    className="rounded p-1 hover:bg-gray-200"
                                    aria-label="Upload picture"
                                >
                                    <Upload className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                    onClick={onPictureRemove}
                                    className="rounded p-1 hover:bg-gray-200"
                                    aria-label="Remove picture"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
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

