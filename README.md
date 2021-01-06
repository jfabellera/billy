# Billy
A MERN stack application created to maintain my expenses.

### Features
- Create new expenses
- View expenses
- Edit expenses
- Delete expenses
- View basic statistics about expenses

### Installing
1. Clone the repository
2. Place a `.env` file in the root project folder with the following environment variables:
   - MONGODB_URI=<mongodb url>
   - JWT_ACCESS_SECRET=<your secret key>
   - JWT_REFRESH_SECRET=<your secret key>
3. Run `npm install` in the root project folder.
4. Install nodemon with `npm install -g nodemon`
5. Run `npm run auth` to start authentication server
6. Run `npm run express` to start the express API server
7. Run `npm run client` to start the react app
8. Navigate to (http://localhost:3000) in your browser to use the application
