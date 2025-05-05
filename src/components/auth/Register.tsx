import { IonButton, IonCardContent, IonCardTitle, IonCol, IonGrid, IonIcon, IonInput, IonInputPasswordToggle, IonPicker, IonPickerColumn, IonPickerColumnOption, IonRow} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React from 'react';

const Register: React.FC = () => {

   return (
      <>
         <IonCardContent className='ion-padding'>
            <IonGrid fixed>
            {/* <IonTitle className='ion-text-center ion-padding-top'>Register</IonTitle> */}
               <IonRow class="ion-justify-content-center">
                  <IonCol >
                     <IonCardContent>
                        <IonCardTitle className='ion-text-center'>Register</IonCardTitle>
                        <form >
                           <IonGrid>
                              <IonRow>
                                 <IonCol>
                                    <IonPicker>
                                       <IonPickerColumn value="ClientOrg">
                                          <div slot="prefix">Organisation</div>
                                          <IonPickerColumnOption value="ClientOrg">Client</IonPickerColumnOption>
                                          <IonPickerColumnOption value="LawfirmOrg">Law Firm</IonPickerColumnOption>
                                          <IonPickerColumnOption value="RetailOrg">Retail</IonPickerColumnOption>
                                       </IonPickerColumn>
                                    </IonPicker>
                                 </IonCol>
                                 <IonCol>
                                    <IonPicker>
                                       <IonPickerColumn value="client">
                                          <div slot="prefix">role</div>
                                          <IonPickerColumnOption value="client">client</IonPickerColumnOption>
                                       </IonPickerColumn>
                                    </IonPicker>
                                 </IonCol>
                              </IonRow>
                              <IonRow>
                                 <IonInput className="ion-margin-botoom" labelPlacement='floating' label='User Name' type='text' placeholder='John' fill='outline'></IonInput>
                                 <IonInput className="ion-margin-top" labelPlacement='floating' label='Email' type='email' placeholder='email@example.com' fill='outline'></IonInput>
                                 <IonCol>
                                    <IonInput className="ion-margin-top" labelPlacement='floating' label='Password' type='password' fill='outline'>
                                       <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                                    </IonInput>
                                 </IonCol>
                                 <IonCol>
                                    <IonInput className="ion-margin-top" labelPlacement='floating' label='Renter Password' type='password' fill='outline'>
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
                  </IonCol>
               </IonRow>
            </IonGrid>
         </IonCardContent>
      </>
   );
};

export default Register;