import * as actionTypes from '../actions/actionTypes';

const initialState = {
  accounts: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts,
      };
    }
    default:
      return state;
  }
};

export default reducer;
