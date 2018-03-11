const bcrypt = require('bcryptjs');
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

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser (req,res) {
  return handleErrors(req)
  .then(() => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  //console.log(req.body);
  return (db.one('Insert into account_info (fullname,username,email,contact_no,address,password) values($1,$2,$3,$4,$5,$6) RETURNING *',
  [req.body.fullname,req.body.username,req.body.email,req.body.contact_no,req.body.address,hash]))
  })
  .catch((err) => {
    res.status(400).json({status: err.message});
  });
  }

  function loginRequired(req, res, next) {
  if (!req.user) return res.status(401).json({status: 'Please log in'});
  return next();
}

function loginRedirect(req, res, next) {
  if (req.user) return res.status(401).json(
    {status: 'You are already logged in'});
    console.log("loginRedirect");
  return next();
}

function handleErrors(req) {
  return new Promise((resolve, reject) => {
    console.log(req.body);
    if (req.body.username.length < 6) {
      console.log("reject");
      reject({
        message: 'Username must be longer than 6 characters'
      });
    }
    else if (req.body.password.length < 6) {
      console.log("rejectda");
      reject({
        message: 'Password must be longer than 6 characters'
      });
    } else {
      console.log("as");
      resolve();
    }
  });
}

module.exports = {
  comparePass,
  createUser,
  loginRequired,
  loginRedirect,handleErrors
};
