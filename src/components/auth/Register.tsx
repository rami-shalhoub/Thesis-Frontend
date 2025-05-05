import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonRow, IonTitle } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React from 'react';

const Register: React.FC = () => {

    return (
        <>
        <IonCardContent className='ion-padding'>
            <IonTitle className='ion-text-center ion-padding-top'>Register</IonTitle>
            <IonGrid fixed>
                <IonRow class="ion-justify-content-center">
                    <IonCol >
                        <IonCardContent>
                            <form >
                                <IonGrid>
                                    <IonRow>
                                        <IonCol>
                                            <IonInput className="ion-margin-bottom "labelPlacement='floating' label='Fist Name' type='text' placeholder='John' fill='outline'></IonInput>
                                        </IonCol>
                                        <IonCol>
                                            <IonInput className="ion-margin-botoom" labelPlacement='floating' label='Fist Name' type='text' placeholder='Doe' fill='outline'></IonInput>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonInput className="ion-margin-top" labelPlacement='floating' label='Email' type='email' placeholder='email@example.com' fill='outline'></IonInput>
                                        <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='outline'></IonInput>
                                    </IonRow>
                                </IonGrid>
                                <IonButton type='submit' expand='block' className="ion-margin-top">
                                    Register
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

export default Register;