import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BarChart3, Settings } from "lucide-react";

/**
 * @intent Top navigation bar with logo and action buttons
 * @param {object} props - Component props
 * @param {function} props.onReporting - Reporting button click handler
 * @param {function} props.onSettings - Settings button click handler
 * @param {function} props.onBack - Back button click handler (optional)
 * @param {boolean} props.showBack - Show back button
 */
function TopNavBar({ className, onReporting, onSettings }) {
    return (
        <header
            className={cn(
                "flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm",
                className
            )}
            role="banner"
        >
            {/* Logo + App Name */}
            <div className="flex items-center gap-3">
                <img
                    src="/logo.jpg"
                    alt="Syncra Logo"
                    className="h-10 w-10 rounded-lg object-contain bg-white"
                />
                <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Syncra
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-wide">
                        Odoo's appointment booking module
                    </span>
                </div>
            </div>

            {/* Right Actions */}
            <nav className="flex items-center gap-2" aria-label="Main navigation">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={onReporting}
                >
                    <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Reporting
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={onSettings}
                >
                    <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                    Settings
                </Button>
            </nav>
        </header>
    );
}

export { TopNavBar };

