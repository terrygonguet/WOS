var WOS = WOS || {};

WOS.io = io("http://ca2-imd-wos.herokuapp.com/");
WOS.api = "http://ca2-imd-wos.herokuapp.com/";

$(document).ready(function () {
  $(document).keydown(function (e) {
    if (e.key === "t" && (e.altKey || e.metaKey) && e.ctrlKey) {
      e.preventDefault();
      var app = new WOS.App("home/apps/cmd/");
      $(".hint").fadeOut("slow");
    }
  });
});
