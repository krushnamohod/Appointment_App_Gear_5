import { Bot, User } from 'lucide-react';

/**
 * @intent Individual chat message bubble with user/AI styling
 * @param {object} props
 * @param {string} props.content - Message content
 * @param {boolean} props.isUser - Whether message is from user
 * @param {object} props.action - Suggested action from AI
 * @param {function} props.onAction - Handler for action buttons
 */
const ChatMessage = ({ content, isUser, action, onAction }) => {
    return (
        <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-terracotta text-white' : 'bg-sage/20 text-sage'}
      `}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Bubble */}
            <div className={`
        max-w-[80%] rounded-2xl px-4 py-2.5
        ${isUser
                    ? 'bg-terracotta text-white rounded-br-md'
                    : 'bg-ink/5 text-ink rounded-bl-md'
                }
      `}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

                {/* Action Button (if AI suggests booking) */}
                {!isUser && action && (
                    <button
                        onClick={() => onAction(action)}
                        className="mt-2 px-3 py-1.5 bg-terracotta text-white text-xs font-medium rounded-full hover:bg-terracotta/90 transition-colors"
                    >
                        {action.type === 'book'
                            ? `Book ${action.serviceName}`
                            : 'Start Booking'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
