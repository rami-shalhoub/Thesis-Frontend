import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonRow } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React from 'react';


const Signin: React.FC = () => {
   return (
      <>
         <IonCardContent className='ion-padding'>
            <IonGrid fixed>
               <IonRow class="ion-justify-content-center">
                  <IonCol>
                     <form>
                        <IonInput labelPlacement='floating' label='Email' type='email' placeholder='email@example.com' fill='outline'></IonInput>
                        <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='outline'>
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                        <IonButton type='submit' expand='block' className="ion-margin-top">
                           Sign in
                           <IonIcon icon={logInOutline} slot='end' />
                        </IonButton>
                     </form>
                  </IonCol>
               </IonRow>
            </IonGrid>
         </IonCardContent>
      </>
   );
};

export default Signin;