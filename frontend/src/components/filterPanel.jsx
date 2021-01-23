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

import { Card, Grid, Button, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
const { useBreakpoint } = Grid;

const FilterPanel = (props) => {
  const screens = useBreakpoint();

  return screens.md ? (
    <Card>'hi bro'</Card>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button style={{ marginLeft: 'auto' }}>Filters</Button>
      <Modal></Modal>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
