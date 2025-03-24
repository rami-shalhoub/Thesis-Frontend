//* This is the main Menu where it is always rendered on the right side of the page 
//* it will be always opened on big screens and it can be opened and closed on small screens
//* it contains the Chat page with the chat history, the Secure Share page , User signin logout, and the settings page*/
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, 
		IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenu, 
		IonMenuToggle, IonPage, IonPopover, IonRouterOutlet, IonSearchbar, 
		IonSplitPane, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } 
	from '@ionic/react';
import React, { useState } from 'react';
import { Redirect, Route } from 'react-router';
import Chat from './Chat';
import Share from './Share';
import Settings from './Settings';
import secureShare from '../assets/secureShare.svg'
import LoginModal from './LoginModal';
import { chatbubblesOutline, logOutOutline,menuOutline,personCircle, settings, trashBin } from 'ionicons/icons';
import './CSS/Menu.css';

const Menu: React.FC = () => {
	const userName = "user"
	const chats =[
		{title: "chat 1", date:'01-02-2025'},
		{title: "chat 2", date: '02-02-2025'},
		{title: "chat 3", date: '01-02-2025'}
	]

	//& Search logic
 	const [results, setResults] = useState([...chats]);
	const handleInput = (event: Event) => {
		let query = '';
		const target = event.target as HTMLIonSearchbarElement;
		if (target) query = target.value!.toLowerCase();
		setResults(chats.filter((chat) => chat.title.toLowerCase().includes(query)));
	};

	//& Displaying chats logic
	const groupChatsByDate = (chats: { title: string; date: string }[]) => {
		const groupedChats = new Map<string, { title: string; date: string }[]>();

		chats.forEach((chat) => {
			if (!groupedChats.has(chat.date)) {
				groupedChats.set(chat.date, []);
			}
			groupedChats.get(chat.date)?.push(chat);
		});
		return groupedChats;
	};
	const groupedChats = groupChatsByDate(results);

	return (
	<>
		<IonPage>
			<IonSplitPane contentId='main' when="lg" disabled={true}>
				<IonMenu contentId='main' swipeGesture={false} type='overlay'>
					{/*//& HEADER */}
					<IonHeader>
						<IonToolbar color={'secondary'}>
							<IonTitle>DApp AI</IonTitle>
						</IonToolbar>
					</IonHeader>

					{/* //& Chat History  */}
					<IonContent>
						<IonTitle color={'tertiary'}>Chat History</IonTitle>
						{/* //^ Search Bar */}
						<IonSearchbar 
						  showClearButton="focus"
						  clearIcon={trashBin}
						  debounce={1000}
						  onIonInput={(event) => handleInput(event)}
						/>
						{/* //^ Display the chats and categorize them based on dates*/}
						{Array.from(groupedChats.entries()).map(([date, chats]) => (
							<React.Fragment key={date}>
							<IonItemDivider>
								<IonLabel>{date}</IonLabel>
							</IonItemDivider>
							{chats.map((chat, index) => (
								<IonItemSliding key={index}>
								<IonItemOptions side="start">
									<IonItemOption color="success" expandable>
									Archive
									</IonItemOption>
								</IonItemOptions>

								<IonItem routerDirection='none'>
									<IonLabel>{chat.title}</IonLabel>
								</IonItem>

								<IonItemOptions side="end">
									<IonItemOption color="danger" expandable>
									Delete
									</IonItemOption>
								</IonItemOptions>
								</IonItemSliding>
							))}
							</React.Fragment>
						))}
					</IonContent>
					
					{/* //& User menu */}
					 <IonButton id="cover-trigger" shape='round' fill='outline' >
						<IonIcon slot='icon-only' icon={personCircle} className='ion-padding-end'/>
						{userName}
					</IonButton>
					<IonPopover trigger="cover-trigger" size="auto" side='right' backdropDismiss={true} dismissOnSelect={true}>
						{/* //^ Login in Button  */}
						<IonButton fill='clear' expand='block' onClick={() => document.getElementById('open-login-modal')?.click()}>
							<IonIcon slot='icon-only' icon={personCircle}/>
							Login
						</IonButton>
						
						{/* //^ Settings button */}
						<IonMenuToggle autoHide={false}>
							<IonItem routerLink='/settings' routerDirection='none'>
								<IonIcon icon={settings}/>
								settings
							</IonItem>
						</IonMenuToggle>

						{/* //^ Log out button */}
						<IonMenuToggle autoHide={false}>
						<IonButton expand='full' routerLink="/" routerDirection='root'>
							<IonIcon slot='start' icon={logOutOutline} />
							Logout
						</IonButton>
						</IonMenuToggle>   
					</IonPopover>
					
					{/* //^ Hidden Login button to open the Login Modal while the Popover closes */}
					<IonButton id='open-login-modal' fill='clear' expand='block' style={{ display: 'none'}}>
						<IonIcon slot='icon-only' icon={personCircle}/>
						Sign in
						<LoginModal triggerID='open-login-modal'></LoginModal>
					</IonButton>
				</IonMenu>
					

				{/* //& Bottom tab bar to open the side menu, AI chat, and the secure share */}
				<IonTabs>
					{/*//^ Tab Bar */}
					<IonTabBar slot="bottom">
                        <IonTabButton tab="menu" onClick={() => document.querySelector('ion-menu')?.open()}>
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

					<IonRouterOutlet id='main'>
						<Route exact path='/chat' component={Chat} />
						<Route path='/share' component={Share} />
					</IonRouterOutlet>
				</IonTabs>
				
				{/* //& Routes for the Side Pan */}
				<IonRouterOutlet id='main'>
						<Route exact path='/chat' component={Chat} />
						<Route path='/share' component={Share} />
						<Route path='/settings' component={Settings}/>
						<Route exact path='/'>
							<Redirect to='/chat' />
						</Route>
					</IonRouterOutlet>
			</IonSplitPane>
		</IonPage>
	</>
	);
};

export default Menu;