import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { useUsersStore } from "@/store/usersStore";
import { AlertTriangle, Loader2, Plus, Trash2, User, UserCheck, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @intent User role management view with CRUD operations
 */
function UserRoleManagement() {
    const { users, loading, error, fetchUsers, createUser, toggleUserStatus, updateUserRole, deleteUser } = useUsersStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "ADMIN":
                return "bg-red-100 text-red-700 border-red-200";
            case "ORGANISER":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "PROVIDER":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await deleteUser(userId);
        if (result.success) {
            setDeleteConfirm(null);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        await updateUserRole(userId, newRole);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">User Role Management</h1>
                        <p className="text-sm text-slate-500">Create, manage and control user access</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-200/50 hover:from-blue-700 hover:to-indigo-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Content */}
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Error Banner */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && users.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50">
                        <User className="mb-4 h-12 w-12 text-slate-300" />
                        <p className="text-lg font-medium text-slate-600">No users found</p>
                        <p className="text-sm text-slate-400">Create your first user to get started</p>
                    </div>
                ) : (
                    /* Users Table */
                    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/50">
                        {/* Table Header */}
                        <div className="hidden border-b border-slate-100 bg-slate-50/80 px-6 py-3 sm:grid sm:grid-cols-[1fr_1fr_140px_100px_100px]">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</span>
                            <span className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Status</span>
                            <span className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</span>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-slate-50/50 sm:grid sm:grid-cols-[1fr_1fr_140px_100px_100px] sm:items-center sm:gap-4 sm:px-6"
                                >
                                    {/* Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-800">{user.name}</p>
                                            <p className="truncate text-xs text-slate-400 sm:hidden">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Email - Hidden on mobile, shown above */}
                                    <p className="hidden truncate text-sm text-slate-600 sm:block">{user.email}</p>

                                    {/* Role Dropdown */}
                                    <div className="flex items-center gap-2 sm:block">
                                        <span className="text-xs text-slate-400 sm:hidden">Role:</span>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={cn(
                                                "cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                                                getRoleBadgeClass(user.role)
                                            )}
                                        >
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="ORGANISER">Organiser</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>

                                    {/* Status Toggle */}
                                    <div className="flex items-center gap-2 sm:justify-center">
                                        <span className="text-xs text-slate-400 sm:hidden">Status:</span>
                                        <button
                                            onClick={() => toggleUserStatus(user.id)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                                user.isActive
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            )}
                                        >
                                            {user.isActive ? (
                                                <>
                                                    <UserCheck className="h-3.5 w-3.5" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <UserX className="h-3.5 w-3.5" />
                                                    Inactive
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 sm:justify-center">
                                        <button
                                            onClick={() => setDeleteConfirm(user)}
                                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            title="Delete user"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal onClose={() => setShowCreateModal(false)} onCreate={createUser} />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <DeleteConfirmModal
                    user={deleteConfirm}
                    onClose={() => setDeleteConfirm(null)}
                    onConfirm={() => handleDeleteUser(deleteConfirm.id)}
                />
            )}
        </div>
    );
}

/**
 * @intent Modal for creating new users
 * @param {function} onClose - Close handler
 * @param {function} onCreate - Create user handler
 */
function CreateUserModal({ onClose, onCreate }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ORGANISER",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await onCreate(formData);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-800">Create New User</h2>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1.5 rounded-xl"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1.5 rounded-xl"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1.5 rounded-xl"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                                Role
                            </Label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="ORGANISER">Organiser</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Create User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/**
 * @intent Confirmation modal for deleting users
 * @param {object} user - User to delete
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm deletion handler
 */
function DeleteConfirmModal({ user, onClose, onConfirm }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-7 w-7 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Delete User?</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { UserRoleManagement };

