import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';

import usersReducer from './store/reducers/usersReducer';
import expensesReducer from './store/reducers/expensesReducer';
import groupsReducer from './store/reducers/groupsReducer';

import App from './App';

const rootReducer = combineReducers({
  users: usersReducer,
  expenses: expensesReducer,
  groups: groupsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
