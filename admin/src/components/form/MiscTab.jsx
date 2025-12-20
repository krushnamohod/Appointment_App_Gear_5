import { Label } from "@/components/ui/Label";

/**
 * @intent Misc tab for introduction and confirmation messages
 * @param {object} props.messages - Messages data from parent
 * @param {function} props.onChange - Change handler
 */
function MiscTab({ messages = {}, onChange }) {
    const data = {
        introductionMessage: messages.introductionMessage ?? "",
        confirmationMessage: messages.confirmationMessage ?? ""
    };

    const handleChange = (key, value) => {
        onChange?.({ ...data, [key]: value });
    };

    return (
        <div className="space-y-8">
            {/* Introduction Page Message */}
            <div>
                <Label className="block text-lg font-medium text-ink mb-2">
                    Introduction page message
                </Label>
                <div className="border-t border-ink/20 pt-4">
                    <textarea
                        value={data.introductionMessage}
                        onChange={(e) => handleChange("introductionMessage", e.target.value)}
                        placeholder="Enter the message to display on the booking introduction page..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-terracotta/30 bg-white text-ink 
                                   placeholder:text-ink-light/50 focus:outline-none focus:border-terracotta 
                                   focus:ring-2 focus:ring-terracotta/10 resize-none font-sans text-base"
                    />
                </div>
            </div>

            {/* Confirmation Page Message */}
            <div>
                <Label className="block text-lg font-medium text-ink mb-2">
                    Confirmation page message
                </Label>
                <div className="border-t border-ink/20 pt-4">
                    <textarea
                        value={data.confirmationMessage}
                        onChange={(e) => handleChange("confirmationMessage", e.target.value)}
                        placeholder="Enter the message to display after booking confirmation..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-terracotta/30 bg-white text-ink 
                                   placeholder:text-ink-light/50 focus:outline-none focus:border-terracotta 
                                   focus:ring-2 focus:ring-terracotta/10 resize-none font-sans text-base"
                    />
                </div>
            </div>
        </div>
    );
}

export { MiscTab };

