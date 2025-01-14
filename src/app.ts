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

  private chatService: UserService;

  private websocket: WebSocketClient;

  private router: Router;

  private messageService: ChatMessageService;

  constructor() {
    const routes = this.createRoutes();
    this.router = new Router(routes);
    this.websocket = new WebSocketClient('ws://localhost:4000');
    this.chatService = new UserService(this.websocket);
    this.messageService = new ChatMessageService(this.websocket);
    const registry = new HandlersRegistry(this.websocket);
    this.loginView = new LoginView(this.router, this.chatService, registry);
    this.chatView = new ChatView(
      this.chatService,
      this.messageService,
      registry,
    );
    this.aboutView = new AboutView(this.router);
    console.log('app constructor');
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
          const footer = new Footer();
          footer.create();
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

window.addEventListener('beforeunload', () => {
  // const websocket = new WebSocketClient('ws://localhost:4000');
  // const chatService = new ChatService(websocket);
  // const messageService = new MessageService(websocket);
  // const chatView = new ChatView(chatService, messageService);
  // const dialogueView = new DialogueView(messageService, user);
});
