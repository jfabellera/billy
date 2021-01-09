require('dotenv').config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  jwt_access_secret: JWT_ACCESS_SECRET,
  jwt_refresh_secret: JWT_REFRESH_SECRET,
  mongodb_uri: MONGODB_URI,
};
