import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Settings: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    
                    <IonTitle>Setting page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default Settings;