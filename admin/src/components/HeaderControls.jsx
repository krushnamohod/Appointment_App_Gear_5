import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import useAppointmentsStore from "@/store/appointmentsStore";
import { Plus, Search } from "lucide-react";

/**
 * @intent Header controls with New button and search input
 */
function HeaderControls({ className, onNewClick }) {
    const searchQuery = useAppointmentsStore((state) => state.searchQuery);
    const setSearchQuery = useAppointmentsStore((state) => state.setSearchQuery);

    return (
        <div
            className={cn("flex items-center justify-between gap-4 px-6 py-4", className)}
            role="search"
        >
            {/* New Button */}
            <Button
                onClick={onNewClick}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                aria-label="Create new appointment type"
            >
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                New
            </Button>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
                <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    aria-hidden="true"
                />
                <Input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search appointments by name"
                />
            </div>
        </div>
    );
}

export { HeaderControls };

