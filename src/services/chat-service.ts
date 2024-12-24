import { User } from '../data/interfaces';
import LoginView from '../view/login/login';
import WebSocketClient from '../view/websocket';
import ChatView from '../view/chat/chat';

export default class ChatService {
  private websocket: WebSocketClient;

  MAX_ID = 100000;

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
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

  public setupIncomingMessage() {
    this.websocket.setOnMessageCallback((message) => {
      if (message.type === 'ERROR') {
        LoginView.createErrorMessage(message.payload.error!);
        // this.websocket.close();
      } else if (message.type === 'USER_LOGIN') {
        console.log('remove login view part');
        document.querySelector('main')?.remove();
        const chatView = new ChatView();
        document.querySelector('body')!.append(chatView.create());
      }
    });
  }

  private generateRequestId(): string {
    return Math.floor(Math.random() * this.MAX_ID).toString();
  }
}
