import * as actionTypes from '../actions/actionTypes';

const initialState = {
  categories: null,
  monthlyTotal: null,
  yearlyTotal: null,
  categoryAmounts: null,
  update: 0,
  updateAction: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_EXPENSES: {
      return {
        ...state,
      };
    }
    case actionTypes.REFRESH_EXPENSES: {
      return {
        ...state,
        update: state.update + 1,
        updateAction: 'refresh',
      };
    }
    case actionTypes.ADD_NEW_EXPENSE: {
      return {
        ...state,
        update: state.update + 1,
        updateAction: 'add',
      };
    }
    case actionTypes.EDIT_EXPENSE: {
      return {
        ...state,
        update: state.update + 1,
        updateAction: 'edit',
      };
    }
    case actionTypes.DELETE_EXPENSE: {
      return {
        ...state,
        update: state.update + 1,
        updateAction: 'delete',
      };
    }
    case actionTypes.GET_USER_CATEGORIES: {
      return {
        ...state,
        categories: action.categories,
      };
    }
    case actionTypes.GET_CATEGORY_AMOUNTS: {
      return {
        ...state,
        categoryAmounts: action.categoryAmounts,
      };
    }
    case actionTypes.GET_MONTHLY_TOTAL: {
      return {
        ...state,
        monthlyTotal: action.monthlyTotal,
      };
    }
    case actionTypes.GET_YEARLY_TOTAL: {
      return {
        ...state,
        yearlyTotal: action.yearlyTotal,
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
