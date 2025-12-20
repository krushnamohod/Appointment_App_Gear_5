import { HeaderControls } from "@/components/HeaderControls";
import { ResourcesList } from "@/components/ResourcesList";
import { ResourceFormView } from "@/views/ResourceFormView";
import { useResourcesStore } from "@/store/resourcesStore";
import { useEffect, useState } from "react";
import { Box, Layers, Users } from "lucide-react";

/**
 * @intent Module for managing physical resources (List + Form views)
 */
function ResourcesModule() {
    const [view, setView] = useState("list");
    const [selectedResource, setSelectedResource] = useState(null);
    const { resources, fetchResources } = useResourcesStore();

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleNew = () => {
        setSelectedResource(null);
        setView("form");
    };

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setView("form");
    };

    const handleBack = () => {
        setView("list");
        setSelectedResource(null);
    };

    // Calculate Stats
    const totalResources = resources.length;
    const totalCapacity = resources.reduce((acc, res) => acc + (res.capacity || 0), 0);
    const typesCount = new Set(resources.map(res => res.type)).size;

    if (view === "form") {
        return (
            <div className="h-full bg-slate-50 overflow-auto">
                <ResourceFormView
                    resource={selectedResource}
                    onBack={handleBack}
                />
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 overflow-auto">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2 text-blue-600">
                            <Box className="h-5 w-5" />
                            <dt className="truncate text-sm font-medium text-gray-500">Total Assets</dt>
                        </div>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalResources}</dd>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2 text-indigo-600">
                            <Users className="h-5 w-5" />
                            <dt className="truncate text-sm font-medium text-gray-500">Global Capacity</dt>
                        </div>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalCapacity}</dd>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-900/5 sm:p-6 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-2 text-emerald-600">
                            <Layers className="h-5 w-5" />
                            <dt className="truncate text-sm font-medium text-gray-500">Asset Categories</dt>
                        </div>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{typesCount}</dd>
                    </div>
                </div>

                {/* Main List Area */}
                <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
                    <div className="border-b border-gray-100 bg-white px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Resource Inventory</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-500">Manage and track your physical booking assets across all categories.</p>
                            </div>
                            <button
                                onClick={handleNew}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow-sm"
                            >
                                <Box className="h-4 w-4" />
                                Add Resource
                            </button>
                        </div>
                    </div>
                    <ResourcesList
                        onEditResource={handleEdit}
                        className="p-0 border-t border-gray-100"
                    />
                </div>
            </main>
        </div>
    );
}

export { ResourcesModule };
