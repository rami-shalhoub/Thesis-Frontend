//* This is the main Menu where it is always rendered on the right side of the page 
//* it will be always opened on big screens and it can be opened and closed on small screens
//* it contains the Chat page with the chat history, the Secure Share page , User signin logout, and the settings page*/
import {
   IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider,
   IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenu,
   IonRow, IonSearchbar,
   IonSplitPane, IonTitle, IonToolbar
}
   from '@ionic/react';
import React, { useState, useEffect } from 'react';
import newChat from '../../assets/newChat.svg';
import { closeCircleOutline, logoIonic, trashBin, trashBinOutline } from 'ionicons/icons';
import './Menu.css';
import UserMenu from './UserMenu';
import { Session } from '../../APIs/ChatAPI';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/useChat';
import { useHistory } from 'react-router';


const Menu: React.FC = () => {
   const { user } = useAuth();
   const history = useHistory();
   const {
      sessions,
      loading,
      createSession,
      getAllSessions,
      closeSession,
      deleteSession,
      deleteAllSessions
   } = useChat();
   const [searchResults, setSearchResults] = useState<Session[]>([]);

   // Fetch all sessions when component mounts or user changes
   useEffect(() => {
      const loadSessions = async () => {
         if (user) {
            try {
               await getAllSessions();
            } catch (error) {
               console.error('Error loading sessions in SideMenu:', error);
            }
         }
      };
      
      loadSessions();
      // Only depend on user, not getAllSessions to prevent infinite loops
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [user]);

   // Create a new session
   const handleCreateSession = async () => {
      try {
         const sessionId = await createSession();
         // Navigate to chat page with the new session ID
         history.push(`/chat/${sessionId}`);
      } catch (error) {
         console.error('Error creating session:', error);
      }
   };

   // Delete a session
   const handleDeleteSession = async (sessionId: string) => {
      try {
         await deleteSession(sessionId);
      } catch (error) {
         console.error('Error deleting session:', error);
      }
   };

   // Close a session
   const handleCloseSession = async (sessionId: string) => {
      try {
         await closeSession(sessionId);
      } catch (error) {
         console.error('Error closing session:', error);
      }
   };

   // Delete all sessions
   const handleDeleteAllSessions = async () => {
      try {
         await deleteAllSessions();
      } catch (error) {
         console.error('Error deleting all sessions:', error);
      }
   };

   // Open a specific chat
   const handleOpenChat = (sessionId: string) => {
      history.push(`/chat/${sessionId}`);
   };

   // Format date for display
   const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      return date.toLocaleDateString();
   };

   // Group sessions by date
   const groupSessionsByDate = (sessions: Session[]) => {
      const groupedSessions = new Map<string, Session[]>();

      sessions.forEach((session) => {
         const date = formatDate(session.createdAt);
         if (!groupedSessions.has(date)) {
            groupedSessions.set(date, []);
         }
         groupedSessions.get(date)?.push(session);
      });
      return groupedSessions;
   };

   // Search logic
   const handleInput = (event: Event) => {
      let query = '';
      const target = event.target as HTMLIonSearchbarElement;
      if (target) query = target.value!.toLowerCase();

      // Filter sessions based on search query
      setSearchResults(sessions.filter((session) =>
         (session.id ? session.id.toLowerCase().includes(query) : false) ||
         formatDate(session.createdAt).toLowerCase().includes(query)
      ));
   };

   // Get grouped sessions for display
   const groupedSessions = searchResults.length > 0
      ? groupSessionsByDate(searchResults)
      : groupSessionsByDate(sessions);


   return (
      <>

         <IonSplitPane contentId='main' when="lg" disabled={true}>
            <IonMenu contentId='main' swipeGesture={false} type='reveal'>
               {/*//& HEADER */}
               <IonHeader>
                  <IonToolbar color={'secondary'}>
                     <IonTitle>
                        <IonIcon icon={logoIonic} className='ion-padding-end' />
                        AI DApp
                     </IonTitle>
                  </IonToolbar>
               </IonHeader>

               {/* //& Chat History  */}
               <IonContent>
                  <IonGrid>
                     <IonRow>
                        <IonCol>
                           <IonTitle color={'tertiary'} className='ion-padding'>Chat History</IonTitle>
                        </IonCol>
                        <IonCol offset='3' className='ion-padding-top'>
                           <IonButton color={'danger'} onClick={handleDeleteAllSessions}>
                              <IonIcon icon={trashBin}></IonIcon>
                           </IonButton>
                        </IonCol>
                     </IonRow>
                  </IonGrid>

                  {/* //^ Search Bar */}
                  <IonSearchbar
                     color={'light'}
                     showClearButton="focus"
                     clearIcon={trashBin}
                     debounce={1000}
                     onIonInput={(event) => handleInput(event)}
                  />
                  {/* //^ Display the chats and categorize them based on dates*/}
                  {loading ? (
                     <div className="ion-text-center ion-padding">Loading chats...</div>
                  ) :
                  sessions.length === 0 ? (
                     <div className="ion-text-center ion-padding">No chats found</div>
                  ) : Array.from(groupedSessions.entries()).map(([date, sessions]) => (
                     <React.Fragment key={date}>
                        <IonItemDivider>
                           <IonLabel>{date}</IonLabel>
                        </IonItemDivider>
                        {sessions.filter(session => session.id).map((session) => (
                           <IonItemSliding key={session.id || `unknown-${Math.random()}`}>
                              <IonItemOptions side="start">
                                 <IonItemOption
                                    color="danger"
                                    expandable
                                    type='button'
                                    onClick={() => session.id && handleDeleteSession(session.id)}
                                    disabled={!session.id}
                                 >
                                    <IonIcon icon={trashBinOutline} slot='icon-only' />
                                 </IonItemOption>
                              </IonItemOptions>

                              <IonItem routerDirection='none'>
                                 <IonLabel>
                                    <IonButton
                                       fill='clear'
                                       expand='block'
                                       onClick={() => session.id && handleOpenChat(session.id)}
                                       disabled={!session.id}
                                    >
                                       {`Chat ${session.id ? session.id.substring(0, 8) : 'Unknown'}...`}
                                       <small className="ion-padding-start">
                                          {session.createdAt ? new Date(session.createdAt).toLocaleTimeString() : 'Unknown time'}
                                       </small>
                                    </IonButton>
                                 </IonLabel>
                              </IonItem>

                              <IonItemOptions side="end">
                                 <IonItemOption
                                    color="medium"
                                    expandable
                                    type='button'
                                    onClick={() => session.id && handleCloseSession(session.id)}
                                    disabled={!session.id}
                                 >
                                    <IonIcon icon={closeCircleOutline} slot='icon-only' />
                                 </IonItemOption>
                              </IonItemOptions>
                           </IonItemSliding>
                        ))}
                     </React.Fragment>
                  ))}
               </IonContent>

               {/* //& New Chat button */}
               <IonButton onClick={handleCreateSession} className='ion-padding ion-margin-top' shape='round' fill='solid' expand='full'>
                  New Chat
                  <IonIcon icon={newChat} slot='start' />
               </IonButton>
               {/* //& User menu */}
               <UserMenu></UserMenu>
            </IonMenu>
         </IonSplitPane>
      </>
   );
};

export default Menu;
