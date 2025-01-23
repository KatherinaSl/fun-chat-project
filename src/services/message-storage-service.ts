import { Message, User } from '../data/interfaces';
import HandlersRegistry from './handlers-registry';

export default class MessageStorageService {
  private storage = new Map<string, Message[]>();

  private newMessageListener?: (message: Message) => void;

  private deliveredMessageListener?: (message: Message) => void;

  private readMessageListener?: (message: Message) => void;

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

    registry.addMessageHandler('MSG_DELIVER', (msg) => {
      const msgId = msg.payload?.message?.id;
      const deliveredMsg = Array.from(this.storage.values())
        .flat()
        .filter((message) => message.id === msgId)
        .at(0);
      if (deliveredMsg && deliveredMsg.status) {
        deliveredMsg.status.isDelivered = true;

        if (this.deliveredMessageListener) {
          this.deliveredMessageListener(deliveredMsg);
        }
      }
    });

    registry.addMessageHandler('MSG_READ', (msg) => {
      const msgId = msg.payload?.message?.id;
      const readMsg = Array.from(this.storage.values())
        .flat()
        .filter((message) => message.id === msgId)
        .at(0);
      if (readMsg && readMsg.status) {
        readMsg.status.isReaded = true;

        if (this.readMessageListener) {
          this.readMessageListener(readMsg);
        }
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

  public setDeliveredMessageListener(callback: (message: Message) => void) {
    this.deliveredMessageListener = callback;
  }

  public setReadMessageListener(callback: (message: Message) => void) {
    this.readMessageListener = callback;
  }
}
