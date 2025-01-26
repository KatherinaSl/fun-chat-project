import { Message, SocketMessage, User } from '../data/interfaces';
import HandlersRegistry from './handlers-registry';
import { SOCKET_MSG_TYPE, MESSAGE_ACTIONS } from '../constants';

export default class MessageStorageService {
  private storage = new Map<string, Message[]>();

  private unreadMessagesMap = new Map<string, number>();

  private messageListenerMap = new Map<string, (message: Message) => void>();

  private unreadMessageCounterListener?: (
    contact: string,
    counter: number
  ) => void;

  constructor(registry: HandlersRegistry) {
    registry.addMessageHandler(
      SOCKET_MSG_TYPE.MSG_SEND,
      this.recievedMessageHandler.bind(this)
    );

    registry.addMessageHandler(
      SOCKET_MSG_TYPE.MSG_FROM_USER,
      this.recievedMessageHistoryHandler.bind(this)
    );

    registry.addMessageHandler(
      SOCKET_MSG_TYPE.MSG_DELIVER,
      this.deliveredMessageHandler.bind(this)
    );

    registry.addMessageHandler(
      SOCKET_MSG_TYPE.MSG_READ,
      this.readMessageHandler.bind(this)
    );
  }

  public setUnreadMessageCounterListener(
    callback: (contact: string, counter: number) => void
  ) {
    this.unreadMessageCounterListener = callback;
  }

  public resetUnreadMessageCounter(user: string) {
    this.unreadMessagesMap.set(user, 0);
    if (this.unreadMessageCounterListener) {
      this.unreadMessageCounterListener(user, 0);
    }
  }

  public getMessageHistory(user: User): Message[] {
    const messages = this.storage.get(user.login);
    return messages ? messages! : [];
  }

  public setMessageListener(
    action: string,
    callback: (message: Message) => void
  ) {
    this.messageListenerMap.set(action, callback);
  }

  private recievedMessageHistoryHandler(msg: SocketMessage) {
    const msgHistory = msg.payload?.messages;
    const currentUser = sessionStorage.getItem('user')!;

    if (!msgHistory || !msgHistory.length) {
      return;
    }

    const contact = this.getContactName(currentUser, msgHistory[0]);

    this.storage.set(contact, msgHistory);

    const unReadMessagesCount = msgHistory
      .filter((message) => !message.status?.isReaded)
      .filter((message) => message.to === currentUser).length;

    this.unreadMessagesMap.set(contact, unReadMessagesCount);
    if (this.unreadMessageCounterListener) {
      this.unreadMessageCounterListener(contact, unReadMessagesCount);
    }
  }

  private recievedMessageHandler(msg: SocketMessage) {
    const incomingMsg = msg.payload?.message;
    const currentUser = sessionStorage.getItem('user')!;

    if (!incomingMsg) {
      return;
    }
    const contact = this.getContactName(currentUser, incomingMsg);

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

    this.executeMessageListener(MESSAGE_ACTIONS.NEW_MESSAGE, incomingMsg);
  }

  private deliveredMessageHandler(msg: SocketMessage) {
    const deliveredMsg = this.getMessageFromStorage(msg);
    if (deliveredMsg && deliveredMsg.status) {
      deliveredMsg.status.isDelivered = true;
      this.executeMessageListener(MESSAGE_ACTIONS.DELIVER, deliveredMsg);
    }
  }

  private readMessageHandler(msg: SocketMessage) {
    const readMsg = this.getMessageFromStorage(msg);
    if (readMsg && readMsg.status) {
      readMsg.status.isReaded = true;
      this.executeMessageListener(MESSAGE_ACTIONS.READ, readMsg);
    }
  }

  private getContactName(currentUser: string, msg: Message) {
    return currentUser === msg.from ? msg.to! : msg.from!;
  }

  private getMessageFromStorage(msg: SocketMessage) {
    const msgId = msg.payload?.message?.id;
    const deliveredMsg = Array.from(this.storage.values())
      .flat()
      .filter((message) => message.id === msgId)
      .at(0);
    return deliveredMsg;
  }

  private storeMessageHistory(incomingMsg: Message, sender: string) {
    let msgHistory = this.storage.get(sender);
    if (!msgHistory) {
      msgHistory = [];
    }
    msgHistory.push(incomingMsg);
    this.storage.set(sender, msgHistory);
  }

  private executeMessageListener(action: string, msg: Message) {
    const callback = this.messageListenerMap.get(action);
    if (callback) {
      callback(msg);
    }
  }
}
