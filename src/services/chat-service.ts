import { User } from '../data/interfaces';
// import LoginView from '../view/login/login';
import WebSocketClient from '../view/websocket';
// import ChatView from '../view/chat/chat';
import Router from '../routing/router';
// import Pages from '../routing/pages';

export default class ChatService {
  private websocket: WebSocketClient;

  private router: Router;

  MAX_ID = 100000;

  constructor(websocket: WebSocketClient, router: Router) {
    this.websocket = websocket;
    this.router = router;
  }

  public login(user: User) {
    const msg = {
      id: this.generateRequestId(),
      type: 'USER_LOGIN',
      payload: {
        user,
      },
    };

    this.websocket.send(msg);
  }

  private generateRequestId(): string {
    return Math.floor(Math.random() * this.MAX_ID).toString();
  }
}
