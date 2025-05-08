import { IonButton, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonRow } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../APIs/ErrorHandler';


const Signin: React.FC = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const { ErrorToastComponent, showToast } = useErrorHandler();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
         showToast('Please enter both email and password');
         return;
      }

      setIsLoading(true);
      try {
         await login(email, password);

         // Close the modal after successful login
         const modal = document.querySelector('ion-modal');
         if (modal) {
            modal.dismiss();
         }
      } catch (error) {
         console.error('Login failed:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <>
         <IonCardContent className='ion-padding'>
            <IonGrid fixed>
               <IonRow class="ion-justify-content-center">
                  <IonCol>
                     <form onSubmit={handleSubmit}>
                        <IonInput
                           labelPlacement='floating'
                           label='Email'
                           type='email'
                           placeholder='email@example.com'
                           fill='outline'
                           value={email}
                           onIonInput={(e) => setEmail(e.detail.value || '')}
                           required
                        ></IonInput>
                        <IonInput
                           className="ion-margin-top"
                           labelPlacement='floating'
                           label='Password'
                           type='password'
                           fill='outline'
                           value={password}
                           onIonInput={(e) => setPassword(e.detail.value || '')}
                           required
                        >
                           <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                        </IonInput>
                        <IonButton
                           type='submit'
                           expand='block'
                           className="ion-margin-top"
                           disabled={isLoading}
                        >
                           {isLoading ? 'Signing in...' : 'Sign in'}
                           <IonIcon icon={logInOutline} slot='end' />
                        </IonButton>
                     </form>
                  </IonCol>
               </IonRow>
            </IonGrid>
         </IonCardContent>
         <ErrorToastComponent />
      </>
   );
};

export default Signin;
