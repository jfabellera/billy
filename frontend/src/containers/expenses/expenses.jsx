import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getUserExpenses,
  refreshExpenses,
} from '../../store/actions/expensesActions';
import { getGroups } from '../../store/actions/groupsActions';
import GroupManager from '../../components/groupManager';
import ExpensesTable from '../../components/expensesTable';

import { Row, Col } from 'antd';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group_id: null,
      group_name: 'All expenses',
    };

    this.props.getGroups();
  }

  onGroupChange = (value) => {
    this.setState(
      { group_id: value.id, group_name: value.name },
      this.props.refreshExpenses
    );
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    return (
      <>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
        <Row gutter={16} style={{height: '100%'}}>
          <Col xs={24} md={6}>
            <GroupManager onChange={this.onGroupChange} />
          </Col>
          <Col xs={24} md={18}>
            <ExpensesTable
              title={this.state.group_name}
              options={
                this.state.group_id ? { group_id: this.state.group_id } : {}
              }
            />
          </Col>
        </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    refreshExpenses: () => dispatch(refreshExpenses()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
