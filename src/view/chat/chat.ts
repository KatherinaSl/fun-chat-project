import './chat.scss';
import createHTMLElement from '../../util/create-element';
import UserService from '../../services/user-service';
import DialogueView from './dialogue';
import ChatMessageService from '../../services/chat-message-service';
import ContactsView from './contacts';
import HandlersRegistry from '../../services/handlers-registry';

export default class ChatPageView {
  private userService: UserService;

  private messageService: ChatMessageService;

  private dialogueView: DialogueView;

  private contactsView: ContactsView;

  constructor(
    userService: UserService,
    messageService: ChatMessageService,
    registry: HandlersRegistry,
  ) {
    this.userService = userService;
    this.messageService = messageService;
    this.dialogueView = new DialogueView(this.messageService, registry);
    this.contactsView = new ContactsView(
      this.userService,
      registry,
      this.dialogueView,
    );
  }

  public create(): Node {
    const main = createHTMLElement('main', 'main__container');
    main.append(this.contactsView.create(), this.dialogueView.create());
    return main;
  }
}
