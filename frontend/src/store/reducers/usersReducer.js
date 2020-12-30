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
  authenticatedUsername: !validCredentials()
    ? null
    : jwt.decode(localStorage.getItem('refreshToken')).userInfo.username,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESSFUL:
        return {
            isAuthenticated: true,
            authenticatedUsername: action.authenticatedUsername,
        }
    case actionTypes.LOGOUT_USER: {
        return {
            isAuthenticated: false,
            authenticatedUsername: ''
        }
    }
    default:
        return state;
}
};

export default reducer;
