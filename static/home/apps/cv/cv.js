$(document).ready(function () {
  var blinky = setInterval(function () {
    $("#blinky").toggle();
  }, 750);

  var birth = new Date(1996, 04, 11);
  $("#age").text(parseInt((Date.now() - birth) / 31557600000));
});
