const environment = process.env.NODE_ENV;

// Assumes development and production - refactor as needed for test
const endpoints =
  environment === 'development'
    ? {
        auth: 'http://localhost:3000',
        api: 'http://localhost:4000',
      }
    : {
        auth: 'https://billytracking.co/auth',
        api: 'https://billytracking.co/api',
      };

module.exports = { endpoints };
