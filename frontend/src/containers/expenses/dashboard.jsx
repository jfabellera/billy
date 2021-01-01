import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUserExpenses } from '../../store/actions/expensesActions';
import ExpensesTable from '../../components/expensesTable';

class Dashboard extends Component {
  componentDidMount() {}

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='d-flex flex-fill'>
        <div style={{ height: '100%' }}>
          <ExpensesTable />
        </div>
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
