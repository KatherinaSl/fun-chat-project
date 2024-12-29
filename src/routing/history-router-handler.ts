type RouterHandlerParam = {
  nameEvent: string;
  locationField: keyof Location;
};

export default class HistoryRouterHandler {
  public params: RouterHandlerParam;

  public handler;

  private callback: (path: string) => void;

  constructor(callback: (path: string) => void) {
    this.params = {
      nameEvent: 'popstate',
      locationField: 'pathname',
    };
    this.handler = this.navigate.bind(this);
    this.callback = callback;

    window.addEventListener('popstate', this.handler);
  }

  public navigate(url: PopStateEvent | string) {
    if (typeof url === 'string') {
      this.setHistory(url);
    }

    const locationValue = window.location[this.params.locationField];

    if (typeof locationValue === 'string') {
      const path = locationValue.slice(1);
      this.callback(path);
    }
  }

  public disable() {
    window.removeEventListener('popstate', this.handler);
  }

  public setHistory(url: string) {
    window.history.pushState(null, '', `/${url}`);
  }
}
