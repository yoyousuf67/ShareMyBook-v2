const express = require('express');
const router = express.Router();
const init = require('../authentication/passport');
const authHelpers = require('../authentication/_helpers');
const passport = require('../authentication/local');
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
    if (err) { handleResponse(res, 500, 'errorhere'); }
    else if(!user) { handleResponse(res, 404, 'User not found'); }
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


module.exports = router;
