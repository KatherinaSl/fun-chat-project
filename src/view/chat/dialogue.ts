import { Message, SocketMessage, User } from '../../data/interfaces';
import createHTMLElement from '../../util/create-element';
import './dialogue.scss';
import './chat.scss';
import * as Constants from '../../constants';
import ChatMessageService from '../../services/chat-message-service';
import HandlersRegistry from '../../services/handlers-registry';
import getConvertedTime from '../../util/date-util';
import { createDeliveredIcon } from '../../util/create-svg';

export default class DialogueView {
  private user?: User;

  private messageService: ChatMessageService;

  private count: number = 0;

  constructor(
    messageService: ChatMessageService,
    registry: HandlersRegistry,
    user?: User,
  ) {
    this.user = user;
    this.messageService = messageService;
    registry.addMessageHandler('MSG_SEND', (msg) => {
      if (
        msg.payload?.message?.from === this.user?.login ||
        msg.payload?.message?.from === sessionStorage.getItem('user')
      ) {
        this.showMessage(msg.payload?.message as Message);
      } else if (msg.payload?.message?.from !== this.user?.login) {
        //  todo redo
        this.createMessageCounter(msg);
      }
    });

    registry.addMessageHandler('MSG_FROM_USER', (msg) => {
      console.log(msg);
      msg.payload?.messages?.forEach((message) => {
        this.showMessage(message);
        if (message.status?.isDelivered) {
          console.log(message.text);
        }
      });
    });

    registry.addMessageHandler('MSG_DELIVER', (message) => {
      console.log(message.payload?.message?.status?.isDelivered);
    });
  }

  public create() {
    const messageField = createHTMLElement('div', 'main__chat');
    const userInfo = createHTMLElement('div', 'main__chat__user');
    const userName = createHTMLElement('p', 'user-name');
    const userStatus = createHTMLElement('p', 'user-status');
    userInfo.append(userName, userStatus);
    const dialogue = createHTMLElement('div', 'main__chat__dialogue');
    const selectUserElement = createHTMLElement('p', 'welcome-message');
    dialogue.append(selectUserElement);
    const msgField = createHTMLElement('div', 'main__chat__msg');
    const msgInput = createHTMLElement(
      'input',
      'input-message',
    ) as HTMLInputElement;
    msgInput.setAttribute('type', 'text');
    msgInput.setAttribute('placeholder', Constants.MSG_PLACEHOLDER);
    msgInput.addEventListener('keypress', this.inputMessageHandler.bind(this));
    const sendButton = createHTMLElement('button') as HTMLButtonElement;
    sendButton.textContent = Constants.BUTTONS.SEND_BUTTON;
    sendButton.addEventListener('click', this.inputMessageHandler.bind(this));

    if (this.user) {
      userStatus.textContent = this.user.isLogined
        ? Constants.USER_STATUS.ONLINE
        : Constants.USER_STATUS.OFFLINE;
      userName.textContent = this.user.login;
      selectUserElement.textContent = Constants.START_DIALOGUE_MSG;
      this.messageService.fetchMsgHistory(this.user);
    } else {
      selectUserElement.textContent = Constants.CHOOSE_USER_MSG;
      sendButton.disabled = true;
      msgInput.disabled = true;
    }

    msgField.append(msgInput, sendButton);
    messageField.append(userInfo, dialogue, msgField);
    return messageField;
  }

  public static updateUserStatus() {
    const status = document
      .querySelector('.main__users li')
      ?.getAttribute('status');
    const userName = document.querySelector('.user-name');
    if (userName?.textContent) {
      document.querySelector('.user-status')!.textContent =
        status === 'true'
          ? Constants.USER_STATUS.ONLINE
          : Constants.USER_STATUS.OFFLINE;
    }
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
    msgContainer!.classList.add(
      `${message.to === this.user?.login ? 'message_right' : 'message_left'}`,
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

    if (message.status?.isDelivered) {
      msgStatus.innerHTML += createDeliveredIcon();
    }

    msgContainer.append(userInfo, msgText, msgStatus);
    messages?.append(msgContainer);

    messages?.scrollTo(0, messages.scrollHeight);
  }

  private createMessageCounter(msg: SocketMessage) {
    document.querySelectorAll('.main__users li').forEach((liItem) => {
      if (liItem.getAttribute('login') === msg.payload?.message?.from) {
        liItem.querySelector('.message-counter')?.remove();
        const span = createHTMLElement('span', 'message-counter');
        this.count += 1;
        span.textContent = this.count.toString();
        liItem?.append(span);
      }
    });
  }
}
