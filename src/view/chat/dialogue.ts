import createHTMLElement from '../../util/element-creator';
import './chat.scss';

export default class DialogueView {
  private user?: string;

  CHOOSE_USER_MSG = 'Select a chat to start messaging...';

  START_DIALOGUE_MSG = 'Write your first message...';

  PLACEHOLDER = 'Write a message...';

  constructor(user?: string) {
    this.user = user;
  }

  public create() {
    const messageField = createHTMLElement('div', 'main__chat');
    const userInfo = createHTMLElement('div', 'main__chat__user');
    const userName = createHTMLElement('p');
    userInfo.append(userName);
    const dialogue = createHTMLElement('div', 'main__chat__dialogue');
    const selectUserElement = createHTMLElement('p');
    dialogue.append(selectUserElement);
    const msgField = createHTMLElement('div', 'main__chat__msg');
    const msgInput = createHTMLElement('input') as HTMLInputElement;
    msgInput.setAttribute('type', 'text');
    msgInput.setAttribute('placeholder', this.PLACEHOLDER);
    const sendButton = createHTMLElement('button') as HTMLButtonElement;
    sendButton.textContent = 'Send';

    if (this.user) {
      userName.textContent = this.user;
      selectUserElement.textContent = this.START_DIALOGUE_MSG;
    } else {
      selectUserElement.textContent = this.CHOOSE_USER_MSG;
      sendButton.disabled = true;
      msgInput.disabled = true;
    }

    msgField.append(msgInput, sendButton);
    messageField.append(userInfo, dialogue, msgField);
    return messageField;
  }
}
