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
import { getGroups, getGroupAmounts } from '../../store/actions/groupsActions';
import moment from 'moment';

import ExpensesTable from '../../components/expensesTable';
import Totals from '../../components/totals';
// import CategoriesPieChart from '../../components/categoriesPieChart';
import NewExpense from '../../components/newExpense';

import { Row, Col } from 'antd';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      update: this.props.update,
      start_date: moment().clone().startOf('month').format('YYYY/MM/DD'),
      end_date: moment().clone().endOf('month').format('YYYY/MM/DD'),
      monthlyTotal: 0,
      yearlyTotal: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.update();
    this.props.getGroups();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (this.state.update !== this.props.update && this._isMounted) {
      this.setState({ update: this.props.update });
      this.update();
    }
  }

  update = () => {
    this.props.getMonthlyTotal(this.state.start_date).then((total) => {
      if (this._isMounted) this.setState({ monthlyTotal: total });
    });
    this.props.getYearlyTotal(this.state.start_date).then((total) => {
      if (this._isMounted) this.setState({ yearlyTotal: total });
    });
    this.props.getUserCategories();
    this.props.getCategoryAmounts({
      start_date: this.state.start_date,
      end_date: this.state.end_date,
    });
    this.props.getGroupAmounts(this.state.start_date);
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Row gutter={[16, 16]} style={{}}>
            <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 0 }}>
              <NewExpense
                categories={this.props.categories}
                groups={this.props.groups}
              />
            </Col>
            <Col xs={{ span: 24, order: 0 }} md={{ span: 12, order: 1 }}>
              <Totals
                monthlyTotal={this.state.monthlyTotal}
                yearlyTotal={this.state.yearlyTotal}
                month={this.state.start_date}
                year={this.state.start_date}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col
              xs={{ span: 24, order: 0 }}
              md={{ span: 12, order: 0 }}
            >
              <ExpensesTable
                title={moment(new Date(this.state.start_date)).format('MMMM')}
                options={{
                  start_date: this.state.start_date,
                  end_date: this.state.end_date,
                }}
              />
            </Col>
            <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 1 }}>
              {/* <CategoriesPieChart /> */}
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
    getMonthlyTotal: (date) => dispatch(getMonthlyTotal(date)),
    getYearlyTotal: (date) => dispatch(getYearlyTotal(date)),
    getCategoryAmounts: (options) => dispatch(getCategoryAmounts(options)),
    getGroups: () => dispatch(getGroups()),
    getGroupAmounts: (date) => dispatch(getGroupAmounts(date)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
