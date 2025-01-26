import './dialogue.scss';
import './chat.scss';
import { Message, User } from '../../data/interfaces';
import createHTMLElement from '../../util/create-element';
import * as Constants from '../../constants';
import ChatMessageService from '../../services/chat-message-service';
import getConvertedTime from '../../util/date-util';
import {
  createDeliveredIcon,
  createMenuIcon,
  createReadIcon,
} from '../../util/create-svg';
import MessageStorageService from '../../services/message-storage-service';

export default class DialogueView {
  private user?: User;

  private messageService: ChatMessageService;

  private messageStorage: MessageStorageService;

  constructor(
    messageService: ChatMessageService,
    messageStorage: MessageStorageService,
    user?: User
  ) {
    this.user = user;
    this.messageService = messageService;
    this.messageStorage = messageStorage;

    this.messageStorage.setMessageListener(
      Constants.MESSAGE_ACTIONS.NEW_MESSAGE,
      (message) => {
        if (this.user) {
          this.showMessage(message);

          if (!message.status?.isReaded && message.from === this.user?.login) {
            this.messageService.sendReadStatus(message.id!);
            this.messageStorage.resetUnreadMessageCounter(this.user.login);
          }
        }
      }
    );

    this.messageStorage.setMessageListener(
      Constants.MESSAGE_ACTIONS.DELIVER,
      (message) => {
        const deliveredMsgStatus = document.querySelector(
          `#msg_${message.id} .message__status`
        );
        if (deliveredMsgStatus) {
          deliveredMsgStatus.innerHTML = createDeliveredIcon();
        }
      }
    );

    this.messageStorage.setMessageListener(
      Constants.MESSAGE_ACTIONS.READ,
      (message) => {
        const readMsgStatus = document.querySelector(
          `#msg_${message.id}.message_right .message__status`
        );

        if (readMsgStatus) {
          readMsgStatus.innerHTML = createReadIcon();
        }
      }
    );
  }

  public create() {
    const messageField = createHTMLElement('div', 'main__chat');
    const userInfo = createHTMLElement('div', 'main__chat__user');

    const icon = createHTMLElement('div', 'icon-wrapper');
    icon.addEventListener('click', this.burgerIconHandler.bind(this));
    icon.innerHTML = createMenuIcon();

    const userName = createHTMLElement('p', 'user-name');
    const userStatus = createHTMLElement('p', 'user-status');
    userInfo.append(icon, userName, userStatus);
    const dialogue = createHTMLElement('div', 'main__chat__dialogue');
    const selectUserElement = createHTMLElement('p', 'welcome-message');
    selectUserElement.textContent = Constants.CHOOSE_USER_MSG;
    dialogue.append(selectUserElement);
    const msgField = createHTMLElement('div', 'main__chat__msg');
    const msgInput = createHTMLElement(
      'input',
      'input-message'
    ) as HTMLInputElement;
    msgInput.setAttribute('type', 'text');
    msgInput.setAttribute('placeholder', Constants.MSG_PLACEHOLDER);
    msgInput.addEventListener('keypress', this.inputMessageHandler.bind(this));
    const sendButton = createHTMLElement('button') as HTMLButtonElement;
    sendButton.textContent = Constants.BUTTONS.SEND_BUTTON;
    sendButton.addEventListener('click', this.inputMessageHandler.bind(this));
    sendButton.disabled = true;
    msgInput.disabled = true;

    msgField.append(msgInput, sendButton);
    messageField.append(userInfo, dialogue, msgField);
    return messageField;
  }

  public setContact(user: User) {
    this.user = user;
    const userStatus = document.querySelector('.user-status');
    const userName = document.querySelector('.user-name');
    document
      .querySelectorAll('.message')
      .forEach((message) => message.remove());
    userStatus!.textContent = this.user.isLogined
      ? Constants.USER_STATUS.ONLINE
      : Constants.USER_STATUS.OFFLINE;
    userName!.textContent = this.user.login;
    if (!document.querySelector('.welcome-message')) {
      this.createWelcomingMessage();
    }

    (
      document.querySelector('.main__chat__msg button') as HTMLButtonElement
    ).disabled = false;

    (document.querySelector('.input-message') as HTMLInputElement).disabled =
      false;

    const messageHistory = this.messageStorage.getMessageHistory(this.user!);
    messageHistory?.forEach((message) => {
      this.showMessage(message);
      if (!message.status?.isReaded && message.from === this.user?.login) {
        this.messageService.sendReadStatus(message.id!);
      }
    });
    this.messageStorage.resetUnreadMessageCounter(this.user.login);
  }

  private burgerIconHandler(event: Event) {
    const icon = (event.target as HTMLDivElement).closest('div')!;
    icon.classList.toggle('transform');
    document.querySelector('.main__users')?.classList.toggle('open');
  }

  private createWelcomingMessage() {
    const selectUserElement = createHTMLElement('p', 'welcome-message');
    selectUserElement.textContent = Constants.START_DIALOGUE_MSG;
    document.querySelector('.main__chat__dialogue')?.append(selectUserElement);
  }

  private inputMessageHandler(event: KeyboardEvent | MouseEvent) {
    const recipient = document.querySelector('.user-name')!
      .textContent as string;
    const input = document.querySelector('.input-message') as HTMLInputElement;
    if (input.value) {
      if (
        (event instanceof KeyboardEvent &&
          (event as KeyboardEvent).key === 'Enter') ||
        event instanceof MouseEvent
      ) {
        this.messageService.sendMsg({ to: recipient, text: input.value });
        input.value = '';
      }
    }
  }

  private showMessage(message: Message) {
    document.querySelector('.welcome-message')?.remove();
    const messages = document.querySelector('.main__chat__dialogue');
    const msgContainer = createHTMLElement('div', 'message');
    msgContainer.id = `msg_${message.id!}`;
    msgContainer!.classList.add(
      `${message.to === this.user?.login ? 'message_right' : 'message_left'}`
    );
    const userInfo = createHTMLElement('p', 'message__user');
    const msgUser = createHTMLElement('span');
    msgUser.innerText = message.from as string;
    const msgTime = createHTMLElement('span', 'message__time');

    if (message.datetime) {
      const time = getConvertedTime(message.datetime);
      msgTime.textContent = time;
    }

    userInfo.append(msgUser, msgTime);
    const msgText = createHTMLElement('p');
    msgText.innerText = message.text as string;

    const msgStatus = createHTMLElement('div', 'message__status');

    if (message.status?.isDelivered && message.to === this.user?.login) {
      msgStatus.innerHTML = createDeliveredIcon();
    }

    if (message.status?.isReaded && message.to === this.user?.login) {
      msgStatus.innerHTML = createReadIcon();
    }

    msgContainer.append(userInfo, msgText, msgStatus);
    messages?.append(msgContainer);

    messages?.scrollTo(0, messages.scrollHeight);
  }
}
