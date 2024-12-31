import './chat.scss';
import createHTMLElement from '../../util/element-creator';
import ChatService from '../../services/chat-service';
import { Message } from '../../data/interfaces';
import { creatOnlineIcon, creatOfflineIcon } from '../../util/create-svg';

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
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    const userList = createHTMLElement('div', 'main__users');
    const input = createHTMLElement('input', 'search-form');
    input.setAttribute('placeholder', this.PLACEHOLDER);
    const messageField = createHTMLElement('div', 'main__chat');
    userList.append(input);
    this.chatService.getAllLoginUsers();
    this.chatService.getAllLogoutUsers();
    main.append(userList, messageField);
    return main;
  }

  public fillUsersList(msg: Message) {
    const div = document.querySelector('.main__users');
    const userLogin = sessionStorage.getItem('user');
    const onlineUsers = msg.payload?.users!.filter(
      (user) => user.login !== userLogin,
    );
    const ul = createHTMLElement('ul');
    onlineUsers?.forEach((user) => {
      const li = createHTMLElement('li');
      li.textContent = user.login;
      if (user.isLogined === true) {
        li.innerHTML += creatOnlineIcon();
      } else {
        li.innerHTML += creatOfflineIcon();
      }
      ul.append(li);
    });

    div?.append(ul);
  }
}
