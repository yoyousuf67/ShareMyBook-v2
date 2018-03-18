var express = require('express');
var router = express.Router();
var authHelpers=require('../authentication/_helpers');
var request = require("request");

//create a User
// router.get('/index',authHelpers.loginRequired,function(req, res, next) {
//       res.render('index', { title: 'Hello',condition: false, anyArray:[1,2,3]});
//       });
router.get('/',function(req, res, next) {
    if(req.user){
      res.redirect('/display_books');
    }
    else{
    res.render('login',{display:'none'});
    }

      });

router.get('/register/:type?',function(req, res, next) {
    var type=req.params.type;
    if(req.user){
      res.redirect('/display_books');
    }
    else{
      if (!type) {
        res.render('signup',{display:'none'});
      }else{
        res.render('signup',{title:'Error!',body:'Error Occurred',display:'block'});
      }
    }
      });
router.get('/success/:val',function (req,res,next) {
    var val=req.params.val;
    if(req.user){
      res.redirect('/display_books');
    }
    else{
      if (val=="success") {
          res.render('login',{title:'Success!',body:'Login with your new credentials',display:'block',value:val});
      }else {
        res.render('login',{title:'Error!',body:val,display:'block',value:'danger'});
      }
    }

});
  //display homepage
router.get('/display_books',function(req, res, next) {
  if(!req.user){
    res.redirect('/');
  }
  else{
    if(req.user.cart){
    var cart_detail=req.user.cart;
  }
  else{var cart_detail=[];}

  if(req.user.wishlist){
  var wishlist_detail=req.user.wishlist;
}
else{var wishlist_detail=[];}

if(req.user.books){
var books=req.user.books;
}
else{var books=[];}
//first request to fetch newproducts
    var options = { method: 'GET',
    url: 'http://localhost:8080/book/0/newProduct/'
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    newproduct=JSON.parse(body);
    //remove products in cart
    for (var i = 0; i < cart_detail.length; i++) {
      for (var j = 0; j < newproduct.data.length; j++) {
        if(cart_detail[i]==newproduct.data[j].book_id)
          newproduct.data.splice(j,1);
      }
    }
    //remove products in wishlist
    for (var i = 0; i < wishlist_detail.length; i++) {
      //console.log("i"+wishlist_detail.length);
      for (var j = 0; j < newproduct.data.length; j++) {
        if(wishlist_detail[i]==newproduct.data[j].book_id){
          newproduct.data.splice(j,1);
          console.log("jump");
        }
      }
    }
    //remove products by user
    for (var i = 0; i < books.length; i++) {
      for (var j = 0; j < newproduct.data.length; j++) {
        if(books[i]==newproduct.data[j].book_id)
          newproduct.data.splice(j,1);
      }
    }
    //second request to fetch specials
      var options = { method: 'GET',
      url: 'http://localhost:8080/book/3/specials'
      };

      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      special=JSON.parse(body);
        for (var i = 0; i < cart_detail.length; i++) {
          for (var j = 0; j < special.data.length; j++) {
            if(cart_detail[i]==special.data[j].book_id)
              special.data.splice(j,1);
          }
        }
        for (var i = 0; i < wishlist_detail.length; i++) {
          for (var j = 0; j < special.data.length; j++) {
            if(wishlist_detail[i]==special.data[j].book_id)
              special.data.splice(j,1);
          }
        }


      res.render('display_books',{newproducts:newproduct.data,specials:special.data,cart_num:cart_detail.length});
      });
    });
  }
      });

//display particular book
router.get('/book_view/:book_id',function (req,res,next) {
  if(!req.user){
    res.redirect('/');
  }
  else{
    if(req.user.cart){
    var cart_detail=req.user.cart;
    var cart_len=req.user.cart.length;
  }
  else{
    var cart_detail=[];
    var cart_len=0;
  }
  if(req.user.wishlist){
  var wishlist_detail=req.user.wishlist;
  var wishlist_len=req.user.wishlist.length;
}
else{
  var wishlist_detail=[];
  var wishlist_len=0;
}
    var book_id=req.params.book_id;
    console.log("book id "+book_id);
    var options = { method: 'GET',
      url: 'http://localhost:8080/book/'+book_id,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      single_book=JSON.parse(body);
      //console.log(single_book.data);

        for (var j = 0; j < cart_detail.length; j++) {
          if(cart_detail[j]==single_book.data.book_id){
              var disabledcart="disabledbutton";
              var disabledwishlist="disabledbutton";
              //console.log(disabled);
            }
        }
        for (var j = 0; j < wishlist_detail.length; j++) {
          if(wishlist_detail[j]==single_book.data.book_id){
              var disabledwishlist="disabledbutton";
              //console.log(disabled);
            }
        }

      res.render('book_view',{book:single_book.data,cart_num:cart_len,disablecart:disabledcart,disablewishlist:disabledwishlist});
    });
  }
});

//display sorted books
router.get('/show_sorted_books/:by/:offset?',function(req, res, next) {
  if(!req.user){
    res.redirect('/');
  }
  else{
    if(req.user.cart){
    var cart_detail=req.user.cart;
    var cart_len=req.user.cart.length;
  }
  else{
    var cart_detail=[];
    var cart_len=0;
  }
  if(req.user.wishlist){
  var wishlist_detail=req.user.wishlist;
  var wishlist_len=req.user.wishlist.length;
}
else{
  var wishlist_detail=[];
  var wishlist_len=0;
}
    var offset_value;
    var by=req.params.by;
    var offset=req.params.offset;
    if (!offset||offset==0) {
      offset_value=0;
    }
    else{
      offset_value=((offset-1)*9);
    }
    if (by=="specials") {
      var limit=9;
      var options = { method: 'GET',
      url: 'http://localhost:8080/book/'+limit+'/'+by+'/'+offset_value
      };
    }
    else{
      var options = { method: 'GET',
      url: 'http://localhost:8080/book/'+offset_value+'/'+by
      };
    }
    //console.log(by);
    //console.log(offset);
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var arr=[]
  newproduct=JSON.parse(body);
  menulen=Math.ceil((newproduct.data.length)/9);
  for (var i = 0; i < menulen; i++) {
    arr.push(i+1);
  }
  //console.log("arr"+arr);
  // console.log("by"+by);
  // console.log("offset"+newproduct.data);
  if (offset_value==0) {
    active_value=1;
  }else {
    active_value=offset_value;
  }
  for (var i = 0; i < cart_detail.length; i++) {
    for (var j = 0; j < newproduct.data.length; j++) {
      if(cart_detail[i]==newproduct.data[j].book_id)
        newproduct.data.splice(j,1);
    }
  }
  console.log("after new cart"+newproduct.data);
  for (var i = 0; i < wishlist_detail.length; i++) {
    console.log("i"+wishlist_detail.length);
    console.log("here");
    for (var j = 0; j < newproduct.data.length; j++) {
      if(wishlist_detail[i]==newproduct.data[j].book_id){
        newproduct.data.splice(j,1);
        console.log("jump");
      }
    }
  }
  // for (var i = 0; i < newproduct.data.length; i++) {
  //   for (var j = 0; j < cart_detail.length; j++) {
  //     if(cart_detail[j]==newproduct.data[i].book_id)
  //       newproduct.data.splice(i,1);
  //       //console.log(newproduct.data);
  //   }
  // }
  //console.log(req.user.cart.length);
    res.render('show_sorted_books',{sortedproducts:newproduct.data,datalen:arr,by_type:by,active:active_value,cart_num:cart_len});
  });}
    });

    //display sorted books by type or genre
    router.get('/show_sorted_books_by_tog/:by_type_or_genre/:by_val/:offset?',function(req, res, next) {
      if(!req.user){
        res.redirect('/');
      }
      else{
        if(req.user.cart){
        var cart_detail=req.user.cart;
        var cart_len=req.user.cart.length;
      }
      else{
        var cart_detail=[];
        var cart_len=0;
      }
      if(req.user.wishlist){
      var wishlist_detail=req.user.wishlist;
      var wishlist_len=req.user.wishlist.length;
    }
    else{
      var wishlist_detail=[];
      var wishlist_len=0;
    }
      var offset_value;
      var by_val=req.params.by_val;
        var by_type_or_genre=req.params.by_type_or_genre;
        var offset=req.params.offset;
        if (!offset||offset==0) {
          offset_value=0;
        }
        else{
          offset_value=((offset-1)*9);
        }
          var options = { method: 'GET',
          url: 'http://localhost:8080/book/'+offset_value+'/'+by_type_or_genre+'/'+by_val
          };
      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var arr=[]
      var cond=false;
      newproduct=JSON.parse(body);
      for (var i = 0; i < cart_detail.length; i++) {
        for (var j = 0; j < newproduct.data.length; j++) {
          if(cart_detail[i]==newproduct.data[j].book_id)
            newproduct.data.splice(j,1);
        }
      }
      for (var i = 0; i < wishlist_detail.length; i++) {
        console.log("i"+wishlist_detail.length);
        for (var j = 0; j < newproduct.data.length; j++) {
          if(wishlist_detail[i]==newproduct.data[j].book_id){
            newproduct.data.splice(j,1);
          }
        }
      }
      menulen=Math.ceil((newproduct.data.length)/9);
      if (menulen==0) {
        arr.push(1);
        cond=true;
      }else{
        for (var i = 0; i < menulen; i++) {
          arr.push(i+1);
        }
      }

      if (offset_value==0) {
        active_value=1;
      }else {
        active_value=offset_value;
      }
        res.render('show_sorted_books',{sortedproducts:newproduct.data,datalen:arr,condition:cond,by_type:by_type_or_genre,active:active_value,active_tog:by_val,cart_num:cart_len});
      });}
        });

//cart display
router.get('/user/cart_display',function (req,res,next) {
  if(!req.user){
    res.redirect('/');
  }
  else{
    if(req.user.cart&&req.user.cart.length!=0){
      var user=req.user;
      console.log(user);
        var options = { method: 'GET',
          url: 'http://localhost:8080/book/cart/cart_display',
          headers:
           {
             'cache-control': 'no-cache',
             'content-type': 'application/json' },
          body: { user: user },
          json: true };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          console.log(body);
          res.render('cart',{cartproducts:body.data});
        });
  }
  else{
    res.render('cart',{condition:true});}
}
});


router.get('/account_info/:data',function (req,res,next) {
  if (!req.user) {
    res.redirect('/');
  }else{
  var data=req.params.data;
    res.render('account',{to_display:data});
  }
});


router.get('/shit',function (req,res,next) {
  var user=req.user;
  console.log(user);
    res.send(user);
});


module.exports = router;
