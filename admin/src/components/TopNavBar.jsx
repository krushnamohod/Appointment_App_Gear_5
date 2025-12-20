import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowLeft, BarChart3, Calendar, Settings } from "lucide-react";

/**
 * @intent Top navigation bar with logo and action buttons
 * @param {object} props - Component props
 * @param {function} props.onReporting - Reporting button click handler
 * @param {function} props.onSettings - Settings button click handler
 * @param {function} props.onBack - Back button click handler (optional)
 * @param {boolean} props.showBack - Show back button
 */
function TopNavBar({ className, onReporting, onSettings, onBack, showBack = false }) {
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
                {showBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                    <Calendar className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">Appointment App</span>
                    <span className="text-xs text-gray-500">The Perfect Booking System</span>
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

