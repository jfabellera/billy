import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUserExpenses,
  editExpense,
  deleteExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';

import './expensesTable.css';

import { Card, Table, Row, Col, Typography, Input } from 'antd';
const { Title } = Typography;
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    sorter: true,
    ellipsis: true,
    showSorterTooltip: false,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    sorter: true,
    ellipsis: true,
    showSorterTooltip: false,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    sorter: true,
    responsive: ['lg'],
    ellipsis: true,
    showSorterTooltip: false,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    sorter: true,
    defaultSortOrder: 'descend',
    render: (date) => moment(date).format('MM/DD/YY'),
    showSorterTooltip: false,
  },
];

class ExpensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      expenses: [],
      totalExpenses: 1,
      query: {
        sort: 'date',
        direction: 'dsc',
        per_page: 100,
        page: 1,
        search: '',
      },
    };
  }

  componentDidMount() {
    this.fetchExpenses();
  }

  componentDidUpdate() {
    if (this.state.update !== this.props.update) {
      this.setState({ update: this.props.update });
      this.fetchExpenses();
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    let query = { ...this.state.query, page: pagination.current };
    if (sorter.order) {
      query.sort = sorter.field;
      query.direction = sorter.order === 'ascend' ? 'asc' : 'dsc';
    } else {
      query.sort = 'date';
      query.direction = 'dsc';
    }
    this.setState({ query: query }, this.fetchExpenses);
  };

  handleSearchChange = (e) => {
    this.setState(
      { query: { ...this.state.query, search: e.target.value, page: 1 } },
      this.fetchExpenses
    );
  };

  fetchExpenses = () => {
    this.setState({ loading: true }, () => {
      this.props.getUserExpenses(this.state.query).then((data) => {
        this.setState({
          loading: false,
          expenses: data.expenses,
          totalExpenses: data.total,
        });
      });
    });
  };

  render() {
    return (
      <Card
        style={{ height: '100%' }}
        bodyStyle={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '6px',
        }}
      >
        <Row>
          <Col span={12}>
            <Title level={3}>Expenses</Title>
          </Col>
          <Col span={12}>
            <Input
              style={{ float: 'right', maxWidth: '300px' }}
              placeholder='Search...'
              onChange={this.handleSearchChange}
            />
          </Col>
        </Row>
        <Row style={{ display: 'flex', flex: 1 }}>
          <Table
            dataSource={this.state.expenses}
            columns={columns}
            pagination={{
              current: this.state.query.page,
              total: this.state.totalExpenses,
              pageSize: this.state.query.per_page,
              responsive: true,
              showSizeChanger: false,
              position: ['bottomCenter'],
            }}
            scroll={{ x: false, y: true }}
            onChange={this.handleTableChange}
            loading={this.state.loading}
          />
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.expenses.categories,
    groups: state.groups.groups,
    update: state.expenses.update,
    updateAction: state.expenses.updateAction,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    getUserCategories: () => dispatch(getUserCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
