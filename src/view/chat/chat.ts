import './chat.scss';
import { createHTMLElement } from '../../util/html-utils';
import UserService from '../../services/user-service';
import DialogueView from './dialogue';
import ChatMessageService from '../../services/chat-message-service';
import ContactsView from './contacts';
import HandlersRegistry from '../../services/handlers-registry';
import MessageStorageService from '../../services/message-storage-service';

export default class ChatPageView {
  private dialogueView: DialogueView;

  private contactsView: ContactsView;

  constructor(
    userService: UserService,
    messageService: ChatMessageService,
    registry: HandlersRegistry
  ) {
    const messageStorage = new MessageStorageService(registry);
    this.dialogueView = new DialogueView(messageService, messageStorage);
    this.contactsView = new ContactsView(
      userService,
      registry,
      this.dialogueView,
      messageService,
      messageStorage
    );
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    main.append(this.contactsView.create(), this.dialogueView.create());
    return main;
  }
}
