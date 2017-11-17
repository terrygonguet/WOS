var WOS = WOS || {};

WOS.io = io(location.origin);

$(document).ready(function () {
  var app = new WOS.App("home/apps/cmd/");
});
