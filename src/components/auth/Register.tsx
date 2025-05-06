import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonPicker, IonRow, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React from 'react';

const Register: React.FC = () => {

   return (
      <>
         <IonCardContent className='ion-padding'>
            <form >
               <IonGrid class="ion-justify-content-center" fixed>
                  <IonRow >
                     <IonCol>
                        <IonPicker className='ion-padding-end' style={{ height: '70%', borderRight: '1px solid #ccc' }}>
                           <IonSelect value="ClientOrg" interface="popover" placeholder="Organisation" >
                              <div slot="label">Organisation <IonText color="danger"> (Required)</IonText></div>
                              <IonSelectOption value="ClientOrg">Client</IonSelectOption>
                              <IonSelectOption value="LawfirmOrg">Law Firm</IonSelectOption>
                              <IonSelectOption value="RetailOrg">Retail</IonSelectOption>
                           </IonSelect>
                        </IonPicker>
                     </IonCol>

                     <IonCol>
                        <IonPicker className='ion-padding-start' style={{ height: '70%' }}>
                           <IonSelect value="client" interface="popover" placeholder="Role" >
                              <div slot="label">Role<IonText color="danger"> (Required)</IonText></div>
                              <IonSelectOption value="client">client</IonSelectOption>
                           </IonSelect>
                        </IonPicker>
                     </IonCol>
                  </IonRow>

                  <IonRow>
                     <IonInput className="ion-margin-botoom" labelPlacement='floating' label='User Name' type='text' placeholder='John' fill='outline' required={true}></IonInput>
                     <IonInput className="ion-margin-top" labelPlacement='floating' label='Email' type='email' placeholder='email@example.com' fill='outline' required={true}></IonInput>

                     <IonCol>
                        <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='outline' required={true}>
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                     </IonCol>

                     <IonCol>
                        <IonInput className="ion-margin-top" labelPlacement='floating' label='Renter Password' type='password' fill='outline' required={true}>
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                     </IonCol>
                  </IonRow>
               </IonGrid>

               <IonButton type='submit' expand='block' className="ion-margin-top">
                  Register
                  <IonIcon icon={logInOutline} slot='end' />
               </IonButton>
            </form>
         </IonCardContent>
      </>
   );
};

export default Register;