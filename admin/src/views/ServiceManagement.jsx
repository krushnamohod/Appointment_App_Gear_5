import { useState, useEffect } from "react";
import { Plus, Trash, Edit, X, Save } from "lucide-react";
import { useAdminAuthStore } from "@/store/authStore";

const API_URL = "http://localhost:3000/api";

export function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState({ name: "", duration: 30, price: 0 });
    const { token } = useAdminAuthStore();

    useEffect(() => {
        fetchServices();
    }, []);

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
            await fetch(`${API_URL}/services/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setServices(services.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    const handleSave = async () => {
        try {
            const method = currentService.id ? "PUT" : "POST";
            const url = currentService.id ? `${API_URL}/services/${currentService.id}` : `${API_URL}/services`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(currentService),
            });

            if (res.ok) {
                setIsEditing(false);
                setCurrentService({ name: "", duration: 30, price: 0 });
                fetchServices();
            }
        } catch (error) {
            console.error("Failed to save service", error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Service Management</h1>
                <button
                    onClick={() => { setIsEditing(true); setCurrentService({ name: "", duration: 30, price: 0 }); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {isEditing && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">{currentService.id ? "Edit Service" : "New Service"}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                className="border p-2 rounded w-full"
                                placeholder="Service name"
                                value={currentService.name}
                                onChange={e => setCurrentService({ ...currentService, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                            <input
                                className="border p-2 rounded w-full"
                                type="number"
                                placeholder="30"
                                value={currentService.duration}
                                onChange={e => setCurrentService({ ...currentService, duration: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                className="border p-2 rounded w-full"
                                type="number"
                                placeholder="0"
                                value={currentService.price || 0}
                                onChange={e => setCurrentService({ ...currentService, price: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                            <input
                                className="border p-2 rounded w-full"
                                type="number"
                                placeholder="1"
                                value={currentService.capacity || 1}
                                onChange={e => setCurrentService({ ...currentService, capacity: parseInt(e.target.value) || 1 })}
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
                            <th className="text-left p-4">Duration</th>
                            <th className="text-left p-4">Price</th>
                            <th className="text-left p-4">Capacity</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="border-b last:border-0">
                                <td className="p-4 font-medium">{service.name}</td>
                                <td className="p-4">{service.duration} min</td>
                                <td className="p-4">₹{service.price || 0}</td>
                                <td className="p-4">{service.capacity}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => { setCurrentService(service); setIsEditing(true); }}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
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
