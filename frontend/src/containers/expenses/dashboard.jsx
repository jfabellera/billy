import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getUserExpenses,
  getUserCategories,
  getMonthlyTotal,
  getYearlyTotal,
} from '../../store/actions/expensesActions';
import ExpensesTable from '../../components/expensesTable';
import NewExpenseForm from '../../components/newExpenseForm';
import Totals from '../../components/totals';

import { Col } from 'react-bootstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      update: this.props.update,
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    if (this.state.update !== this.props.update) {
      console.log('updating dashboard BRO !');
      this.setState({ update: this.props.update });
      this.update();
    }
  }

  update = () => {
    this.props.getMonthlyTotal();
    this.props.getYearlyTotal();
    this.props.getUserCategories();
  };

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
            <ExpensesTable variant='currentMonth' />
          </div>
        </Col>
        <Col className='w-100'>
          <Totals />
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    update: state.expenses.update,
    updateAction: state.expenses.update,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: () => dispatch(getUserExpenses()),
    getUserCategories: () => dispatch(getUserCategories()),
    getMonthlyTotal: () => dispatch(getMonthlyTotal()),
    getYearlyTotal: () => dispatch(getYearlyTotal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
