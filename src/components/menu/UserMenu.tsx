import { IonButton, IonIcon, IonMenuToggle, IonPopover } from '@ionic/react';
import { personCircle, settings, logOutOutline } from 'ionicons/icons';
import React from 'react';
import LoginModal from '../auth/LoginModal';

const UserMenu: React.FC = () => {
   const userName: string = "rami";

   return (
      <>
         {/* //^ Sign in Button  */}
         <IonButton id='open-login-modal' shape='round' fill='outline' className='ion-margin-bottom' >
            <IonIcon slot='icon-only' icon={personCircle} />
            Sign in
            <LoginModal triggerID='open-login-modal'></LoginModal>
         </IonButton>
         {/* //^User menu */}
         <IonButton id="cover-trigger" shape='round' fill='outline' className='ion-margin-bottom'>
            <IonIcon slot='icon-only' icon={personCircle} className='ion-padding-end' />
            {userName}
         </IonButton><br />
         <IonPopover trigger="cover-trigger" size="auto" side='right' backdropDismiss={true} dismissOnSelect={true}>

            {/* //^ Settings button */}
            <IonMenuToggle autoHide={false}>
               <IonButton fill='solid' expand='block' routerLink='/settings' routerDirection='none'>
                  <IonIcon icon={settings} />
                  Settings
               </IonButton>
            </IonMenuToggle>

            {/* //^ Log out button */}
            <IonMenuToggle autoHide={false}>
               <IonButton fill='clear' expand='full' routerLink="/" routerDirection='root'>
                  <IonIcon slot='start' icon={logOutOutline} />
                  Logout
               </IonButton>
            </IonMenuToggle>
         </IonPopover>
      </>
   );
};

export default UserMenu;