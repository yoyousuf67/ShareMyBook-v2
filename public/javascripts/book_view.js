//book view zoomin and zoomout
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

//display nag when book is added to cart
function removecookie() {
  $('.cookie.nag').nag('clear');
}

//add a book  to cart
function add_to_cart(book_id) {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    var num=JSON.parse(this.responseText);
    var val=num.data.cart.length;
  console.log(val);
  $('.cartnum').text(val);
  $('.cookie.nag').html(`<span class="title">The selected item has been added to cart.</span><i class="close icon"></i>`).nag('show');
  $(".cart"+book_id).addClass("disabledbutton");
  $(".wishlist"+book_id).addClass("disabledbutton");
  }
  });
  xhr.open("GET", "http://localhost:8080/book/add_to_cart/"+book_id);
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(data);
}

//add a book to wishlist
function add_to_wishlist(book_id) {
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    var num=JSON.parse(this.responseText);
    var val=num.data.wishlist.length;
  console.log(val);
  $('.wishlist').text(val);
  $('.cookie.nag').html(`<span class="title">The selected item has been added to wishlist.</span><i class="close icon"></i>`).nag('show');
  $(".wishlist"+book_id).addClass("disabledbutton");
//  $('.ui.inline.nag.cookie.'+book_id).nag('show');
  }
  });
  xhr.open("GET", "http://localhost:8080/book/add_to_wishlist/"+book_id);
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(data);
}

//Logout function
var logout = function(){
  var data = null;
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status==200) {
      window.location.href = '/';
    }
  });
  xhr.open("GET", "http://localhost:8080/auth/logout");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
      }

//Display books in cart
  function cart_display() {
    window.location.replace("/user/cart_display");
        }
