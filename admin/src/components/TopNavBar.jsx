import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/store/authStore";
import { User } from "lucide-react";

/**
 * @intent Top navigation bar with logo and user profile
 */
function TopNavBar({ className }) {
    const { user } = useAdminAuthStore();

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

            {/* Right - User Profile */}
            <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-terracotta" />
                <span className="text-sm font-medium text-ink">
                    {user?.name || "User"}
                </span>
            </div>
        </header>
    );
}

export { TopNavBar };

