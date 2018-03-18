function wishlist() {
  var settings = {
"async": true,
"crossDomain": true,
"url": "http://localhost:8080/book/wishlist/wishlist_display",
"method": "GET",
"headers": {
  "content-type": "application/json",
  "cache-control": "no-cache",
  "postman-token": "5f7fe4fa-d497-e7c6-69fe-2cbd0b6d952d"
}
}
$('a.item.active').removeClass('active');
$('a.item.wishlist').addClass('active');
$.ajax(settings).done(function (response) {
  var disp=`
        <div class="ui segment ">
        <h3 class="ui header">My Wishlist</h3>
        <div class="ui four column grid computer only">
          <div class="column"></div>
          <div class="column"><h5>Detail</h5></div>
          <div class="column"><h5>Price</h5></div>
          <div class="column"></div>
        </div>
        <hr>`
  if (response.data.length==0) {
  disp=disp+  `          <div class="ui one column stackable internally celled grid">
                  <div class="column">  <h1>&nbsp;</h1>    </div><div class="column">
                    <div class="column">
                      <h3 class="header">No Books Added Yet</h3>
                    </div>
                     <h1>&nbsp;</h1>    </div><div class="column">  <h5>&nbsp;</h5>    </div>`
  }
  for (var i = 0; i < response.data.length; i++) {
    val=response.data[i]
    console.log(response.data[i]);
  disp=disp+`
      <div class="ui four column stackable celled grid">
        <div class="column">
          <img class="ui bordered image" src="http://via.placeholder.com/200x200"/>
          </div>
          <div class="column">
          <span><h4 class="ui header">`+val.bookname+ `</h4>by `+val.author+ `</span>
          </div>
            <div class="column">
            <span class="discount">&#x20b9;`+val.sp+ `</span>
            </div>
            <div class="column">
            <a onclick="remove_from_wishlist(`+val.book_id+`)">Remove from Wishlist</a><br><br><br>
            <a onclick="add_to_cart_wishlist(`+val.book_id+`)">Add to Cart</a>
            </div>
      </div>
      `
  }
  disp=disp+`</div>`
  $('#show').html(disp);
});
}
function account() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://localhost:8080/auth/account/display_account_info",
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b4dae757-7586-1c0d-eefd-fdbc42bf66c4"
    }
  }

  $.ajax(settings).done(function (response) {
    //console.log(response);
    var data=response.data;
  var disp=render_form(data);
  $('a.item.active').removeClass('active');
  $('a.item.account').addClass('active');
  $('#show').html(disp);
});
}

function render_form(data) {
  var template=`
  <div class="ui inline cookie nag">
 </div>
  <form class="ui form" id='update_form'>
    <h3>My Account</h3>
    <div class="field">
      <div class="label">Username   :</div>
      <div class="ui disabled input">
      <input type="text" placeholder="Username" value="`+data.username+`">
      </div>
    </div>
    <div class="field">
      <div class="label">Email Id   :</div>
      <div class="ui disabled input">
      <input type="email" placeholder="Email Id" value="`+data.email+`">
      </div>
    </div>
    <div class="field">
      <div class="label">Full Name   :</div>

      <input type="text" class="field-custom" placeholder="Full Name" name="fullname" value="`+data.fullname+`">

    </div>
    <div class="field">
      <div class="label">Contact No   :</div>
      <div class="ui input">
      <input type="number" placeholder="Contact No" name="contact_no" value="`+data.contact_no+`">
      </div>
    </div>
    <div class="field">
      <div class="label">Address</div>
      <textarea rows="2" placeholder="Address" name="address">`+data.address+`</textarea>
    <br>
  </div>
    <button class="ui button" type="submit">Update</button>
  </form>
  <script>
  $('#update_form').form({
    on: 'blur',
    inline: true,
    delay: false,
    fields: {
      fullname: {
        identifier: 'fullname',
        rules: [{
             type   : 'minLength[3]',
             prompt : 'Please enter a valid name',
           },
           {
             type   :'regExp[/^[a-zA-Z ]+$/]',
             prompt : 'Please enter a valid name',
           }]
      },
      address: {
        identifier: 'address',
        rules: [{
             type   : 'minLength[8]',
             prompt : 'Please enter a valid address',
           }]
      },
      contact_no: {
        identifier: 'contact_no',
        optional   : true,
        rules: [{
             type   : 'exactLength[10]',
             prompt : 'Please enter a Contact No of ten digits',
           },
           {
             type   :'regExp[/^[0-9]+$/]',
             prompt : 'Please enter a Contact No of ten digits',
           }]
      }
    }
  });
  </script>
  <script>
  //Function to submit form
    $(document).ready(function() {
    $("#update_form").submit(function(e) {
      e.preventDefault();
      $.ajax({
       type: "POST",
        url: "http://localhost:8080/auth/account/update_info",
        data: $(this).serialize(),
        success: function(response) {
          data=response.data;
          // callback code here
          console.log(response);
          var disp=render_form(data);
          $('a.item.active').removeClass('active');
          $('a.item.account').addClass('active');
          $('#show').html(disp);
          $('.cookie.nag').html('<span class="title">Account Information Successfully Updated.</span><i class="close icon"></i>').nag('show');
         }
      });
    });
  });
  </script>
  `
  return template;
}


  function my_books_for_sale() {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:8080/book/sale/sale_display",
      "method": "GET",
      "headers": {
        "cache-control": "no-cache",
        "postman-token": "c84b9e4b-b8f2-a873-01cd-538523f21cac"
      }
    }
    $('a.item.active').removeClass('active');
    $('a.item.books').addClass('active');
    $.ajax(settings).done(function (response) {
            console.log(response.data.length);
    var disp=`<div class="ui segment ">
          <h3 class="ui header">My Books for Sale</h3>
          <div class="ui four column grid computer only">
            <div class="column"></div>
            <div class="column"><h5>Detail</h5></div>
            <div class="column"><h5>Price</h5></div>
            <div class="column"></div>
          </div>
          <hr>`
    if (response.data.length==0) {
    disp=disp+  `          <div class="ui one column stackable internally celled grid">
                    <div class="column">  <h1>&nbsp;</h1>    </div><div class="column">
                      <div class="column">
                        <h3 class="header">No Books Added Yet</h3>
                      </div>
                       <h1>&nbsp;</h1>    </div><div class="column">  <h5>&nbsp;</h5>    </div>`
    }
    for (var i = 0; i < response.data.length; i++) {
      val=response.data[i]
      console.log(response.data[i]);
    disp=disp+`
        <div class="ui four column stackable celled grid">
          <div class="column">
            <img class="ui bordered image" src="http://via.placeholder.com/200x200"/>
            </div>
            <div class="column">
            <span><h4 class="ui header">`+val.bookname+ `</h4>by `+val.author+ `</span>
            </div>
              <div class="column">
              <span class="discount">&#x20b9;`+val.sp+ `</span>
              </div>
              <div class="column">
              <a onclick=del_book(`+val.book_id+`)>Remove from Catalog</a><br><br><br>
              </div>
        </div>
        `
    }
    disp=disp+`</div>`
    $('#show').html(disp);
  });
  }
function remove_from_wishlist(book_id){
  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:8080/book/remove_from/wishlist/"+book_id,
  "method": "GET",
  "headers": {
    "cache-control": "no-cache"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
    window.location.replace("/account_info/wishlist");
});
}
function add_to_cart_wishlist(book_id){
  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:8080/book/remove_from/wishlist/"+book_id,
  "method": "GET",
  "headers": {
    "cache-control": "no-cache"
  }
}

$.ajax(settings).done(function (response) {
          //second request
        var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/book/add_to_cart/"+book_id,
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "aa4b5a72-e9de-0957-6d9d-5f2a089aad01"
        }
      }

      $.ajax(settings).done(function (response) {
        window.location.replace("/account_info/wishlist");
      });

});
}
function del_book(book_id) {
  var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:8080/book/delete/"+book_id,
  "method": "DELETE",
  "headers": {
    "cache-control": "no-cache",
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
          window.location.replace("/account_info/my_books_for_sale");
});
}
