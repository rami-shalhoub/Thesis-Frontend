import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { menuOutline, chatbubblesOutline } from 'ionicons/icons';
import React from 'react';
import { Route, Redirect } from 'react-router';
import Chat from '../../pages/Chat';
import Settings from '../../pages/Settings';
import Share from '../../pages/Share';
import secureShare from '../../assets/secureShare.svg'
import SideMenu from './SideMenu';

const BottomMenu: React.FC = () => {

    return (
        <>
            <IonPage id='main'>
                {/* //& Bottom tab bar to open the side menu, AI chat, and the secure share */}
                <IonTabs>
                    {/*//^ Tab Bar */}
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="menu" onClick={() => {
                            const menu = document.querySelector('ion-menu');
                            if (menu) {
                                (menu as HTMLIonMenuElement).isOpen().then(isOpen => {
                                    if (isOpen) {
                                        (menu as HTMLIonMenuElement).close();
                                    } else {
                                        (menu as HTMLIonMenuElement).open();
                                    }
                                });
                            }
                        }}>
                            <IonIcon icon={menuOutline} />
                            <IonLabel>Menu</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="chat" href="/chat">
                            <IonIcon icon={chatbubblesOutline} />
                            <IonLabel>Chat</IonLabel>
                        </IonTabButton>

                        <IonTabButton tab="share" href="/share">
                            <IonIcon icon={secureShare} />
                            <IonLabel>Share</IonLabel>
                        </IonTabButton>
                    </IonTabBar>

                    {/* //& Routes for the Side Pan */}
                    <IonRouterOutlet id='main'>
                        <Route exact path='/chat' component={Chat} />
                        <Route path='/share' component={Share} />
                        <Route path='/settings' component={Settings} />
                        <Route exact path='/'>
                            <Redirect to='/chat' />
                        </Route>
                    </IonRouterOutlet>
                </IonTabs>
            </IonPage>
            {/* //& Side Menu */}
            <SideMenu />
        </>
    );
};

export default BottomMenu;