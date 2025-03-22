import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React  from 'react';
const Chat: React.FC = () => {



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonMenuButton></IonMenuButton>
                            </IonButtons>
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
    );
};

export default Chat;