import {
  SocketMessage,
  SocketMessageType,
  SocketPayload,
} from '../data/interfaces';
import WebSocketClient from './websocket';

export default abstract class SocketService {
  protected websocket: WebSocketClient;

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
  }

  protected getRandomRequestId() {
    return window.self.crypto.randomUUID();
  }

  protected createSocketMessage(
    type: SocketMessageType,
    payload: SocketPayload | null = null,
  ): SocketMessage {
    return {
      id: this.getRandomRequestId(),
      type,
      payload,
    };
  }
}
