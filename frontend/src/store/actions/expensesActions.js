import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';
import querystring from 'querystring';

/**
 * Get the expenses for the current user that follow the specified options
 * like sort order, sort criteria, start date, end date, etc.
 *
 * @param {Object} options
 */
export const getUserExpenses = (options) => {
  return (dispatch) => {
    // decocode jwt to get username
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(localStorage.getItem('accessToken')).user
      .username;

    // construct query params from options
    let query = '';
    if (options) {
      query = '?' + querystring.stringify(options);
    }

    // make request for user expenses with query params
    return axiosAPI
      .get('/users/' + username + '/expenses' + query)
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER_EXPENSES,
          expenses: res.data.expenses,
          totalExpenses: res.data.total,
        });
      })
      .catch((err) => {});
      
  };
};
