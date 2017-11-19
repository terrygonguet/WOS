(function () {
  var id = win + "";
  const handle = WOS.Window.list[id];
  var currentdir = [];
  const history = [];
  var hoffset = 0;

  handle.left = innerWidth / 2 - handle.width / 2;
  handle.top = innerHeight / 2 - handle.height / 2;

  $.getJSON("list", function (res) {
    currentdir = Object.keys(res);
    $("#path", handle.windowContent).text(curpath());
    addLine("Type 'help' for commands", "info");
    $("#cli", handle.windowContent).removeAttr("disabled").focus();
  });

  handle.onresize = size => {
    $(".output", handle.windowContent).css("max-height", size.height - $(".input", handle.windowContent).height());
  };
  $(".output", handle.windowContent).css("max-height", handle.windowContent.height() - $(".input", handle.windowContent).height() - 12);

  handle.windowContent.click(e => {
    $("#cli", handle.windowContent).focus();
  });

  // type : muted, primary, success, info, warning, and danger
  function addLine(text, type="muted") {
    $(`<div class="row"></div>`)
      .append($(`<div class="col-xs-12 text-${type}" style="overflow:hidden"></div>`).text(text))
      .prependTo($(".output", handle.windowContent));
  }

  $('#cli', handle.windowContent).on('keyup', function (e) {
    if(e.key === "Enter"){
      var text = $(this).val();
      if (!text) return;
      $(this).val("");
      history.push(text);
      hoffset = 0;

      addLine(curpath() + " > " + text);
      var words = text.split(" ");
      if (commands[words[0]])
        commands[words[0]](words.slice(1));
      else
        addLine("No command with the name: " + words[0], "danger");
    }
  });

  function curpath() {
    return currentdir.join("/");
  }
  function addtopath(dir) {
    currentdir = currentdir.concat(dir.split("/"));
    $("#path", handle.windowContent).text(curpath());
  }
  function upone() {
    currentdir.pop();
    $("#path", handle.windowContent).text(curpath());
  }

  const commands = {
    ls: e => {
      $.getJSON("list/" + encodeURIComponent(curpath()), function (res) {
        addLine(".", "success");
        addLine("..", "success");
        for (var f in res) {
          addLine(f, res[f] === "file" ? "primary" : "success");
        }
      });
    },
    cd: e => {
      var path;
      if (e[0] === "..") {
        upone();
        path = encodeURIComponent(curpath());
      } else {
        path = encodeURIComponent(curpath() + "/" + e[0]);
      }
      $.getJSON("list/" + path, function (res) {
        if (e[0] !== "." && e[0] !== "..")
          addtopath(e[0]);
      }).fail(function () {
        addLine("Not a valid path", "danger");
      });
    },
    open: e => {
      try {
        if (e[0]) {
          new WOS.App(curpath() + "/" + e[0] + "/");
        } else {
          new WOS.App(curpath() + "/");
        }
      } catch (err) {
        addLine(err, "danger");
      }
    },
    code: e => {
      $.get(curpath() + "/" + e[0], function (res) {
        var win = new WOS.Window({
          x: 50, y: 50, w: 500, h: 500,
          title: curpath() + "/" + e[0]
        });

        var filetype = "generic";
        e[0].includes(".css") && (filetype = "css");
        e[0].includes(".js") && (filetype = "javascript");
        e[0].includes(".html") && (filetype = "html");

        var content = $(`<pre class="code"></pre>`)
          .append($(`<code data-language="${filetype}"><code>`)
            .text(res));
        win.windowContent.append(content);
        win.appendTo("body");
        Rainbow.color(content[0]);

      }).fail(function (err) {
        addLine("Cannot load " + curpath() + "/" + e[0], "danger");
      });
    },
    help: e => {
      addLine("cd <path>     : change directory.", "info");
      addLine("ls            : list directory contents.", "info");
      addLine("help          : displays help", "info");
      addLine("open [<path>] : opens an app in a window. An app is a folder containing an app.json file. If no path is provided the path is the current directory.", "info");
      addLine("code <path> : opens a file in a new window to see the contents. Files are read only.", "info");
    }
  }
})();
