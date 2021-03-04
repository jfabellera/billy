import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  getUserExpenses,
  refreshExpenses,
} from '../../store/actions/expensesActions';
import { getGroups } from '../../store/actions/groupsActions';
import FilterPanel from '../../components/filterPanel';
import ExpensesTable from '../../components/expensesTable';

import { Row, Col } from 'antd';

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.containerRef = React.createRef();
    this.state = {
      group_id: null,
      group_name: 'All expenses',
    };

    this.props.getGroups();
  }

  componentDidMount() {
    this.setState({ containerHeight: this.containerRef.current.clientHeight });
    window.addEventListener('resize', () => {
      this.setState({
        containerHeight: this.containerRef?.current?.clientHeight,
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.setState({
        containerHeight: this.containerRef?.current?.clientHeight,
      });
    });
  }

  onGroupChange = (value) => {
    this.setState(
      { group_id: value.id, group_name: value.name },
      this.props.refreshExpenses
    );
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Row gutter={[16, 16]} style={{ maxHeight: '33%' }}>
            <Col xs={24} md={0} style={{}}>
              <FilterPanel onChange={this.onGroupChange} />
            </Col>
          </Row>
          <Row
            id="container"
            ref={this.containerRef}
            gutter={[16, 16]}
            style={{ height: '100%' }}
          >
            <Col xs={0} md={8}>
              <FilterPanel onChange={this.onGroupChange} />
            </Col>
            <Col id="expenses-column" xs={24} md={16}>
              <ExpensesTable
                title={this.state.group_name}
                options={
                  this.state.group_id ? { group_id: this.state.group_id } : {}
                }
                tableHeight={this.state.containerHeight * 1.1 || 350}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    refreshExpenses: () => dispatch(refreshExpenses()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
