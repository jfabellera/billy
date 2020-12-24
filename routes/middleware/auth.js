const jwt = require('jsonwebtoken');
const config = require('../../config');

auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // verify token
    jwt.verify(token, config.jwt_access_secret, (err, user) => {
      console.log(err);
      if (err) return res.status(403).json({ message: 'Forbidden' });
      // add user from payload
      req.user = user;
      next();
    });
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
