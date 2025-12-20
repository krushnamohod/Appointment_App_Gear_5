/**
 * @intent User settings view
 */
function UserSettingsView() {
    const users = [
        { id: 1, name: "John Doe", role: "Admin" },
        { id: 2, name: "Jane Smith", role: "Manager" },
        { id: 3, name: "Bob Wilson", role: "Staff" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">User Settings</h1>
            <div className="rounded-lg border bg-white shadow-sm">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * @intent Resources settings view
 */
function ResourcesSettingsView() {
    const resources = [
        { id: 1, name: "Room A1", type: "Conference Room" },
        { id: 2, name: "Room B2", type: "Office" },
        { id: 3, name: "Projector X", type: "Equipment" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Resources Settings</h1>
            <div className="rounded-lg border bg-white shadow-sm">
                {resources.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
                        <div>
                            <p className="font-medium">{res.name}</p>
                            <p className="text-sm text-gray-500">{res.type}</p>
                        </div>
                        <button className="text-sm text-primary hover:underline">Manage</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { ResourcesSettingsView, UserSettingsView };

