import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ArrowRight, Trash2 } from "lucide-react";

/**
 * @intent Schedule tab with weekly schedule table
 * @param {object} props - Component props
 * @param {array} props.schedules - Array of schedule entries
 * @param {function} props.onSchedulesChange - Schedule change handler
 */
function ScheduleTab({ className, schedules, onSchedulesChange }) {
    const handleRowChange = (index, field, value) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        onSchedulesChange?.(newSchedules);
    };

    const handleDeleteRow = (index) => {
        const newSchedules = schedules.filter((_, i) => i !== index);
        onSchedulesChange?.(newSchedules);
    };

    const handleAddLine = () => {
        onSchedulesChange?.([
            ...schedules,
            { id: Date.now(), day: "Monday", from: "9:00", to: "12:00" },
        ]);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden rounded-xl bg-slate-100/80 px-4 py-3 sm:grid sm:grid-cols-[180px_1fr_40px_1fr_48px] sm:gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Day</span>
                <span className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">From</span>
                <span></span>
                <span className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">To</span>
                <span></span>
            </div>

            {/* Schedule Rows */}
            <div className="space-y-2">
                {schedules.map((schedule, index) => (
                    <div
                        key={schedule.id}
                        className="group rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border-slate-300 hover:shadow-sm sm:grid sm:grid-cols-[180px_1fr_40px_1fr_48px] sm:items-center sm:gap-4 sm:p-3"
                    >
                        {/* Mobile Layout */}
                        <div className="mb-3 flex items-center justify-between sm:hidden">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Schedule Entry</span>
                            <button
                                onClick={() => handleDeleteRow(index)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label="Delete schedule row"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Day - Full width on mobile */}
                        <div className="mb-3 sm:mb-0">
                            <span className="mb-1 block text-xs text-slate-400 sm:hidden">Day</span>
                            <input
                                type="text"
                                value={schedule.day}
                                onChange={(e) => handleRowChange(index, "day", e.target.value)}
                                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-center text-sm font-medium transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-9"
                                placeholder="Monday"
                            />
                        </div>

                        {/* Mobile: Time row */}
                        <div className="flex items-center gap-2 sm:contents">
                            <div className="flex-1">
                                <span className="mb-1 block text-xs text-slate-400 sm:hidden">From</span>
                                <Input
                                    type="text"
                                    value={schedule.from}
                                    onChange={(e) => handleRowChange(index, "from", e.target.value)}
                                    className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-center font-mono text-sm focus:bg-white sm:h-9"
                                    placeholder="9:00"
                                />
                            </div>

                            {/* Arrow */}
                            <div className="flex h-10 w-10 items-center justify-center sm:h-9">
                                <ArrowRight className="h-4 w-4 text-slate-300" />
                            </div>

                            <div className="flex-1">
                                <span className="mb-1 block text-xs text-slate-400 sm:hidden">To</span>
                                <Input
                                    type="text"
                                    value={schedule.to}
                                    onChange={(e) => handleRowChange(index, "to", e.target.value)}
                                    className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-center font-mono text-sm focus:bg-white sm:h-9"
                                    placeholder="12:00"
                                />
                            </div>
                        </div>

                        {/* Delete - Hidden on mobile (shown in header) */}
                        <button
                            onClick={() => handleDeleteRow(index)}
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors group-hover:text-slate-400 hover:!bg-red-50 hover:!text-red-500 sm:flex"
                            aria-label="Delete schedule row"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Line Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleAddLine}
                className="mt-2 w-full rounded-xl border-2 border-dashed border-slate-200 text-primary hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:w-auto"
            >
                + Add Schedule Row
            </Button>
        </div>
    );
}

export { ScheduleTab };

