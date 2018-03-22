//creatin a demo imgArray
var imgArray = new Array('http://res.cloudinary.com/yoyousuf67/image/upload/c_scale,h_500,w_850/v1521613588/Capture.jpg','http://res.cloudinary.com/yoyousuf67/image/upload/c_scale,h_500,w_850/v1521613585/desktop.jpg','http://res.cloudinary.com/yoyousuf67/image/upload/c_scale,h_500,w_850/v1521613584/Capture2.jpg');

function functieArray() {
    for (i = 0; i < imgArray.length; i++) {
      var img = document.createElement("img");
      img.src = imgArray[i];
      var gallery = document.getElementById("pozeGallery");
      gallery.appendChild(img);
    }

};
