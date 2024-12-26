import LoginView from './view/login/login';
import ChatView from './view/chat/chat';
import ChatService from './services/chat-service';
import WebSocketClient from './view/websocket';
import Router from './routing/router';
import Pages from './routing/pages';

export default class App {
  private loginView: LoginView;

  private chatView: ChatView;

  private chatService: ChatService;

  private websocket: WebSocketClient;

  private router: Router;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.websocket = new WebSocketClient('ws://localhost:4000');
    this.chatService = new ChatService(this.websocket, this.router);
    this.loginView = new LoginView(this.router, this.websocket);
    this.chatView = new ChatView();
  }

  public start() {
    // this.createLoginView();
  }

  public createRoutes() {
    return [
      {
        path: ``,
        callback: () => {
          console.log('path is empty');
          this.createLoginView();
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: () => {
          document.querySelector('body')!.append(this.loginView.create());
        },
      },
      {
        path: `${Pages.CHAT}`,
        callback: () => {
          console.log('this is chat page');
          document.querySelector('main')?.remove();
          const chatView = new ChatView();
          document.querySelector('body')!.append(chatView.create());
        },
      },
      {
        path: `${Pages.ABOUT}`,
        callback: () => {},
      },
    ];
  }

  private createLoginView() {
    const userLogin = (
      document.querySelector('#username-input') as HTMLInputElement
    )?.value;
    const userPassword = (
      document.querySelector('#password-input') as HTMLInputElement
    )?.value;
    this.chatService.login({ login: userLogin, password: userPassword });

    document.querySelector('body')!.append(this.loginView.create());
  }
}
