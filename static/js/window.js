var WOS = WOS || {};
(function () {
  class Window {

    constructor(props = {}) {
      this.width           = props.w || 400;
      this.height          = props.h || 300;
      this.x               = props.x || 100;
      this.y               = props.y || 100;
      this._title          = $(`<span>${props.title}</span>`);
      this.title           = props.title || "";
      this.windowContainer = $(`<div class="windowcontainer"></div>`);
      this.window          = $(`<div class="window"></div>`);
      this.titleBar        = $(`<div class="titlebar"></div>`);
      this.windowhead      = $(`<div class="windowhead"></div>`);
      this.windowContent   = $(`<div class="windowcontent"></div>`).height(window.innerHeight - this.titleBar.height());
      this.btnReduce       = $(`<div class="titlebtn titlereduce"></div>`);
      this.btnFullscreen   = $(`<div class="titlebtn titlefullscreen"></div>`);
      this.btnClose        = $(`<div class="titlebtn titleclose"></div>`);
      this.previousState   = {};
      this.isReduced       = false;
      this.isFullscreen    = false;
      this.path            = props.path;
      this.iframe          = null;
      this.onresize        = null;
      this.ondrag          = null;
      this.onclose         = null;
      this.source          = null;
      this.onloadcomplete  = props.onloadcomplete || null;

      if (props.iframe) {
        this.setiframe();
      } else {
        this.source = props.source;
      }

      Window.list.push(this);

      this.zindex = Window.list.length;
      this.saveState();

      this.windowContainer.append(
        this.window.append(
          this.titleBar.append(
            this._title,
            this.btnReduce,
            this.btnFullscreen,
            this.btnClose
          ),
          this.windowhead,
          this.windowContent
        )
      );

      this.windowContainer
        .draggable({
          handle:".titlebar",
          containment: "body",
          drag: (e, ui) => {
            this.x = ui.offset.left,
            this.y = ui.offset.top
            this.triggerDrag();
          },
          start: (e, ui) => {
            this.iframe && this.iframe.attr("style", "pointer-events:none;");
          },
          stop: (e, ui) => {
            this.iframe && this.iframe.removeAttr("style");
          }
        })
        .resizable({
          handles: "se",
          minHeight: 100,
          minWidth: 150,
          resize: (e, ui) => {
            this.width = ui.size.width,
            this.height = ui.size.height
            this.triggerResize();
          },
          start: (e, ui) => {
            this.iframe && this.iframe.attr("style", "pointer-events:none;");
          },
          stop: (e, ui) => {
            this.iframe && this.iframe.removeAttr("style");
          }
        });

      this.btnReduce.click(() => {
        if (this.isReduced) {
          this.restoreState();
          this.enableMove();
          this.isReduced = false;
        } else {
          this.saveState();
          this.reduce();
        }
        Window.list.filter(w => w.isReduced).forEach((w, i) => w.left = i * 152);
      });
      this.btnFullscreen.click(() => {
        if (this.isFullscreen) {
          this.restoreState();
          this.enableMove();
          this.isFullscreen = false;
        } else {
          this.saveState();
          this.fullscreen();
        }
      });
      this.btnClose.click(this.close.bind(this));

      this.windowContainer.click(() => {
        Window.list.filter(w => !w.isReduced).forEach(w => (w.zindex > 0 && w.zindex--));
        this.zindex = Window.list.length;
      });

      this.restoreState();
    }

    get title() {
      return this._title.text();
    }

    set title(val) {
      this._title.text(val);
    }

    get zindex() {
      return this.windowContainer.css("z-index");
    }

    set zindex(val) {
      this.windowContainer.css("z-index", val);
    }

    set source(val) {
      if (!val) return;
      this.windowContent.html(`
      <div class="container defaultcontent">
        <div class="row">
          <div class="col-xs-1"></div>
          <div class="col-xs-10 alert alert-info">
            Loading app
          </div>
          <div class="col-xs-1"></div>
        </div>
      </div>
      `);
      $.get(val, res => {
        this.windowContent.html(res);
        this.onloadcomplete && this.onloadcomplete(this);
      });
    }

    set left(val) {
      this.windowContainer.css("left", val);
    }

    set top(val) {
      this.windowContainer.css("top", val);
    }

    setiframe(val) {
      this.iframe = $(`<iframe src="${this.path}"></iframe>`);
      this.windowContent.html(this.iframe);
      this.iframe.ready(e => {
        this.iframe[0].contentWindow.win = this;
        this.iframe[0].contentWindow.outerWindow = window;
      });
    }

    triggerResize() {
      this.onresize && this.onresize({
        width: this.windowContent.width(),
        height: this.windowContent.height()
      });
      this.windowContent.show();
    }

    triggerDrag() {
      const offset = this.windowContent.offset();
      this.ondrag && this.ondrag({
        top: offset.top,
        left: offset.left
      });
    }

    triggerClose() {
      this.onclose && this.onclose();
    }

    fullscreen() {
      this.disableMove();
      this.isReduced = false;
      this.windowContainer.css({
        width: window.innerWidth + 4,
        height: window.innerHeight + 4,
        top: -2,
        left: -2
      });
      this.isFullscreen = true;
      this.triggerResize();
    }

    reduce() {
      this.disableMove();
      this.isFullscreen = false;
      this.zindex = 99;
      this.windowContainer.css({
        width: 150,
        height:this.titleBar.height() + 5,
        top: window.innerHeight - this.titleBar.height() - 4
      });
      this.isReduced = true;
      this.triggerResize();
      this.windowContent.hide();
    }

    close() {
      this.windowContainer.detach();
      Window.list.splice(Window.list.indexOf(this), 1);
      this.triggerClose();
    }

    appendTo(elem) {
      this.windowContainer.appendTo(elem);
    }

    disableMove() {
      this.windowContainer.draggable("disable").resizable("disable");
    }

    enableMove() {
      this.windowContainer.draggable("enable").resizable("enable");
    }

    saveState() {
      if (this.isFullscreen || this.isReduced) return;
      this.previousState   = {
        left: this.x,
        top: this.y,
        width: this.width,
        height: this.height
      };
    }

    restoreState() {
      this.enableMove();
      this.isReduced = false;
      this.isFullscreen = false;
      this.windowContainer.css(this.previousState);
      this.triggerResize();
    }

  }
  Window.list = [];
  WOS.Window = Window;
})();
