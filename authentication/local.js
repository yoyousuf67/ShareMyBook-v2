const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const init = require('./passport');
const authHelpers = require('./_helpers');
var promise = require('bluebird');
const db_config={
host: 'localhost', // server name or IP address;
port: 5432,
database: 'smb',
user: 'user',
password: 'root',
promiseLib: promise
};
options={}
var pgp = require('pg-promise')(db_config);
const db=pgp(db_config);
passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  db.oneOrNone('Select * from account_info where username=$1',[username])
  .then((user) => {
    //console.log(user);
    if (!user) return done(null, false);
    else if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;
