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
    console.log('connection is opened');
    if (!this.websocket || this.websocket.readyState === WebSocket.CLOSED) {
      this.websocket = new WebSocket(this.url);
      this.websocket.addEventListener('open', (event) => {
        console.log(event);
        // socket.send('Hello Server!');
      });
    }
    this.setupCallback();
  }

  public send(message: Message) {
    this.openSocket();
    const obj = JSON.stringify(message);
    this.websocket?.send(obj);
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

  // const userLogin = (
  //   document.querySelector('#username-input') as HTMLInputElement
  // )?.value;
  // const userPassword = (
  //   document.querySelector('#password-input') as HTMLInputElement
  // )?.value;
  // const user = {
  //   id: this.getRandomIdRequest(10000).toString(),
  //   type: 'USER_LOGIN',
  //   payload: {
  //     user: {
  //       login: userLogin,
  //       password: userPassword,
  //     },
  //   },
  // };
}
