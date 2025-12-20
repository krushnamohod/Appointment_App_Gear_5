import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { useResourcesStore } from "@/store/resourcesStore";
import { useUsersStore } from "@/store/usersStore";
import { Box, ChevronDown, Edit2, Loader2, Plus, Save, Trash2, User, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @intent User settings view with edit functionality for name and email
 */
function UserSettingsView() {
    const { users, loading, error, fetchUsers, updateUserProfile } = useUsersStore();
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: "", email: "" });
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditData({ name: user.name, email: user.email });
        setSaveError(null);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({ name: "", email: "" });
        setSaveError(null);
    };

    const handleSave = async () => {
        if (!editData.name.trim() || !editData.email.trim()) {
            setSaveError("Name and email are required");
            return;
        }

        const result = await updateUserProfile(editingId, editData);
        if (result.success) {
            setEditingId(null);
            setEditData({ name: "", email: "" });
            setSaveError(null);
        } else {
            setSaveError(result.error);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
                <span className="ml-2">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="p-8 bg-paper min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-terracotta" />
                <h1 className="font-heading text-2xl font-bold text-ink">User Settings</h1>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {error}
                </div>
            )}

            <div className="card-paper">
                {users.length === 0 ? (
                    <div className="text-center py-12 text-ink-light">
                        <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No users found.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-ink/10">
                        {users.map((user) => (
                            <div key={user.id} className="p-4 hover:bg-paper transition-colors">
                                {editingId === user.id ? (
                                    /* Edit Mode */
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="block text-sm font-medium text-ink mb-1">
                                                Name
                                            </Label>
                                            <Input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium text-ink mb-1">
                                                Email
                                            </Label>
                                            <Input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                        {saveError && (
                                            <p className="text-red-500 text-sm">{saveError}</p>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <Button onClick={handleSave} className="btn-primary">
                                                <Save className="h-4 w-4 mr-1" />
                                                Save
                                            </Button>
                                            <Button onClick={handleCancel} className="btn-outline">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-ink">{user.name}</p>
                                            <p className="text-sm text-ink-light">{user.email}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                            className="text-terracotta hover:text-terracotta-dark"
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

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
 * @intent Resources settings view with CRUD operations
 */
function ResourcesSettingsView() {
    const { resources, loading, error, fetchResources, createResource, updateResource, deleteResource } = useResourcesStore();
    const [selectedResource, setSelectedResource] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", capacity: 1, type: "COURT", workingHours: defaultWorkingHours, linkedResourceIds: [] });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [linkedDropdownOpen, setLinkedDropdownOpen] = useState(false);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleNew = () => {
        setSelectedResource(null);
        setFormData({ name: "", capacity: 1, type: "COURT", workingHours: defaultWorkingHours, linkedResourceIds: [] });
        setShowForm(true);
    };

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setFormData({
            name: resource.name,
            capacity: resource.capacity,
            type: resource.type || "COURT",
            workingHours: resource.workingHours || defaultWorkingHours,
            linkedResourceIds: resource.linkedResources?.map(r => r.id) || []
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        if (selectedResource) {
            await updateResource(selectedResource.id, formData);
        } else {
            await createResource(formData);
        }
        setShowForm(false);
        setSelectedResource(null);
    };

    const handleDelete = async (id) => {
        await deleteResource(id);
        setDeleteConfirm(null);
    };

    const toggleLinkedResource = (id) => {
        setFormData(prev => ({
            ...prev,
            linkedResourceIds: prev.linkedResourceIds.includes(id)
                ? prev.linkedResourceIds.filter(rid => rid !== id)
                : [...prev.linkedResourceIds, id]
        }));
    };

    // Default resources for linking when none exist in database
    const defaultLinkOptions = [
        { id: "court-2", name: "Court 2", capacity: 2 },
        { id: "court-3", name: "Court 3", capacity: 2 },
        { id: "court-4", name: "Court 4", capacity: 2 },
    ];

    // Get available resources for linking (exclude current resource)
    // Use default options if no resources exist
    const availableForLinking = resources.length > 0
        ? resources.filter(r => r.id !== selectedResource?.id)
        : defaultLinkOptions;

    if (loading && resources.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
                <span className="ml-2">Loading resources...</span>
            </div>
        );
    }

    return (
        <div className="p-8 bg-paper min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Box className="h-6 w-6 text-terracotta" />
                    <h1 className="font-heading text-2xl font-bold text-ink">Resources</h1>
                </div>
                <Button onClick={handleNew} className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                </Button>
            </div>

            {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {error}
                </div>
            )}

            {/* Resource Form */}
            {showForm && (
                <div className="card-paper mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading text-xl font-bold text-ink">
                            {selectedResource ? "Edit Resource" : "New Resource"}
                        </h2>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-ink-light hover:text-ink"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Name */}
                            <div>
                                <Label className="block text-sm font-medium text-ink mb-1">
                                    Name <span className="text-terracotta">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Court 1"
                                    className="input-field"
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <Label className="block text-sm font-medium text-ink mb-1">
                                    Type
                                </Label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="COURT">Court</option>
                                    <option value="VENUE">Venue</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                    <option value="ROOM">Room</option>
                                </select>
                            </div>

                            {/* Capacity */}
                            <div>
                                <Label className="block text-sm font-medium text-ink mb-1">
                                    Capacity (Total slots)
                                </Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                    className="input-field w-full"
                                />
                            </div>
                        </div>

                        {/* Working Hours/Schedule */}
                        <div className="border-t pt-4">
                            <Label className="block text-sm font-medium text-ink mb-2">
                                Weekly Availability Schedule
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {Object.keys(formData.workingHours).map((day) => (
                                    <div key={day} className="p-2 border rounded-lg bg-paper-light">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="capitalize font-medium text-sm">{day}</span>
                                            <input
                                                type="checkbox"
                                                checked={formData.workingHours[day].enabled}
                                                onChange={(e) => {
                                                    const updatedHours = { ...formData.workingHours };
                                                    updatedHours[day].enabled = e.target.checked;
                                                    setFormData({ ...formData, workingHours: updatedHours });
                                                }}
                                            />
                                        </div>
                                        {formData.workingHours[day].enabled && (
                                            <div className="space-y-1">
                                                {formData.workingHours[day].slots.map((slot, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 text-[10px]">
                                                        <input
                                                            type="time"
                                                            value={slot.start}
                                                            onChange={(e) => {
                                                                const updatedHours = { ...formData.workingHours };
                                                                updatedHours[day].slots[idx].start = e.target.value;
                                                                setFormData({ ...formData, workingHours: updatedHours });
                                                            }}
                                                            className="border rounded px-1 py-0.5 w-full"
                                                        />
                                                        <span>-</span>
                                                        <input
                                                            type="time"
                                                            value={slot.end}
                                                            onChange={(e) => {
                                                                const updatedHours = { ...formData.workingHours };
                                                                updatedHours[day].slots[idx].end = e.target.value;
                                                                setFormData({ ...formData, workingHours: updatedHours });
                                                            }}
                                                            className="border rounded px-1 py-0.5 w-full"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Linked Resources */}
                        <div>
                            <Label className="block text-sm font-medium text-ink mb-1">
                                Linked Resources
                            </Label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setLinkedDropdownOpen(!linkedDropdownOpen)}
                                    className="input-field flex items-center justify-between"
                                >
                                    <span className="text-ink-light">
                                        {formData.linkedResourceIds.length > 0
                                            ? `${formData.linkedResourceIds.length} selected`
                                            : "Select resources..."}
                                    </span>
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", linkedDropdownOpen && "rotate-180")} />
                                </button>

                                {linkedDropdownOpen && availableForLinking.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-ink/10 rounded-lg shadow-lg max-h-48 overflow-auto">
                                        {availableForLinking.map((res) => (
                                            <label
                                                key={res.id}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-paper cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.linkedResourceIds.includes(res.id)}
                                                    onChange={() => toggleLinkedResource(res.id)}
                                                    className="rounded border-ink/20"
                                                />
                                                <span className="text-ink">{res.name}</span>
                                                <span className="text-ink-light text-xs ml-auto">Cap: {res.capacity}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected chips */}
                            {formData.linkedResourceIds.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.linkedResourceIds.map(id => {
                                        const res = resources.find(r => r.id === id);
                                        return res ? (
                                            <span
                                                key={id}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-terracotta/10 text-terracotta rounded text-sm"
                                            >
                                                {res.name}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleLinkedResource(id)}
                                                    className="hover:text-terracotta-dark"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="btn-primary">
                                <Save className="h-4 w-4 mr-2" />
                                {selectedResource ? "Update" : "Create"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Resources List */}
            <div className="card-paper">
                {resources.length === 0 ? (
                    <div className="text-center py-12 text-ink-light">
                        <Box className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No resources yet. Click "New" to create one.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-ink/10">
                        {resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="flex items-center justify-between p-4 hover:bg-paper transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-ink">{resource.name}</p>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-ink-light">
                                        <span>Capacity: <span className="font-mono">{resource.capacity}</span></span>
                                        {resource.linkedResources?.length > 0 && (
                                            <span>
                                                Linked: {resource.linkedResources.map(r => r.name).join(", ")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(resource)}
                                        className="text-terracotta hover:text-terracotta-dark"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteConfirm(resource.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Delete Confirmation */}
                                {deleteConfirm === resource.id && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                                            <p className="font-medium text-ink mb-4">
                                                Delete "{resource.name}"?
                                            </p>
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="btn-outline"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="bg-red-500 text-white hover:bg-red-600"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export { ResourcesSettingsView, UserSettingsView };

