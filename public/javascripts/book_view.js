function zoomIn(event) {
  var hide_element=document.getElementById("hide");
  var element = document.getElementById("overlay");
  element.style.display = "block";
  hide_element.style.display="none";
  var img = document.getElementById("imgZoom");
  var posX = event.offsetX ? (event.offsetX) : event.pageX - img.offsetLeft;
  var posY = event.offsetY ? (event.offsetY) : event.pageY - img.offsetTop;
  element.style.backgroundPosition = (-posX * 2) + "px " + (-posY * 2) + "px";
}

function zoomOut() {
  var hide_element=document.getElementById("hide");
  var element = document.getElementById("overlay");
  hide_element.style.display="block";
  element.style.display = "none";
}
