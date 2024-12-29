import LoginView from './view/login/login';
import ChatView from './view/chat/chat';
import ChatService from './services/chat-service';
import WebSocketClient from './view/websocket';
import Router from './routing/router';
import Pages from './routing/pages';
import AboutView from './view/about/about';
import Header from './view/chat/header';

export default class App {
  private loginView: LoginView;

  private chatView: ChatView;

  private aboutView: AboutView;

  private chatService: ChatService;

  private websocket: WebSocketClient;

  private router: Router;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.websocket = new WebSocketClient('ws://localhost:4000');
    this.chatService = new ChatService(this.websocket, this.router);
    this.loginView = new LoginView(
      this.router,
      this.websocket,
      this.chatService,
    );
    this.chatView = new ChatView();
    this.aboutView = new AboutView(this.router);
  }

  public start() {
    // this.createLoginView();
  }

  public createRoutes() {
    return [
      {
        path: ``,
        callback: () => {
          if (sessionStorage.length) {
            console.log('login page disabled');
            this.router.navigate(`${Pages.CHAT}`);
          } else {
            this.createLoginView();
          }
        },
      },
      {
        path: `${Pages.LOGIN}`,
        callback: () => {
          if (sessionStorage.length) {
            console.log('login page disabled');
            this.router.navigate(`${Pages.CHAT}`);
          } else {
            this.createLoginView();
          }
        },
      },
      {
        path: `${Pages.CHAT}`,
        callback: () => {
          document.querySelector('main')?.remove();
          const header = new Header(this.router, this.chatService);
          header.create();
          document.querySelector('body')!.append(this.chatView.create());
        },
      },
      {
        path: `${Pages.ABOUT}`,
        callback: () => {
          document.querySelector('main')?.remove();
          document.querySelector('header')?.remove();
          document.querySelector('footer')?.remove();

          document.querySelector('body')!.append(this.aboutView.create());
        },
      },
    ];
  }

  private createLoginView() {
    document.querySelector('body')!.append(this.loginView.create());
  }
}
