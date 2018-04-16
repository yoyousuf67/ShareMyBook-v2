require('dotenv').config()
var express = require('express');
var router = express.Router();
var promise = require('bluebird');
//setup db
const db_config={
host: process.env.HOST, // server name or IP address;
port: process.env.PORT||5432,
database: process.env.DATABASE,
user: process.env.USER,
password: process.env.PASSWORD,
promiseLib: promise
};
var pgp = require('pg-promise')(db_config);
const db=pgp(db_config);

//show by book type
router.get('/:offset/type/:param', function(req, res, next) {
  var offset=req.params.offset;
  var sortby=req.params.param;

  db.any('SELECT * from book_info where book_type=$1 AND is_blocked=$2 AND is_sold=$3 order by created_at desc offset $4', [sortby,"false","false",offset])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "First offset "+offset+" booktype "+sortby,
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});


//show by genre
router.get('/:offset/genre/:param', function(req, res, next) {
  var offset=req.params.offset;
  var genre=req.params.param;

  db.any('SELECT * from book_info where category=$1 AND is_blocked=$2 AND is_sold=$3 order by created_at desc offset $4', [genre,"false","false",offset])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "First offset"+offset+"books",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});


//show single book
router.get('/:bookId',function (req,res,next) {
    var bookId=req.params.bookId;
  db.one('SELECT * from book_info where book_id=$1',[bookId])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Selected Book",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});


//show special books
router.get('/:limit/specials/:offset?',function (req,res,next) {
  var limit=req.params.limit;
  var offset=req.params.offset;
  if (!offset) {
    db.any('SELECT * from book_info where is_special=$1 AND is_blocked=$2 AND is_sold=$3 order by created_at desc limit $4', [true,"false","false",limit])
      .then(function(data) {

        res.status(200).json({
          status:'success',
          message: "First"+limit+" special books",
          data: data
        });
          // success;
      })
      .catch(function(error) {
          // error;
          return next(error);
      });
  }
  else{
  db.any('SELECT * from book_info where is_special=$1 AND is_blocked=$2 AND is_sold=$3 order by created_at desc offset $4 limit $3', [true,"false","false",offset,limit])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "First"+limit+" special books with offset "+offset,
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
  }
});

//show latest books
router.get('/:offset/newProduct',function (req,res,next) {
  var offset=req.params.offset;
  console.log('offset '+offset);
  db.any('SELECT * from book_info WHERE is_blocked=$1 AND is_sold=$2 order by created_at desc limit 9 offset $3', ["false","false",offset])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "First nine books",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});


//fetch books by user
router.get('/:username/books_by_user',function (req,res,next) {
  var username=req.params.username;
  console.log('username '+username);
  db.any('SELECT book_id from book_info where username=$1 AND is_blocked=$2 AND is_sold=$3', [username,"false","false"])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "First nine books",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});

//delete a book
router.delete('/delete/:bookId',function (req,res,next) {
  var bookId=req.params.bookId;
  var user_id=req.user.user_id;
  console.log(bookId);
  db.none('delete from book_info where book_id = $1', bookId)
    .then(function() {

      db.one("Update account_info set books = array_remove(books,'"+bookId+"') where user_id="+user_id+"Returning *")
        .then(function(result) {
          res.status(200).json({
            status:'success',
            message: `Removed book`
          });
            // success;
        })
        .catch(function(error) {
            // error;
            return next(error);
        });
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});

//add to cart functionality
router.get('/add_to_cart/:bookId',function (req,res,next) {
    var bookId=req.params.bookId;
    var user_id=req.user.user_id;
  db.one("Update account_info set cart=cart||'{"+bookId+"}' where user_id="+user_id+"Returning *")
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Book added to cart",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});

//display_cart functionality
router.get('/cart/cart_display',function (req,res,next) {
    //var bookId=req.params.bookId;
    if(req.body.user.cart&&req.body.user.cart.length!=0)
{ console.log(req.body.user.cart);
  var cart=req.body.user.cart;
    var books=`(`;
    for (var i = 0; i < cart.length; i++) {

      if(i<cart.length-1){
        books=books+`'`+cart[i]+`'`+`,`;
      }
      else{
        books=books+`'`+cart[i]+`'`+`)`;
      }
      //console.log(books);
    }
    const where = pgp.as.format('WHERE book_id in '+books+"AND is_blocked='false' AND is_sold='false'");
    //console.log(books);
  db.any('SELECT * from book_info $1:raw',where)
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Cart display",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        console.log(error);
        return next(error);
    });
  }else{
    res.status(200).json({
      status:'success',
      message: "wishlist display",
      data: ''
    });
  }

});

//add_to_wishlist functionality
router.get('/add_to_wishlist/:bookId',function (req,res,next) {
    var bookId=req.params.bookId;
    var user_id=req.user.user_id;
  db.one("Update account_info set wishlist=wishlist||'{"+bookId+"}' where user_id="+user_id+"Returning *")
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Book added to wishlist",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});


//remove_from_wishlist functionality
router.get('/remove_from/:wishlist_or_cart/:bookId',function (req,res,next) {
    var bookId=req.params.bookId;
    var wishlist_or_cart=req.params.wishlist_or_cart;
    var user_id=req.user.user_id;
  db.one("Update account_info set "+wishlist_or_cart+" = array_remove("+wishlist_or_cart+",'"+bookId+"') where user_id="+user_id+"Returning *")
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Book removed from wishlist",
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});

//display wishlist functionality
router.get('/wishlist/wishlist_display',function (req,res,next) {
    //var bookId=req.params.bookId;
    console.log(req.user.wishlist);
    if (req.user.wishlist&&req.user.wishlist.length!=0) {
      var cart=req.user.wishlist;
      var books='(';
      for (var i = 0; i < cart.length; i++) {

        if(i<cart.length-1){
          books=books+`'`+cart[i]+`'`+',';
        }
        else{
          books=books+`'`+cart[i]+`'`+')';
        }
      }
      const where = pgp.as.format('WHERE book_id in '+books);
    console.log("books "+books);
  db.any('SELECT * from book_info $1:raw',where)
    .then(function(data) {
      console.log('data '+data);
      res.status(200).json({
        status:'success',
        message: "wishlist display",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        console.log(error);
        return next(error);
    });
  }else{
    res.status(200).json({
      status:'success',
      message: "wishlist display",
      data: ''
    });
  }
});


//display my books for sale functionality
router.get('/sale/sale_display',function (req,res,next) {
  var username=req.user.username;
  db.any('SELECT * from book_info where username=$1 AND is_blocked=$2 AND is_sold=$3',[username,"false","false"])
    .then(function(data) {
      console.log('data '+data);
      res.status(200).json({
        status:'success',
        message: "wishlist display",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        console.log(error);
        return next(error);
    });
});

//add a book
router.get('/book/add_book',function (req,res,next) {
  var newarr=req.body.newarr;
  var user_id=req.body.user.user_id;
  var book_id=req.body.book_id;
  if(newarr[5]<=(Math.ceil(newarr[4]/10))){newarr[11]='true'}
  console.log(newarr);
  db.none('Insert into book_info(book_id,username,bookname,author,mrp,sp,book_type,language,category,front_cover,description,is_special) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
  newarr)
    .then(function() {

        db.one("Update account_info set books=books||'{"+book_id+"}' where user_id="+user_id+"Returning *")
        .then(function(data) {
          res.status(200).json({
            status:'success',
            message: "Update User Info",
            data: data
          });
            // success;
        })
        .catch(function(error) {
            // error;
            return next(error);
        });
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});

// //Check if a book is in processing
// router.get('/book/is_processing',function (req,res,next) {
//   var book_id=req.query.book_id;
//   console.log(book_id);
//   db.any("Select is_blocked,is_sold from book_info where book_id=$1",[book_id])
// .then(function(data) {
//   res.status(200).json({
//     status:'success',
//     message: "Fetched Book Info",
//     data: data
//   });
//     // success;
// })
// .catch(function(error) {
//     // error;
//     return next(error);
// });
// });

//Block book if it is to be processed
router.put('/book/is_processed',function (req,res,next) {
  var book_id=req.query;
  var obj_len=Object.keys(book_id).length;
  console.log(Object.keys(book_id).length);
  var arr="";
  for (var key in book_id) {
      if (book_id.hasOwnProperty(key)) {
          console.log(key + " -> " + book_id[key]);
          arr=arr+" Select is_blocked,is_sold from book_info where book_id='"+book_id[key]+"' UNION ALL"
      }
  }
  var lastIndex = arr.lastIndexOf(" ");
  arr = arr.substring(0, lastIndex);
  var lastIndex = arr.lastIndexOf(" ");
  arr = arr.substring(0, lastIndex);
  console.log(arr);
  db.any(arr)
.then(function(data) {
                  console.log(data);
                var flag=true;
                  if (flag) {
                    for (var i = 0; i < data.length; i++) {
                      console.log(data[i]);
                      if (data[i].is_blocked||data[i].is_sold) {
                        res.status(204).json({
                          status:'Bad Request',
                          message: "Updated Book Info",
                          data: "Book is currently being processed"
                        });
                        break;
                        flag=false;
                      }
                    }
                  }
                  if (flag) {
                    var arr="Update book_info set is_blocked = CASE ";
                    for (var key in book_id) {
                        if (book_id.hasOwnProperty(key)) {
                            console.log(key + " -> " + book_id[key]);
                            arr=arr+" WHEN book_id ='"+book_id[key]+"' THEN true"
                        }
                    }
                    arr=arr+" END Where book_id in ("
                    for (var key in book_id) {
                        if (book_id.hasOwnProperty(key)) {
                            //console.log(key + " -> " + book_id[key]);
                            arr=arr+"'"+book_id[key]+"',"
                        }
                    }
                    arr=arr.slice(0,-1);
                    arr=arr+')';
                    console.log(arr);
                    db.any(arr)
                  .then(function(data) {
                    console.log(data);
                    res.status(200).json({
                      status:'success',
                      message: "Updated Book Info",
                      data: data
                    });
                    var arr="Update book_info set is_blocked = CASE ";
                    for (var key in book_id) {
                        if (book_id.hasOwnProperty(key)) {
                            console.log(key + " -> " + book_id[key]);
                            arr=arr+" WHEN book_id ='"+book_id[key]+"' THEN false"
                        }
                    }
                    arr=arr+" END Where book_id in ("
                    for (var key in book_id) {
                        if (book_id.hasOwnProperty(key)) {
                            //console.log(key + " -> " + book_id[key]);
                            arr=arr+"'"+book_id[key]+"',"
                        }
                    }
                    arr=arr.slice(0,-1);
                    arr=arr+')';
                    console.log(arr);
                            setTimeout(function () {
                              db.none(arr)
                            },900000);
                      // success;
                  })
                  .catch(function(error) {
                    console.log(error);
                      // error;
                      return next(error);
                  });
                  }
    // success;
})
.catch(function(error) {
  console.log(error);
    // error;
    return next(error);
});

});
//Add book to "sold" table after sold
router.put('/book/is_sold',function (req,res,next) {
  var book_id=req.query.book_id;
  var user_id=req.user.user_id;
  var cart=req.user.cart;
  var arr="update book_info as t set is_blocked=c.is_blocked,is_sold=c.is_sold from (values";
  for (var i = 0; i < cart.length; i++) {
    arr=arr+"('"+cart[i]+"',true,true),";
  }
  arr=arr.slice(0,-1);
  arr=arr+" ) as c(book_id,is_blocked,is_sold) where c.book_id=t.book_id";
  console.log(arr);
  console.log(user_id);
  db.any(arr)
.then(function(data) {
  console.log(data);
  arr="";
  for (var i = 0; i < cart.length; i++) {
    arr=arr+"("+user_id+",'"+cart[i]+"'),";
  }
    arr=arr.slice(0,-1);
  console.log(arr);
  db.any("Insert into sold (user_id,book_id) values "+arr+"")
  .then(function(data) {
    console.log(data);
    for (var i = 0; i < cart.length; i++) {
      if(i==cart.length-1){var bookie=cart[i];
        console.log("book "+bookie);
         break;}
    db.none("UPDATE account_info SET cart = array_remove(cart, $1), wishlist = array_remove(wishlist, $1);",[cart[i]])
    }
    db.none("UPDATE account_info SET cart = array_remove(cart, $1), wishlist = array_remove(wishlist, $1);",bookie)
    .then(function(data) {
    res.status(200).json({
      status:'success',
      message: "Updated Sold Book Info"
    });
      // success;
        })
        .catch(function(error) {
          console.log(error);
            // error;
            return next(error);
        });
    // success;
        })
      .catch(function(error) {
        console.log(error);
          // error;
          return next(error);
      });
  })
  .catch(function(error) {
    console.log(error);
      // error;
      return next(error);
  });
});


router.get('/book/search_api',function (req,res,next) {
  var bookname=req.query.q;
  console.log(bookname);
  db.any("SELECT book_id, bookname , author from book_info where is_blocked=$1 AND is_sold=$2 AND bookname ILIKE '%"+bookname+"%' order by created_at", ["false","false"])
    .then(function(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].book_id="https://thawing-fortress-74054.herokuapp.com/book_view/"+data[i].book_id;
      }
      res.status(200).json({
        status:'success',
        message: "Search Books API",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });

});

router.get('/book/test',function (req,res,next) {
  var cart=req.user.cart;
  console.log(req.user.cart);
  var arr="update book_info as t set is_blocked=c.is_blocked,is_sold=c.is_sold from (values";
  for (var i = 0; i < cart.length; i++) {
    arr=arr+"('"+cart[i]+"',true,true),";
  }
  arr=arr.slice(0,-1);
  arr=arr+" ) as c(book_id,is_blocked,is_sold) where c.book_id=t.book_id";
  console.log(arr);
  res.sendStatus(200);
});
module.exports = router;
