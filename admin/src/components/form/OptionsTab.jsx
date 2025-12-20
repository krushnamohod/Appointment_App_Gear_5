import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

/**
 * @intent Options tab for appointment configuration - manual confirmation, paid booking, slots, cancellation
 * @param {object} props.options - Options data from parent
 * @param {function} props.onChange - Change handler
 */
function OptionsTab({ options = {}, onChange }) {
    const data = {
        manualConfirmation: options.manualConfirmation ?? false,
        capacityLimit: options.capacityLimit ?? 50,
        paidBooking: options.paidBooking ?? false,
        bookingFee: options.bookingFee ?? 200,
        slotCreation: options.slotCreation ?? "00:30",
        cancellationHours: options.cancellationHours ?? "01:00"
    };

    const handleChange = (key, value) => {
        onChange?.({ ...data, [key]: value });
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
                {/* Manual Confirmation */}
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        id="manualConfirmation"
                        checked={data.manualConfirmation}
                        onChange={(e) => handleChange("manualConfirmation", e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-terracotta focus:ring-terracotta"
                    />
                    <div className="flex-1">
                        <Label htmlFor="manualConfirmation" className="font-medium text-ink cursor-pointer">
                            Manual confirmation
                        </Label>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-ink-light">Upto</span>
                            <Input
                                type="number"
                                min="1"
                                max="100"
                                value={data.capacityLimit}
                                onChange={(e) => handleChange("capacityLimit", parseInt(e.target.value) || 1)}
                                className="w-20 input-field text-center"
                                disabled={!data.manualConfirmation}
                            />
                            <span className="text-sm text-ink-light">% of capacity</span>
                        </div>
                    </div>
                </div>

                {/* Paid Booking */}
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        id="paidBooking"
                        checked={data.paidBooking}
                        onChange={(e) => handleChange("paidBooking", e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-terracotta focus:ring-terracotta"
                    />
                    <div className="flex-1">
                        <Label htmlFor="paidBooking" className="font-medium text-ink cursor-pointer">
                            Paid Booking
                        </Label>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-ink-light">Booking Fees</span>
                            <span className="text-ink-light">(Rs</span>
                            <Input
                                type="number"
                                min="0"
                                value={data.bookingFee}
                                onChange={(e) => handleChange("bookingFee", parseInt(e.target.value) || 0)}
                                className="w-24 input-field text-center"
                                disabled={!data.paidBooking}
                            />
                            <span className="text-sm text-ink-light">Per booking)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* Slot Creation */}
                <div>
                    <Label className="font-medium text-ink">Slot Creation</Label>
                    <div className="mt-2 flex items-center gap-2">
                        <Input
                            type="text"
                            value={data.slotCreation}
                            onChange={(e) => handleChange("slotCreation", e.target.value)}
                            placeholder="00:30"
                            className="w-24 input-field text-center font-mono"
                        />
                        <span className="text-sm text-ink-light">hours</span>
                    </div>
                </div>

                {/* Cancellation */}
                <div>
                    <Label className="font-medium text-ink">Cancellation</Label>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-ink-light">up to</span>
                        <Input
                            type="text"
                            value={data.cancellationHours}
                            onChange={(e) => handleChange("cancellationHours", e.target.value)}
                            placeholder="01:00"
                            className="w-24 input-field text-center font-mono"
                        />
                        <span className="text-sm text-ink-light">hour(s) before the booking</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { OptionsTab };

