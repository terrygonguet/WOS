(function () {
  var id = win + "";
  const handle = WOS.Window.list[id];
  var currentdir = [];

  $.getJSON("list", function (res) {
    currentdir = Object.keys(res);
    $("#path", handle.windowContent).text(curpath());
    addLine("Type 'help' for commands", "info");
    $("#cli", handle.windowContent).removeAttr("disabled");
  });

  handle.onresize = size => {
    $(".output", handle.windowContent).css("max-height", size.height - $(".input", handle.windowContent).height());
  };
  $(".output", handle.windowContent).css("max-height", handle.windowContent.height() - $(".input", handle.windowContent).height());

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

      addLine(curpath() + " > " + text);
      var words = text.split(" ");
      commands[words[0]] && commands[words[0]](words.slice(1));
    }
  });

  $("#cli").focus();

  function curpath() {
    return currentdir.join("/");
  }
  function addtopath(dir) {
    currentdir.push(dir);
    $("#path", handle.windowContent).text(curpath());
  }

  const commands = {
    ls: e => {
      $.getJSON("list/" + encodeURIComponent(curpath()), function (res) {
        for (var f in res) {
          addLine(f, res[f] === "file" ? "primary" : "success");
        }
      });
    },
    cd: e => {
      $.getJSON("list/" + encodeURIComponent(curpath() + "/" + e[0]), function (res) {
        addtopath(e[0]);
      }).fail(function () {
        addLine("Not a valid path", "danger");
      });

    }
  }
})();
