import createHTMLElement from '../../util/element-creator';
import './chat.scss';

export default class DialogueView {
  CHOOSE_USER_MSG = 'Select a chat to start messaging...';

  PLACEHOLDER = 'Write a message...';

  public create(): Node {
    const messageField = createHTMLElement('div', 'main__chat');
    const userInfo = createHTMLElement('div', 'main__chat__user');
    const userName = createHTMLElement('p');
    userInfo.append(userName);
    const dialogue = createHTMLElement('div', 'main__chat__dialogue');
    const selectUserElement = createHTMLElement('p');
    selectUserElement.textContent = this.CHOOSE_USER_MSG;
    dialogue.append(selectUserElement);
    const msgField = createHTMLElement('div', 'main__chat__msg');
    const msgInput = createHTMLElement('input') as HTMLInputElement;
    msgInput.setAttribute('type', 'text');
    msgInput.setAttribute('placeholder', this.PLACEHOLDER);
    msgInput.disabled = true;
    const sendButton = createHTMLElement('button') as HTMLButtonElement;
    sendButton.textContent = 'Send';
    sendButton.disabled = true;
    msgField.append(msgInput, sendButton);
    messageField.append(userInfo, dialogue, msgField);
    return messageField;
  }
}
