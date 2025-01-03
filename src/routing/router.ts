import Pages from './pages';
import HistoryRouterHandler from './history-router-handler';

type Route = {
  path: string;
  callback: (path: string) => void;
};

export default class Router {
  private routes: Array<Route>;

  private handler;

  constructor(routes: Array<Route>) {
    this.routes = routes;
    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      this.handler.navigate('');
    });
  }

  public navigate(url: string) {
    this.handler.navigate(url);
  }

  private urlChangedHandler(path: string) {
    const route = this.routes.find((item) => item.path === path);

    if (!route) {
      this.redirectToLoginPage();
      return;
    }

    route.callback(path);
  }

  private redirectToLoginPage() {
    const route = this.routes.find((item) => item.path === Pages.LOGIN);
    if (route) {
      this.navigate(route.path);
    }
  }
}
