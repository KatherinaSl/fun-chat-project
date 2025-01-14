import './chat.scss';
import createHTMLElement from '../../util/create-element';
import UserService from '../../services/user-service';
import { SocketMessage, User } from '../../data/interfaces';
import { createOnlineIcon } from '../../util/create-svg';
import DialogueView from './dialogue';
import { SEARCH_PLACEHOLDER } from '../../constants';
import ChatMessageService from '../../services/chat-message-service';
import HandlersRegistry from '../../services/handlers-registry';

export default class ChatPageView {
  private userService: UserService;

  private messageService: ChatMessageService;

  private registry: HandlersRegistry;

  constructor(
    userService: UserService,
    messageService: ChatMessageService,
    registry: HandlersRegistry,
  ) {
    this.userService = userService;
    this.messageService = messageService;
    this.registry = registry;
    this.registry.addMessageHandler('USER_ACTIVE', (msg) => {
      this.fillUsersList(msg);
      this.userService.saveContacts(msg.payload?.users);
    });
    registry.addMessageHandler('USER_INACTIVE', (msg) => {
      this.fillUsersList(msg);
      this.userService.saveContacts(msg.payload?.users);
    });
    registry.addMessageHandler('USER_EXTERNAL_LOGIN', (msg) => {
      this.createOrUpdateUserRecord(msg.payload!.user!);
      this.userService.updateContact(msg.payload!.user!);
      DialogueView.updateUserStatus();
    });
    registry.addMessageHandler('USER_EXTERNAL_LOGOUT', (msg) => {
      this.createOrUpdateUserRecord(msg.payload!.user!);
      this.userService.updateContact(msg.payload!.user!);
      DialogueView.updateUserStatus();
    });
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    const userList = createHTMLElement('div', 'main__users');
    const form = createHTMLElement('form');
    const input = createHTMLElement('input', 'search-input');
    input.setAttribute('placeholder', SEARCH_PLACEHOLDER);
    input.setAttribute('type', 'text');
    input.addEventListener('keyup', this.searchUserHandler.bind(this));
    form.append(input);
    const ul = createHTMLElement('ul');
    userList.append(form, ul);

    const dialogueView = new DialogueView(this.messageService, this.registry);
    sessionStorage.setItem('dialogueView', JSON.stringify(dialogueView));

    this.userService.requestAllLoginUsers();
    this.userService.requestAllLogoutUsers();
    main.append(userList, dialogueView.create());
    return main;
  }

  public fillUsersList(msg: SocketMessage) {
    const userLogin = sessionStorage.getItem('user');
    const users = msg.payload?.users!.filter(
      (user) => user.login !== userLogin,
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
      li.setAttribute('login', login);
      li.addEventListener('click', this.showUserInfoHandler.bind(this));
      li.textContent = login;
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

    const login = li?.textContent as string;
    const contact = this.userService.getContact(login);
    const dialogue = new DialogueView(
      this.messageService,
      this.registry,
      contact,
    );
    sessionStorage.setItem('dialogue', JSON.stringify(dialogue));
    document.querySelector('.main__chat')?.remove();
    document.querySelector('.main__container')?.append(dialogue.create());
  }
}
