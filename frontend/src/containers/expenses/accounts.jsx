import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAccounts } from '../../store/actions/accountsActions';

class Accounts extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.props.getAccounts();
  }

  render() {
    if (this.props.accounts)
      return this.props.accounts.map((acc, i) => <div key={i}>{acc.name}</div>);
    else return null;
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts.accounts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAccounts: () => dispatch(getAccounts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
