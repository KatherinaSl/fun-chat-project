import { SocketMessage } from '../data/interfaces';
import WebSocketClient from './websocket';

export default class HandlersRegistry {
  private websocket: WebSocketClient;

  private handlers = new Map<string, (message: SocketMessage) => void>();

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
    this.setupMessageHandlers();
  }

  public addMessageHandler(
    type: string,
    handler: (msg: SocketMessage) => void
  ) {
    this.handlers.set(type, handler);
  }

  private setupMessageHandlers() {
    this.websocket.setOnMessageCallback((message) => {
      const handler = this.handlers.get(message.type);
      if (handler) {
        handler(message);
      }
    });
  }
}
