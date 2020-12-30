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
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESSFUL:
        return {
            isAuthenticated: true,
            authenticatedUser: action.authenticatedUser,
        }
    case actionTypes.LOGOUT_USER: {
        return {
            isAuthenticated: false,
            authenticatedUser: ''
        }
    }
    default:
        return state;
}
};

export default reducer;
