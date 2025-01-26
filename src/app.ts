import LoginView from './view/login/login';
import ChatView from './view/chat/chat';
import UserService from './services/user-service';
import WebSocketClient from './services/websocket';
import Router from './routing/router';
import Pages from './routing/pages';
import AboutView from './view/about/about';
import Header from './view/chat/header/header';
import Footer from './view/chat/footer/footer';
import ChatMessageService from './services/chat-message-service';
import HandlersRegistry from './services/handlers-registry';

export default class App {
  private loginView: LoginView;

  private chatView: ChatView;

  private aboutView: AboutView;

  private userService: UserService;

  private websocket: WebSocketClient;

  private router: Router;

  private messageService: ChatMessageService;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.websocket = new WebSocketClient(
      process.env.SERVER || 'ws://localhost:4000'
    );
    this.userService = new UserService(this.websocket);
    this.messageService = new ChatMessageService(this.websocket);
    const registry = new HandlersRegistry(this.websocket);
    this.loginView = new LoginView(this.router, this.userService, registry);
    this.chatView = new ChatView(
      this.userService,
      this.messageService,
      registry
    );
    this.aboutView = new AboutView(this.router);
  }

  public start() {}

  public createRoutes() {
    return [
      {
        path: ``,
        callback: () => this.grantAccessToUsers(),
      },
      {
        path: `${Pages.LOGIN}`,
        callback: () => this.grantAccessToUsers(),
      },
      {
        path: `${Pages.CHAT}`,
        callback: () => this.createChatView(),
      },
      {
        path: `${Pages.ABOUT}`,
        callback: () => this.createAboutPageView(),
      },
    ];
  }

  private createLoginView() {
    document.querySelector('body')!.append(this.loginView.create());
  }

  private createChatView() {
    document.querySelector('header')?.remove();
    document.querySelector('footer')?.remove();
    const footer = new Footer();
    const header = new Header(this.router, this.userService);
    document.querySelector('main')?.remove();
    header.create();
    document.querySelector('body')!.append(this.chatView.create());
    footer.create();
  }

  private createAboutPageView() {
    document.querySelector('main')?.remove();
    document.querySelector('header')?.remove();
    document.querySelector('footer')?.remove();

    document.querySelector('body')!.append(this.aboutView.create());
  }

  private grantAccessToUsers() {
    if (sessionStorage.length) {
      this.router.navigate(`${Pages.CHAT}`);
    } else {
      this.createLoginView();
    }
  }
}
