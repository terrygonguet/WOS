(function () {
  const handle = WOS.Window.list[win];
  handle.onresize = size => {
    $(".output", handle.windowContent).css("max-height", size.height - $(".input", handle.windowContent).height() - 12);
  };
  $(".output", handle.windowContent).css("max-height", handle.windowContent.height() - $(".input", handle.windowContent).height() - 12);

  handle.windowContent.click(e => {
    $("#cli", handle.windowContent).focus();
  });

  // type : muted, primary, success, info, warning, and danger
  function addLine(pseudo, text, type="muted") {
    $(`<div class="row"></div>`)
      .append($(`<div class="col-xs-2 text-${type}"></div>`).text(pseudo))
      .append($(`<div class="col-xs-10 text-${type}" style="overflow:hidden"></div>`).text(text))
      .prependTo($(".output", handle.windowContent));
  }

  var pseudo = localStorage.getItem("pseudo");

  const commands = {
    nick: (e) => {
      pseudo = e.join(" ");
      localStorage.setItem("pseudo", pseudo);
      addLine("Info", `Your nickname is now "${pseudo}".`, "info");
    },
    summon: (e) => {
      WOS.io.emit("summon", e.join(" "), (data) => {
        addLine("Info", data, "warning");
      });
    },
    count: () => {
      WOS.io.emit("count", null, count => {
        addLine("Info", count + " person(s) on the website right now", "info");
      });
    },
    help: (e) => {
      addLine("/nick <nickname>", "Changes your nickname, no rules apply.", "info");
      addLine("/count", "Prints how many people are on the website right now (not necessarily on the chat app)", "info");
      addLine("/summon <message>", "Summons the author of this site to the chat (may or may not work quickly enough)", "info");
    }
  }

  $('#cli', handle.windowContent).on('keyup', function (e) {
    if(e.key === "Enter"){
      var text = $(this).val();
      if (!text) return;
      if (text.startsWith("/")) {
        var substr = text.slice(1);
        var words = substr.split(" ");
        if (commands[words[0]]) {
          commands[words[0]](words.slice(1));
        } else {
          addLine("Error", "Unknown command : " + words[0], "danger");
        }
      } else if (!pseudo) {
        addLine("Error", "You must first set your display name with /nick <nickname>. No rules apply.", "danger");
      } else {
        addLine(pseudo + " (YOU)", text);
        WOS.io.emit("message", { pseudo, text });
      }
      $(this).val("");
    }
  });

  WOS.io.on("message", data => {
    addLine(data.pseudo, data.text, data.type || "muted");
  });

  $("#cli", handle.windowContent).focus();
  addLine("Info", "/help for the list of commands", "warning");
})();
