import { User } from '../../data/interfaces';
import createHTMLElement from '../../util/element-creator';
import './chat.scss';
import * as Constants from '../../constants';

export default class DialogueView {
  private user?: User;

  constructor(user?: User) {
    this.user = user;
  }

  public create() {
    const messageField = createHTMLElement('div', 'main__chat');
    const userInfo = createHTMLElement('div', 'main__chat__user');
    const userName = createHTMLElement('p', 'user-name');
    const userStatus = createHTMLElement('p', 'user-status');
    userInfo.append(userName, userStatus);
    const dialogue = createHTMLElement('div', 'main__chat__dialogue');
    const selectUserElement = createHTMLElement('p');
    dialogue.append(selectUserElement);
    const msgField = createHTMLElement('div', 'main__chat__msg');
    const msgInput = createHTMLElement('input') as HTMLInputElement;
    msgInput.setAttribute('type', 'text');
    msgInput.setAttribute('placeholder', Constants.MSG_PLACEHOLDER);
    const sendButton = createHTMLElement('button') as HTMLButtonElement;
    sendButton.textContent = Constants.BUTTONS.SEND_BUTTON;

    if (this.user) {
      // const status = document
      //   .querySelector('.main__users li')?.getAttribute('status');
      // console.log(status);
      // userStatus.textContent =
      //   status === 'true' ? Constants.USER_STATUS.ONLINE
      //     : Constants.USER_STATUS.OFFLINE;
      userStatus.textContent = this.user.isLogined
        ? Constants.USER_STATUS.ONLINE
        : Constants.USER_STATUS.OFFLINE;
      userName.textContent = this.user.login;
      selectUserElement.textContent = Constants.START_DIALOGUE_MSG;
    } else {
      selectUserElement.textContent = Constants.CHOOSE_USER_MSG;
      sendButton.disabled = true;
      msgInput.disabled = true;
    }

    msgField.append(msgInput, sendButton);
    messageField.append(userInfo, dialogue, msgField);
    return messageField;
  }

  public static updateUserStatus() {
    const status = document
      .querySelector('.main__users li')
      ?.getAttribute('status');
    document.querySelector('.user-status')!.textContent =
      status === 'true'
        ? Constants.USER_STATUS.ONLINE
        : Constants.USER_STATUS.OFFLINE;
  }
}
