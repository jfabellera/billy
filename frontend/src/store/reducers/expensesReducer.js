import * as actionTypes from '../actions/actionTypes';

const initialState = {
  expenses: [],
  categories: [],
  totalExpenses: 0,
  update: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_EXPENSES: {
      return {
        ...state,
        expenses: action.expenses,
        totalExpenses: action.totalExpenses,
      };
    }
    case actionTypes.ADD_NEW_EXPENSE: {
      return {
        ...state,
        update: state.update + 1,
      };
    }
    case actionTypes.EDIT_EXPENSE: {
      return {
        ...state,
        update: state.update + 1,
      };
    }
    case actionTypes.GET_USER_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
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
