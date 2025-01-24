import { Message, User } from '../data/interfaces';
import SocketService from './socket-service';

export default class ChatMessageService extends SocketService {
  public sendMsg(message: Message) {
    const socketMsg = this.createSocketMessage('MSG_SEND', { message });
    this.websocket.send(socketMsg);
  }

  public fetchMsgHistory(user: User) {
    const socketMsg = this.createSocketMessage('MSG_FROM_USER', { user });
    this.websocket.send(socketMsg);
  }

  public setReadStatus(messageId: string) {
    const socketMsg = this.createSocketMessage('MSG_READ', {
      message: { id: messageId },
    });
    this.websocket.send(socketMsg);
  }

  public getRandomMessageId() {
    return window.self.crypto.randomUUID();
  }
}
