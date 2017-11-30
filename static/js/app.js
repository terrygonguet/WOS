var WOS = WOS || {};
(function () {
  class App {

    constructor(path, onfail = null) {
      this.path = path;
      this.window = null;
      this.onfail = onfail;

      $.get(path + "app.json", res => {

        var props = {
          title: res.title,
          source: path + res.html,
          path, iframe: res.iframe
        };
        if (res.window) {
          res.window.width && (props.w = res.window.width);
          res.window.height && (props.h = res.window.height);
          props.x = App.nextX;
          props.y = App.nextY;
        }
        !res.iframe && (props.onloadcomplete = (win) => {
          for (var css of res.css) {
            win.windowhead.append($(`<link href='${path + css}' rel='stylesheet'>`));
          }
          for (var js of res.js) {
            window.win = WOS.Window.list.indexOf(win);
            window.path = path;
            $.getScript(path + js);
          }
        });

        this.window = new WOS.Window(props);
        res.window && res.window.fullscreen && this.window.fullscreen();
        res.window && res.window.reduce && this.window.reduce();
        this.window.appendTo("body");

      }).fail(e => {
        this.onfail && this.onfail("Cannot open app : \"" + path + "app.json\" not found");
      });
    }

  }

  Object.defineProperty(App, "nextX", {
    get: () => {
      App.lastX += 30;
      if (App.lastX > innerWidth / 2) App.lastX = 50;
      return App.lastX;
    }
  });
  Object.defineProperty(App, "nextY", {
    get: () => {
      App.lastY += 30;
      if (App.lastY > innerHeight / 2) App.lastY = 50;
      return App.lastY;
    }
  });
  App.lastX = 50;
  App.lastY = 50;

  WOS.App = App;
})();
