import * as actionTypes from '../actions/actionTypes';
import jwt from 'jsonwebtoken';

const validCredentials = () => {
  const authorizationToken = localStorage.getItem('refreshToken');
  if (authorizationToken === null) return false;
  try {
    jwt.decode(authorizationToken);
    return true;
  } catch (err) {
    return false;
  }
};

const initialState = {
  isAuthenticated: validCredentials(),
  authenticatedUser: !validCredentials()
    ? null
    : jwt.decode(localStorage.getItem('refreshToken')).userInfo,
  usernameTaken: false,
  invalidUser: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESSFUL: {
      return {
        isAuthenticated: true,
        authenticatedUser: action.authenticatedUser,
        usernameTaken: false,
        invalidUser: false,
      };
    }
    case actionTypes.LOGIN_UNSUCCESSFUL: {
      return {
        isAuthenticated: false,
        authenticatedUser: null,
        usernameTaken: false,
        invalidUser: true,
      };
    }
    case actionTypes.LOGOUT_USER: {
      return {
        isAuthenticated: false,
        authenticatedUser: null,
        usernameTaken: false,
        invalidUser: false,
      };
    }
    case actionTypes.REGISTER_SUCCESSFUL: {
      return {
        ...state,
        usernameTaken: false,
      };
    }
    case actionTypes.REGISTER_USERNAME_TAKEN: {
      return {
        ...state,
        usernameTaken: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
