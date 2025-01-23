import './chat.scss';
import createHTMLElement from '../../util/create-element';
import UserService from '../../services/user-service';
import DialogueView from './dialogue';
import ChatMessageService from '../../services/chat-message-service';
import ContactsView from './contacts';
import HandlersRegistry from '../../services/handlers-registry';
import MessageStorageService from '../../services/message-storage-service';

export default class ChatPageView {
  private userService: UserService;

  private messageService: ChatMessageService;

  private dialogueView: DialogueView;

  private contactsView: ContactsView;

  private messageStorage: MessageStorageService;

  constructor(
    userService: UserService,
    messageService: ChatMessageService,
    registry: HandlersRegistry,
  ) {
    this.userService = userService;
    this.messageService = messageService;
    this.messageStorage = new MessageStorageService(registry);
    this.dialogueView = new DialogueView(
      this.messageService,
      this.messageStorage,
    );
    this.contactsView = new ContactsView(
      this.userService,
      registry,
      this.dialogueView,
      this.messageService,
    );
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    main.append(this.contactsView.create(), this.dialogueView.create());
    return main;
  }
}
