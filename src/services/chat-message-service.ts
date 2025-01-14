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
}
