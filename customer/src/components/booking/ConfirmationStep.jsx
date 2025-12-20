import { Calendar, CheckCircle, Clock, ExternalLink, MapPin, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Paper Planner styled confirmation showing appointment details
 */
const ConfirmationStep = () => {
    const navigate = useNavigate();
    const { booking, resetBooking, setStep } = useBookingStore();

    // Check if manual confirmation is required
    const requiresManualConfirmation = false;

    // Format date for display
    const formatDate = () => {
        if (!booking.date) return 'N/A';
        const date = new Date(booking.date);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    // Generate Google Calendar link
    const getGoogleCalendarLink = () => {
        if (!booking.date || !booking.time) return '#';
        const startDate = new Date(`${booking.date}T${booking.time.replace(' AM', ':00').replace(' PM', ':00')}`);
        const endDate = new Date(startDate.getTime() + (booking.service?.duration || 30) * 60000);
        const formatForGoogle = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.service?.name || 'Appointment')}&dates=${formatForGoogle(startDate)}/${formatForGoogle(endDate)}&details=${encodeURIComponent('Booked via Appointment App')}`;
    };

    // Generate Outlook Calendar link
    const getOutlookCalendarLink = () => {
        if (!booking.date || !booking.time) return '#';
        const startDate = new Date(`${booking.date}T${booking.time.replace(' AM', ':00').replace(' PM', ':00')}`);
        const endDate = new Date(startDate.getTime() + (booking.service?.duration || 30) * 60000);
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(booking.service?.name || 'Appointment')}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`;
    };

    const handleCancel = () => {
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
                <div className="card-planner p-4 bg-gold/20 border-gold">
                    <h3 className="text-ink font-serif text-lg">Appointment Reserved</h3>
                    <p className="text-ink/60 text-sm">
                        You will get an email when the organiser confirms your booking
                    </p>
                </div>
            )}

            {/* Success Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-sage/20 rounded-full mb-4">
                    <CheckCircle className="text-sage-dark" size={40} />
                </div>
                <h2 className="font-serif text-3xl text-ink mb-2">Appointment Confirmed!</h2>
                <p className="text-ink/60">You will receive a confirmation email shortly</p>
            </div>

            {/* Appointment Details Card */}
            <div className="card-planner p-6 space-y-5">
                {/* Time */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="text-terracotta" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-ink/50 mb-1">Date & Time</p>
                        <p className="font-serif text-lg text-ink">{formatDate()}, {booking.time || 'N/A'}</p>
                        <div className="flex gap-2 mt-2">
                            <a
                                href={getGoogleCalendarLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-paper border border-ink/10 rounded-planner text-sm text-ink/70 hover:bg-ink/5"
                            >
                                <ExternalLink size={12} />
                                Google calendar
                            </a>
                            <a
                                href={getOutlookCalendarLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-paper border border-ink/10 rounded-planner text-sm text-ink/70 hover:bg-ink/5"
                            >
                                <ExternalLink size={12} />
                                Outlook
                            </a>
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="text-gold-dark" size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-ink/50 mb-1">Duration</p>
                        <p className="font-serif text-lg text-ink">{booking.service?.duration || 30} min</p>
                    </div>
                </div>

                {/* Number of People - if capacity enabled */}
                {booking.service?.manageCapacity && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="text-sage-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-ink/50 mb-1">Number of People</p>
                            <p className="font-serif text-lg text-ink">{booking.numberOfPeople || 1}</p>
                        </div>
                    </div>
                )}

                {/* Venue */}
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-dusty-rose/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-dusty-rose" size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-ink/50 mb-1">Venue</p>
                        <p className="font-serif text-lg text-ink">{booking.service?.venue || "Our Office"}</p>
                        <p className="text-ink/60">{booking.provider?.name ? `With: ${booking.provider.name}` : "Any available provider"}</p>
                    </div>
                </div>

                {/* Thank You Message */}
                {!requiresManualConfirmation && (
                    <div className="bg-paper border border-ink/10 rounded-planner p-4 text-center">
                        <p className="text-ink/70 italic">
                            {booking.service?.confirmationMessage || "Thank you for your trust, we look forward to meeting you!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2 text-error border-error/30 hover:bg-error/10"
                >
                    <X size={18} />
                    Cancel Appointment
                </button>

                <button
                    onClick={handleDone}
                    className="btn-primary"
                >
                    View My Appointments
                </button>
            </div>
        </div>
    );
};

export default ConfirmationStep;

