import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';

export const getUserExpenses = () => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(localStorage.getItem('accessToken')).user
      .username;
    // const username = 'jan';

    axiosAPI
      .get('/users/' + username + '/expenses')
      .then((res) => {
        dispatch({ type: actionTypes.GET_USER_EXPENSES, expenses: res.data });
      })
      .catch((err) => {});
  };
};
