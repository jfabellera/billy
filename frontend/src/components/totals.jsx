import React, { Component } from 'react';
import { connect } from 'react-redux';

import './totals.css';

class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='d-flex flex-fill align-items-center justify-content-center'
      style={{ padding: '12px' }}>
        <div className='monthly-total'>
          <h1>{this.props.monthlyTotal}</h1>
          <span>Monthly Total</span>
        </div>
        <div className='yearly-total'>
          <h1>{this.props.yearlyTotal}</h1>
          <span>Yearly Total</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    monthlyTotal: state.expenses.monthlyTotal,
    yearlyTotal: state.expenses.yearlyTotal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
