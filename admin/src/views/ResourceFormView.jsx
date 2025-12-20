import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { useResourcesStore } from "@/store/resourcesStore";
import { ChevronDown, Save, X } from "lucide-react";
import { useState, useEffect } from "react";

const defaultWorkingHours = {
    monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { enabled: false, slots: [{ start: "10:00", end: "14:00" }] },
    sunday: { enabled: false, slots: [{ start: "10:00", end: "14:00" }] },
};

/**
 * @intent Premium form view for creating/editing resources
 */
function ResourceFormView({ resource, onBack }) {
    const { resources, createResource, updateResource } = useResourcesStore();
    const [formData, setFormData] = useState({
        name: resource?.name || "",
        capacity: resource?.capacity || 1,
        type: resource?.type || "COURT",
        workingHours: resource?.workingHours || defaultWorkingHours,
        linkedResourceIds: resource?.linkedResources?.map(r => r.id) || []
    });
    const [linkedDropdownOpen, setLinkedDropdownOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        if (resource) {
            await updateResource(resource.id, formData);
        } else {
            await createResource(formData);
        }
        onBack();
    };

    const toggleLinkedResource = (id) => {
        setFormData(prev => ({
            ...prev,
            linkedResourceIds: prev.linkedResourceIds.includes(id)
                ? prev.linkedResourceIds.filter(rid => rid !== id)
                : [...prev.linkedResourceIds, id]
        }));
    };

    const availableForLinking = resources.filter(r => r.id !== resource?.id);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {resource ? "Edit Resource" : "Create New Resource"}
                        </h1>
                        <p className="text-sm text-gray-500">Define capacity and availability for your physical assets</p>
                    </div>
                    <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-6">General Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Resource Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Center Court, Conference Room A"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Resource Type</Label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="COURT">Court</option>
                                    <option value="ROOM">Room</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                    <option value="VENUE">Venue</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Maximum Capacity (Concurrent Users)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Weekly Availability</h2>
                            <p className="text-xs text-gray-400 font-mono uppercase">Operational Hours</p>
                        </div>
                        <div className="space-y-4">
                            {Object.keys(formData.workingHours).map((day) => (
                                <div key={day} className="flex items-center gap-4 py-3 border-b last:border-0 border-gray-50">
                                    <div className="w-24">
                                        <span className="capitalize text-sm font-medium text-gray-700">{day}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.workingHours[day].enabled}
                                        onChange={(e) => {
                                            const updatedHours = { ...formData.workingHours };
                                            updatedHours[day].enabled = e.target.checked;
                                            setFormData({ ...formData, workingHours: updatedHours });
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {formData.workingHours[day].enabled && (
                                        <div className="flex items-center gap-2 ml-4">
                                            {formData.workingHours[day].slots.map((slot, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(e) => {
                                                            const updatedHours = { ...formData.workingHours };
                                                            updatedHours[day].slots[idx].start = e.target.value;
                                                            setFormData({ ...formData, workingHours: updatedHours });
                                                        }}
                                                        className="w-32 h-8 py-1 px-2 text-xs"
                                                    />
                                                    <span className="text-gray-400">to</span>
                                                    <Input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(e) => {
                                                            const updatedHours = { ...formData.workingHours };
                                                            updatedHours[day].slots[idx].end = e.target.value;
                                                            setFormData({ ...formData, workingHours: updatedHours });
                                                        }}
                                                        className="w-32 h-8 py-1 px-2 text-xs"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Linking */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Linked Assets</h2>
                        <div className="relative">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLinkedDropdownOpen(!linkedDropdownOpen)}
                                className="w-full justify-between"
                            >
                                <span className="text-gray-500">
                                    {formData.linkedResourceIds.length > 0
                                        ? `${formData.linkedResourceIds.length} resources selected`
                                        : "Select companion resources..."}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", linkedDropdownOpen && "rotate-180")} />
                            </Button>

                            {linkedDropdownOpen && availableForLinking.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-auto">
                                    {availableForLinking.map((res) => (
                                        <label key={res.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.linkedResourceIds.includes(res.id)}
                                                onChange={() => toggleLinkedResource(res.id)}
                                                className="rounded border-gray-300 text-blue-600"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{res.name}</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-tight">{res.type}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <Button type="button" variant="ghost" onClick={onBack}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                            <Save className="h-4 w-4 mr-2" />
                            {resource ? "Update Resource" : "Create Resource"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export { ResourceFormView };
