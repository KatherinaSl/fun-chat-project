import LoginView from './view/login/login';

export default class App {
  private loginView: LoginView | null;

  constructor() {
    this.loginView = null;
  }

  public start() {
    this.createLoginView();
  }

  private createLoginView() {
    this.loginView = new LoginView();
    document.querySelector('body')!.append(this.loginView.create());
  }
}
