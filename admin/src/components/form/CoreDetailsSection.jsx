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
        <div className={cn("p-4 sm:p-6", className)}>
            <div className="grid gap-6 md:grid-cols-2 md:gap-x-12">
                {/* Left Column */}
                <div className="space-y-5">
                    {/* Duration */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Duration</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="text"
                                value={data.duration || "00:30"}
                                onChange={(e) => handleChange("duration", e.target.value)}
                                className="w-24 text-center rounded-xl border-slate-200 bg-slate-50/50 font-mono text-base focus:bg-white"
                                placeholder="00:30"
                            />
                            <span className="text-sm text-slate-500">Hours:Minutes</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Location</Label>
                        <Input
                            type="text"
                            value={data.location || ""}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
                            placeholder="Doctor's Office"
                        />
                        {!data.location && (
                            <p className="flex items-center gap-1.5 text-xs text-amber-600">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                If empty, this will be an Online Appointment
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    {/* Book Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Book By</Label>
                        <RadioGroup
                            value={data.bookType || "user"}
                            onValueChange={(val) => handleChange("bookType", val)}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary/30">
                                <RadioGroupItem value="user" id="book-user" />
                                <Label htmlFor="book-user" className="cursor-pointer font-normal">User</Label>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary/30">
                                <RadioGroupItem value="resources" id="book-resources" />
                                <Label htmlFor="book-resources" className="cursor-pointer font-normal">Resources</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Users/Resources Pills */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Select Users</Label>
                        <div className="flex flex-wrap gap-2">
                            {(data.availableUsers || []).map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all duration-200",
                                        (data.selectedUsers || []).includes(user.id)
                                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-sm">
                                        {user.code}
                                    </span>
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assignment */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Assignment Method</Label>
                        <RadioGroup
                            value={data.assignment || "automatically"}
                            onValueChange={(val) => handleChange("assignment", val)}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary/30">
                                <RadioGroupItem value="automatically" id="assign-auto" />
                                <Label htmlFor="assign-auto" className="cursor-pointer font-normal">Automatically</Label>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 transition-colors has-[:checked]:bg-primary/10 has-[:checked]:ring-1 has-[:checked]:ring-primary/30">
                                <RadioGroupItem value="visitor" id="assign-visitor" />
                                <Label htmlFor="assign-visitor" className="cursor-pointer font-normal">By Visitor</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Manage Capacity */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="flex items-start gap-3">
                            <Checkbox
                                checked={data.manageCapacity || false}
                                onCheckedChange={(val) => handleChange("manageCapacity", val)}
                                id="manage-capacity"
                                className="mt-0.5"
                            />
                            <div className="flex-1">
                                <Label htmlFor="manage-capacity" className="cursor-pointer text-sm font-medium text-slate-700">
                                    Manage Capacity
                                </Label>
                                <p className="mt-1 text-xs text-slate-500">
                                    Allow{" "}
                                    <Input
                                        type="number"
                                        value={data.simultaneousAppointments || 1}
                                        onChange={(e) => handleChange("simultaneousAppointments", parseInt(e.target.value) || 1)}
                                        className="mx-1 inline-block h-7 w-14 rounded-lg border-slate-200 text-center text-sm"
                                        disabled={!data.manageCapacity}
                                        min={1}
                                    />{" "}
                                    simultaneous appointment(s) per user
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { CoreDetailsSection };

