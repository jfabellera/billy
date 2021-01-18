import React, { useState } from 'react';
import { connect } from 'react-redux';
// import update from 'immutability-helper';
import {
  getGroups,
  addGroup,
  editGroup,
  deleteGroup,
  setDefaultGroup,
} from '../store/actions/groupsActions';

import { Card } from 'antd';

const GroupManager = (props) => {
  return (
      <Card>
        Hi bro
      </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
    addGroup: (group_name) => dispatch(addGroup(group_name)),
    editGroup: (group) => dispatch(editGroup(group)),
    deleteGroup: (group_id) => dispatch(deleteGroup(group_id)),
    setDefaultGroup: (group_id) => dispatch(setDefaultGroup(group_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupManager);
