import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnimatedNumber from 'sa-animated-number-react';
import { Row, Col, Card, Skeleton, Popover } from 'antd';
import { getGroupAmounts } from '../store/actions/groupsActions';

import './totals.css';

const totalSkeleton = (
  <Skeleton active title={{ width: '100%' }} paragraph={{ rows: 0 }} />
);

class Totals extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      monthlyPopoverVisible: false,
      cardWidth: '50',
    };
    this.card = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ cardWidth: this.card.current.offsetWidth });
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    if (this._isMounted)
      this.setState({ cardWidth: this.card.current.offsetWidth });
  };

  totalCard = (title, total, color, visible) => {
    return (
      <Col span={12}>
        <div ref={this.card} style={{ height: '100%' }}>
          <Card
            className="card-hover"
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

  renderGroups = () => {
    if (this.props.monthlyGroups) {
      return this.props.monthlyGroups.map((group, i) => (
        <p key={i}>{group.name}: {group.total}</p>
      ));
    }
  };

  render() {
    return (
      <Row gutter={[16]} style={{ height: '100%' }}>
        <Popover
          content={this.renderGroups()}
          title={'Groups'}
          trigger="click"
          visible={this.state.monthlyPopoverVisible}
          onVisibleChange={(visible) => {
            this.setState({ monthlyPopoverVisible: visible });
          }}
        >
          {this.totalCard(
            'Monthly total',
            this.props.monthlyTotal,
            'green',
            !isNaN(this.props.monthlyTotal) & !isNaN(this.props.yearlyTotal)
          )}
        </Popover>

        <Popover
          content={<p>hi bro</p>}
          title={'Groups'}
          trigger="click"
          visible={this.state.yearlyPopoverVisible}
          onVisibleChange={(visible) => {
            this.setState({ yearlyPopoverVisible: visible });
          }}
        >
          {this.totalCard(
            'Yearly total',
            this.props.yearlyTotal,
            'gold',
            !isNaN(this.props.monthlyTotal) & !isNaN(this.props.yearlyTotal)
          )}
        </Popover>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    monthlyGroups: state.groups.monthlyGroups,
    yearlyGroups: state.groups.yearlyGroups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
