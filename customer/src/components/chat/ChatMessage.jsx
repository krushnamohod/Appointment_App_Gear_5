import { Bot, User, Clock, Calendar, CheckCircle, XCircle, RefreshCw, Star } from 'lucide-react';

/**
 * @intent Individual chat message bubble with user/AI styling
 * @param {object} props
 * @param {string} props.content - Message content
 * @param {boolean} props.isUser - Whether message is from user
 * @param {object} props.action - Suggested action from AI
 * @param {Array} props.slots - Available slots for booking
 * @param {boolean} props.isConfirmation - Is this a booking confirmation
 * @param {boolean} props.isCancellation - Is this a cancellation confirmation
 * @param {boolean} props.isReschedule - Is this a reschedule confirmation
 * @param {function} props.onAction - Handler for action buttons
 * @param {function} props.onSlotSelect - Handler for slot selection
 */
const ChatMessage = ({
    content,
    isUser,
    action,
    slots,
    isConfirmation,
    isCancellation,
    isReschedule,
    onAction,
    onSlotSelect
}) => {
    // Determine message styling based on type
    const getMessageStyle = () => {
        if (isConfirmation) return 'bg-green-50 border border-green-200';
        if (isCancellation) return 'bg-red-50 border border-red-200';
        if (isReschedule) return 'bg-blue-50 border border-blue-200';
        if (isUser) return 'bg-terracotta text-white';
        return 'bg-ink/5 text-ink';
    };

    // Render markdown-like formatting for messages
    const renderContent = (text) => {
        if (!text) return null;

        // Split by lines and process each
        return text.split('\n').map((line, i) => {
            // Bold text
            let processed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            // Strikethrough
            processed = processed.replace(/~~(.+?)~~/g, '<del class="text-ink/50">$1</del>');
            // Inline code
            processed = processed.replace(/`(.+?)`/g, '<code class="bg-ink/10 px-1 rounded text-sm">$1</code>');

            return (
                <span
                    key={i}
                    dangerouslySetInnerHTML={{ __html: processed }}
                    className="block"
                />
            );
        });
    };

    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isUser ? 'bg-terracotta text-white' : 'bg-sage/20 text-sage'}
                ${isConfirmation ? 'bg-green-100 text-green-600' : ''}
                ${isCancellation ? 'bg-red-100 text-red-600' : ''}
                ${isReschedule ? 'bg-blue-100 text-blue-600' : ''}
            `}>
                {isUser ? <User size={16} /> :
                    isConfirmation ? <CheckCircle size={16} /> :
                        isCancellation ? <XCircle size={16} /> :
                            isReschedule ? <RefreshCw size={16} /> :
                                <Bot size={16} />}
            </div>

            {/* Message Content */}
            <div className="max-w-[85%] space-y-2">
                {/* Message Bubble */}
                <div className={`
                    rounded-2xl px-4 py-2.5
                    ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}
                    ${getMessageStyle()}
                `}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {renderContent(content)}
                    </div>
                </div>

                {/* Slot Suggestions */}
                {slots && slots.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-ink/60 px-1">Click a time to book:</p>
                        <div className="flex flex-wrap gap-2">
                            {slots.slice(0, 5).map((slot, idx) => (
                                <button
                                    key={slot.id}
                                    onClick={() => onSlotSelect && onSlotSelect(slot)}
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                                        transition-all hover:scale-105
                                        ${slot.recommended
                                            ? 'bg-sage text-white shadow-md'
                                            : 'bg-white border border-ink/20 hover:border-sage hover:bg-sage/5'}
                                    `}
                                >
                                    <Clock size={14} />
                                    <span className="font-medium">{slot.time}</span>
                                    {slot.recommended && <Star size={12} className="text-yellow-300" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!isUser && action && (
                    <div className="flex flex-wrap gap-2">
                        {action.type === 'book' && (
                            <button
                                onClick={() => onAction(action)}
                                className="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-terracotta/90 transition-colors flex items-center gap-2"
                            >
                                <Calendar size={14} />
                                Book {action.serviceName}
                            </button>
                        )}

                        {action.type === 'open_booking' && (
                            <button
                                onClick={() => onAction(action)}
                                className="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-terracotta/90 transition-colors"
                            >
                                Start Booking
                            </button>
                        )}

                        {action.type === 'quick_book' && (
                            <button
                                onClick={() => onAction(action)}
                                className="px-4 py-2 bg-sage text-white text-sm font-medium rounded-full hover:bg-sage/90 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={14} />
                                Book {action.time}
                            </button>
                        )}

                        {action.type === 'cancel_booking' && (
                            <button
                                onClick={() => onAction(action)}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <XCircle size={14} />
                                Cancel Appointment
                            </button>
                        )}

                        {action.type === 'reschedule_booking' && (
                            <button
                                onClick={() => onAction(action)}
                                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={14} />
                                Reschedule
                            </button>
                        )}

                        {action.type === 'show_bookings' && action.bookings && (
                            <div className="w-full space-y-2 mt-2">
                                {action.bookings.map((booking, idx) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-ink/10 shadow-sm"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{booking.serviceName}</p>
                                            <p className="text-xs text-ink/60">
                                                {booking.date} at {booking.time}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => onAction({
                                                    type: 'reschedule_booking',
                                                    bookingId: booking.id,
                                                    serviceName: booking.serviceName
                                                })}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Reschedule"
                                            >
                                                <RefreshCw size={14} />
                                            </button>
                                            <button
                                                onClick={() => onAction({
                                                    type: 'cancel_booking',
                                                    bookingId: booking.id,
                                                    serviceName: booking.serviceName
                                                })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Cancel"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {action.type === 'slot_suggestions' && action.slots && (
                            <div className="w-full space-y-2 mt-2">
                                <p className="text-xs text-ink/60">Available slots for {action.serviceName} on {action.date}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {action.slots.slice(0, 5).map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => onSlotSelect && onSlotSelect(slot)}
                                            className={`
                                                flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                                                transition-all hover:scale-105
                                                ${slot.recommended
                                                    ? 'bg-sage text-white shadow-md'
                                                    : 'bg-white border border-ink/20 hover:border-sage hover:bg-sage/5'}
                                            `}
                                        >
                                            <Clock size={14} />
                                            <span className="font-medium">{slot.time}</span>
                                            {slot.recommended && <Star size={12} className="text-yellow-300" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;

