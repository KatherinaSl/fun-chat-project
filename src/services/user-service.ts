import { User } from '../data/interfaces';
import SocketService from './socket-service';

export default class UserService extends SocketService {
  private contacts = new Map<string, User>();

  public login(user: User) {
    const msg = this.createSocketMessage('USER_LOGIN', { user });
    this.websocket.send(msg);
  }

  public logout(user: User) {
    const msg = this.createSocketMessage('USER_LOGOUT', { user });
    this.websocket.send(msg);
    this.websocket.close();
  }

  public requestAllLoginUsers() {
    const msg = this.createSocketMessage('USER_ACTIVE');
    this.websocket.send(msg);
  }

  public requestAllLogoutUsers() {
    const msg = this.createSocketMessage('USER_INACTIVE');
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
