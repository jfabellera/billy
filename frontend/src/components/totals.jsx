import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnimatedNumber from 'animated-number-react';

import './totals.css';

class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatValue = (value) => `$ ${Number(value).toFixed(2)}`;
  render() {
    return (
      <div
        className='d-flex flex-fill align-items-center justify-content-center'
        style={{ padding: '12px' }}
      >
        <div className='monthly-total'>
          <h1>
            <AnimatedNumber
              value={this.props.monthlyTotal}
              formatValue={this.formatValue}
              duration={600}
            />
          </h1>
          <span>Monthly Total</span>
        </div>
        <div className='yearly-total'>
          <h1>
            <AnimatedNumber
              value={this.props.yearlyTotal}
              formatValue={this.formatValue}
              duration={600}
            />
          </h1>
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
