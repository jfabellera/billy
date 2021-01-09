import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class LandingPage extends Component {
  render() {
    console.log(this.props.isAuthenticated);
    if (this.props.isAuthenticated) {
      console.log('hi');
      return <Redirect to='/dashboard' />;
    } else
      return (
        <>
          <div className='d-flex flex-fill align-items-center justify-content-center overflow-auto bg-dark'>
            <h1
              id='title'
              className='display-1'
              style={{ color: '#69ff00', fontSize: '6vw' }}
            >
              Billy{' '}
              <span
                id='subtitle'
                className='display-1 text-secondary'
                style={{ fontSize: '6vw', lineHeight: '100%' }}
              >
                your personal expense tracker
              </span>
            </h1>
          </div>
        </>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
