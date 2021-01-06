import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUserExpenses } from '../../store/actions/expensesActions';
import { getGroups } from '../../store/actions/groupsActions';
import GroupManager from '../../components/groupManager';
import ExpensesTable from '../../components/expensesTable';

import './expenses.css';
import { Row, Col } from 'react-bootstrap';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.props.getGroups();
    this.props.getUserExpenses({});
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    return (
      <>
        <Row className='manage'>
          <Col className='sidebar' md='3'>
            <p>hi bro</p>
            <GroupManager />
          </Col>
          <Col md='9'>
            <ExpensesTable title='All expenses' style={{ border: 0 }} />
          </Col>
        </Row>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
