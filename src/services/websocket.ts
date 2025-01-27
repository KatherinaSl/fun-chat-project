import { SocketMessage } from '../data/interfaces';
import createSocketMessage from '../util/socket-utils';
import { SOCKET_MSG_TYPE } from '../constants';

export default class WebSocketClient {
  private websocket?: WebSocket;

  private url: string;

  private messageQueue: SocketMessage[] = [];

  private onMessage?: (msg: SocketMessage) => void;

  constructor(url: string) {
    this.url = url;
    this.openSocket();
  }

  public openSocket() {
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      this.websocket = new WebSocket(this.url);
    }
    this.setupCallback();
  }

  public send(message: SocketMessage) {
    this.openSocket();
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket?.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  public close() {
    this.websocket?.close();
  }

  public setOnMessageCallback(callback: (message: SocketMessage) => void) {
    this.onMessage = callback;
    if (this.websocket) {
      this.setupCallback();
    }
  }

  private setupCallback() {
    if (this.onMessage) {
      this.websocket!.onmessage = (msgEvent) => {
        const dataString = msgEvent.data;
        const dataObj = JSON.parse(dataString);
        this.onMessage!(dataObj);
      };
    }
    if (this.websocket) {
      this.websocket.onopen = this.onOpenCallback.bind(this);
    }
  }

  private onOpenCallback() {
    if (sessionStorage.length && this.messageQueue.length) {
      const login = sessionStorage.getItem('user')!;
      const password = sessionStorage.getItem('password')!;

      const firstMessage = this.messageQueue[0];
      if (firstMessage.type !== SOCKET_MSG_TYPE.USER_LOGIN) {
        const msg = createSocketMessage(SOCKET_MSG_TYPE.USER_LOGIN, {
          user: { login, password },
        });
        this.websocket?.send(JSON.stringify(msg));
      }
    }

    while (this.messageQueue.length) {
      const obj = this.messageQueue.shift()!;
      this.websocket?.send(JSON.stringify(obj));
    }
  }
}
