import { Message, MessagePayload, MessageType, User } from '../data/interfaces';
import WebSocketClient from '../view/websocket';

export default class ChatService {
  private websocket: WebSocketClient;

  private handlers = new Map<string, (message: Message) => void>();

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
    this.setupMessageHandlers();
  }

  public login(user: User) {
    const msg = this.createMessage('USER_LOGIN', { user });
    this.websocket.send(msg);
  }

  public logout(user: User) {
    const msg = this.createMessage('USER_LOGOUT', { user });
    this.websocket.send(msg);
    this.websocket.close();
  }

  public getAllLoginUsers() {
    const msg = this.createMessage('USER_ACTIVE');
    this.websocket.send(msg);
  }

  public getAllLogoutUsers() {
    const msg = this.createMessage('USER_INACTIVE');
    this.websocket.send(msg);
  }

  public getThirdPartyUserLogin(user: User) {
    const msg = this.createMessage('USER_EXTERNAL_LOGIN', { user });
    this.websocket.send(msg);
  }

  public addMessageHandler(type: string, handler: (msg: Message) => void) {
    this.handlers.set(type, handler);
  }

  private getRandomRequestId() {
    return window.self.crypto.randomUUID();
  }

  private setupMessageHandlers() {
    this.websocket.setOnMessageCallback((message) => {
      const handler = this.handlers.get(message.type);
      if (handler) {
        handler(message);
      }
    });
  }

  private createMessage(
    type: MessageType,
    payload: MessagePayload | null = null,
  ): Message {
    return {
      id: this.getRandomRequestId(),
      type,
      payload,
    };
  }
}
