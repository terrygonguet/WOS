$(document).ready(function () {
  $(".windowcontainer")
    .draggable({ handle:".titlebar" })
    .resizable({
      handles: "se",
      minHeight: 200,
      minWidth: 200,
      start: function (e, ui) {
        console.log(ui);
        ui.element.find(".windowcontent").show();
      }
    });
  $(".titlereduce").click(function () {
    $(this).parent().parent().find(".windowcontent").hide();
    $(this).parent().parent().parent().css({
      width: 300,
      height: $(this).parent().height() + 5,
      left: 0,
      top: window.innerHeight - $(this).parent().height() - 4
    });
  });
  $(".titlefullscreen").click(function () {
    $(this).parent().parent().find(".windowcontent").show();
    $(this).parent().parent().parent().css({
      width: window.innerWidth + 4,
      height: window.innerHeight + 4,
      top: -2,
      left: -2
    });
  });
  $(".titleclose").click(function () {
    $(this).parent().parent().parent().detach();
  });
});
