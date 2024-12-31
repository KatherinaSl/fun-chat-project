import './header.scss';
import createHTMLElement from '../../../util/element-creator';
import Pages from '../../../routing/pages';
import Router from '../../../routing/router';
import ChatService from '../../../services/chat-service';
import * as Constants from '../../../constants';

export default class Header {
  private router: Router;

  private chatService: ChatService;

  constructor(router: Router, chatService: ChatService) {
    this.router = router;
    this.chatService = chatService;
  }

  public create() {
    const header = createHTMLElement('header');
    const container = createHTMLElement('div', 'header__container');
    const username = createHTMLElement('p');
    username.textContent = `User: ${this.getUserName()}`;

    const title = createHTMLElement('h1');
    title.textContent = Constants.APP_NAME;

    const aboutButton = createHTMLElement('button');
    aboutButton.textContent = Constants.APP_PAGES.ABOUT_PAGE;
    aboutButton.addEventListener(
      'click',
      this.aboutButtonClickHandler.bind(this, `${Pages.ABOUT}`),
    );

    const logoutButton = createHTMLElement('button');
    logoutButton.textContent = Constants.BUTTONS.LOGOUT_BUTTON;
    logoutButton.addEventListener(
      'click',
      this.logoutButtonHandler.bind(this, `${Pages.LOGIN}`),
    );

    container.append(username, title, aboutButton, logoutButton);
    header.append(container);
    document.querySelector('body')?.append(header);
  }

  private getUserName() {
    return sessionStorage.getItem('user');
  }

  public aboutButtonClickHandler(url: string) {
    this.router.navigate(url);
  }

  public logoutButtonHandler(url: string) {
    const userLogin = sessionStorage.getItem('user')!;
    const userPassword = sessionStorage.getItem('password')!;
    sessionStorage.clear();
    this.router.navigate(url);
    this.chatService.logout({ login: userLogin, password: userPassword });
  }
}
