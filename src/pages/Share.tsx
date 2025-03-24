import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Share: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    
                    <IonTitle>Secure Sharing</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Blockchain technologies secure sharing
            </IonContent>
        </IonPage>
    );
};

export default Share;