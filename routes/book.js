var express = require('express');
var router = express.Router();
var promise = require('bluebird');
//setup db
const db_config={
host: 'localhost', // server name or IP address;
port: 5432,
database: 'smb',
user: 'user',
password: 'root',
promiseLib: promise
};
var pgp = require('pg-promise')(db_config);
const db=pgp(db_config);

//show by book type
router.get('/:offset/type/:param', function(req, res, next) {
  var offset=req.params.offset;
  var sortby=req.params.param;

  db.any('SELECT * from book_info where book_type=$1 order by created_at desc offset $2', [sortby,offset])
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

  db.any('SELECT * from book_info where category=$1 order by created_at desc offset $2', [genre,offset])
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
    db.any('SELECT * from book_info where is_special=$1 order by created_at desc limit $2', [true,limit])
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
  db.any('SELECT * from book_info where is_special=$1 order by created_at desc offset $2 limit $3', [true,offset,limit])
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
  db.any('SELECT * from book_info order by created_at desc limit 9 offset $1', [offset])
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
  db.any('SELECT book_id from book_info where username=$1', [username])
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
      console.log(books);
    }
    const where = pgp.as.format('WHERE book_id in '+books);
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
  db.any('SELECT * from book_info where username=$1',[username])
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


module.exports = router;
