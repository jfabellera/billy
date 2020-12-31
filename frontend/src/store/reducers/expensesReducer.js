import * as actionTypes from '../actions/actionTypes';
import jwt from 'jsonwebtoken';

const initialState = {
  expenses: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_EXPENSES: {
      return {
        expenses: action.expenses,
      };
    }
    case actionTypes.LOGOUT_USER: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
