import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const userRegisterRequest = (userInfo) => {
  return (dispatch) => {
    axios
      .post('http://localhost:5000/users', userInfo)
      .then((res) => {
        // log user in
        dispatch(
          userLoginRequest({
            username: userInfo.username,
            password: userInfo.password,
          })
        );
      })
      .catch((err) => {
        if (err.response) {
          // Username is taken
          if (err.response.status === 409) {
            dispatch({
              type: actionTypes.REGISTER_USERNAME_TAKEN,
              usernameTaken: true,
            });
          }
        }
      });
  };
};

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
            dispatch({
              type: actionTypes.LOGIN_UNSUCCESSFUL,
            });
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
