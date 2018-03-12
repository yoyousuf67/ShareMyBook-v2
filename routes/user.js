var express = require('express');
var router = express.Router();
var authHelpers=require('../authentication/_helpers');
var request = require("request");
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello',condition: false, anyArray:[1,2,3]});
});
router.get('/test/:id',function (req,res,next) {
    res.render('test',{output: req.params.id});
})
router.post('/test/submit',function (req,res,next) {
  var id=req.body.id;
  res.redirect('/test/'+id);
})*/

//create a User
router.get('/index',authHelpers.loginRequired,function(req, res, next) {
      res.render('index', { title: 'Hello',condition: false, anyArray:[1,2,3]});
      });
router.get('/',function(req, res, next) {
      res.render('login',{display:'none'});
      });
router.get('/register',function(req, res, next) {
      res.render('signup');
      });
router.get('/success',function (req,res,next) {
  res.render('login',{title:'Success!',body:'Login with your new credentials',display:'block'});
});
  //display homepage
router.get('/display_books',function(req, res, next) {
    var options = { method: 'GET',
    url: 'http://localhost:8080/book/9/newProduct/'
    };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    newproduct=JSON.parse(body);
    //console.log(string.data);
    //second request
      var options = { method: 'GET',
      url: 'http://localhost:8080/book/3/specials'
      };

      request(options, function (error, response, body) {
      if (error) throw new Error(error);
      special=JSON.parse(body);
      console.log(special.data);
      res.render('display_books',{newproducts:newproduct.data,specials:special.data});
      });
    });
      });
//display particular book
router.get('/book_view/:book_id',function (req,res,next) {
    book_id=req.params.book_id;
    console.log("book id "+book_id);
    var options = { method: 'GET',
      url: 'http://localhost:8080/book/'+book_id,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      single_book=JSON.parse(body);
      console.log(single_book.data);

      res.render('book_view',{book:single_book.data});
    });
});
router.get('/shit',function (req,res,next) {
  console.log(req.user);
    res.send(req.user);
})

module.exports = router;
