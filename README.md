# Billy
A MERN stack application created to maintain my expenses.

# Features
- Expenses
   - Title, amount, category, date, group, and description attributes
   - Sort by attribute
   - Search by title
- Groups
   - Group expenses together i.e. by card or bank account
   - View group distributions for the month and year on the dashboard

# Usage
## Installing
1. Clone the repository
2. Place a `.env` file in _backend/_ with the following environment variables:
   - MONGODB_URI=[_mongodb uri_]
   - JWT_ACCESS_SECRET=[_secret for access tokens_]
   - JWT_REFRESH_SECRET=[_secret for refresh tokens_]
3. Place a `.env` file in _backend/_ with the following environment variables:
   - REACT_APP_AUTH_URL=[_url for auth server (e.g. http://localhost:3000)_]
   - REACT_APP_API_URL=[_url for api server (e.g. http://localhost:4000)_]
4. Run `npm install` in the _backend/_.
5. Run `npm install` in the _frontend/_.

## Running

### Development
1. Open a new terminal in _backend/_ and run `npm run auth`.
2. Open a new terminal in _backend/_ and run `npm run express`.
3. If you are on Linux/MacOS:
   - Open _frontend/package.json_ 
   - Under `scripts`, edit `start` to be
   ```
   "start": "PORT=5000 react-script start",
   ```
3. Open a new terminal in _frontend/_ and run `npm start`.


### Production
1. Open the terminal
2. Install pm2 by running `npm install -g pm2`
3. Navigate to _backend/_
4. Start the authentication server by running `sudo pm2 start authServer.js --name auth`
5. Start the API server by running `sudo pm2 start app.js --name api`
6. Navigate to _frontend/_
7. Build a production version of the react-app by running `npm run build`
8. Start the react-app by running `sudo pm2 serve build 5000 --spa --name client`
