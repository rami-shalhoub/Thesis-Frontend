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
import { Message as ApiMessage } from '../APIs/ChatAPI';
import { useParams, useHistory } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/useChat';

interface ChatParams {
    sessionId: string;
}

// Local message interface that matches MessageBubble component
interface UIMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    isTyping?: boolean;
}

const Chat: React.FC = () => {
    const { sessionId } = useParams<ChatParams>();
   // const sessionId = '57b2db74-f376-4861-8248-62eede151b72'; // Hardcoded for testing
    const history = useHistory();
    const { user } = useAuth();
    const { 
        messages: apiMessages, 
        currentSession,
        sessions,
        getSession, 
        sendMessage 
    } = useChat();
    const [uiMessages, setUiMessages] = useState<UIMessage[]>([]);
    const [hasMessages, setHasMessages] = useState(false);
    const [isResponseLoading, setIsResponseLoading] = useState(false);
    const contentRef = useRef<HTMLIonContentElement>(null);
    
    // Fetch session data when component mounts or sessionId changes
    useEffect(() => {
        const loadSession = async () => {
            try {
                if (sessionId) {
                    // If sessionId is provided, load that specific session
                    await getSession(sessionId);
                } else if (user) {
                    // If no sessionId is provided, check if there are any existing sessions
                    if (sessions && sessions.length > 0) {
                        // If there are existing sessions, load the most recent one
                        const mostRecentSession = sessions[0];
                        history.push(`/chat/${mostRecentSession.id}`);
                    } else {
                        // If no sessions exist, open the side menu for the user to create a new chat
                        const menu = document.querySelector('ion-menu');
                        if (menu) {
                            (menu as HTMLIonMenuElement).open();
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading session:', error);
            }
        };
        
        loadSession();
        // Include sessions and history in the dependency array
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, user, sessions, history]);

    // Convert API messages to UI messages
    useEffect(() => {
        if (apiMessages.length > 0) {
            const convertedMessages: UIMessage[] = apiMessages.map((msg: ApiMessage) => ({
                id: msg.id,
                text: msg.content,
                sender: msg.role === 'user' ? 'user' as const : 'bot' as const,
                isTyping: false
            }));
            
            setUiMessages(convertedMessages);
            setHasMessages(convertedMessages.length > 0);
        } else {
            setUiMessages([]);
            setHasMessages(false);
        }
    }, [apiMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollToBottom(300);
        }
    }, [uiMessages]);

    // Create a new session

    // Handle sending a message
    const handleSendMessage = async (text: string) => {
        if (!sessionId) return;

        // Set loading state to disable input
        setIsResponseLoading(true);

        // Add user message to UI immediately
        const userMessage: UIMessage = {
            id: Date.now().toString(),
            text: text,
            sender: 'user'
        };
        
        setUiMessages(prevMessages => [...prevMessages, userMessage]);
        setHasMessages(true);
        
        // Add typing indicator
        const typingMessage: UIMessage = {
            id: (Date.now() + 1).toString(),
            text: '',
            sender: 'bot',
            isTyping: true
        };
        
        setUiMessages(prevMessages => [...prevMessages, typingMessage]);

        try {
            // Send message to API
            await sendMessage(sessionId, text);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Remove typing indicator if there's an error
            setUiMessages(prevMessages => prevMessages.filter(msg => !msg.isTyping));
        } finally {
            // Reset loading state to enable input
            setIsResponseLoading(false);
        }
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
                        {uiMessages.map((message) => (
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
                        disabled={isResponseLoading || (currentSession ? !currentSession.isActive : false)}
                    />
                </div>
            )}

      </IonPage>
   );
};

export default Chat;
