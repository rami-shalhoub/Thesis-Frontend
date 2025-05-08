import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonModal } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './components/auth/AuthModal.css';
import BottomMenu from './components/menu/BottomMenu';
import Signin from './components/auth/Signin';
import Register from './components/auth/Register';

setupIonicReact();

/**
 * Main application content that checks authentication status
 * and conditionally renders the appropriate components
 */
const AppContent: React.FC = () => {
   const { isAuthenticated } = useAuth();
   const [activeSegment, setActiveSegment] = useState<'signin' | 'register'>('signin');

   // Prevent modal from being dismissed if not authenticated
   const handleModalDismiss = (e: CustomEvent) => {
      if (!isAuthenticated) {
         e.preventDefault();
      }
   };

   return (
      <IonApp>
         {/* Authentication Modal - Cannot be dismissed until authenticated */}
         <IonModal
            isOpen={!isAuthenticated}
            onDidDismiss={handleModalDismiss}
            backdropDismiss={false}
            className="auth-modal"
         >
            <div className="ion-padding">
               <div className="ion-text-center ion-padding">
                  <h2>Welcome to the App</h2>
                  <p>Please sign in or register to continue</p>
               </div>

               <div className="ion-padding">
                  <div className="segment-container">
                     <div className="segment-buttons">
                        <button
                           className={`segment-button ${activeSegment === 'signin' ? 'active' : ''}`}
                           onClick={() => setActiveSegment('signin')}
                        >
                           Sign In
                        </button>
                        <button
                           className={`segment-button ${activeSegment === 'register' ? 'active' : ''}`}
                           onClick={() => setActiveSegment('register')}
                        >
                           Register
                        </button>
                     </div>
                  </div>

                  <div className="segment-content">
                     {activeSegment === 'signin' ? (
                        <Signin />
                     ) : (
                        <Register />
                     )}
                  </div>
               </div>
            </div>
         </IonModal>

         {/* Main App Content - Only accessible when authenticated */}
         <IonReactRouter basename='/app'>
            <IonRouterOutlet>
               <Route component={BottomMenu} />
            </IonRouterOutlet>
         </IonReactRouter>
      </IonApp>
   );
};

/**
 * Main App component that provides the AuthProvider context
 */
const App: React.FC = () => (
   <AuthProvider>
      <AppContent />
   </AuthProvider>
);

export default App;
