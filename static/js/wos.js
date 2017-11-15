var WOS = WOS || {};

WOS.io = io(location.origin);

$(document).ready(function () {
  var w = new WOS.Window({
    title: "Chat client",
    source: "chat",
    x: window.innerWidth / 2 - 400,
    y: window.innerHeight / 2 - 300,
    w: 800, h: 600
  });
  w.appendTo("body");
});
