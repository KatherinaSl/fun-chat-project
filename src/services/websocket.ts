import { SocketMessage } from '../data/interfaces';

export default class WebSocketClient {
  private websocket: WebSocket | null;

  private url: string;

  private messageQueue: string[] = [];

  private onMessage: ((msg: SocketMessage) => void) | null;

  constructor(url: string) {
    this.url = url;
    this.websocket = null;
    this.onMessage = null;
    this.openSocket();
  }

  public openSocket() {
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      this.websocket = new WebSocket(this.url);
    }
    this.setupCallback();
  }

  public send(message: SocketMessage) {
    const obj = JSON.stringify(message);
    this.openSocket();
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket?.send(obj);
    } else {
      this.messageQueue.push(obj);
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
      // todo !!!!!!!!!!!
      this.websocket.onopen = () => {
        if (sessionStorage.length) {
          const login = sessionStorage.getItem('user');
          const pass = sessionStorage.getItem('password');

          const obj = this.messageQueue[0];
          if (!obj.includes('USER_LOGIN')) {
            const msg = `{
              "id":"123",
              "type": "USER_LOGIN",
              "payload": {
                "user": {
                  "login": "${login}",
                  "password": "${pass}"
                }
              }
            }`;
            this.websocket?.send(msg);
          }
        }

        while (this.messageQueue.length) {
          const obj = this.messageQueue.shift()!;

          this.websocket?.send(obj);
        }
      };
    }
  }
}
