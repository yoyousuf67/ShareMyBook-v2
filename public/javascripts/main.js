//creatin a demo imgArray
var imgArray = new Array('http://via.placeholder.com/850x500','http://via.placeholder.com/850x500','http://via.placeholder.com/850x500');

function functieArray() {
    for (i = 0; i < imgArray.length; i++) {
      var img = document.createElement("img");
      img.src = imgArray[i];
      var gallery = document.getElementById("pozeGallery");
      gallery.appendChild(img);
    }

};
