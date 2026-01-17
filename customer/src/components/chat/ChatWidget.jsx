import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, RotateCcw, Sparkles, Calendar, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import {
    sendChatMessage,
    resetConversation,
    getQuickSuggestions,
    bookViaChat,
    cancelViaChat,
    rescheduleViaChat,
    getSmartSlots
} from '../../services/chatService';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Floating AI chat widget for appointment assistance
 * - Floating action button (bottom-left to avoid conflict with booking FAB)
 * - Expandable chat drawer
 * - Message history with typing indicator
 * - Quick action suggestions
 * - Smart scheduling with slot suggestions
 * - Booking, cancellation, and reschedule via chat
 */
const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            content: "Hi! 👋 I'm your appointment assistant. I can help you book, reschedule, or cancel appointments. What would you like to do?",
            isUser: false
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [pendingReschedule, setPendingReschedule] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const { openDrawer, setSelectedService } = useBookingStore();

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            // Load suggestions on first open
            if (suggestions.length === 0) {
                loadSuggestions();
            }
        }
    }, [isOpen]);

    const loadSuggestions = async () => {
        try {
            const suggestionsData = await getQuickSuggestions();
            setSuggestions(suggestionsData);
        } catch (error) {
            console.warn('Could not load suggestions:', error);
        }
    };

    const addMessage = (content, isUser = false, extras = {}) => {
        const newMessage = {
            id: Date.now() + Math.random(),
            content,
            isUser,
            ...extras
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    const handleSend = async () => {
        const message = inputValue.trim();
        if (!message || isLoading) return;

        // Add user message
        addMessage(message, true);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(message);

            // Add AI response
            addMessage(response.message, false, {
                action: response.suggestedAction,
                slots: response.suggestedSlots
            });

        } catch (error) {
            addMessage("Sorry, I'm having trouble connecting. Please try again in a moment.", false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetConversation();
            setPendingReschedule(null);
            setMessages([
                {
                    id: 'welcome',
                    content: "Conversation reset! How can I help you today?",
                    isUser: false
                }
            ]);
        } catch (error) {
            console.warn('Could not reset conversation:', error);
        }
    };

    const handleQuickBook = async (slotId, serviceId, serviceName, time) => {
        setIsLoading(true);
        try {
            const result = await bookViaChat(slotId, serviceId);
            addMessage(result.message, false, {
                isConfirmation: true,
                booking: result.booking
            });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to book. Please try again.';
            addMessage(`❌ ${errorMsg}`, false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId, serviceName) => {
        setIsLoading(true);
        addMessage(`Cancelling your ${serviceName} appointment...`, false);

        try {
            const result = await cancelViaChat(bookingId);
            addMessage(result.message, false, { isCancellation: true });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to cancel. Please try again.';
            addMessage(`❌ ${errorMsg}`, false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRescheduleBooking = async (bookingId, serviceName) => {
        setPendingReschedule({ bookingId, serviceName });
        addMessage(
            `To reschedule your **${serviceName}** appointment, please tell me your preferred date (e.g., "tomorrow", "next Monday", "January 25th").`,
            false
        );
    };

    const handleRescheduleWithSlot = async (newSlotId) => {
        if (!pendingReschedule) return;

        setIsLoading(true);
        try {
            const result = await rescheduleViaChat(pendingReschedule.bookingId, newSlotId);
            addMessage(result.message, false, { isReschedule: true });
            setPendingReschedule(null);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to reschedule. Please try again.';
            addMessage(`❌ ${errorMsg}`, false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (action) => {
        if (!action) return;

        switch (action.type) {
            case 'book':
                // Set selected service and open booking flow
                setSelectedService({ id: action.serviceId, name: action.serviceName });
                openDrawer();
                setIsOpen(false);
                break;

            case 'open_booking':
                openDrawer();
                setIsOpen(false);
                break;

            case 'quick_book':
                await handleQuickBook(action.slotId, action.serviceId, action.serviceName, action.time);
                break;

            case 'slot_suggestions':
                // Slots are already displayed in the message
                break;

            case 'cancel_booking':
                await handleCancelBooking(action.bookingId, action.serviceName);
                break;

            case 'reschedule_booking':
                await handleRescheduleBooking(action.bookingId, action.serviceName);
                break;

            case 'show_bookings':
                // Bookings are displayed in the message
                break;

            default:
                console.log('Unknown action type:', action.type);
        }
    };

    const handleSlotSelect = async (slot, action) => {
        if (pendingReschedule) {
            await handleRescheduleWithSlot(slot.id);
        } else if (action) {
            await handleQuickBook(slot.id, action.serviceId, action.serviceName, slot.time);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button - Bottom Right, below booking FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className={`
          fixed bottom-28 right-6 z-40 w-14 h-14 rounded-full 
          bg-gradient-to-br from-sage to-sage/80 text-white shadow-lg
          flex items-center justify-center transition-all duration-300 
          hover:scale-105 hover:shadow-xl
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
                aria-label="Chat with AI Assistant"
            >
                <MessageCircle size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-terracotta rounded-full animate-pulse" />
            </button>

            {/* Chat Drawer */}
            <div
                className={`
          fixed z-50 bg-paper shadow-2xl transition-all duration-300 ease-out
          flex flex-col rounded-2xl overflow-hidden
          
          /* Mobile: Bottom card */
          bottom-4 left-4 right-4 max-h-[80vh] h-[500px]
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
          
          /* Desktop: Right side panel */
          md:bottom-6 md:right-6 md:left-auto md:w-[400px] md:h-[600px]
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sage to-sage/80 text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} />
                        <span className="font-medium">AI Assistant</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Smart Scheduling</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleReset}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Reset conversation"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            content={msg.content}
                            isUser={msg.isUser}
                            action={msg.action}
                            slots={msg.slots}
                            isConfirmation={msg.isConfirmation}
                            isCancellation={msg.isCancellation}
                            isReschedule={msg.isReschedule}
                            onAction={handleAction}
                            onSlotSelect={(slot) => handleSlotSelect(slot, msg.action)}
                        />
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                                <Sparkles size={16} className="text-sage animate-pulse" />
                            </div>
                            <div className="bg-ink/5 rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-ink/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestions */}
                {messages.length <= 2 && suggestions.length > 0 && (
                    <div className="px-4 pb-2 flex gap-2 flex-wrap">
                        {suggestions.slice(0, 3).map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs px-3 py-1.5 bg-sage/10 text-sage hover:bg-sage/20 rounded-full transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                {/* Pending Reschedule Notice */}
                {pendingReschedule && (
                    <div className="px-4 pb-2">
                        <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
                            <RefreshCw size={16} />
                            <span>Rescheduling: {pendingReschedule.serviceName}</span>
                            <button
                                onClick={() => setPendingReschedule(null)}
                                className="ml-auto text-amber-500 hover:text-amber-700"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-ink/10">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={pendingReschedule ? "Enter preferred date..." : "Type your message..."}
                            className="flex-1 px-4 py-2.5 bg-ink/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            className="w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-ink/10 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default ChatWidget;

