import { IonModal, IonPage, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView } from '@ionic/react';
import React from 'react';
import './LoginModal.css'
import Signin from './Signin';
import Register from './Register';

interface LoginModalProps {
    triggerID: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ triggerID }) => {
    return (
        <IonPage>
            <IonModal id='floating-modal' trigger={triggerID}>
                <IonSegment value="Signin">
                    <IonSegmentButton value="Signin" contentId='Signin'> sign in</IonSegmentButton>
                    <IonSegmentButton value="Register" contentId='Register'> Register</IonSegmentButton>
                </IonSegment>
                <IonSegmentView >
                    <IonSegmentContent id='Signin' style={{ margin: '60px' }}>
                        <Signin></Signin>
                    </IonSegmentContent>
                    <IonSegmentContent id='Register'>
                        <Register></Register>
                    </IonSegmentContent>
                </IonSegmentView>
            </IonModal>
        </IonPage>
    );
};

export default LoginModal;