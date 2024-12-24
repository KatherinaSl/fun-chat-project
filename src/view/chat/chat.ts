import './chat.scss';
import createHTMLElement from '../../util/element-creator';

export default class ChatPageView {
  public create(): Node {
    const main = createHTMLElement('main');
    const containter = createHTMLElement('div', 'container');

    main.append(containter);
    return main;
  }
}
