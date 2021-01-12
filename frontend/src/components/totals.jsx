import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnimatedNumber from 'animated-number-react';
import { Row, Col, Card, Skeleton } from 'antd';

import './totals.css';

const totalSkeleton = (
  <Skeleton active title={{ width: '100%' }} paragraph={{ rows: 0 }} />
);

class Totals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardWidth: '50',
    };
    this.card = React.createRef();
  }

  componentDidMount() {
    this.setState({ cardWidth: this.card.current.offsetWidth });
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({ cardWidth: this.card.current.offsetWidth });
  };

  totalCard = (title, total, color, visible) => {
    return (
      <Col span={12}>
        <div ref={this.card} style={{ height: '100%' }}>
          <Card
          className='card-hover'
            style={{ height: '100%' }}
            bodyStyle={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ color: 'grey' }}>{title}</div>
              <div style={{ fontSize: this.state.cardWidth / 8, color: color }}>
                {visible ? (
                  <AnimatedNumber
                    value={total}
                    formatValue={this.formatValue}
                    duration={600}
                  />
                ) : (
                  totalSkeleton
                )}
              </div>
            </div>
          </Card>
        </div>
      </Col>
    );
  };

  formatValue = (value) => `$ ${Number(value).toFixed(2)}`;
  render() {
    return (
      <Row gutter={[16]} style={{ height: '100%' }}>
        {this.totalCard(
          'Monthly total',
          this.props.monthlyTotal,
          'green',
          this.props.monthlyTotal & this.props.yearlyTotal
        )}
        {this.totalCard(
          'Yearly total',
          this.props.yearlyTotal,
          'gold',
          this.props.monthlyTotal & this.props.yearlyTotal
        )}
      </Row>
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
