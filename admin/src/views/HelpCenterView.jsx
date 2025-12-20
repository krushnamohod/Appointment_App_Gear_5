/**
 * @intent Help center view
 */
function HelpCenterView() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Help Centre</h1>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">How to use the Appointment App?</h2>
                <p className="text-gray-600 mb-4">
                    Learn how to manage appointments, resources, and users in our comprehensive documentation.
                </p>
                <button className="text-primary hover:underline">Read Documentation →</button>

                <div className="mt-8 pt-6 border-t">
                    <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
                    <p className="text-gray-600">
                        Need help? Reach out to our support team at <a href="mailto:support@example.com" className="text-primary">support@example.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export { HelpCenterView };

