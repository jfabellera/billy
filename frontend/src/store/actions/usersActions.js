import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAuth from '../../helpers/axiosAuth';
import axiosAPI from '../../helpers/axiosAPI';

export const userRegisterRequest = (userInfo) => {
  return (dispatch) => {
    return axiosAPI
      .post('/users', userInfo)
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
  return (dispatch) => {
    return axiosAuth
      .post('/login', userLogin)
      .then((res) => {
        // logged in

        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        dispatch({
          type: actionTypes.LOGIN_SUCCESSFUL,
          authenticatedUser: jwt.decode(res.data.refreshToken).user,
        });
        return true;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            dispatch({
              type: actionTypes.LOGIN_UNSUCCESSFUL,
            });
            return false;
          }
        }
      });
  };
};

export const userLogoutRequest = () => {
  return (dispatch) => {
    return axiosAuth
      .delete('/logout', {
        data: { token: localStorage.getItem('refreshToken') },
      })
      .then((res) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch({ type: actionTypes.LOGOUT_USER });
      });
  };
};
