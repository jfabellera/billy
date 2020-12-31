import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axiosAPI from '../../helpers/axiosAPI';

class Dashboard extends Component {
  state = {
    expenses: null,
  };

  componentDidMount() {
    axiosAPI
      .get('http://localhost:5000/users/johndoe/expenses')
      .then((res) => {
        this.setState({ expenses: JSON.stringify(res.data, null, 4) });
      })
      .catch((err) => {
        this.setState({ expenses: 'please log in' });
      });
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div className='d-flex flex-fill overflow-auto'>
        {this.state.expenses}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
