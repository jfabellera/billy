import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';

export const getUserExpenses = () => {
  return (dispatch) => {
    const username = jwt.decode(localStorage.getItem('accessToken')).user.username;

    axiosAPI
      .get('/users/' + username + '/expenses')
      .then((res) => {
        console.log(res.data);
        dispatch({ type: actionTypes.GET_USER_EXPENSES, expenses: res.data });
      })
      .catch((err) => {});
  };
};
