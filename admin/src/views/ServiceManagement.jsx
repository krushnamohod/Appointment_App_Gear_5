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

    const [activeTab, setActiveTab] = useState("basic");

    const handleSave = async () => {
        try {
            const method = currentService.id ? "PUT" : "POST";
            const url = currentService.id ? `${API_URL}/services/${currentService.id}` : `${API_URL}/services`;

            // Prepare data for Prisma (numbers and booleans)
            const payload = {
                ...currentService,
                price: Number(currentService.price || 0),
                capacity: Number(currentService.capacity || 1),
                capacityLimit: Number(currentService.capacityLimit || 50),
                bookingFee: Number(currentService.bookingFee || 0),
                duration: Number(currentService.duration || 30),
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
                    onClick={() => {
                        setIsEditing(true);
                        setActiveTab("basic");
                        setCurrentService({
                            name: "", duration: 30, price: 0, image: "",
                            manageCapacity: false, venue: "",
                            manualConfirmation: false, capacityLimit: 50,
                            paidBooking: false, bookingFee: 0,
                            slotCreation: "00:30", cancellationHours: "01:00",
                            introductionMessage: "", confirmationMessage: "",
                            questions: []
                        });
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {isEditing && (
                <div className="mb-6 border rounded-xl bg-white shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
                    {/* Header */}
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">{currentService.id ? "Edit Service" : "New Service"}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b bg-white">
                        {[
                            { id: "basic", label: "General", icon: <Edit size={16} /> },
                            { id: "options", label: "Options", icon: <Save size={16} /> },
                            { id: "questions", label: "Questions", icon: <Plus size={16} /> },
                            { id: "misc", label: "Misc", icon: <X size={16} /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 
                                ${activeTab === tab.id
                                        ? "border-blue-600 text-blue-600 bg-blue-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Scrollable */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {activeTab === "basic" && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                                    <input
                                        className="border-2 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="e.g. Badminton Court (1 Hour)"
                                        value={currentService.name}
                                        onChange={e => setCurrentService({ ...currentService, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (min)</label>
                                    <input
                                        className="border-2 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="number"
                                        value={currentService.duration}
                                        onChange={e => setCurrentService({ ...currentService, duration: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                    <input
                                        className="border-2 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="number"
                                        value={currentService.price}
                                        onChange={e => setCurrentService({ ...currentService, price: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Category</label>
                                    <select
                                        className="border-2 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={currentService.resourceType || ""}
                                        onChange={e => setCurrentService({ ...currentService, resourceType: e.target.value })}
                                    >
                                        <option value="">None (Expert/Provider based)</option>
                                        <option value="COURT">Court (Sports/Venues)</option>
                                        <option value="ROOM">Room (Consultations/Hotels)</option>
                                        <option value="EQUIPMENT">Equipment (Rentals)</option>
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1">Select 'Court' for cricket pitches or badminton courts.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Group Size</label>
                                    <input
                                        className="border-2 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="number"
                                        value={currentService.capacity}
                                        onChange={e => setCurrentService({ ...currentService, capacity: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-4 mt-2">
                                    <ImageUpload
                                        currentImage={currentService.image}
                                        onUploadSuccess={(url) => setCurrentService({ ...currentService, image: url })}
                                        label="Service Image"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === "options" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <h3 className="font-bold text-gray-800 border-b pb-2">Policy & Confirmation</h3>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">Manual Confirmation</label>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5"
                                                checked={currentService.manualConfirmation}
                                                onChange={e => setCurrentService({ ...currentService, manualConfirmation: e.target.checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">Manage Capacity</label>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5"
                                                checked={currentService.manageCapacity}
                                                onChange={e => setCurrentService({ ...currentService, manageCapacity: e.target.checked })}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <h3 className="font-bold text-gray-800 border-b pb-2">Timing Rules</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Creation (Interval)</label>
                                            <input
                                                type="text"
                                                placeholder="00:30"
                                                className="border p-2 rounded w-full"
                                                value={currentService.slotCreation}
                                                onChange={e => setCurrentService({ ...currentService, slotCreation: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Limit (Hours before)</label>
                                            <input
                                                type="text"
                                                placeholder="01:00"
                                                className="border p-2 rounded w-full"
                                                value={currentService.cancellationHours}
                                                onChange={e => setCurrentService({ ...currentService, cancellationHours: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                        <h3 className="font-bold text-gray-800 border-b pb-2">Payment Settings</h3>
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">Required Pre-payment</label>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5"
                                                checked={currentService.paidBooking}
                                                onChange={e => setCurrentService({ ...currentService, paidBooking: e.target.checked })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-payment Amount (₹)</label>
                                            <input
                                                type="number"
                                                className="border p-2 rounded w-full"
                                                value={currentService.bookingFee}
                                                onChange={e => setCurrentService({ ...currentService, bookingFee: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Venue / Location Details</label>
                                        <textarea
                                            className="border-2 p-2.5 rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Provide exact address or specific court numbers..."
                                            value={currentService.venue || ""}
                                            onChange={e => setCurrentService({ ...currentService, venue: e.target.value })}
                                        />
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "questions" && (
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-500 italic">Collect extra info from users during booking (e.g. Bat requirement, Player names)</p>
                                    <button
                                        onClick={() => {
                                            const qs = currentService.questions || [];
                                            setCurrentService({ ...currentService, questions: [...qs, { id: Date.now(), title: "", type: "text", required: true }] });
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                                    >
                                        + Add Question
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(currentService.questions || []).map((q, i) => (
                                        <div key={q.id || i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <input
                                                        className="border-2 p-2 rounded-lg w-full"
                                                        placeholder="Question Title (e.g. Do you need a cricket kit?)"
                                                        value={q.title}
                                                        onChange={e => {
                                                            const qs = [...currentService.questions];
                                                            qs[i].title = e.target.value;
                                                            setCurrentService({ ...currentService, questions: qs });
                                                        }}
                                                    />
                                                </div>
                                                <select
                                                    className="border-2 p-2 rounded-lg"
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
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4"
                                                        checked={q.required}
                                                        onChange={e => {
                                                            const qs = [...currentService.questions];
                                                            qs[i].required = e.target.checked;
                                                            setCurrentService({ ...currentService, questions: qs });
                                                        }}
                                                    />
                                                    <span className="text-sm">Mandatory field</span>
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const qs = currentService.questions.filter((_, idx) => idx !== i);
                                                    setCurrentService({ ...currentService, questions: qs });
                                                }}
                                                className="text-red-400 hover:text-red-600 p-2"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "misc" && (
                            <div className="space-y-6 max-w-3xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Introduction Message</label>
                                    <textarea
                                        className="border-2 p-2.5 rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Show this message to users before they start booking..."
                                        value={currentService.introductionMessage || ""}
                                        onChange={e => setCurrentService({ ...currentService, introductionMessage: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmation / Success Message</label>
                                    <textarea
                                        className="border-2 p-2.5 rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Show this after a successful booking..."
                                        value={currentService.confirmationMessage || ""}
                                        onChange={e => setCurrentService({ ...currentService, confirmationMessage: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 rounded-lg bg-white border-2 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-8 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            <Save size={18} /> Finish & Save
                        </button>
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
