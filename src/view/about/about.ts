import './about.scss';
import createHTMLElement from '../../util/element-creator';
import Router from '../../routing/router';
import Pages from '../../routing/pages';
import * as Constants from '../../constants';

export default class AboutPageView {
  private router: Router;

  APP_DISCRIPTION =
    'The application is designed to demonstrate the assignment Fun Chat within the course RSSchool';

  constructor(router: Router) {
    this.router = router;
  }

  public create(): Node {
    const main = createHTMLElement('main');
    const containter = createHTMLElement('div', 'about');
    const description = createHTMLElement('h2');
    description.textContent = Constants.APP_NAME;
    const p = createHTMLElement('p');
    p.textContent = this.APP_DISCRIPTION;

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
