import * as actionTypes from '../actions/actionTypes';

const initialState = {
  getGroups: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_GROUPS: {
      return {
        ...state,
        groups: action.groups,
      };
    }
    default:
      return state;
  }
};

export default reducer;
