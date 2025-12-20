import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { BarChart3, Settings } from "lucide-react";

/**
 * @intent Settings modal/panel
 */
function SettingsModal({ open, onOpenChange }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Settings
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium">General Settings</h3>
                        <p className="mt-1 text-sm text-gray-500">Configure application preferences.</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">Manage notification preferences.</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="font-medium">Integrations</h3>
                        <p className="mt-1 text-sm text-gray-500">Connect third-party services.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * @intent Reporting modal/panel
 */
function ReportingModal({ open, onOpenChange }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Reporting Dashboard
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                        <p className="text-sm text-gray-600">Total Appointments</p>
                        <p className="text-3xl font-bold text-blue-600">156</p>
                    </div>
                    <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-4">
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-3xl font-bold text-green-600">142</p>
                    </div>
                    <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-4">
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">8</p>
                    </div>
                    <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                        <p className="text-sm text-gray-600">Cancelled</p>
                        <p className="text-3xl font-bold text-purple-600">6</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { ReportingModal, SettingsModal };

