import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const userLoginRequest = (userLogin) => {
  console.log('login requested');

  return async (dispatch) => {
    await axios
      .post('http://localhost:5001/login', userLogin)
      .then((res) => {
        // logged in

        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        dispatch({
          type: actionTypes.LOGIN_SUCCESSFUL,
          authenticatedUser: jwt.decode(res.data.refreshToken).userInfo,
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.setState({ invalid: true });
          }
        }
      });
  };
};

export const userLogoutRequest = () => {
  console.log('logout requested');
  return (dispatch) => {
    axios
      .delete('http://localhost:5001/logout', {
        data: { token: localStorage.getItem('refreshToken') },
      })
      .then((res) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: actionTypes.LOGOUT_USER });
      });
  };
};
