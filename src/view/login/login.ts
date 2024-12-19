import createHTMLElement from '../../util/element-creator';
import loginPic from '../../assets/11155.jpg';
import './login.scss';
import FormInputBuilder from './input/formInput';
import { createSvgLockIcon, createSvgPersonIcon } from '../../util/create-svg';

export default class LoginView {
  private WELCOME_PHRASE = 'LOGIN';

  private NAME_PLACEHOLDER = 'Please, enter your name';

  private PASSWORD_PLACEHOLDER = 'Please, enter your password';

  private NAME_REGEX = `[a-zA-Z]{1,}[a-zA-Z \\-']{1,9}`;

  private PASSWORD_REGEX = `[a-zA-Z0-9]{4,10}`;

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
}
