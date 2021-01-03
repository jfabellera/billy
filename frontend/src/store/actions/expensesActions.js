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
    const username = jwt.decode(token).user.username;

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
      .catch((err) => {
        // TODO
      });
  };
};

/**
 * Adds expense for the user
 * @param {Object} expense
 */
export const addNewExpense = (expense) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    // get user_id
    return axiosAPI
      .get('/users/' + username)
      .then((res) => {
        expense.user_id = res.data._id;
        axiosAPI
          .post('/expenses', expense)
          .then((res) => {
            dispatch({
              type: actionTypes.ADD_NEW_EXPENSE,
            });
          })
          .catch((err) => {
            // TODO
          });
      })
      .catch((err) => {
        // TODO
      });
  };
};

/**
 * Edits an expense for the user
 * @param {Object} expense
 */
export const editExpense = (expense) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    return axiosAPI
      .put('/expenses/' + expense.id, expense)
      .then((res) => {
        dispatch({
          type: actionTypes.EDIT_EXPENSE,
        });
      })
      .catch((err) => {
        //TODO
      });
  };
};

export const deleteExpense = (expenseId) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    return axiosAPI
      .delete('/expenses/' + expenseId)
      .then((res) => {
        dispatch({
          type: actionTypes.DELETE_EXPENSE,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

export const getUserCategories = () => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username + '/expenses/categories')
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER_CATEGORIES,
          categories: res.data,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};
