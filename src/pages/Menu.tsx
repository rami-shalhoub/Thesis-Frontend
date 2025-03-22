import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Chat from './Chat';
import Share from './Share';
import Signin from './Signin';
import Settings from './Settings';
import { chatbubblesOutline, logOutOutline,personCircle, settings } from 'ionicons/icons';
import './CSS/Menu.css';
import secureShare from '../assets/secureShare.svg'


const Menu: React.FC = () => {
    const pagesTop = [
        { name: "Chat", url: "/chat", icon: chatbubblesOutline },
        { name: "Share", url: "/share", icon: secureShare }
    ];

    const pagesBottom = [
        {name: "Settings", url:"/settings", icon: settings},
        {name: "Signin", url:"/signin", icon: personCircle}
    ]

    return (
        <IonPage>
            <IonSplitPane contentId='main' when="lg">
                <IonMenu contentId='main'>
                    <IonHeader>
                        <IonToolbar color={'secondary'}>
                            <IonTitle>DApp AI</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                         {pagesTop.map((page, index) => (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem routerLink={page.url} routerDirection='none'>
                                    <IonIcon slot='start' icon={page.icon} />
                                    {page.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                    </IonContent>

                    <IonContent>
                        {pagesBottom.map((page, index) => (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem  routerLink={page.url} routerDirection='none'>
                                    <IonIcon slot='start' icon={page.icon} />
                                    {page.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                    </IonContent>

                    <IonMenuToggle autoHide={false}>
                        <IonButton expand='full' routerLink="/" routerDirection='root'>
                            <IonIcon slot='start' icon={logOutOutline} />
                            Logout
                        </IonButton>
                    </IonMenuToggle>
                </IonMenu>

                <IonRouterOutlet id='main'>
                    <Route exact path='/chat' component={Chat} />
                    <Route path='/share' component={Share} />
                    <Route path='/signin' component={Signin}/>
                    <Route path='/settings' component={Settings}/>
                    <Route exact path='/'>
                        <Redirect to='/chat' />
                    </Route>
                </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};

export default Menu;