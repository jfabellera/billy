import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class LandingPage extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    } else
      return (
        <>
          <div
            style={{
              display: 'flex',
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10vmax',
            }}
          >
            Billy
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
