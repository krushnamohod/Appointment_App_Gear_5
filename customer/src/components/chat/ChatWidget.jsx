import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage, resetConversation, getQuickSuggestions } from '../../services/chatService';
import { useBookingStore } from '../../context/BookingContext';

/**
 * @intent Floating AI chat widget for appointment assistance
 * - Floating action button (bottom-left to avoid conflict with booking FAB)
 * - Expandable chat drawer
 * - Message history with typing indicator
 * - Quick action suggestions
 */
const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            content: "Hi! 👋 I'm your appointment assistant. How can I help you today?",
            isUser: false
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
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

    const handleSend = async () => {
        const message = inputValue.trim();
        if (!message || isLoading) return;

        // Add user message
        const userMessage = { id: Date.now(), content: message, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(message);

            // Add AI response
            const aiMessage = {
                id: Date.now() + 1,
                content: response.message,
                isUser: false,
                action: response.suggestedAction
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            // Add error message
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                content: "Sorry, I'm having trouble connecting. Please try again in a moment.",
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetConversation();
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

    const handleAction = (action) => {
        if (action.type === 'book' && action.serviceId) {
            // Set selected service and open booking flow
            setSelectedService({ id: action.serviceId, name: action.serviceName });
            openDrawer();
            setIsOpen(false);
        } else if (action.type === 'open_booking') {
            openDrawer();
            setIsOpen(false);
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
                            onAction={handleAction}
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

                {/* Input Area */}
                <div className="p-4 border-t border-ink/10">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
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
