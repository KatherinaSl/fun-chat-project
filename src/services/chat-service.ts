import { User } from '../data/interfaces';
import WebSocketClient from '../view/websocket';
import Router from '../routing/router';

export default class ChatService {
  private websocket: WebSocketClient;

  private router: Router;

  MAX_ID = 100000;

  uuid = window.self.crypto.randomUUID();

  constructor(websocket: WebSocketClient, router: Router) {
    this.websocket = websocket;
    this.router = router;
  }

  public login(user: User) {
    const msg = {
      // id: this.generateRequestId(),
      id: this.uuid,
      type: 'USER_LOGIN',
      payload: {
        user,
      },
    };

    // console.log(msg);

    this.websocket.send(msg);
  }

  public logout(user: User) {
    const msg = {
      // id: this.generateRequestId(),
      id: this.uuid,
      type: 'USER_LOGOUT',
      payload: {
        user,
      },
    };

    this.websocket.send(msg);
    this.websocket.close();
  }
}
