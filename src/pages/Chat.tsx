import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React  from 'react';
const Chat: React.FC = () => {
    return (
        <>
        <IonPage id='chat-page'>
            <IonHeader>
                <IonToolbar>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>
                                Chat page
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Deepseek chat
          </IonContent>
        </IonPage>
        </>
    );
};

export default Chat;