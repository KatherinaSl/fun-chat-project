import LoginView from './view/login/login';
// import ChatView from './view/chat/chat';
import ChatService from './services/chat-service';
import WebSocketClient from './view/websocket';

export default class App {
  private loginView: LoginView;

  // private chatView: ChatView;

  private chatService: ChatService;

  private websocket: WebSocketClient;

  constructor() {
    this.loginView = new LoginView();
    // this.chatView = new ChatView();
    this.websocket = new WebSocketClient('ws://localhost:4000');
    this.chatService = new ChatService(this.websocket);
  }

  public start() {
    this.createLoginView();
  }

  private createLoginView() {
    // this.loginView = new LoginView();
    document.querySelector('body')!.append(this.loginView.create());

    if (document.querySelector('.form-box')) {
      document.querySelector('form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const userLogin = (
          document.querySelector('#username-input') as HTMLInputElement
        )?.value;

        const userPassword = (
          document.querySelector('#password-input') as HTMLInputElement
        )?.value;
        this.chatService.login({ login: userLogin, password: userPassword });
        this.chatService.setupIncomingMessage();
        // this.loginView?.delete();
        // this.chatView = new ChatView();
        // document.querySelector('body')!.append(this.chatView.create());
      });
    }
  }
}
