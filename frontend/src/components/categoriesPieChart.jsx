import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';

class CategoriesPieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          width: 380,
          type: 'donut',
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 500,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230,
        },
      },
    };
  }

  render() {
    return (
        <Chart
          options={{
            ...this.state.options,
            labels: this.props.categoryAmountLabels,
          }}
          series={this.props.categoryAmountTotals}
          type='donut'
        />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categoryAmountTotals: state.expenses.categoryAmounts.map(
      (category) => category.total
    ),
    categoryAmountLabels: state.expenses.categoryAmounts.map(
      (category) => category.name
    ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPieChart);
