import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Box, Edit, Trash2, Users } from "lucide-react";

/**
 * @intent Individual resource row for the Resource Module
 */
function ResourceRow({ resource, onEdit, onDelete, className }) {
    const { id, name, type, capacity, linkedResources } = resource;

    return (
        <div
            className={cn(
                "group grid grid-cols-12 gap-4 items-center px-6 py-4 transition-all hover:bg-slate-50",
                className
            )}
            role="article"
            aria-label={`Resource: ${name}`}
        >
            {/* Col 1: Name & Type */}
            <div className="col-span-4 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-medium text-gray-900">{name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                        {type || 'COURT'}
                    </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    ID: {id.slice(0, 8)}...
                </div>
            </div>

            {/* Col 2: Capacity */}
            <div className="col-span-2 flex items-center text-sm text-gray-600">
                <Users className="mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <span>{capacity} Users</span>
            </div>

            {/* Col 3: Links */}
            <div className="col-span-3">
                <div className="flex flex-wrap gap-1">
                    {linkedResources && linkedResources.length > 0 ? (
                        linkedResources.map((lr) => (
                            <span key={lr.id} className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px]">
                                {lr.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400 italic">No links</span>
                    )}
                </div>
            </div>

            {/* Col 4: Actions */}
            <div className="col-span-3 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(resource)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600"
                    title="Edit Resource"
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                    title="Delete Resource"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export { ResourceRow };
