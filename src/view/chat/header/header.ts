import './header.scss';
import { createHTMLElement } from '../../../util/html-utils';
import Pages from '../../../routing/pages';
import Router from '../../../routing/router';
import UserService from '../../../services/user-service';
import * as Constants from '../../../constants';

export default class Header {
  private router: Router;

  private chatService: UserService;

  constructor(router: Router, chatService: UserService) {
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
      this.aboutButtonClickHandler.bind(this, `${Pages.ABOUT}`)
    );

    const logoutButton = createHTMLElement('button');
    logoutButton.textContent = Constants.BUTTONS.LOGOUT_BUTTON;
    logoutButton.addEventListener(
      'click',
      this.logoutButtonHandler.bind(this, `${Pages.LOGIN}`)
    );

    container.append(username, title, aboutButton, logoutButton);
    header.append(container);
    document.querySelector('body')?.append(header);
  }

  public aboutButtonClickHandler(url: string) {
    this.router.navigate(url);
  }

  public logoutButtonHandler(url: string) {
    const login = sessionStorage.getItem('user')!;
    const password = sessionStorage.getItem('password')!;
    sessionStorage.clear();
    this.router.navigate(url);
    this.chatService.logout({ login, password });
  }

  private getUserName() {
    return sessionStorage.getItem('user');
  }
}
