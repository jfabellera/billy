import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';

export const getGroups = () => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username + '/groups')
      .then((res) => {
        dispatch({
          type: actionTypes.GET_GROUPS,
          groups: res.data.groups,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};
