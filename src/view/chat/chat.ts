import './chat.scss';
import createHTMLElement from '../../util/element-creator';
import ChatService from '../../services/chat-service';
import { Message } from '../../data/interfaces';
import { creatOnlineIcon, creatOfflineIcon } from '../../util/create-svg';
import DialogueView from './dialogue';

export default class ChatPageView {
  private chatService: ChatService;

  PLACEHOLDER = 'Search...';

  constructor(chatService: ChatService) {
    this.chatService = chatService;
    this.chatService.addMessageHandler('USER_ACTIVE', (msg) => {
      this.fillUsersList(msg);
    });
    this.chatService.addMessageHandler('USER_INACTIVE', (msg) => {
      this.fillUsersList(msg);
    });
    this.chatService.addMessageHandler('USER_EXTERNAL_LOGIN', (msg) => {
      this.getThirdPartyUser(msg);
    });
    this.chatService.addMessageHandler('USER_EXTERNAL_LOGOUT', (msg) => {
      this.getThirdPartyUser(msg);
    });
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    const userList = createHTMLElement('div', 'main__users');
    const form = createHTMLElement('form');
    const input = createHTMLElement('input', 'search-form');
    input.setAttribute('placeholder', this.PLACEHOLDER);
    input.setAttribute('type', 'text');
    input.addEventListener('keyup', this.searchUserHandler.bind(this));
    form.append(input);
    const ul = createHTMLElement('ul');
    userList.append(form, ul);

    const dialogueView = new DialogueView();

    this.chatService.getAllLoginUsers();
    this.chatService.getAllLogoutUsers();
    main.append(userList, dialogueView.create());
    return main;
  }

  public fillUsersList(msg: Message) {
    const ul = document.querySelector('.main__users ul');
    const userLogin = sessionStorage.getItem('user');
    const users = msg.payload?.users!.filter(
      (user) => user.login !== userLogin,
    );
    users?.forEach((user) => {
      const li = createHTMLElement('li');
      li.addEventListener('click', this.showUserInfoHandler.bind(this));
      li.textContent = user.login;
      if (user.isLogined === true) {
        li.innerHTML += creatOnlineIcon();
      } else {
        li.innerHTML += creatOfflineIcon();
      }
      ul?.append(li);
    });
  }

  public getThirdPartyUser(msg: Message) {
    const allUsers = document.querySelectorAll('.main__users li');
    const user = msg.payload?.user;

    if (allUsers.length === 0) {
      const listItem = createHTMLElement('li');
      listItem.addEventListener('click', this.showUserInfoHandler.bind(this));
      listItem.textContent = user!.login;
      listItem.innerHTML += creatOnlineIcon();
      document.querySelector('.main__users ul')?.append(listItem);
    } else if (user?.isLogined) {
      const loginUser = user.login;
      allUsers.forEach((li) => {
        if (li.textContent === loginUser) {
          const item = li;
          item.querySelector('svg')?.remove();
          item.innerHTML += creatOnlineIcon();
        }
      });
    } else {
      const logoutUser = user?.login;
      allUsers.forEach((li) => {
        if (li.textContent === logoutUser) {
          const item = li;
          item.querySelector('svg')?.remove();
          item.innerHTML += creatOfflineIcon();
        }
      });
    }
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
    console.log(event.target);
    const user = (event.target as HTMLUListElement).textContent as string;
    console.log(user);
    const dialogue = new DialogueView(user);
    document.querySelector('.main__chat')?.remove();
    document
      .querySelector('.main__container')
      ?.append(dialogue.createDialogue(user));
  }
}
