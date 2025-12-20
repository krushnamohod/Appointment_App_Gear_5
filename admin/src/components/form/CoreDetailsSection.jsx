import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { cn } from "@/lib/utils";

/**
 * @intent Core details section with duration, location, book type, users, assignment, capacity
 * @param {object} props - Component props
 * @param {object} props.data - Form data
 * @param {function} props.onChange - Change handler
 */
function CoreDetailsSection({ className, data, onChange }) {
    const handleChange = (field, value) => {
        onChange?.({ ...data, [field]: value });
    };

    const toggleUser = (userId) => {
        const currentUsers = data.selectedUsers || [];
        const newUsers = currentUsers.includes(userId)
            ? currentUsers.filter((id) => id !== userId)
            : [...currentUsers, userId];
        handleChange("selectedUsers", newUsers);
    };

    return (
        <div className={cn("grid grid-cols-2 gap-x-12 gap-y-4 px-6 py-4", className)}>
            {/* Left Column */}
            <div className="space-y-4">
                {/* Duration */}
                <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-600">Duration</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={data.duration || "00:30"}
                            onChange={(e) => handleChange("duration", e.target.value)}
                            className="w-20 text-center"
                            placeholder="00:30"
                        />
                        <span className="text-sm text-gray-600">Hours</span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                    <Label className="w-20 text-gray-600">Location</Label>
                    <Input
                        type="text"
                        value={data.location || ""}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="flex-1"
                        placeholder="Doctor's Office"
                    />
                </div>
                {!data.location && (
                    <p className="ml-[92px] text-xs text-amber-600">
                        If location is empty → Online Appointment
                    </p>
                )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                {/* Book Type */}
                <div className="flex items-center gap-3">
                    <Label className="w-24 text-gray-600">Book</Label>
                    <RadioGroup
                        value={data.bookType || "user"}
                        onValueChange={(val) => handleChange("bookType", val)}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="user" id="book-user" />
                            <Label htmlFor="book-user" className="font-normal cursor-pointer">User</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="resources" id="book-resources" />
                            <Label htmlFor="book-resources" className="font-normal cursor-pointer">Resources</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Users/Resources Pills */}
                <div className="flex items-center gap-3">
                    <Label className="w-24 text-gray-600">user</Label>
                    <div className="flex gap-2">
                        {(data.availableUsers || []).map((user) => (
                            <button
                                key={user.id}
                                onClick={() => toggleUser(user.id)}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm transition-colors",
                                    (data.selectedUsers || []).includes(user.id)
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
                                    {user.code}
                                </span>
                                {user.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assignment */}
                <div className="flex items-center gap-3">
                    <Label className="w-24 text-gray-600">Assignment</Label>
                    <RadioGroup
                        value={data.assignment || "automatically"}
                        onValueChange={(val) => handleChange("assignment", val)}
                        className="flex items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="automatically" id="assign-auto" />
                            <Label htmlFor="assign-auto" className="font-normal cursor-pointer">Automatically</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="visitor" id="assign-visitor" />
                            <Label htmlFor="assign-visitor" className="font-normal cursor-pointer">By visitor</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Manage Capacity */}
                <div className="flex items-start gap-3">
                    <Label className="w-24 text-gray-600">Manage capacity</Label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={data.manageCapacity || false}
                                onCheckedChange={(val) => handleChange("manageCapacity", val)}
                                id="manage-capacity"
                            />
                            <Label htmlFor="manage-capacity" className="font-normal cursor-pointer">
                                Allow
                                <Input
                                    type="number"
                                    value={data.simultaneousAppointments || 1}
                                    onChange={(e) => handleChange("simultaneousAppointments", parseInt(e.target.value) || 1)}
                                    className="mx-1.5 inline-block w-12 h-7 text-center"
                                    disabled={!data.manageCapacity}
                                    min={1}
                                />
                                Simultaneous Appointment(s) per user
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CoreDetailsSection };

