import * as actionTypes from '../actions/actionTypes';

const initialState = {
  expenses: [],
  totalExpenses: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_EXPENSES: {
      return {
        expenses: action.expenses,
        totalExpenses: action.totalExpenses,
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
