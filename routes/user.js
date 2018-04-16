require('dotenv').config()
var express = require('express');
var router = express.Router();
var authHelpers=require('../authentication/_helpers');
var request = require("request");
var cloudinary = require('cloudinary');
var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

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
        res.render('signup',{title:'Error!',body:'UserName/Email already exists',display:'block'});
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
    url: 'https://sharemybook.herokuapp.com/book/0/newProduct/'
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    newproduct=JSON.parse(body);
    newproduct.data=remove_own_data(cart_detail,wishlist_detail,books,newproduct);

    //second request to fetch specials
      var options = { method: 'GET',
      url: 'https://sharemybook.herokuapp.com/book/3/specials'
      };

      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      special=JSON.parse(body);
        special.data=remove_own_data(cart_detail,wishlist_detail,books,special);

      res.render('display_books',{newproducts:newproduct.data,specials:special.data,cart_num:cart_detail.length});
      });
    });
  }
      });


//function to remove own data
function remove_own_data(cart_detail,wishlist_detail,books,newproduct) {
  //remove products by user
  for (var i = 0; i < books.length; i++) {
    for (var j = 0; j < newproduct.data.length; j++) {
      if(books[i]==newproduct.data[j].book_id){
        console.log(books[i]);
        newproduct.data.splice(j,1);
      }
    }
  }

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

  return newproduct.data;
}


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
      url: 'https://sharemybook.herokuapp.com/book/'+book_id,
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
      var imgurl= single_book.data.front_cover.split('/');
      imgurl.splice(imgurl.length-2,0,"c_fill,h_854,w_960");
      imgurl=imgurl.join('/');
    //  console.log(imgurl);

      var iur= single_book.data.front_cover.split('/');
      iur.splice(iur.length-2,0,"c_fill,h_854,w_960");
      iur=iur.join('/');
      //console.log(iur);
      res.render('book_view',{img:imgurl,book:single_book.data,mimg:iur,cart_num:cart_len,disablecart:disabledcart,disablewishlist:disabledwishlist});
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
if(req.user.books){
var books=req.user.books;
}
else{var books=[];}

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
      url: 'https://sharemybook.herokuapp.com/book/'+limit+'/'+by+'/'+offset_value
      };
    }
    else{
      var options = { method: 'GET',
      url: 'https://sharemybook.herokuapp.com/book/'+offset_value+'/'+by
      };
    }
    //console.log(by);
    //console.log(offset);
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var arr=[]
  newproduct=JSON.parse(body);
  newproduct.data=remove_own_data(cart_detail,wishlist_detail,books,newproduct);
  menulen=Math.ceil((newproduct.data.length)/9);
  for (var i = 0; i < menulen; i++) {
    arr.push(i+1);
  }
  if (offset_value==0) {
    active_value=1;
  }else {
    active_value=offset_value;
  }
  // for (var i = 0; i < cart_detail.length; i++) {
  //   for (var j = 0; j < newproduct.data.length; j++) {
  //     if(cart_detail[i]==newproduct.data[j].book_id)
  //       newproduct.data.splice(j,1);
  //   }
  // }
  // console.log("after new cart"+newproduct.data);
  // for (var i = 0; i < wishlist_detail.length; i++) {
  //   console.log("i"+wishlist_detail.length);
  //   console.log("here");
  //   for (var j = 0; j < newproduct.data.length; j++) {
  //     if(wishlist_detail[i]==newproduct.data[j].book_id){
  //       newproduct.data.splice(j,1);
  //       //console.log("jump");
  //     }
  //   }
  // }
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
    if(req.user.books){
    var books=req.user.books;
    }
    else{var books=[];}
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
          url: 'https://sharemybook.herokuapp.com/book/'+offset_value+'/'+by_type_or_genre+'/'+by_val
          };
      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var arr=[]
      var cond=false;
      newproduct=JSON.parse(body);
       newproduct.data=remove_own_data(cart_detail,wishlist_detail,books,newproduct);
      // for (var i = 0; i < cart_detail.length; i++) {
      //   for (var j = 0; j < newproduct.data.length; j++) {
      //     if(cart_detail[i]==newproduct.data[j].book_id)
      //       newproduct.data.splice(j,1);
      //   }
      // }
      // for (var i = 0; i < wishlist_detail.length; i++) {
      //   console.log("i"+wishlist_detail.length);
      //   for (var j = 0; j < newproduct.data.length; j++) {
      //     if(wishlist_detail[i]==newproduct.data[j].book_id){
      //       newproduct.data.splice(j,1);
      //     }
      //   }
      // }
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
      });
    }
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
          url: 'https://sharemybook.herokuapp.com/book/cart/cart_display',
          headers:
           {
             'cache-control': 'no-cache',
             'content-type': 'application/json' },
          body: { user: user },
          json: true };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(body.data);
          var amt=0;
          for (var i = 0; i < body.data.length; i++) {
            amt=amt+body.data[i].sp;
          }
          //console.log(amt);
          res.render('cart',{cartproducts:body.data,cart_len:req.user.cart.length,book_sp: amt});
        });
  }
  else{
    res.render('cart',{condition:true,cart_len:0,book_sp:0});}
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


router.get('/book_form',function (req,res,next) {
  if (!req.user) {
    res.redirect('/');
  }else{
  res.render('book_form');
}
});

router.post('/addbook',function (req,res,next) {
  if (!req.user) {
    res.redirect('/');
  }else{
  var form = new formidable.IncomingForm();
  var user_id=req.user.user_id;
  var username=req.user.username;
  var newarr=[];
  var book_id,front_cover,file_path;
form.multiples = true;
form=new formidable.IncomingForm();
form.parse(req)
      .on('file', function(name, file) {
        console.log('Got file:', name);
        console.log(file.path);
        file_path=file.path;
    })
    .on('field', function(name, field) {
        console.log('Got a field:', name);
        if(name=="mrp"||name=="sp"){
          newarr.push(Number(field));
        }else{
          newarr.push(field);
        }
      //  console.log(newarr);
    })
    .on('error', function(err) {
      console.log(err);
        next(err);
    })
    .on('end', function() {
      cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
    cloudinary.v2.uploader.upload(file_path,{width: 200, height: 200, crop: "fill"},
        function(error, result){console.log(result)
          book_id=result.public_id;
          front_cover=result.url;
          newarr.splice(0, 0, book_id);
          newarr.splice(1, 0, username);
          newarr.splice(9, 0, front_cover);
          newarr.splice(11, 0, 'false');
          console.log(newarr);
          var options = { method: 'GET',
            url: 'https://sharemybook.herokuapp.com/book/book/add_book',
            headers:
             {
               'cache-control': 'no-cache',
               'content-type': 'application/json' },
            body: { user: req.user,
                    newarr:newarr,
                  book_id:book_id,
                  front_cover: front_cover
                },
            json: true };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
            res.send("success");
          });
        });
    });
  }
  });

  router.post('/checkout',function (req,res,next) {
    if (!req.user) {
      res.redirect('/');
    }else{
      var booksp=req.body.booksp;
      console.log(booksp);
    res.render('checkout',{book_sp:booksp});
  }
  });

  router.get('/test',function (req,res,next) {
    res.render('checkout');
  });
module.exports = router;
