import { ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Confirmation step showing booking details with calendar links and cancel option
 */
const ConfirmationStep = () => {
    const navigate = useNavigate();
    const { booking, resetBooking, setStep } = useBookingStore();

    // Check if manual confirmation is required (mock - would come from backend)
    const requiresManualConfirmation = false;

    // Format date for display
    const formatDate = () => {
        if (!booking.date) return 'N/A';
        const date = new Date(booking.date);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Generate Google Calendar link
    const getGoogleCalendarLink = () => {
        if (!booking.date || !booking.time) return '#';
        const startDate = new Date(`${booking.date}T${booking.time.replace(' AM', ':00').replace(' PM', ':00')}`);
        const endDate = new Date(startDate.getTime() + (booking.service?.duration || 30) * 60000);

        const formatForGoogle = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.service?.name || 'Appointment')}&dates=${formatForGoogle(startDate)}/${formatForGoogle(endDate)}&details=${encodeURIComponent('Booked via BookNow')}`;
    };

    // Generate Outlook Calendar link
    const getOutlookCalendarLink = () => {
        if (!booking.date || !booking.time) return '#';
        const startDate = new Date(`${booking.date}T${booking.time.replace(' AM', ':00').replace(' PM', ':00')}`);
        const endDate = new Date(startDate.getTime() + (booking.service?.duration || 30) * 60000);

        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(booking.service?.name || 'Appointment')}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
    };

    const handleCancel = () => {
        // Redirect to date picker (step 3)
        setStep(3);
    };

    const handleDone = () => {
        resetBooking();
        navigate('/profile');
    };

    return (
        <div className="space-y-6">
            {/* Reserved Banner - Only if manual confirmation required */}
            {requiresManualConfirmation && (
                <div className="border-2 border-red-400 rounded-lg p-4 bg-red-50">
                    <h3 className="text-red-600 font-semibold">Appointment Reserved</h3>
                    <p className="text-red-500 text-sm">
                        You will get a mail when organiser confirms your booking
                    </p>
                </div>
            )}

            {/* Main Confirmation Card */}
            <div className="border-2 border-red-400 rounded-lg overflow-hidden bg-white">
                {/* Confirmed Badge */}
                <div className="p-6 border-b border-gray-200">
                    <div className="inline-block px-4 py-2 bg-green-100 border-2 border-green-500 rounded-lg">
                        <span className="text-green-700 font-semibold">
                            ✓ Appointment confirmed
                        </span>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="p-6 space-y-6">
                    {/* Time */}
                    <div className="flex items-start gap-4">
                        <span className="text-red-500 font-medium w-24">Time</span>
                        <div>
                            <p className="text-gray-800 font-semibold mb-2">
                                {formatDate()}, {booking.time || 'N/A'}
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href={getGoogleCalendarLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <ExternalLink size={14} />
                                    Google calendar
                                </a>
                                <a
                                    href={getOutlookCalendarLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    <ExternalLink size={14} />
                                    Outlook calendar
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-4">
                        <span className="text-red-500 font-medium w-24">Duration</span>
                        <p className="text-gray-800 font-semibold">
                            {booking.service?.duration || 30} min
                        </p>
                    </div>

                    {/* Number of People - Only if manage capacity is enabled */}
                    {booking.service?.manageCapacity && (
                        <div className="flex items-center gap-4">
                            <span className="text-red-500 font-medium w-24">No of people</span>
                            <p className="text-gray-800 font-semibold">
                                {booking.numberOfPeople || 1}
                            </p>
                        </div>
                    )}

                    {/* Venue */}
                    <div className="flex items-start gap-4">
                        <span className="text-red-500 font-medium w-24">Venue</span>
                        <div className="text-gray-800">
                            <p className="font-semibold">Doctor's Office</p>
                            <p>64 Doctor Street</p>
                            <p>Springfield 380005</p>
                            <p>Ahmedabad</p>
                        </div>
                    </div>
                </div>

                {/* Thank You Message & Cancel */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Thank you message - only when confirmed */}
                        {!requiresManualConfirmation && (
                            <div className="border border-gray-300 rounded-lg p-4 text-sm text-gray-600 italic">
                                Thank you for your trust we look forward to meeting you
                            </div>
                        )}

                        {/* Cancel Button */}
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <X size={18} />
                            cancel your appointment
                        </button>
                    </div>
                </div>
            </div>

            {/* Done Button */}
            <div className="text-center">
                <button
                    onClick={handleDone}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                    View My Appointments
                </button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
