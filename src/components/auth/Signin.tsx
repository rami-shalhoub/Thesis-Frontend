import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonRow, IonTitle } from '@ionic/react';
import {logInOutline} from 'ionicons/icons';
import React from 'react';
import './Signin.css'


const Signin: React.FC= () => {
    return (
        <>
        <IonCardContent id='signin-card' className='ion-margin-top'>
            <IonTitle className='ion-text-center ion-padding-top'>Sign in</IonTitle>
            <IonGrid fixed>
                <IonRow class="ion-justify-content-center">
                    <IonCol >
                        <IonCardContent>
                            <form >
                                <IonInput labelPlacement='floating' label='Email' type='email' placeholder='email@example.com' fill='outline'></IonInput>
                                <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='outline'></IonInput>
                                <IonButton type='submit' expand='block' className="ion-margin-top">
                                    Sign in
                                    <IonIcon icon={logInOutline} slot='end'/>
                                </IonButton>
                            </form>
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCardContent>
        </>
    );
};

export default Signin;