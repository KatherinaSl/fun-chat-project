import { Message, User } from '../data/interfaces';
import HandlersRegistry from './handlers-registry';

export default class MessageStorageService {
  private storage = new Map<string, Message[]>();

  private newMessageListener?: (message: Message) => void;

  constructor(registry: HandlersRegistry) {
    registry.addMessageHandler('MSG_SEND', (msg) => {
      const incomingMsg = msg.payload?.message;
      const currentUser = sessionStorage.getItem('user');
      if (currentUser === incomingMsg?.from) {
        this.storeMessageHistory(incomingMsg, incomingMsg.to!);
      } else {
        this.storeMessageHistory(incomingMsg!, incomingMsg!.from!);
      }

      if (this.newMessageListener) {
        this.newMessageListener(incomingMsg!);
      }
    });

    registry.addMessageHandler('MSG_FROM_USER', (msg) => {
      const msgHistory = msg.payload?.messages;
      const currentUser = sessionStorage.getItem('user');

      if (!msgHistory || !msgHistory.length) {
        return;
      }

      if (currentUser === msgHistory[0].from) {
        this.storage.set(msgHistory[0].to!, msgHistory);
      } else {
        this.storage.set(msgHistory[0].from!, msgHistory);
      }
    });
  }

  private storeMessageHistory(incomingMsg: Message, sender: string) {
    let msgHistory = this.storage.get(sender);
    if (!msgHistory) {
      msgHistory = [];
    }
    msgHistory.push(incomingMsg);
    this.storage.set(sender, msgHistory);
  }

  public getMessageHistory(user: User): Message[] {
    const messages = this.storage.get(user.login);
    return messages ? messages! : [];
  }

  public setNewMessageListener(callback: (message: Message) => void) {
    this.newMessageListener = callback;
  }
}
