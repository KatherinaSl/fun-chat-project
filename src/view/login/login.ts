import './login.scss';
import './error.scss';
import createHTMLElement from '../../util/element-creator';
import loginPic from '../../assets/11155.jpg';
import FormInputBuilder from '../../util/build-input';
import { createSvgLockIcon, createSvgPersonIcon } from '../../util/create-svg';
import Router from '../../routing/router';
import Pages from '../../routing/pages';
import WebSocketClient from '../websocket';
import ChatService from '../../services/chat-service';
import * as Constants from '../../constants';

export default class LoginView {
  private WELCOME_PHRASE = 'LOGIN';

  private NAME_PLACEHOLDER = 'Please, enter your name';

  private PASSWORD_PLACEHOLDER = 'Please, enter your password';

  private NAME_REGEX = `[a-zA-Z]{1,}[a-zA-Z \\-']{1,9}`;

  private PASSWORD_REGEX = `[a-zA-Z0-9]{4,10}`;

  private router: Router;

  private websocket: WebSocketClient;

  private chatService: ChatService;

  constructor(
    router: Router,
    websocket: WebSocketClient,
    chatService: ChatService,
  ) {
    this.router = router;
    this.websocket = websocket;
    this.chatService = chatService;
    this.chatService.addMessageHandler('ERROR', (msg) =>
      this.createErrorMessage(msg.payload!.error!),
    );
    this.chatService.addMessageHandler('USER_LOGIN', () => {
      this.router.navigate(`${Pages.CHAT}`);
    });
  }

  public create(): Node {
    const main = createHTMLElement('main');
    const h2 = createHTMLElement('h1');
    h2.textContent = this.WELCOME_PHRASE;
    const formBox = createHTMLElement('div', 'form-box');
    const formPic = createHTMLElement('div', 'login-img');
    const img = createHTMLElement('img') as HTMLImageElement;
    img.src = loginPic as string;
    const form = createHTMLElement('form') as HTMLFormElement;
    form.action = '';
    form.addEventListener('submit', this.loginClickHandler.bind(this));

    const userNameInput = new FormInputBuilder()
      .setId('username-input')
      .setName('username')
      .setPattern(this.NAME_REGEX)
      .setPlaceholder(this.NAME_PLACEHOLDER)
      .setRequirements(this.getLoginFieldRequirement('name', 2))
      .setType('text')
      .setAutocomplete('username')
      .setSvgLabel(createSvgPersonIcon())
      .build();

    const passwordInput = new FormInputBuilder()
      .setId('password-input')
      .setName('password')
      .setPattern(this.PASSWORD_REGEX)
      .setPlaceholder(this.PASSWORD_PLACEHOLDER)
      .setRequirements(this.getPasswordFieldRequirement('password', 4))
      .setType('password')
      .setAutocomplete('current-password')
      .setSvgLabel(createSvgLockIcon())
      .build();

    const button = createHTMLElement('input', 'submit') as HTMLInputElement;
    button.type = 'submit';
    button.value = Constants.BUTTONS.SIGNIN_BUTTON;

    const aboutButton = createHTMLElement('button');
    aboutButton.textContent = Constants.APP_PAGES.ABOUT_PAGE;

    form.append(userNameInput, passwordInput, button, aboutButton);
    document.body.appendChild(form);
    formPic.append(img);
    formBox.append(h2, form);

    document.querySelector('main')?.remove();
    document.querySelector('header')?.remove();
    document.querySelector('footer')?.remove();

    main.append(formPic, formBox);

    aboutButton.addEventListener(
      'click',
      this.aboutButtonClickHandler.bind(this, `${Pages.ABOUT}`),
    );
    return main;
  }

  public delete() {
    document.querySelector('main')?.remove();
  }

  private createErrorMessage(message: string) {
    const wrapper = createHTMLElement('div', 'wrapper');
    const div = createHTMLElement('div', 'error');
    const p = createHTMLElement('p');
    const button = createHTMLElement('button');
    button.textContent = 'OK';
    button.addEventListener('click', () => {
      wrapper.remove();
    });
    p.textContent = message;
    div.append(p, button);
    wrapper.append(div);
    document.querySelector('body')?.append(wrapper);
  }

  private getLoginFieldRequirement(name: string, minLength: number): string {
    const firstRequirement = `Your ${name} should consist of only English alphabet letters.`;
    const secondRequirement =
      'You don’t allowed for numerical digits and underscores.';
    const thirdRequirement = `Your ${name} must have at least ${minLength} characters and maximum 10 characters.`;
    return `${firstRequirement}\n${secondRequirement}\n${thirdRequirement}`;
  }

  private getPasswordFieldRequirement(name: string, minLength: number): string {
    const firstRequirement = `Your ${name} should consist of only English alphabet letters.`;
    const secondRequirement = `Your password must have at least ${minLength} characters  and maximum 10 characters`;
    return `${firstRequirement}\n${secondRequirement}`;
  }

  public loginClickHandler(event: Event) {
    event.preventDefault();
    const userLogin = (
      document.querySelector('#username-input') as HTMLInputElement
    )?.value;
    const userPassword = (
      document.querySelector('#password-input') as HTMLInputElement
    )?.value;
    this.chatService.login({ login: userLogin, password: userPassword });
    this.setUserInfo(userLogin, userPassword);
  }

  public aboutButtonClickHandler(url: string) {
    this.router.navigate(url);
  }

  private setUserInfo(login: string, password: string) {
    sessionStorage.setItem('user', login);
    sessionStorage.setItem('password', password);
  }
}
