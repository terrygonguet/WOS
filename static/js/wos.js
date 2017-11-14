var WOS = WOS || {};

$(document).ready(function () {
  var w = new WOS.Window("Test", {
    x: window.innerWidth / 2 - 400,
    y: window.innerHeight / 2 - 300,
    w: 800, h: 600
  });
  w.appendTo("body");
});
