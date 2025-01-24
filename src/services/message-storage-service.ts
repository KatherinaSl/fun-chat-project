import { Message, User } from '../data/interfaces';
import HandlersRegistry from './handlers-registry';

export default class MessageStorageService {
  private storage = new Map<string, Message[]>();

  private unreadMessagesMap = new Map<string, number>();

  private newMessageListener?: (message: Message) => void;

  private deliveredMessageListener?: (message: Message) => void;

  private readMessageListener?: (message: Message) => void;

  private unreadMessageCounterListener?: (
    contact: string,
    counter: number,
  ) => void;

  constructor(registry: HandlersRegistry) {
    registry.addMessageHandler('MSG_SEND', (msg) => {
      const incomingMsg = msg.payload?.message;
      const currentUser = sessionStorage.getItem('user');

      if (!incomingMsg) {
        return;
      }
      const contact =
        currentUser === incomingMsg.from ? incomingMsg.to! : incomingMsg.from!;

      this.storeMessageHistory(incomingMsg, contact);

      if (!incomingMsg.status?.isReaded && incomingMsg.to === currentUser) {
        let unReadMessagesCount = this.unreadMessagesMap.get(contact);
        if (!unReadMessagesCount) {
          unReadMessagesCount = 0;
        }
        unReadMessagesCount += 1;
        this.unreadMessagesMap.set(contact, unReadMessagesCount);
        if (this.unreadMessageCounterListener) {
          this.unreadMessageCounterListener(contact, unReadMessagesCount);
        }
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

      const contact =
        currentUser === msgHistory[0].from
          ? msgHistory[0].to!
          : msgHistory[0].from!;

      this.storage.set(contact, msgHistory);

      const unReadMessagesCount = msgHistory
        .filter((message) => !message.status?.isReaded)
        .filter((message) => message.to === currentUser).length;

      this.unreadMessagesMap.set(contact, unReadMessagesCount);
      if (this.unreadMessageCounterListener) {
        this.unreadMessageCounterListener(contact, unReadMessagesCount);
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

  public setUnreadMessageCounterListener(
    callback: (contact: string, counter: number) => void,
  ) {
    this.unreadMessageCounterListener = callback;
  }

  public resetUnreadMessageCounter(user: string) {
    this.unreadMessagesMap.set(user, 0);
    if (this.unreadMessageCounterListener) {
      this.unreadMessageCounterListener(user, 0);
    }
  }
}
