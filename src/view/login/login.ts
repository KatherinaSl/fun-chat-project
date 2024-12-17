import createHTMLElement from '../../util/element-creator';
import loginPic from '../../assets/11155.jpg';
import './login.scss';

export default class LoginView {
  private WELCOME_PHRASE = 'LOGIN';

  private NAME_PLACEHOLDER = 'Please, enter your name';

  private PASSWORD_PLACEHOLDER = 'Please, enter your password';

  private NAME_REGEX = `[a-zA-Z]{1,}[a-zA-Z \\-']{1,9}`;

  private PASSWORD_REGEX = `[a-zA-Z0-9]{4,10}`;

  public create(): Node {
    const main = createHTMLElement('main');
    const formBox = createHTMLElement('div', 'form-box');
    const formPic = createHTMLElement('div', 'login-img');
    const img = createHTMLElement('img') as HTMLImageElement;
    img.src = loginPic as string;
    const form = createHTMLElement('form') as HTMLFormElement;
    form.action = '';
    const h2 = createHTMLElement('h1');
    h2.textContent = this.WELCOME_PHRASE;
    const firstInput = this.createInput(
      'firstName',
      this.NAME_PLACEHOLDER,
      this.getLoginFieldRequirement('name', 2),
      this.NAME_REGEX,
    );
    const secondInput = this.createInput(
      'surname',
      this.PASSWORD_PLACEHOLDER,
      this.getPasswordFieldRequirement('password', 4),
      this.PASSWORD_REGEX,
    );
    const button = createHTMLElement('input', 'submit') as HTMLInputElement;
    button.type = 'submit';
    button.value = 'Sing in';
    form.append(h2, firstInput, secondInput, button);
    formPic.append(img);
    formBox.append(form);

    document.querySelector('main')?.remove();
    document.querySelector('header')?.remove();

    main.append(formPic, formBox);
    return main;
  }

  private createInput(
    name: string,
    text: string,
    requirements: string,
    pattern: string,
  ): HTMLElement {
    const divInput = createHTMLElement('div', 'inputbox');
    const input = createHTMLElement('input') as HTMLInputElement;
    input.placeholder = text;
    input.required = true;
    input.pattern = pattern;
    input.type = 'text';
    input.name = name;
    input.oninvalid = (event) => {
      event.preventDefault();
    };
    const divReq = createHTMLElement('div', 'requirements');
    divReq.textContent = requirements;
    divInput.append(input, divReq);
    return divInput;
  }

  private getLoginFieldRequirement(name: string, minLength: number): string {
    const firstRequirement = `Your ${name} should consist of only English alphabet letters.`;
    const secondRequirement =
      'You don’t allowed for numerical digits and underscores';
    const thirdRequirement = `Your ${name} should consist of at least ${minLength} characters and maximum 10 characters`;
    return `${firstRequirement}\n${secondRequirement}\n${thirdRequirement}`;
  }

  private getPasswordFieldRequirement(name: string, minLength: number): string {
    const firstRequirement = `Your ${name} should consist of only English alphabet letters.`;
    const secondRequirement = `Your ${name} should consist of at least ${minLength} characters and maximum 10 characters`;
    return `${firstRequirement}\n${secondRequirement}`;
  }
}
