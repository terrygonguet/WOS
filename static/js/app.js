var WOS = WOS || {};
(function () {
  class App {

    constructor(path) {
      this.path = path;
      this.window = null;

      $.get(path + "app.json", res => {

        var props = {
          title: res.title,
          source: path + res.html
        };
        if (res.window) {
          res.window.width && (props.w = res.window.width);
          res.window.height && (props.h = res.window.height);
          res.window.x && (props.x = res.window.x);
          res.window.y && (props.y = res.window.y);
        }
        props.onloadcomplete = (win) => {
          for (var css of res.css) {
            win.windowhead.append($(`<link href='${path + css}' rel='stylesheet'>`));
          }
          for (var js of res.js) {
            window.win = WOS.Window.list.indexOf(win);
            window.path = path;
            $.getScript(path + js);
          }
        }

        this.window = new WOS.Window(props);
        res.window && res.window.fullscreen && this.window.fullscreen();
        res.window && res.window.reduce && this.window.reduce();
        this.window.appendTo("body");

      }).fail(e => {
        console.log(e);
        throw "No app there";
      });
    }

  }

  WOS.App = App;
})();
