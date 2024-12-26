import createHTMLElement from '../../util/element-creator';
import loginPic from '../../assets/11155.jpg';
import './login.scss';
import FormInputBuilder from './input/formInput';
import { createSvgLockIcon, createSvgPersonIcon } from '../../util/create-svg';
import Router from '../../routing/router';
import Pages from '../../routing/pages';
import WebSocketClient from '../websocket';
import ChatPageView from '../chat/chat';

export default class LoginView {
  private WELCOME_PHRASE = 'LOGIN';

  private NAME_PLACEHOLDER = 'Please, enter your name';

  private PASSWORD_PLACEHOLDER = 'Please, enter your password';

  private NAME_REGEX = `[a-zA-Z]{1,}[a-zA-Z \\-']{1,9}`;

  private PASSWORD_REGEX = `[a-zA-Z0-9]{4,10}`;

  private router: Router;

  private websocket: WebSocketClient;

  constructor(router: Router, websocket: WebSocketClient) {
    this.router = router;
    this.websocket = websocket;
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
    button.value = 'Sing in';
    form.append(userNameInput, passwordInput, button);

    formPic.append(img);
    formBox.append(h2, form);

    document.querySelector('main')?.remove();
    document.querySelector('header')?.remove();

    main.append(formPic, formBox);

    return main;
  }

  public delete() {
    document.querySelector('main')?.remove();
  }

  private createErrorMessage(message: string) {
    const wrapper = createHTMLElement('div', 'wrapper');
    const div = createHTMLElement('div', 'error-message');
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
    this.router.navigate(`${Pages.CHAT}`);

    this.websocket.setOnMessageCallback((message) => {
      if (message.type === 'ERROR') {
        this.createErrorMessage(message.payload.error!);
      } else if (message.type === 'USER_LOGIN') {
        console.log('remove login view part');
        document.querySelector('main')?.remove();
        const chatView = new ChatPageView();
        document.querySelector('body')!.append(chatView.create());
      }
    });
  }
}
