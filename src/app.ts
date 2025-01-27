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
import { removeHTMLElements } from './util/html-utils';

export default class App {
  private loginView?: LoginView;

  private chatView?: ChatView;

  private aboutView?: AboutView;

  private userService?: UserService;

  private websocket: WebSocketClient;

  private router: Router;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.websocket = new WebSocketClient(
      process.env.SERVER || 'ws://localhost:4000'
    );
  }

  public initApp() {
    this.userService = new UserService(this.websocket);
    const messageService = new ChatMessageService(this.websocket);
    const registry = new HandlersRegistry(this.websocket);
    this.loginView = new LoginView(this.router, this.userService, registry);
    this.chatView = new ChatView(this.userService, messageService, registry);
    this.aboutView = new AboutView(this.router);
  }

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
    document.querySelector('body')!.append(this.loginView!.create());
  }

  private createChatView() {
    removeHTMLElements(['header', 'main', 'footer']);
    const footer = new Footer();
    const header = new Header(this.router, this.userService!);
    header.create();
    document.querySelector('body')!.append(this.chatView!.create());
    footer.create();
  }

  private createAboutPageView() {
    removeHTMLElements(['header', 'main', 'footer']);
    document.querySelector('body')!.append(this.aboutView!.create());
  }

  private grantAccessToUsers() {
    if (sessionStorage.length) {
      this.router.navigate(`${Pages.CHAT}`);
    } else {
      this.createLoginView();
    }
  }
}

const app = new App();
app.initApp();
