import { ResourceRow } from "./ResourceRow";
import { useResourcesStore } from "@/store/resourcesStore";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

/**
 * @intent Premium list view for Resources
 */
function ResourcesList({ onEditResource, className }) {
    const { resources, loading, deleteResource } = useResourcesStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = resources.filter(res =>
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Fetching resources...</p>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* List Header Labels */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Resource / Type</div>
                <div className="col-span-2">Capacity</div>
                <div className="col-span-3">Linked Assets</div>
                <div className="col-span-3 text-right pr-4">Actions</div>
            </div>

            {/* List Content */}
            <div className="divide-y divide-gray-100">
                {filteredResources.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p>No resources found matching your search.</p>
                    </div>
                ) : (
                    filteredResources.map((res) => (
                        <ResourceRow
                            key={res.id}
                            resource={res}
                            onEdit={onEditResource}
                            onDelete={async (id) => {
                                if (confirm("Delete this resource?")) {
                                    await deleteResource(id);
                                }
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export { ResourcesList };
