require('dotenv').config();

module.exports = {
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  mongodb_uri: process.env.MONGODB_URI,
  auth_port: 3000,
  api_port: 4000
};
