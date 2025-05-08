import React, { createContext, useState, useEffect, useCallback } from 'react';
import { chatApi, Session, Message } from '../APIs/ChatAPI';
import { useErrorHandler } from '../APIs/ErrorHandler';
interface ChatContextType {
   sessions: Session[];
   currentSession: Session | null;
   messages: Message[];
   loading: boolean;
   createSession: () => Promise<string>;
   getSession: (sessionId: string) => Promise<void>;
   getAllSessions: () => Promise<void>;
   closeSession: (sessionId: string) => Promise<void>;
   deleteSession: (sessionId: string) => Promise<void>;
   deleteAllSessions: () => Promise<void>;
   sendMessage: (sessionId: string, prompt: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [sessions, setSessions] = useState<Session[]>([]);
   const [currentSession, setCurrentSession] = useState<Session | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const { showToast, ErrorToastComponent } = useErrorHandler();

   // Get userId from localStorage
   const getUserId = (): string => {
      const userId = localStorage.getItem('userId');
      console.log('ChatContext: getUserId called, userId from localStorage:', userId);
      
      if (!userId) {
         console.error('ChatContext: User ID not found in localStorage');
         throw new Error('User ID not found. Please log in again.');
      }
      return userId;
   };

   // Create a new session
   const createSession = async (): Promise<string> => {
      try {
         console.log('ChatContext: Creating new session');
         setLoading(true);
         const userId = getUserId();
         console.log('ChatContext: Using userId for new session:', userId);
         const response = await chatApi.createSession(userId);
         console.log('ChatContext: Create session response:', response.data);
         const newSession = response.data;

         // Update sessions list
         setSessions(prevSessions => [newSession, ...prevSessions]);
         setCurrentSession(newSession);

         console.log('ChatContext: New session created with ID:', newSession.id);
         return newSession.id;
      } catch (error) {
         console.error('ChatContext: Error creating session:', error);
         showToast('Failed to create new chat session');
         throw error;
      } finally {
         setLoading(false);
      }
   };

   // Get a specific session
   const getSession = async (sessionId: string): Promise<void> => {
      try {
         console.log('ChatContext: Getting session with ID:', sessionId);
         setLoading(true);
         const response = await chatApi.getSession(sessionId);
         console.log('ChatContext: Session response:', response.data);
         setCurrentSession(response.data.session);
         setMessages(response.data.messages);
      } catch (error) {
         console.error('Error fetching session:', error);
         showToast('Failed to load chat session');
         throw error;
      } finally {
         setLoading(false);
      }
   };

   // Get all sessions
   const getAllSessions = useCallback(async (): Promise<void> => {
      try {
         console.log('ChatContext: Getting all sessions');
         setLoading(true);
         const userId = getUserId();
         console.log('ChatContext: Using userId:', userId);
         const response = await chatApi.getAllSessions(userId);
         console.log('ChatContext: All sessions response:', response.data);
         setSessions(response.data);
      } catch (error) {
         console.error('ChatContext: Error fetching sessions:', error);
         showToast('Failed to load chat history');
         throw error;
      } finally {
         setLoading(false);
      }
   }, [setLoading, setSessions, showToast]);

   // Close a session
   const closeSession = async (sessionId: string): Promise<void> => {
      try {
         setLoading(true);
         await chatApi.closeSession(sessionId);

         // Update the session in the state
         setSessions(prevSessions =>
            prevSessions.map(session =>
               session.id === sessionId ? { ...session, isActive: false } : session
            )
         );

         if (currentSession && currentSession.id === sessionId) {
            setCurrentSession({ ...currentSession, isActive: false });
         }

         showToast('Chat closed successfully');
      } catch (error) {
         console.error('Error closing session:', error);
         showToast('Failed to close chat');
         throw error;
      } finally {
         setLoading(false);
      }
   };

   // Delete a session
   const deleteSession = async (sessionId: string): Promise<void> => {
      try {
         console.log('ChatContext: Deleting session with ID:', sessionId);
         setLoading(true);
         await chatApi.deleteSession(sessionId);

         // Remove the session from the state
         setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));

         // If the current session was deleted, create a new one
         if (currentSession && currentSession.id === sessionId) {
            console.log('ChatContext: Current session was deleted, creating a new one');
            const newSessionId = await createSession();
            console.log('ChatContext: Redirecting to new session:', newSessionId);
            window.location.href = `/chat/${newSessionId}`;
         }

         showToast('Chat deleted successfully');
      } catch (error) {
         console.error('ChatContext: Error deleting session:', error);
         showToast('Failed to delete chat');
         throw error;
      } finally {
         setLoading(false);
      }
   };

   // Delete all sessions
   const deleteAllSessions = async (): Promise<void> => {
      try {
         console.log('ChatContext: Deleting all sessions');
         setLoading(true);
         const userId = getUserId();
         await chatApi.deleteAllSessions(userId);

         // Clear sessions from state
         setSessions([]);

         // Create a new session
         console.log('ChatContext: Creating a new session after deleting all');
         const newSessionId = await createSession();
         console.log('ChatContext: Redirecting to new session:', newSessionId);
         window.location.href = `/chat/${newSessionId}`;

         showToast('All chats deleted successfully');
      } catch (error) {
         console.error('ChatContext: Error deleting all sessions:', error);
         showToast('Failed to delete all chats');
         throw error;
      } finally {
         setLoading(false);
      }
   };

   // Send a message
   const sendMessage = async (sessionId: string, prompt: string): Promise<void> => {
      try {
         console.log('ChatContext: Sending message with sessionId:', sessionId);
         setLoading(true);
         await chatApi.sendMessage(sessionId, prompt);
         console.log('ChatContext: Message sent successfully, refreshing session');

         // Refresh the session to get the updated messages
         await getSession(sessionId);
      } catch (error) {
         console.error('ChatContext: Error sending message:', error);
         showToast('Failed to send message');
         throw error;
      } finally {
         setLoading(false);
      }
   };

// Load sessions when the component mounts
useEffect(() => {
   console.log('ChatContext: Initial useEffect running to load sessions');
   
   const loadSessions = async () => {
      try {
         // Only load sessions if we have a userId
         const userId = localStorage.getItem('userId');
         console.log('ChatContext: Initial load - userId from localStorage:', userId);
         
         if (userId) {
            console.log('ChatContext: Initial load - calling getAllSessions');
            await getAllSessions();
            console.log('ChatContext: Initial load - sessions loaded successfully');
         } else {
            console.log('ChatContext: Initial load - no userId found, skipping session load');
         }
      } catch (error) {
         console.error('ChatContext: Error loading initial sessions:', error);
      }
   };
   
   loadSessions();
   // Don't include getAllSessions in the dependency array to prevent infinite loops
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

   return (
      <ChatContext.Provider
         value={{
            sessions,
            currentSession,
            messages,
            loading,
            createSession,
            getSession,
            getAllSessions,
            closeSession,
            deleteSession,
            deleteAllSessions,
            sendMessage
         }}
      >
         {children}
         <ErrorToastComponent />
      </ChatContext.Provider>
   );
};
