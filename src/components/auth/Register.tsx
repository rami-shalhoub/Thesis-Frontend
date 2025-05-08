import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonPicker, IonRow, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../APIs/ErrorHandler';

const Register: React.FC = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      organisationID: 'ClientOrgMSP',
      role: 'client'
   });
   const [isLoading, setIsLoading] = useState(false);
   const { register } = useAuth();
   const { ErrorToastComponent, showToast } = useErrorHandler();

   const handleChange = (field: string, value: string) => {
      setFormData({
         ...formData,
         [field]: value
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
         showToast('Please fill in all required fields');
         return;
      }

      if (formData.password !== formData.confirmPassword) {
         showToast('Passwords do not match');
         return;
      }

      setIsLoading(true);
      try {
         await register(
            formData.email,
            formData.password,
            formData.name,
            formData.organisationID,
            formData.role
         );

         // Close the modal after successful registration
         const modal = document.querySelector('ion-modal');
         if (modal) {
            modal.dismiss();
         }
      } catch (error) {
         console.error('Registration failed:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <IonCardContent className='ion-padding'>
            <form onSubmit={handleSubmit}>
               <IonGrid class="ion-justify-content-center" fixed>
                  <IonRow >
                     <IonCol>
                        <IonPicker className='ion-padding-end' style={{ height: '70%', borderRight: '1px solid #ccc' }}>
                           <IonSelect
                              value={formData.organisationID}
                              interface="popover"
                              placeholder="Organisation"
                              onIonChange={(e) => handleChange('organisationID', e.detail.value)}
                           >
                              <div slot="label">Organisation <IonText color="danger"> (Required)</IonText></div>
                              <IonSelectOption value="ClientOrgMSP">ClientOrg</IonSelectOption>
                              <IonSelectOption value="LawfirmOrgMSP">LawFirmOrg</IonSelectOption>
                              <IonSelectOption value="RetailOrgMSP">RetailOrg</IonSelectOption>
                           </IonSelect>
                        </IonPicker>
                     </IonCol>

                     <IonCol>
                        <IonPicker className='ion-padding-start' style={{ height: '70%' }}>
                           <IonSelect
                              value={formData.role}
                              interface="popover"
                              placeholder="Role"
                              onIonChange={(e) => handleChange('role', e.detail.value)}
                           >
                              <div slot="label">Role<IonText color="danger"> (Required)</IonText></div>
                              <IonSelectOption value="client">client</IonSelectOption>
                           </IonSelect>
                        </IonPicker>
                     </IonCol>
                  </IonRow>

                  <IonRow>
                     <IonInput
                        className="ion-margin-botoom"
                        labelPlacement='floating'
                        label='User Name'
                        type='text'
                        placeholder='John'
                        fill='outline'
                        required={true}
                        value={formData.name}
                        onIonInput={(e) => handleChange('name', e.detail.value || '')}
                     ></IonInput>
                     <IonInput
                        className="ion-margin-top"
                        labelPlacement='floating'
                        label='Email'
                        type='email'
                        placeholder='email@example.com'
                        fill='outline'
                        required={true}
                        value={formData.email}
                        onIonInput={(e) => handleChange('email', e.detail.value || '')}
                     ></IonInput>

                     <IonCol>
                        <IonInput
                           className="ion-margin-top"
                           labelPlacement='floating'
                           label='Password'
                           type='password'
                           fill='outline'
                           required={true}
                           value={formData.password}
                           onIonInput={(e) => handleChange('password', e.detail.value || '')}
                        >
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                     </IonCol>

                     <IonCol>
                        <IonInput
                           className="ion-margin-top"
                           labelPlacement='floating'
                           label='Confirm Password'
                           type='password'
                           fill='outline'
                           required={true}
                           value={formData.confirmPassword}
                           onIonInput={(e) => handleChange('confirmPassword', e.detail.value || '')}
                        >
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                     </IonCol>
                  </IonRow>
               </IonGrid>

               <IonButton
                  type='submit'
                  expand='block'
                  className="ion-margin-top"
                  disabled={isLoading}
               >
                  {isLoading ? 'Registering...' : 'Register'}
                  <IonIcon icon={logInOutline} slot='end' />
               </IonButton>
            </form>
         </IonCardContent>
         <ErrorToastComponent />
      </>
   );
};

export default Register;
