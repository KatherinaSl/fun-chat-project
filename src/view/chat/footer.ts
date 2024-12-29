import createHTMLElement from '../../util/element-creator';
import logoPic from '../../assets/rsschool-logo.jpg';
import gitHubMark from '../../assets/gitHub-Mark.png';

export default class Footer {
  LINK_TO_SCHOOL = 'https://wearecommunity.io/communities/the-rolling-scopes';

  LINK_TO_GH_PROFILE = 'https://github.com/KatherinaSl';

  public create() {
    const footer = createHTMLElement('footer');
    const container = createHTMLElement('div', 'footer__container');
    const links = createHTMLElement('ul', 'footer__links');
    const li = createHTMLElement('li');
    li.textContent = '2024';
    links.append(
      this.getFooterLinks(
        this.LINK_TO_SCHOOL,
        logoPic as string,
        'rsschool-link',
      ),
      li,
      this.getFooterLinks(
        this.LINK_TO_GH_PROFILE,
        gitHubMark as string,
        'github-link',
      ),
    );
    container.append(links);
    footer.append(container);
    document.querySelector('body')?.append(footer);
  }

  private getFooterLinks(link: string, imgSource: string, discription: string) {
    const footerList = createHTMLElement('li', 'footer__item');
    const a = createHTMLElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', link);

    const img = createHTMLElement('img') as HTMLImageElement;
    img.src = imgSource;

    img.setAttribute('alt', discription);

    a.append(img);
    footerList.append(a);
    return footerList;
  }
}
