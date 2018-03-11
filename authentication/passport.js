var passport = require('passport');
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
module.exports = () => {

  passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user.user_id);
  });

  passport.deserializeUser((user_id, done) => {
    db.one('Select * from account_info where user_id=$1',[user_id])
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });

};
