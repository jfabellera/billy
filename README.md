# Billy

A MERN stack monorepo application created to maintain my expenses.

Check it out [here](https://billytracking.co/).

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

This is a `Node.js` project. Get [nvm](https://github.com/nvm-sh/nvm) if you are on a UNIX system or [nvm-windows](https://github.com/coreybutler/nvm-windows) if on Windows, and then install `node` (and `npm`).

This project uses [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to manage aspects of being a monorepo. Ensure you have `yarn` by running:

```
npm i -g yarn
```

This project uses a combination of `eslint` and `prettier` to enforce code style. To ensure that all commits conform to the standard, perform the following steps:

- [Install the Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- In VS Code Settings, search for `Prettier: Config Path` and edit its value to be

```
.prettierrc
```

- In VS Code Settings, search for `Editor: Default Formatter` and choose `esbenp.prettier-vscode` from the dropdown

After cloning the repository, perform the following steps:

1. Place a `.env` file in _backend/_ with the following secrets:

   ```
   MONGODB_URI=[mongodb uri]
   JWT_ACCESS_SECRET=[secret for access tokens]
   JWT_REFRESH_SECRET=[secret for refresh tokens]
   ```

2. Run `yarn install`.

## Running

### Development

To start up both the backend and the frontend, run the following:

```
yarn start
```

To manually check changes on a mobile device, please perform the following:

1. Find your internal IP by running `ipconfig` (Windows) or `ifconfig` (UNIX)

2. In `frontend/src/config.js`, manually replace `localhost` with your internal IP
3. After running `yarn start` with the updated endpoints, on your mobile device, navigate to `http://{internal_ip}:{frontend_port}`

The reason this is necessary is because when your mobile device hits the frontend and attempts to perform any backend calls (logging in, fetching data), it would normally call `localhost`. Since your mobile device is not serving a backend locally, the calls fail. This modification to the endpoint ensures that the frontend hits the backend on your development machine, no matter where the frontend is being served.

**HINT: Be sure not to commit these changes as the internal IP will not be the same between different machines.**

### Production

1. Open the terminal
2. Install pm2 by running `npm install -g pm2`
3. Navigate to _backend/_
4. Start the authentication server by running `sudo pm2 start authServer.js --name auth`
5. Start the API server by running `sudo pm2 start app.js --name api`
6. Navigate to _frontend/_
7. Build a production version of the react-app by running `npm run build`
8. Start the react-app by running `sudo pm2 serve build 5000 --spa --name client`
