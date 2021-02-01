import * as actionTypes from '../actions/actionTypes';

const initialState = {
  groups: null,
  monthlyGroups: null,
  yearlGroups: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_GROUPS: {
      return {
        ...state,
        groups: action.groups,
      };
    }
    case actionTypes.EDIT_GROUP: {
      return state;
    }
    case actionTypes.SET_DEFAULT_GROUP: {
      return state;
    }
    case actionTypes.ADD_GROUP: {
      return state;
    }
    case actionTypes.DELETE_GROUP: {
      return state;
    }
    case actionTypes.GET_GROUP_AMOUNTS: {
      console.log(action.monthlyGroups)
      return {
        ...state,
        monthlyGroups: action.monthlyGroups,
        yearlyGroups: action.yearlyGroups,
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
