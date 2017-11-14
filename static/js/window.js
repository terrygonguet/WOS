var WOS = WOS || {};
(function () {
  class Window {

    constructor(title, props = {}) {
      Window.list.push(this);
      
      this.width           = props.w || 400;
      this.height          = props.h || 300;
      this.x               = props.x || 100;
      this.y               = props.y || 100;
      this._title          = $(`<code>${title}</code>`);
      this.title           = title;
      this.windowContainer = $(`<div class="windowcontainer"></div>`);
      this.window          = $(`<div class="window"></div>`);
      this.titleBar        = $(`<div class="titlebar"></div>`);
      this.windowContent   = $(`<div class="windowcontent"></div>`);
      this.btnReduce       = $(`<div class="titlebtn titlereduce"></div>`);
      this.btnFullscreen   = $(`<div class="titlebtn titlefullscreen"></div>`);
      this.btnClose        = $(`<div class="titlebtn titleclose"></div>`);
      this.previousState   = {};
      this.reduced         = false;
      this.fullscreen      = false;

      this.saveState();

      this.windowContainer.append(
        this.window.append(
          this.titleBar.append(
            this._title,
            this.btnReduce,
            this.btnFullscreen,
            this.btnClose
          ),
          this.windowContent
        )
      );

      this.windowContainer
        .draggable({
          handle:".titlebar",
          drag: (e, ui) => {
            this.x = ui.offset.left,
            this.y = ui.offset.top
          }
        })
        .resizable({
          handles: "se",
          minHeight: 200,
          minWidth: 200,
          resize: (e, ui) => {
            this.width = ui.size.width,
            this.height = ui.size.height
          }
        });

      this.btnReduce.click(() => {
        if (this.reduced) {
          this.restoreState();
          this.enableMove();
        } else {
          this.disableMove();
          this.fullscreen = false;
          this.saveState();
          this.windowContainer.css({
            width: 150,
            height:this.titleBar.height() + 5,
            left: 0,
            top: window.innerHeight - this.titleBar.height() - 4
          });
        }
        this.reduced = !this.reduced;
      });

      this.btnFullscreen.click(() => {
        if (this.fullscreen) {
          this.restoreState();
          this.enableMove();
        } else {
          this.disableMove();
          this.reduced = false;
          this.saveState();
          this.windowContainer.css({
            width: window.innerWidth + 4,
            height: window.innerHeight + 4,
            top: -2,
            left: -2
          });
        }
        this.fullscreen = !this.fullscreen;
      });

      this.btnClose.click(() => {
        this.windowContainer.detach();
      });

      this.restoreState();
    }

    get title() {
      return this._title.text();
    }

    set title(val) {
      this._title.text(val);
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
      this.previousState   = {
        left: this.x,
        top: this.y,
        width: this.width,
        height: this.height
      };
    }

    restoreState() {
      this.windowContainer.css(this.previousState);
    }

  }
  Window.list = [];
  WOS.Window = Window;
})();
