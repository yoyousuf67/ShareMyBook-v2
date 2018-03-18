const express = require('express');
const router = express.Router();
const init = require('../authentication/passport');
const authHelpers = require('../authentication/_helpers');
const passport = require('../authentication/local');
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
init();
router.post('/register',authHelpers.loginRedirect, (req,res,next)  => {
  return authHelpers.createUser(req,res)
  .then((response) => {
    console.log(response);
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, err.message); });
});

router.post('/login',authHelpers.loginRedirect, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'Error'); }
    else if(!user) { handleResponse(res, 404, 'Invalid Credentials'); }
     else if(user) {
// "Note that when using a custom callback, it becomes the application's
// responsibility to establish a session (by calling req.login()) and send
// a response."
      req.logIn(user, function (err) {
        if (!err) {
          console.log(user);
          handleResponse(res, 200, 'success'); }
        else{
          console.log(err);
          //console.log(user.user_id);  34
          handleResponse(res, 500, 'error');}
      });
    }
  })(req, res, next);
});

router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

//display account info
router.get('/account/display_account_info',function (req,res,next) {
    var user_id=req.user.user_id;
    console.log(user_id);
  db.one("Select * from account_info where user_id=$1",[user_id])
    .then(function(data) {
      res.status(200).json({
        status:'success',
        message: "Display User Info",
        data: data
      });
        // success;
    })
    .catch(function(error) {
        // error;
        return next(error);
    });
});

//update account info
router.post('/account/update_info',function (req,res,next) {
    var user_id=req.user.user_id;
    var fullname=req.body.fullname;
    var contact_no=req.body.contact_no;
    var address=req.body.address;
  db.one("UPDATE account_info SET fullname = $1, contact_no=$2, address=$3 WHERE user_id = $4 Returning *",[fullname,contact_no,address,user_id])
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

});
module.exports = router;
