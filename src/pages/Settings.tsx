import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonPage, IonRow } from '@ionic/react';
import { pencil, save, trashBin } from 'ionicons/icons';
import './CSS/Settings.css';
import React, { useState } from 'react';

const Settings: React.FC = () => {
   const organisation: string = 'ClientOrg';
   const role: string = 'Client';
   const name: string = 'John Doe';
   const email: string = 'john@example.com';
   const password: string = 'password123';
   const [isEditMode, setIsEditMode] = useState(false);

   const handleEditClick = () => {
      setIsEditMode(true);
   };

   const handleSaveClick = () => {
      setIsEditMode(false);
   };


   return (
      <IonPage className='ion-justify-content-center ion-align-items-center'>
         <IonCard className='ion-padding ion-margin settings-card'>
            <IonCardHeader>
               <IonCardTitle className='ion-text-center'>Settings</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
               <IonGrid>
                  <IonRow>
                     <IonCol>
                        <IonInput className="ion-margin-bottom" labelPlacement='floating' label='Organisation' type='text' fill='solid' value={organisation} disabled={true}></IonInput>
                     </IonCol>
                     <IonCol>
                        <IonInput className='ion-margin-bottom' label='Role' labelPlacement='floating' type='text' fill='solid' value={role} disabled={true} color='danger'></IonInput>
                     </IonCol>
                  </IonRow>
                  <IonRow>
                     <IonInput className="ion-margin-botoom" labelPlacement='floating' label='User Name' type='text' fill='solid' value={name} disabled={!isEditMode}></IonInput>
                     <IonInput className="ion-margin-top" labelPlacement='floating' label='Email' type='email' fill='solid' value={email} disabled={!isEditMode}></IonInput>
                     <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='solid' value={password} disabled={!isEditMode}>
                        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                     </IonInput>
                  </IonRow>
                  <IonRow>
                     <IonCol>
                        <IonButton 
                           type='submit' 
                           className="ion-margin-top" 
                           style={{ display: isEditMode ? 'none' : 'inline-flex' }}
                           onClick={handleEditClick}
                        >
                           Edit
                           <IonIcon icon={pencil} slot='end' />
                        </IonButton>
                        <IonButton 
                           type='submit' 
                           className="ion-margin-top" 
                           style={{ display: isEditMode ? 'inline-flex' : 'none' }}
                           onClick={handleSaveClick}
                        >
                           Save
                           <IonIcon icon={save} slot='end' />
                        </IonButton>
                     </IonCol>
                     <IonCol offset='8'>
                        <IonButton type='submit' expand='block' className="ion-margin-top" color='danger' disabled={isEditMode}>
                           Delete Account
                           <IonIcon icon={trashBin} slot='end' />
                        </IonButton>
                     </IonCol>
                  </IonRow>
               </IonGrid>

            </IonCardContent>
         </IonCard>
      </IonPage>
   );
};

export default Settings;
