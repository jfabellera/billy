import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getUserExpenses,
  getUserCategories,
  getCategoryAmounts,
  getMonthlyTotal,
  getYearlyTotal,
} from '../../store/actions/expensesActions';
import { getGroups } from '../../store/actions/groupsActions';
import moment from 'moment';

// import ExpensesTable from '../../components/expensesTable';
import Totals from '../../components/totals';
// import CategoriesPieChart from '../../components/categoriesPieChart';
import NewExpense from '../../components/newExpense';

import { Row, Col } from 'antd';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      update: this.props.update,
      start_date: moment().clone().startOf('month').format('YYYY/MM/DD'),
      end_date: moment().clone().endOf('month').format('YYYY/MM/DD'),
    };

    this.props.getGroups();
    this.props.getUserExpenses({
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    });
    this.update();
  }

  componentDidMount() {}

  componentDidUpdate() {
    if (this.state.update !== this.props.update) {
      this.setState({ update: this.props.update });
      this.update();
    }
  }

  update = () => {
    this.props.getMonthlyTotal();
    this.props.getYearlyTotal();
    this.props.getUserCategories();
    this.props.getCategoryAmounts({
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    });
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    if (this.props.expenses !== null && this.props.groups !== null)
      return (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 0 }}>
              <NewExpense categories={this.props.categories} groups={this.props.groups} />
            </Col>
            <Col xs={{ span: 24, order: 0 }} md={{ span: 12, order: 1 }}>
              <Totals />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24, order: 0 }} md={{ span: 12, order: 0 }}>
              Table
            </Col>
            <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 1 }}>
              Graphs n stuff
              {/* <CategoriesPieChart /> */}
            </Col>
          </Row>
        </>
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
    categories: state.expenses.categories,
    monthlyTotal: state.expenses.monthlyTotal,
    yearlyTotal: state.expenses.yearlyTotal,
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    getUserCategories: () => dispatch(getUserCategories()),
    getMonthlyTotal: () => dispatch(getMonthlyTotal()),
    getYearlyTotal: () => dispatch(getYearlyTotal()),
    getCategoryAmounts: (options) => dispatch(getCategoryAmounts(options)),
    getGroups: () => dispatch(getGroups()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
