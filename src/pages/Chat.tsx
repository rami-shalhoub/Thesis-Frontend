import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { logoIonic } from 'ionicons/icons';
import React, { useState, useRef, useEffect } from 'react';
import './CSS/Chat.css';
import MessageInput from '../components/chat/MessageInput';
import MessageBubble from '../components/chat/MessageBubble';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    isTyping?: boolean;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMessages, setHasMessages] = useState(false);
    const [isResponseLoading, setIsResponseLoading] = useState(false);
    const contentRef = useRef<HTMLIonContentElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollToBottom(300);
        }
    }, [messages]);

    // Generate Lorem Ipsum text
    const generateLoremIpsum = () => {
        return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.";
    };

    // Handle sending a message
    const handleSendMessage = (text: string) => {
        // Set loading state to disable input
        setIsResponseLoading(true);

        // Add user message
        const newUserMessage: Message = {
            id: Date.now(),
            text: text,
            sender: 'user'
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setHasMessages(true);

        // Add bot typing indicator
        const typingMessage: Message = {
            id: Date.now() + 1,
            text: '',
            sender: 'bot',
            isTyping: true
        };

        setMessages(prevMessages => [...prevMessages, typingMessage]);

        // Replace typing indicator with actual response after delay
        setTimeout(() => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const typingIndex = updatedMessages.findIndex(msg => msg.isTyping);

                if (typingIndex !== -1) {
                    updatedMessages[typingIndex] = {
                        id: updatedMessages[typingIndex].id,
                        text: generateLoremIpsum(),
                        sender: 'bot'
                    };
                }

                return updatedMessages;
            });

            // Reset loading state to enable input
            setIsResponseLoading(false);
        }, 2000);
    };

    return (
        <IonPage className="chat-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chat</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent ref={contentRef} className={hasMessages ? 'has-messages' : 'no-messages'}>
                {!hasMessages ? (
                    <div className="initial-state">
                        <div className="logo-container">
                            <IonIcon icon={logoIonic} className="ionic-logo" />
                            <IonTitle className="logo-text">DeepSeek powered Legal AI Analyser</IonTitle>
                        </div>
                        <MessageInput
                            onSendMessage={handleSendMessage}
                            position="center"
                            autoFocus={true}
                            disabled={isResponseLoading}
                        />
                    </div>
                ) : (
                    <div className="messages-container">
                        {messages.map((message) => (
                            <MessageBubble
                                key={message.id}
                                text={message.text}
                                sender={message.sender}
                                isTyping={message.isTyping}
                            />
                        ))}
                    </div>
                )}
            </IonContent>

            {hasMessages && (
                <div style={{ paddingBottom: '150px', borderTop: '3px solid #3880ff' }}>
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        position="bottom"
                        disabled={isResponseLoading}
                    />
                </div>
            )}

        </IonPage>
    );
};

export default Chat;