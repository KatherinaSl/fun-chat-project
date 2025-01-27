import './login.scss';
import './error.scss';
import { createHTMLElement, removeHTMLElements } from '../../util/html-utils';
import loginPic from '../../assets/11155.jpg';
import FormInputBuilder from '../../util/build-input';
import { createSvgLockIcon, createSvgPersonIcon } from '../../util/create-svg';
import Router from '../../routing/router';
import Pages from '../../routing/pages';
import UserService from '../../services/user-service';
import * as Constants from '../../constants';
import HandlersRegistry from '../../services/handlers-registry';

export default class LoginView {
  private NAME_REGEX = `[a-zA-Z]{1,}[a-zA-Z \\-']{1,9}`;

  private PASSWORD_REGEX = `[a-zA-Z0-9]{4,10}`;

  private router: Router;

  private userService: UserService;

  constructor(
    router: Router,
    userService: UserService,
    registry: HandlersRegistry
  ) {
    this.router = router;
    this.userService = userService;
    registry.addMessageHandler(Constants.SOCKET_MSG_TYPE.ERROR, (msg) =>
      this.createErrorMessage(msg.payload!.error!)
    );
    registry.addMessageHandler(Constants.SOCKET_MSG_TYPE.USER_LOGIN, () => {
      this.router.navigate(`${Pages.CHAT}`);
    });
  }

  public create(): Node {
    const main = createHTMLElement('main');
    const h2 = createHTMLElement('h1');
    h2.textContent = Constants.LOGIN_PHRASE;

    const formBox = createHTMLElement('div', 'form-box');
    const formPic = createHTMLElement('div', 'login-img');
    const img = createHTMLElement('img') as HTMLImageElement;
    img.src = loginPic as string;
    const form = createHTMLElement('form') as HTMLFormElement;
    form.action = '';
    form.addEventListener('submit', this.loginClickHandler.bind(this));

    const { userNameInput, passwordInput } = this.createInputForm();

    const button = createHTMLElement('input', 'submit') as HTMLInputElement;
    button.type = 'submit';
    button.value = Constants.BUTTONS.SIGNIN_BUTTON;

    const aboutButton = createHTMLElement('button');
    aboutButton.textContent = Constants.APP_PAGES.ABOUT_PAGE;
    aboutButton.addEventListener(
      'click',
      this.aboutButtonClickHandler.bind(this, `${Pages.ABOUT}`)
    );

    form.append(userNameInput, passwordInput, button, aboutButton);
    document.body.appendChild(form);
    formPic.append(img);
    formBox.append(h2, form);

    removeHTMLElements(['header', 'main', 'footer']);

    main.append(formPic, formBox);
    return main;
  }

  public loginClickHandler(event: Event) {
    event.preventDefault();
    const userLogin = (
      document.querySelector('#username-input') as HTMLInputElement
    )?.value;
    const userPassword = (
      document.querySelector('#password-input') as HTMLInputElement
    )?.value;
    this.userService.login({ login: userLogin, password: userPassword });
    this.setUserInfo(userLogin, userPassword);
  }

  public aboutButtonClickHandler(url: string) {
    this.router.navigate(url);
  }

  private createInputForm() {
    const userNameInput = new FormInputBuilder('username-input')
      .setPattern(this.NAME_REGEX)
      .setPlaceholder(Constants.NAME_PLACEHOLDER)
      .setRequirements(this.getLoginFieldRequirement('name', 2))
      .setAutocomplete('username')
      .setSvgLabel(createSvgPersonIcon())
      .build();

    const passwordInput = new FormInputBuilder('password-input')
      .setPattern(this.PASSWORD_REGEX)
      .setPlaceholder(Constants.PASSWORD_PLACEHOLDER)
      .setRequirements(this.getPasswordFieldRequirement('password', 4))
      .setType('password')
      .setAutocomplete('current-password')
      .setSvgLabel(createSvgLockIcon())
      .build();
    return { userNameInput, passwordInput };
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

  private setUserInfo(login: string, password: string) {
    sessionStorage.setItem('user', login);
    sessionStorage.setItem('password', password);
  }
}
