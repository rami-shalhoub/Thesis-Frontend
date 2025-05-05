import { IonButton, IonIcon, IonInput } from '@ionic/react';
import { send } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import './MessageInput.css';

interface MessageInputProps {
   onSendMessage: (text: string) => void;
   position: 'center' | 'bottom';
   autoFocus?: boolean;
   disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, position, autoFocus = false, disabled = false }) => {
   const [inputText, setInputText] = useState('');
   const inputRef = useRef<HTMLIonInputElement>(null);

   const handleSendMessage = () => {
      if (inputText.trim() === '') return;
      onSendMessage(inputText);
      setInputText('');
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSendMessage();
      }
   };

   return (
      <div className={`message-input-container ${position === 'center' ? 'center-position' : 'bottom-position'}`}>
         <IonInput
            ref={inputRef}
            value={inputText}
            onIonInput={(e) => setInputText(e.detail.value || '')}
            onKeyUp={handleKeyPress}
            placeholder="Type your message here..."
            className="message-input"
            aria-label="Type your message here"
            autoFocus={autoFocus}
            disabled={disabled}
         />
         <IonButton
            fill="clear"
            onClick={handleSendMessage}
            disabled={inputText.trim() === '' || disabled}
            className="send-button"
         >
            <IonIcon icon={send} />
         </IonButton>
      </div>
   );
};

export default MessageInput;
