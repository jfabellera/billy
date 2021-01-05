import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getUserExpenses,
  getUserCategories,
  getMonthlyTotal,
  getYearlyTotal,
} from '../../store/actions/expensesActions';
import moment from 'moment';

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
    
    this.props.getUserExpenses({
      start_date: moment().clone().startOf('month').format('YYYY/MM/DD'),
      end_date: moment().clone().endOf('month').format('YYYY/MM/DD'),
    });
    this.update();
  }

  componentDidMount() {
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
    if (
      this.props.monthlyTotal !== null &&
      this.props.yearlyTotal !== null &&
      this.props.expenses !== null
    )
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
    else return null;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    update: state.expenses.update,
    updateAction: state.expenses.update,
    expenses: state.expenses.expenses,
    monthlyTotal: state.expenses.monthlyTotal,
    yearlyTotal: state.expenses.yearlyTotal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    getUserCategories: () => dispatch(getUserCategories()),
    getMonthlyTotal: () => dispatch(getMonthlyTotal()),
    getYearlyTotal: () => dispatch(getYearlyTotal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
