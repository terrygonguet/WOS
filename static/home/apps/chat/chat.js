(function () {
  const handle = WOS.Window.list[win];
  handle.onresize = size => {
    $(".output", handle.windowContent).css("max-height", size.height - $(".input", handle.windowContent).height());
  };
  $(".output", handle.windowContent).css("max-height", handle.windowContent.height() - $(".input", handle.windowContent).height());

  handle.windowContent.click(e => {
    $("#cli", handle.windowContent).focus();
  });

  // type : muted, primary, success, info, warning, and danger
  function addLine(pseudo, text, type="muted") {
    $(`<div class="row"></div>`)
      .append($(`<div class="col-xs-2 text-${type}" style="text-align:right"></div>`).text(pseudo))
      .append($(`<div class="col-xs-10 text-${type}" style="overflow:hidden"></div>`).text(text))
      .prependTo($(".output", handle.windowContent));
  }

  var pseudo = localStorage.getItem("pseudo");

  $('#cli', handle.windowContent).on('keyup', function (e) {
    if(e.key === "Enter"){
      var text = $(this).val();
      if (!text) return;
      if (text.startsWith("/nick ")) {
        pseudo = text.slice(6);
        localStorage.setItem("pseudo", pseudo);
        addLine("Info", `Your nickname is now "${pseudo}".`, "info");
      } else if (!pseudo) {
        addLine("Error", "You must first set your display name with /nick <nickname>. No rules will be enforced.", "danger");
      } else {
        addLine(pseudo + " (YOU)", text);
        WOS.io.emit("message", { pseudo, text });
      }
      $(this).val("");
    }
  });

  WOS.io.on("message", data => {
    addLine(data.pseudo, data.text);
  });

  $("#cli").focus();
})();
