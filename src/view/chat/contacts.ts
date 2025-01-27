import './chat.scss';
import { createHTMLElement } from '../../util/html-utils';
import {
  SOCKET_MSG_TYPE,
  SEARCH_PLACEHOLDER,
  USER_STATUS,
} from '../../constants';
import UserService from '../../services/user-service';
import { SocketMessage, User } from '../../data/interfaces';
import { createOnlineIcon } from '../../util/create-svg';
import HandlersRegistry from '../../services/handlers-registry';
import DialogueView from './dialogue';
import ChatMessageService from '../../services/chat-message-service';
import MessageStorageService from '../../services/message-storage-service';

export default class ContactsView {
  private userService: UserService;

  private dialogueView: DialogueView;

  private messageService: ChatMessageService;

  constructor(
    userService: UserService,
    registry: HandlersRegistry,
    dialogueView: DialogueView,
    messageService: ChatMessageService,
    messageStorage: MessageStorageService
  ) {
    this.userService = userService;
    this.dialogueView = dialogueView;
    this.messageService = messageService;

    messageStorage.setUnreadMessageCounterListener(
      this.unreadMessageCounterCallback()
    );
    registry.addMessageHandler(SOCKET_MSG_TYPE.USER_ACTIVE, (msg) => {
      const currentUser = sessionStorage.getItem('user')!;
      this.contactsHandler(msg, currentUser);
    });
    registry.addMessageHandler(SOCKET_MSG_TYPE.USER_INACTIVE, (msg) => {
      this.contactsHandler(msg);
    });
    registry.addMessageHandler(
      SOCKET_MSG_TYPE.USER_EXTERNAL_LOGIN,
      this.userOnlineStatusChangeHandler.bind(this)
    );
    registry.addMessageHandler(
      SOCKET_MSG_TYPE.USER_EXTERNAL_LOGOUT,
      this.userOnlineStatusChangeHandler.bind(this)
    );
  }

  public create(): Node {
    const userList = createHTMLElement('div', 'main__users');
    const form = createHTMLElement('form');
    const input = createHTMLElement('input', 'search-input');
    input.setAttribute('placeholder', SEARCH_PLACEHOLDER);
    input.setAttribute('type', 'text');
    input.addEventListener('keyup', this.searchUserHandler.bind(this));
    form.append(input);
    const ul = createHTMLElement('ul');
    userList.append(form, ul);
    this.userService.requestAllLoginUsers();
    this.userService.requestAllLogoutUsers();
    return userList;
  }

  private contactsHandler(msg: SocketMessage, currentUser?: string) {
    this.fillUsersList(msg);
    this.userService.saveContacts(msg.payload?.users);
    msg.payload?.users
      ?.filter((user) => currentUser !== user.login)
      .forEach((user) => {
        this.messageService.requestMsgHistory(user);
      });
  }

  private userOnlineStatusChangeHandler(msg: SocketMessage) {
    this.createOrUpdateUserRecord(msg.payload!.user!);
    this.userService.updateContact(msg.payload!.user!);
    this.updateUserStatus();
  }

  private unreadMessageCounterCallback(): (
    contact: string,
    counter: number
  ) => void {
    return (contact, counter) => {
      const counterItem = document.querySelector(
        `.main__users li[login="${contact}"] .message-counter`
      );
      if (counterItem) {
        if (counter === 0) {
          counterItem.classList.add('hidden');
        } else {
          counterItem.textContent = counter.toString();
          counterItem.classList.remove('hidden');
        }
      }
    };
  }

  private fillUsersList(msg: SocketMessage) {
    const userLogin = sessionStorage.getItem('user');
    const users = msg.payload?.users!.filter(
      (user) => user.login !== userLogin
    );
    users?.forEach((user) => {
      this.createOrUpdateUserRecord(user);
    });
  }

  private createOrUpdateUserRecord(user: User) {
    const ul = document.querySelector('.main__users ul')!;
    const { login, isLogined } = user;
    let li = document.querySelector(`.main__users li[login="${login}"]`);
    if (!li) {
      li = createHTMLElement('li');
      const span = createHTMLElement('span');
      const counter = createHTMLElement('div', 'message-counter');
      counter.classList.add('hidden');
      li.setAttribute('login', login);
      li.addEventListener('click', this.showUserInfoHandler.bind(this));
      span.textContent = login;
      li.append(span, counter);
      ul.append(li);
    }
    li.setAttribute('status', `${isLogined}`);
    li.querySelector('svg')?.remove();
    li.innerHTML += createOnlineIcon(user?.isLogined);
  }

  private searchUserHandler(event: Event) {
    const value = (event.target as HTMLInputElement)?.value.toLowerCase();
    document.querySelectorAll('.main__users li').forEach((li) => {
      const item = li;
      const userName = (item as HTMLUListElement).innerText;
      if (userName.toLowerCase().indexOf(value) !== -1) {
        (item as HTMLUListElement).style.display = 'flex';
      } else {
        (item as HTMLUListElement).style.display = 'none';
      }
    });
  }

  private showUserInfoHandler(event: Event) {
    document
      .querySelectorAll('.main__users li')
      .forEach((li) => li.classList.remove('selected_user'));

    const li = (event.target as HTMLUListElement).closest('li');
    li?.classList.add('selected_user');
    li?.querySelector('.message-counter')?.classList.add('hidden');
    const login = li?.getAttribute('login') as string;
    const contact = this.userService.getContact(login) as User;
    this.dialogueView.setContact(contact);
  }

  private updateUserStatus() {
    const status = document
      .querySelector('.main__users li')
      ?.getAttribute('status');
    const userName = document.querySelector('.user-name');
    if (userName?.textContent) {
      document.querySelector('.user-status')!.textContent =
        status === 'true' ? USER_STATUS.ONLINE : USER_STATUS.OFFLINE;
    }
  }
}
