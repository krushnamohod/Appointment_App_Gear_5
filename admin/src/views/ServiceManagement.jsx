import { useState, useEffect } from "react";
import { Plus, Trash, Edit, X, Save } from "lucide-react";
import { useAdminAuthStore } from "@/store/authStore";
import { ImageUpload } from "@/components/ImageUpload";

const API_URL = "http://localhost:3000/api";

export function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState({ name: "", duration: 30, price: 0, image: "", manageCapacity: false, venue: "", confirmationMessage: "", questions: [] });
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
                setCurrentService({ name: "", duration: 30, price: 0, image: "", manageCapacity: false, venue: "", confirmationMessage: "", questions: [] });
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
                    onClick={() => { setIsEditing(true); setCurrentService({ name: "", duration: 30, price: 0, image: "", manageCapacity: false, venue: "", confirmationMessage: "", questions: [] }); }}
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
                        <div className="col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                <input
                                    className="border p-2 rounded w-full"
                                    placeholder="Venue/Location"
                                    value={currentService.venue || ""}
                                    onChange={e => setCurrentService({ ...currentService, venue: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Message</label>
                                <input
                                    className="border p-2 rounded w-full"
                                    placeholder="Thank you for booking!"
                                    value={currentService.confirmationMessage || ""}
                                    onChange={e => setCurrentService({ ...currentService, confirmationMessage: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 col-span-2">
                            <input
                                type="checkbox"
                                id="manageCapacity"
                                checked={currentService.manageCapacity}
                                onChange={e => setCurrentService({ ...currentService, manageCapacity: e.target.checked })}
                            />
                            <label htmlFor="manageCapacity" className="text-sm font-medium text-gray-700">Manage Capacity (Enable multiple people per booking)</label>
                        </div>

                        <div className="col-span-2 md:col-span-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Custom Questions</label>
                                <button
                                    onClick={() => {
                                        const qs = currentService.questions || [];
                                        setCurrentService({ ...currentService, questions: [...qs, { id: Date.now(), title: "", type: "text", required: true }] });
                                    }}
                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200"
                                >
                                    + Add Question
                                </button>
                            </div>
                            <div className="space-y-3">
                                {(currentService.questions || []).map((q, i) => (
                                    <div key={q.id || i} className="flex gap-2 items-start bg-white p-3 rounded border">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                className="border p-1.5 rounded w-full text-sm"
                                                placeholder="Question title"
                                                value={q.title}
                                                onChange={e => {
                                                    const qs = [...currentService.questions];
                                                    qs[i].title = e.target.value;
                                                    setCurrentService({ ...currentService, questions: qs });
                                                }}
                                            />
                                            <div className="flex gap-4">
                                                <select
                                                    className="border p-1 rounded text-xs"
                                                    value={q.type}
                                                    onChange={e => {
                                                        const qs = [...currentService.questions];
                                                        qs[i].type = e.target.value;
                                                        setCurrentService({ ...currentService, questions: qs });
                                                    }}
                                                >
                                                    <option value="text">Short Text</option>
                                                    <option value="textarea">Long Text</option>
                                                    <option value="number">Number</option>
                                                </select>
                                                <label className="flex items-center gap-1 text-xs">
                                                    <input
                                                        type="checkbox"
                                                        checked={q.required}
                                                        onChange={e => {
                                                            const qs = [...currentService.questions];
                                                            qs[i].required = e.target.checked;
                                                            setCurrentService({ ...currentService, questions: qs });
                                                        }}
                                                    />
                                                    Required
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const qs = currentService.questions.filter((_, idx) => idx !== i);
                                                setCurrentService({ ...currentService, questions: qs });
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-4 border-t pt-4">
                            <ImageUpload
                                currentImage={currentService.image}
                                onUploadSuccess={(url) => setCurrentService({ ...currentService, image: url })}
                                label="Service Image"
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
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden border">
                                            {service.image ? (
                                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                            )}
                                        </div>
                                        {service.name}
                                    </div>
                                </td>
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
