import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';
import querystring from 'querystring';

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

export const addGroup = (group_name) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username)
      .then((res) => {
        return axiosAPI
          .post('/groups/', { user_id: res.data._id, name: group_name })
          .then((res) => {
            dispatch({
              type: actionTypes.ADD_GROUP,
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

export const editGroup = (group) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    return axiosAPI
      .put('/groups/' + group._id, { name: group.name })
      .then((res) => {
        dispatch({
          type: actionTypes.EDIT_GROUP,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

export const deleteGroup = (group_id) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    return axiosAPI
      .delete('/groups/' + group_id)
      .then((res) => {
        dispatch({
          type: actionTypes.DELETE_GROUP,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

export const setDefaultGroup = (group_id) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username)
      .then((res) => {
        return axiosAPI
          .put('/users/' + res.data._id, { default_group_id: group_id })
          .then((res) => {
            dispatch({
              type: actionTypes.SET_DEFAULT_GROUP,
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

export const getGroupAmounts = (options) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    let query = '';
    if (options) {
      query = '&' + querystring.stringify(options);
    }

    return axiosAPI
      .get('/users/' + username + '/expenses/groups?amounts=true' + query)
      .then((res) => {
        
      })
      .catch((err) => {
        // TODO
      });
  };
};
