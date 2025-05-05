import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender, isTyping }) => {
  return (
    <div className={`message-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      {isTyping ? (
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <div className="message-text">{text}</div>
      )}
    </div>
  );
};

export default MessageBubble;
