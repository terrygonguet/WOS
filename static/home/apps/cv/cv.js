$(document).ready(function () {
  var blinky = setInterval(function () {
    var newtxt = $("#blinky").html() === "&nbsp;&nbsp;" ? "&nbsp;_" : "&nbsp;&nbsp;";
    $("#blinky").html(newtxt);
  }, 750);

  var birth = new Date(1996, 04, 11);
  $("#age").text(parseInt((Date.now() - birth) / 31557600000));

  $("#hidetext").click(function () {
    $("#name, #hero>h3").fadeToggle();
    $(this).toggleClass("fa-eye fa-eye-slash");
  });
});
