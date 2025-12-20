import { AnimatedSidebar } from "@/components/AnimatedSidebar";
import { ReportingModal, SettingsModal } from "@/components/SettingsModal";
import { TopNavBar } from "@/components/TopNavBar";
import "@/index.css";
import { AppointmentsModule } from "@/views/AppointmentsModule";
import { HelpCenterView } from "@/views/HelpCenterView";
import { ResourcesSettingsView, UserSettingsView } from "@/views/SettingsViews";
import { Box, Calendar, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

/**
 * @intent Main app component composing the sidebar layout with universal Top Navigation
 */
function App() {
    const [showSettings, setShowSettings] = useState(false);
    const [showReporting, setShowReporting] = useState(false);

    const sidebarItems = [
        {
            title: "Appointment View",
            Icon: Calendar,
            Content: AppointmentsModule,
        },
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
                    title: "Resources",
                    Icon: Box,
                    Content: ResourcesSettingsView,
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
        },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Universal Top Navigation */}
            <TopNavBar
                onReporting={() => setShowReporting(true)}
                onSettings={() => setShowSettings(true)}
            />

            {/* Main Content Area (Sidebar + View) */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatedSidebar items={sidebarItems} />
            </div>

            {/* Global Modals */}
            <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
            <ReportingModal open={showReporting} onOpenChange={setShowReporting} />
        </div>
    );
}

export default App;
