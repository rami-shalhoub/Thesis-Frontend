//* This is the main Menu where it is always rendered on the right side of the page 
//* it will be always opened on big screens and it can be opened and closed on small screens
//* it contains the Chat page with the chat history, the Secure Share page , User signin logout, and the settings page*/
import {
	IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider,
	IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonMenu,
	IonRow, IonSearchbar,
	IonSplitPane, IonTitle, IonToolbar
}
	from '@ionic/react';
import React, { useState } from 'react';
import newChat from '../../assets/newChat.svg';
import { logoIonic, trashBin } from 'ionicons/icons';
import './Menu.css';
import UserMenu from './UserMenu';


const Menu: React.FC = () => {
	const chats = [
		{ title: "chat 1", date: '01-02-2025' },
		{ title: "chat 2", date: '02-02-2025' },
		{ title: "chat 3", date: '01-02-2025' }
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

			<IonSplitPane contentId='main' when="lg" disabled={true}>
				<IonMenu contentId='main' swipeGesture={false} type='push'>
					{/*//& HEADER */}
					<IonHeader>
						<IonToolbar color={'secondary'}>
							<IonTitle>
								<IonIcon icon={logoIonic} className='ion-padding-end' />
								AI DApp
							</IonTitle>
						</IonToolbar>
					</IonHeader>
					
					{/* //& Chat History  */}
					<IonContent>
                  <IonGrid>
                     <IonRow>
                        <IonCol>
                           <IonTitle color={'tertiary'} className='ion-padding'>Chat History</IonTitle>
                        </IonCol>
                        <IonCol offset='3' className='ion-padding-top'>
                            <IonButton color={'danger'}>
                              <IonIcon icon={trashBin}></IonIcon>
                           </IonButton>
                        </IonCol>
                     </IonRow>
                  </IonGrid>						
                  
						{/* //^ Search Bar */}
						<IonSearchbar
							color={'light'}
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

					{/* //& New Chat button */}
					<IonButton routerLink='/chat' routerDirection='none' className='ion-padding ion-margin-top' shape='round' fill='solid' expand='full'>
						New Chat
						<IonIcon icon={newChat} slot='start' />
					</IonButton>
               {/* //& User menu */}
               <UserMenu></UserMenu>
				</IonMenu>
			</IonSplitPane>
		</>
	);
};

export default Menu;