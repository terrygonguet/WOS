(function () {
  if (getURLParameter("stats") === "1") {
    document.querySelector("a-scene").setAttribute("stats", "");
  }

  if (getURLParameter("rmvr") !== "0") {
    // Remove VR button
    setTimeout(function () {
      document.querySelector(".a-enter-vr").remove();
    }, 300);
    var sheet = (function() {
    	var style = document.createElement("style");
    	// WebKit hack :(
    	style.appendChild(document.createTextNode(""));
    	document.head.appendChild(style);
    	return style.sheet;
    })();
    sheet.insertRule(".a-enter-vr {  display: none; }");
  }

  if(getURLParameter("allowctrl") === "1") {
    document.querySelector("a-entity[camera]").setAttribute("look-controls", "");
    document.querySelector("a-entity[camera]").setAttribute("wasd-controls", "");
  }
})();
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
