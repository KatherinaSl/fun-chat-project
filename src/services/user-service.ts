import { User } from '../data/interfaces';
import WebSocketClient from './websocket';
import createSocketMessage from '../util/socket-utils';
import { SOCKET_MSG_TYPE } from '../constants';

export default class UserService {
  private contacts = new Map<string, User>();

  private websocket: WebSocketClient;

  constructor(websocket: WebSocketClient) {
    this.websocket = websocket;
  }

  public login(user: User) {
    const msg = createSocketMessage(SOCKET_MSG_TYPE.USER_LOGIN, { user });
    this.websocket.send(msg);
  }

  public logout(user: User) {
    const msg = createSocketMessage(SOCKET_MSG_TYPE.USER_LOGOUT, { user });
    this.websocket.send(msg);
    this.websocket.close();
  }

  public requestAllLoginUsers() {
    const msg = createSocketMessage(SOCKET_MSG_TYPE.USER_ACTIVE);
    this.websocket.send(msg);
  }

  public requestAllLogoutUsers() {
    const msg = createSocketMessage(SOCKET_MSG_TYPE.USER_INACTIVE);
    this.websocket.send(msg);
  }

  public saveContacts(users?: User[]) {
    users?.forEach((user) => {
      this.contacts.set(user.login, user);
    });
  }

  public updateContact(user: User) {
    this.contacts.set(user.login, user);
  }

  public getContact(login: string): User | undefined {
    return this.contacts.get(login);
  }
}
