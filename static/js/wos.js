var WOS = WOS || {};

WOS.io = io(location.origin);

$(document).ready(function () {
  $(document).keyup(function (e) {
    if (e.key === "t" && e.altKey && e.ctrlKey) {
      var app = new WOS.App("home/apps/cmd/");
      $(".hint").fadeOut();
    }
  });
});
