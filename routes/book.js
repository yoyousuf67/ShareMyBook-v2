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

//delete a book
router.delete('/delete/:bookId',function (req,res,next) {
  var bookId=req.params.bookId;
  console.log(bookId);
  db.result('delete from book_info where book_id = $1', bookId)
    .then(function(result) {
      res.status(200).json({
        status:'success',
        message: `Removed ${result.rowCount} book`
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});

//cart functionality
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
    console.log(req.body);
    var cart=req.body.user.cart;
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

});

/*
router.get('/relatedProducts/:genreortype',function (req,res,next) {
  var genreortype=req.params.genreortype;
  db.any('SELECT * from book_info order by created_at limit 3')
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Related Books",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});*/

module.exports = router;
