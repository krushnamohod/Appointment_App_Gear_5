import { useState, useEffect } from "react";
import { Plus, Trash, Edit, X, Save } from "lucide-react";
import { useAdminAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:3000/api";

export function ProviderManagement() {
    const [providers, setProviders] = useState([]);
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProvider, setCurrentProvider] = useState({ name: "", serviceId: "", avatar: "" });
    const { token } = useAdminAuthStore();

    useEffect(() => {
        fetchProviders();
        fetchServices();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await fetch(`${API_URL}/providers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setProviders(data);
        } catch (error) {
            console.error("Failed to fetch providers", error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/services`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/providers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setProviders(providers.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete provider", error);
        }
    };

    const handleSave = async () => {
        try {
            if (!currentProvider.serviceId) {
                alert("Please select a service");
                return;
            }
            const method = currentProvider.id ? "PUT" : "POST";
            const url = currentProvider.id ? `${API_URL}/providers/${currentProvider.id}` : `${API_URL}/providers`;

            const payload = {
                ...currentProvider,
                workingHours: currentProvider.workingHours || { start: "09:00", end: "17:00" } // Default working hours
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentProvider({ name: "", serviceId: "", avatar: "" });
                fetchProviders();
            }
        } catch (error) {
            console.error("Failed to save provider", error);
        }
    };

    const getServiceName = (id) => {
        const service = services.find(s => s.id === id);
        return service ? service.name : "Unknown";
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Provider Management</h1>
                <button
                    onClick={() => { setIsEditing(true); setCurrentProvider({ name: "", serviceId: "", avatar: "" }); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Provider
                </button>
            </div>

            {isEditing && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">{currentProvider.id ? "Edit Provider" : "New Provider"}</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            className="border p-2 rounded"
                            placeholder="Name"
                            value={currentProvider.name}
                            onChange={e => setCurrentProvider({ ...currentProvider, name: e.target.value })}
                        />
                        <select
                            className="border p-2 rounded"
                            value={currentProvider.serviceId}
                            onChange={e => setCurrentProvider({ ...currentProvider, serviceId: e.target.value })}
                        >
                            <option value="">Select Service</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                            <input
                                className="border p-2 rounded w-full"
                                placeholder="https://images.unsplash.com/photo-1537368910025-700350fe46c7..."
                                value={currentProvider.avatar || ""}
                                onChange={e => setCurrentProvider({ ...currentProvider, avatar: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"><Save size={16} /> Save</button>
                        <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"><X size={16} /> Cancel</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow border">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Service</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {providers.map((provider) => (
                            <tr key={provider.id} className="border-b last:border-0">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border">
                                            {provider.avatar ? (
                                                <img src={provider.avatar} alt={provider.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Avatar</div>
                                            )}
                                        </div>
                                        {provider.name}
                                    </div>
                                </td>
                                <td className="p-4">{getServiceName(provider.serviceId)}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => { setCurrentProvider(provider); setIsEditing(true); }}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(provider.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
