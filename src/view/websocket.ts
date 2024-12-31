import { Message } from '../data/interfaces';

export default class WebSocketClient {
  private websocket: WebSocket | null;

  private url: string;

  private onMessage: ((msg: Message) => void) | null;

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

  public send(message: Message) {
    this.openSocket();
    if (this.websocket?.readyState === WebSocket.OPEN) {
      const obj = JSON.stringify(message);
      this.websocket?.send(obj);
    }
  }

  public close() {
    this.websocket?.close();
  }

  public setOnMessageCallback(callback: (message: Message) => void) {
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
  }
}
