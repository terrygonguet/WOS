$(document).ready(function () {
  var blinky = setInterval(function () {
    var newtxt = $("#blinky").html() === "&nbsp;&nbsp;" ? "&nbsp;_" : "&nbsp;&nbsp;";
    $("#blinky").html(newtxt);
  }, 750);

  var birth = new Date(1996, 04, 11);
  $("#age").text(parseInt((Date.now() - birth) / 31557600000));

  $("#hidetext").click(function () {
    $("#details").fadeToggle();
    $(this).toggleClass("fa-eye fa-eye-slash");
  });

  $(".nav>li").click(function () {
    if (!$(this).hasClass("active")) {
      if($(this).attr("data-category") === "home") {
        changeLikes();
      }
      $(".nav>li").removeClass("active");
      $(this).addClass("active");
      $(".category").hide();
      $("#category-" + $(this).attr("data-category")).show();
    }
  });

  $("#btnMore1").click(function () {
    $(this).fadeOut();
    $("#learnmore1").fadeIn();
  });

  $("#btnMore2").click(function () {
    $(this).fadeOut();
    $("#learnmore2").fadeIn();
  });

  var likes = {};
  $.getJSON("like.json", function (res) {
    likes = res;
    changeLikes();
  });

  function changeLikes() {
    $("#learnmore2 .list-group-item").detach();
    for (var list in likes) {
      var alreadyShown = [];
      for (var i = 0; i < 5; i++) {

        var item = null;
        do {
          item = likes[list][Math.floor(Math.random() * likes[list].length)];
        } while (alreadyShown.indexOf(item) !== -1);
        alreadyShown.push(item);

        var a = $("<a>" + item.name + "</a>");
        a.attr("href", item.href ? item.href : "#");
        a.addClass("list-group-item");
        item.href && a.attr("target", "_blank");
        item.title && a.attr("title", item.title);
        a.appendTo("#" + list);
      }
    }
    $("#like").append("<a href='https://vid.me/Mnu8k' target='_blank' class='list-group-item' title='No secret there' style='display:none;'>Hiding things</a>");
  }
});
