import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUserExpenses } from '../../store/actions/expensesActions';
import ExpensesTable from '../../components/expensesTable';
import NewExpenseForm from '../../components/newExpenseForm';

import { Col } from 'react-bootstrap';

class Dashboard extends Component {
  componentDidMount() {}

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='d-flex flex-fill'>
        <Col className='d-flex flex-column w-100'>
          <div className='py-3'>
            <NewExpenseForm />
          </div>
          <div className='d-flex flex-fill pb-3'>
            <ExpensesTable />
          </div>
        </Col>
        <Col></Col>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: () => dispatch(getUserExpenses()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
