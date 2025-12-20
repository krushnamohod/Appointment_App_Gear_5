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

export { UserSettingsView };

