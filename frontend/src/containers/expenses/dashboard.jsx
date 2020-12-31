import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axiosAPI from '../../helpers/axiosAPI';
import { getUserExpenses } from '../../store/actions/expensesActions';

class Dashboard extends Component {
  state = {
    expenses: null,
  };

  componentDidMount() {
    this.props.getUserExpenses();
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='d-flex flex-fill overflow-auto'>
        {JSON.stringify(this.props.expenses)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    expenses: state.expenses.expenses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: () => dispatch(getUserExpenses()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
