import { Message, User } from '../data/interfaces';
import WebSocketClient from './websocket';
import createSocketMessage from '../util/socket-utils';
import { SOCKET_MSG_TYPE } from '../constants';

export default class ChatMessageService {
  private websocket: WebSocketClient;

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
  }

  public sendMsg(message: Message) {
    const socketMsg = createSocketMessage(SOCKET_MSG_TYPE.MSG_SEND, {
      message,
    });
    this.websocket.send(socketMsg);
  }

  public requestMsgHistory(user: User) {
    const socketMsg = createSocketMessage(SOCKET_MSG_TYPE.MSG_FROM_USER, {
      user,
    });
    this.websocket.send(socketMsg);
  }

  public sendReadStatus(messageId: string) {
    const socketMsg = createSocketMessage(SOCKET_MSG_TYPE.MSG_READ, {
      message: { id: messageId },
    });
    this.websocket.send(socketMsg);
  }
}
