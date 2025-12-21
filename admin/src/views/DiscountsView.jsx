import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAdminAuthStore } from "@/store/authStore";
import { Calendar, Edit2, Loader2, Percent, Plus, Send, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @intent Admin discount management view
 */
export function DiscountsView() {
    const { token } = useAdminAuthStore();
    const [discounts, setDiscounts] = useState([]);
    const [services, setServices] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sending, setSending] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        percentage: 10,
        maxUses: "",
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: "",
        isActive: true,
        serviceId: "",
        resourceId: ""
    });

    const fetchDiscounts = async () => {
        try {
            const res = await fetch(`${API_URL}/discounts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setDiscounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch discounts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServicesAndResources = async () => {
        try {
            const [servicesRes, resourcesRes] = await Promise.all([
                fetch(`${API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/resources`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const servicesData = await servicesRes.json();
            const resourcesData = await resourcesRes.json();
            setServices(Array.isArray(servicesData) ? servicesData : []);
            setResources(Array.isArray(resourcesData) ? resourcesData : []);
        } catch (error) {
            console.error("Failed to fetch services/resources:", error);
        }
    };

    useEffect(() => {
        fetchDiscounts();
        fetchServicesAndResources();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `${API_URL}/discounts/${editingId}`
                : `${API_URL}/discounts`;

            const res = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            toast.success(editingId ? "Discount updated!" : "Discount created!");
            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchDiscounts();
        } catch (error) {
            toast.error(error.message || "Failed to save discount");
        }
    };

    const handleEdit = (discount) => {
        setFormData({
            code: discount.code,
            description: discount.description || "",
            percentage: discount.percentage,
            maxUses: discount.maxUses || "",
            validFrom: discount.validFrom?.split("T")[0] || "",
            validUntil: discount.validUntil?.split("T")[0] || "",
            isActive: discount.isActive,
            serviceId: discount.serviceId || "",
            resourceId: discount.resourceId || ""
        });
        setEditingId(discount.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this discount?")) return;

        try {
            await fetch(`${API_URL}/discounts/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Discount deleted");
            fetchDiscounts();
        } catch (error) {
            toast.error("Failed to delete discount");
        }
    };

    const handleSendNotification = async (id) => {
        setSending(id);
        try {
            const res = await fetch(`${API_URL}/discounts/${id}/notify`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            toast.success(data.message || "Notifications sent!");
        } catch (error) {
            toast.error("Failed to send notifications");
        } finally {
            setSending(null);
        }
    };

    const resetForm = () => {
        setFormData({
            code: "",
            description: "",
            percentage: 10,
            maxUses: "",
            validFrom: new Date().toISOString().split("T")[0],
            validUntil: "",
            isActive: true,
            serviceId: "",
            resourceId: ""
        });
    };

    const isExpired = (date) => new Date(date) < new Date();
    const isActive = (discount) => discount.isActive && !isExpired(discount.validUntil);

    return (
        <div className="p-8 bg-paper min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Percent className="h-6 w-6 text-terracotta" />
                    <h1 className="font-heading text-2xl font-bold text-ink">Discounts</h1>
                </div>
                <Button onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }} className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    New Discount
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-heading text-xl font-bold">
                                {editingId ? "Edit Discount" : "New Discount"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-ink/50 hover:text-ink">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Code *</Label>
                                    <Input
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="SUMMER20"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Percentage *</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.percentage}
                                        onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Summer special discount"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Valid From</Label>
                                    <Input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Valid Until *</Label>
                                    <Input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Max Uses (leave blank for unlimited)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.maxUses}
                                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                    placeholder="100"
                                />
                            </div>

                            <div>
                                <Label>Applies To</Label>
                                <select
                                    className="w-full px-3 py-2 border border-ink/20 rounded-md bg-white text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                                    value={formData.serviceId ? `service:${formData.serviceId}` : formData.resourceId ? `resource:${formData.resourceId}` : ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.startsWith("service:")) {
                                            setFormData({ ...formData, serviceId: val.replace("service:", ""), resourceId: "" });
                                        } else if (val.startsWith("resource:")) {
                                            setFormData({ ...formData, resourceId: val.replace("resource:", ""), serviceId: "" });
                                        } else {
                                            setFormData({ ...formData, serviceId: "", resourceId: "" });
                                        }
                                    }}
                                >
                                    <option value="">All Services & Resources</option>
                                    {services.length > 0 && (
                                        <optgroup label="Services">
                                            {services.map((s) => (
                                                <option key={s.id} value={`service:${s.id}`}>{s.name}</option>
                                            ))}
                                        </optgroup>
                                    )}
                                    {resources.length > 0 && (
                                        <optgroup label="Resources">
                                            {resources.map((r) => (
                                                <option key={r.id} value={`resource:${r.id}`}>{r.name}</option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <p className="text-xs text-ink/50 mt-1">Leave empty to apply to all</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="btn-primary flex-1">
                                    {editingId ? "Update" : "Create"}
                                </Button>
                                <Button type="button" onClick={() => setShowForm(false)} variant="outline">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Discounts List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-terracotta" />
                </div>
            ) : discounts.length === 0 ? (
                <div className="text-center py-12 text-ink/50">
                    <Percent className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No discounts yet. Create one to get started!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {discounts.map((discount) => (
                        <div
                            key={discount.id}
                            className={`card-paper p-4 flex items-center justify-between ${!isActive(discount) ? "opacity-60" : ""
                                }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-lg font-bold text-terracotta">
                                        {discount.code}
                                    </span>
                                    <span className="bg-terracotta/10 text-terracotta px-2 py-0.5 rounded text-sm font-bold">
                                        {discount.percentage}% OFF
                                    </span>
                                    {!discount.isActive && (
                                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                                            Inactive
                                        </span>
                                    )}
                                    {isExpired(discount.validUntil) && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                            Expired
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-ink/60">
                                    {discount.description || "No description"}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-ink/50">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Until {new Date(discount.validUntil).toLocaleDateString()}
                                    </span>
                                    <span>
                                        Used: {discount.usedCount}/{discount.maxUses || "∞"}
                                    </span>
                                    {(discount.service || discount.resource) && (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                            For: {discount.service?.name || discount.resource?.name}
                                        </span>
                                    )}
                                    {!discount.service && !discount.resource && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            All
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSendNotification(discount.id)}
                                    disabled={sending === discount.id || !isActive(discount)}
                                    title="Send email to all users"
                                >
                                    {sending === discount.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(discount)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(discount.id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
