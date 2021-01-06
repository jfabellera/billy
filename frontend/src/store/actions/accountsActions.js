import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';

export const getAccounts = () => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username + '/accounts')
      .then((res) => {
        dispatch({
          type: actionTypes.GET_ACCOUNTS,
          accounts: res.data.accounts,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};
