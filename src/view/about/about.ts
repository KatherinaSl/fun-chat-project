import './about.scss';
import createHTMLElement from '../../util/element-creator';
import Router from '../../routing/router';
import Pages from '../../routing/pages';

export default class AboutPageView {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public create(): Node {
    const main = createHTMLElement('main');
    const containter = createHTMLElement('div', 'about');
    const description = createHTMLElement('h2');
    description.textContent = 'Fun Chat';
    const p = createHTMLElement('p');
    p.textContent =
      'The application is designed to demonstrate the assignment Fun Chat within the course RSSchool';

    const button = createHTMLElement('button');
    button.textContent = 'back';
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
