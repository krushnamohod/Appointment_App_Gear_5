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
        <div className={cn("space-y-2", className)}>
            {/* Header */}
            <div className="grid grid-cols-[200px_1fr_40px_1fr_40px] gap-4 px-2 py-2 text-sm font-medium text-gray-500">
                <span>Every</span>
                <span className="text-center">From</span>
                <span></span>
                <span className="text-center">To</span>
                <span></span>
            </div>

            {/* Schedule Rows */}
            <div className="space-y-1">
                {schedules.map((schedule, index) => (
                    <div
                        key={schedule.id}
                        className="grid grid-cols-[200px_1fr_40px_1fr_40px] items-center gap-4 rounded-lg border bg-white px-2 py-2 hover:bg-gray-50"
                    >
                        {/* Day */}
                        <input
                            type="text"
                            value={schedule.day}
                            onChange={(e) => handleRowChange(index, "day", e.target.value)}
                            className="text-center h-8"
                            placeholder="Monday"
                        />
                        {/* From Time */}
                        <Input
                            type="text"
                            value={schedule.from}
                            onChange={(e) => handleRowChange(index, "from", e.target.value)}
                            className="text-center h-8"
                            placeholder="9:00"
                        />

                        {/* Arrow */}
                        <div className="flex justify-center">
                            <ArrowRight className="h-4 w-4 text-red-400" />
                        </div>

                        {/* To Time */}
                        <Input
                            type="text"
                            value={schedule.to}
                            onChange={(e) => handleRowChange(index, "to", e.target.value)}
                            className="text-center h-8"
                            placeholder="12:00"
                        />

                        {/* Delete */}
                        <button
                            onClick={() => handleDeleteRow(index)}
                            className="flex h-8 w-8 items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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
                className="text-primary hover:text-primary/80"
            >
                + Add a Line
            </Button>
        </div>
    );
}

export { ScheduleTab };

