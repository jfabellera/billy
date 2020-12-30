import * as actionTypes from './actionTypes';
// import jwt from 'jsonwebtoken';

export const userLoginRequest = () => {
  console.log('login requested');
  return (dispatch) => {
    dispatch({
      type: actionTypes.LOGIN_SUCCESSFUL,
    });
  };
};

export const userLogoutRequest = () => {
  console.log('logout requested');
  return (dispatch) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: actionTypes.LOGOUT_USER });
  };
};
