import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';
import querystring from 'querystring';
import moment from 'moment';

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

export const getGroupAmounts = (date) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    let query = '';
    const month_dates = {
      start_date: moment(new Date(date)).startOf('month').format('YYYY/MM/DD'),
      end_date: moment(new Date(date)).endOf('month').format('YYYY/MM/DD'),
    };

    const year_dates = {
      start_date: moment(new Date(date)).startOf('year').format('YYYY/MM/DD'),
      end_date: moment(new Date(date)).endOf('year').format('YYYY/MM/DD'),
    };

    const month_query = '&' + querystring.stringify(month_dates);
    const year_query = '&' + querystring.stringify(year_dates);

    const monthly = axiosAPI
      .get('/users/' + username + '/expenses/groups?amounts=true' + month_query)
      .then((res) => {
        return res.data.groups;
      })
      .catch((err) => {
        // TODO
      });

    const yearly = axiosAPI
      .get('/users/' + username + '/expenses/groups?amounts=true' + year_query)
      .then((res) => {
        return res.data.groups;
      })
      .catch((err) => {
        // TODO
      });

    return Promise.all([monthly, yearly]).then((res) => {
      console.log(res);
      dispatch({
        type: actionTypes.GET_GROUP_AMOUNTS,
        monthlyGroups: res[0],
        yearlyGroups: res[1],
      })
    })
  };
};
