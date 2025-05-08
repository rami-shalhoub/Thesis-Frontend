import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonPage, IonRow, IonSelect, IonSelectOption, useIonRouter } from '@ionic/react';
import { pencil, save, trashBin } from 'ionicons/icons';
import './CSS/Settings.css';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useErrorHandler } from '../APIs/ErrorHandler';

const Settings: React.FC = () => {
   const { user, updateUser, deleteUser, isAuthenticated } = useAuth();
   const { ErrorToastComponent, showToast } = useErrorHandler();
   const router = useIonRouter();

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      organisationID: '',
      role: ''
   });
   const [isEditMode, setIsEditMode] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   // Redirect if not authenticated
   useEffect(() => {
      if (!isAuthenticated) {
         router.push('/chat', 'root');
      }
   }, [isAuthenticated, router]);

   // Load user data when component mounts
   useEffect(() => {
      if (user) {
         setFormData({
            name: user.name,
            email: user.email,
            organisationID: user.organisationID,
            role: user.role
         });
      }
   }, [user]);

   const handleChange = (field: string, value: string) => {
      setFormData({
         ...formData,
         [field]: value
      });
   };

   const handleEditClick = () => {
      setIsEditMode(true);
   };

   const handleSaveClick = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
         // Only send fields that have changed
         const updateData: {
            name?: string;
            email?: string;
            organisationID?: string;
         } = {};

         if (formData.name !== user.name || formData.email !== user.email || formData.organisationID !== user.organisationID) {
            updateData.name = formData.name;
            updateData.email = formData.email;
            updateData.organisationID = formData.organisationID;
         }
         // Only make API call if there are changes
         if (Object.keys(updateData).length > 0) {
            await updateUser(user.userId, updateData);
            showToast('User information updated successfully');
         }

         setIsEditMode(false);
      } catch (error) {
         console.error('Failed to update user:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleDeleteAccount = async () => {
      if (!user) return;

      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
         setIsDeleting(true);
         try {
            await deleteUser(user.userId);
            // Redirect will happen automatically due to auth state change
         } catch (error) {
            console.error('Failed to delete account:', error);
            setIsDeleting(false);
         }
      }
   };


   return (
      <IonPage className='ion-justify-content-center ion-align-items-center'>
         <IonCard className='ion-padding ion-margin settings-card'>
            <IonCardHeader>
               <IonCardTitle className='ion-text-center'>Settings</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
               {user && (
                  <IonGrid>
                     <IonRow>
                        <IonCol>
                           <IonSelect
                              value={formData.organisationID}
                              interface="popover"
                              placeholder="Organisation"
                              onIonChange={(e) => handleChange('organisationID', e.detail.value)}
                              disabled={!isEditMode}
                              label='Organisation'
                           >
                              <IonSelectOption value="ClientOrgMSP">ClientOrg</IonSelectOption>
                              <IonSelectOption value="LawfirmOrgMSP">LawFirmOrg</IonSelectOption>
                              <IonSelectOption value="RetailOrgMSP">RetailOrg</IonSelectOption>
                           </IonSelect>
                        </IonCol>
                        <IonCol>
                           <IonInput
                              className='ion-margin-bottom'
                              label='Role'
                              labelPlacement='floating'
                              type='text'
                              fill='solid'
                              value={formData.role}
                              disabled={true}
                              color='danger'
                           ></IonInput>
                        </IonCol>
                     </IonRow>
                     <IonRow>
                        <IonInput
                           className="ion-margin-botoom"
                           labelPlacement='floating'
                           label='User Name'
                           type='text'
                           fill='solid'
                           value={formData.name}
                           disabled={!isEditMode}
                           onIonInput={(e) => handleChange('name', e.detail.value || '')}
                        ></IonInput>
                        <IonInput
                           className="ion-margin-top"
                           labelPlacement='floating'
                           label='Email'
                           type='email'
                           fill='solid'
                           value={formData.email}
                           disabled={!isEditMode}
                           onIonInput={(e) => handleChange('email', e.detail.value || '')}
                        ></IonInput>
                        {/* <IonInput 
                           className="ion-margin-top" 
                           labelPlacement='floating' 
                           label='Password' 
                           type='password' 
                           fill='solid' 
                           value={formData.password} 
                           disabled={true} // Password can't be edited directly
                        >
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput> */}
                     </IonRow>
                     <IonRow>
                        <IonCol>
                           <IonButton
                              type='button'
                              className="ion-margin-top"
                              style={{ display: isEditMode ? 'none' : 'inline-flex' }}
                              onClick={handleEditClick}
                           >
                              Edit
                              <IonIcon icon={pencil} slot='end' />
                           </IonButton>
                           <IonButton
                              type='button'
                              className="ion-margin-top"
                              style={{ display: isEditMode ? 'inline-flex' : 'none' }}
                              onClick={handleSaveClick}
                              disabled={isLoading}
                           >
                              {isLoading ? 'Saving...' : 'Save'}
                              <IonIcon icon={save} slot='end' />
                           </IonButton>
                        </IonCol>
                        <IonCol offset='8'>
                           <IonButton
                              type='button'
                              expand='block'
                              className="ion-margin-top"
                              color='danger'
                              disabled={isEditMode || isDeleting}
                              onClick={handleDeleteAccount}
                           >
                              {isDeleting ? 'Deleting...' : 'Delete Account'}
                              <IonIcon icon={trashBin} slot='end' />
                           </IonButton>
                        </IonCol>
                     </IonRow>
                  </IonGrid>
               )}
            </IonCardContent>
         </IonCard>
         <ErrorToastComponent />
      </IonPage>
   );
};

export default Settings;
