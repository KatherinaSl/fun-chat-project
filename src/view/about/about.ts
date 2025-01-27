import './about.scss';
import { createHTMLElement } from '../../util/html-utils';
import Router from '../../routing/router';
import Pages from '../../routing/pages';
import * as Constants from '../../constants';

export default class AboutPageView {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public create(): Node {
    const main = createHTMLElement('main');
    const containter = createHTMLElement('div', 'about');
    const description = createHTMLElement('h2');
    description.textContent = Constants.APP_NAME;
    const p = createHTMLElement('p');
    p.textContent = Constants.APP_DISCRIPTION;

    const button = createHTMLElement('button');
    button.textContent = Constants.BUTTONS.BACK_BUTTON;
    button.addEventListener('click', this.buttonClickHandler.bind(this));
    containter.append(description, p, button);
    main.append(containter);
    return main;
  }

  private buttonClickHandler() {
    if (sessionStorage.length) {
      this.router.navigate(`${Pages.CHAT}`);
    } else {
      this.router.navigate(`${Pages.LOGIN}`);
    }
  }
}
