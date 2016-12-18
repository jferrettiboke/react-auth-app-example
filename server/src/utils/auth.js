const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const config = require('../config');

exports.getTokenFromRequest = req => (
  req.body.token || req.params.token || req.headers.authorization
);

exports.createToken = payload => (
  jwt.sign(payload, config.auth.secret, {
    expiresIn: config.auth.expiresIn
  })
);

exports.verifyToken = (token, callback) => {
  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      return callback(err);
    }

    return callback(null, decoded);
  });
};

exports.encryptPassword = (password, callback) => {
  // Generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return callback(err); }

    // Hash (encrypt) our password using the salt
    return bcrypt.hash(password, salt, null, (err2, hash) => {
      if (err2) { return callback(err2); }
      return callback(null, hash);
    });
  });
};

exports.comparePassword = (currentPassword, candidatePassword, callback) => (
  bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
    if (err) { return callback(err); }
    return callback(null, isMatch);
  })
);
