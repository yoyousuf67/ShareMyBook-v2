var express = require('express');
var router = express.Router();
var authHelpers=require('../authentication/_helpers');
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
router.post('/',authHelpers.loginRequired,function(req, res, next) {
      res.render('index', { title: 'Hello',condition: false, anyArray:[1,2,3]});
      });

module.exports = router;
