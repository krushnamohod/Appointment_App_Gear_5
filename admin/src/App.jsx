import { AnimatedSidebar } from "@/components/AnimatedSidebar";
import { TopNavBar } from "@/components/TopNavBar";
import "@/index.css";
import { useAdminAuthStore } from "@/store/authStore";
import { AppointmentsModule } from "@/views/AppointmentsModule";
import { DiscountsView } from "@/views/DiscountsView";
import { HelpCenterView } from "@/views/HelpCenterView";
import LoginPage from "@/views/LoginPage";
import { ProviderManagement } from "@/views/ProviderManagement";
import { ReportingView } from "@/views/ReportingView";
import { ResourcesModule } from "@/views/ResourcesModule";
import { ServiceManagement } from "@/views/ServiceManagement";
import { UserSettingsView } from "@/views/SettingsViews";
import { UserRoleManagement } from "@/views/UserRoleManagement";
import { BarChart3, Box, Calendar, HelpCircle, LayoutGrid, LogOut, Percent, Settings, User, Users } from "lucide-react";

/**
 * @intent Main app component with auth routing and sidebar layout
 */
function App() {
    const { isAuthenticated, logout, role } = useAdminAuthStore();

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    const handleSignOut = () => {
        logout();
    };

    // Build sidebar items - Role Management only for ADMIN
    const sidebarItems = [
        {
            title: "Appointment View",
            Icon: Calendar,
            Content: AppointmentsModule,
        },
        {
            title: "Reporting",
            Icon: BarChart3,
            Content: ReportingView,
        },
        {
            title: "Resources",
            Icon: LayoutGrid,
            Content: ResourcesModule,
        },
        // Only show Role Management for ADMIN users
        ...(role === "ADMIN" ? [{
            title: "Role Management",
            Icon: Users,
            Content: UserRoleManagement,
        }] : []),
        // Discounts - Admin only
        ...(role === "ADMIN" ? [{
            title: "Discounts",
            Icon: Percent,
            Content: DiscountsView,
        }] : []),
        {
            title: "Settings",
            Icon: Settings,
            subItems: [
                {
                    title: "User",
                    Icon: User,
                    Content: UserSettingsView,
                },
                {
                    title: "Services",
                    Icon: Box,
                    Content: ServiceManagement,
                },
                {
                    title: "Providers",
                    Icon: User,
                    Content: ProviderManagement,
                },
            ],
        },
        {
            title: "Help Centre",
            Icon: HelpCircle,
            Content: HelpCenterView,
            className: "mt-auto",
        },
        {
            title: "Sign Out",
            Icon: LogOut,
            Content: () => <div className="p-8 text-center text-red-500">Signing Out...</div>,
            className: "text-red-500 hover:bg-red-50 hover:text-red-600 font-medium mt-auto",
            iconClassName: "text-red-500",
            onClick: handleSignOut,
        },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Universal Top Navigation */}
            <TopNavBar />

            {/* Main Content Area (Sidebar + View) */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatedSidebar items={sidebarItems} />
            </div>
        </div>
    );
}

export default App;
