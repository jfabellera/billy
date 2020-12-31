const jwt = require('jsonwebtoken');
const config = require('../../config');

auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    // verify token
    jwt.verify(token, config.jwt_access_secret, (err, user) => {
      if (err) return res.sendStatus(401);
      // add user from payload
      req.user = user.user;
      
      if (req.params.username && req.params.username != req.user.username)
        return res.sendStatus(401);
      next();
    });
  } catch (e) {
    return res.sendStatus(401);
  }
};

module.exports = auth;
