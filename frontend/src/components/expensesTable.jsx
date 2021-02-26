import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUserExpenses,
  getUserCategories,
  editExpense,
  deleteExpense,
} from '../store/actions/expensesActions';
import moment from 'moment';

import ExpandedRow from './expenseTableExpandedRow';
import ExpenseForm from './expenseForm';
import DeleteForm from './deleteForm';

import { Card, Table, Row, Col, Typography, Input } from 'antd';
const { Title } = Typography;

class ExpensesTable extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
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
        category: '',
        group_id: '',
      },
      expandedRowId: null,
      editFormVisible: false,
      editExpense: null,
      deleteFormVisible: false,
      deleteExpense: null,
    };
    this.form = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchExpenses();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (this._isMounted && this.state.update !== this.props.update) {
      this.setState({ update: this.props.update });
      this.fetchExpenses();
    }
  }

  getColumns = () => {
    return [
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
        render: (amount) => `$${Number(amount).toFixed(2)}`,
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
        render: (date) => moment(date).utc().format('MM/DD/YY'),
        showSorterTooltip: false,
      },
    ];
  };

  handleTableChange = (pagination, filters, sorter) => {
    let query = {
      ...this.state.query,
      page: pagination.current,
      category: filters.category,
    };
    if (sorter.order) {
      query.sort = sorter.field;
      query.direction = sorter.order === 'ascend' ? 'asc' : 'dsc';
    } else {
      query.sort = 'date';
      query.direction = 'dsc';
    }
    if (this._isMounted)
      this.setState({ query: query, expandedRowId: null }, this.fetchExpenses);
  };

  handleSearchChange = (e) => {
    if (this._isMounted)
      this.setState(
        { query: { ...this.state.query, search: e.target.value, page: 1 } },
        this.fetchExpenses
      );
  };

  fetchExpenses = () => {
    if (this._isMounted)
      this.setState({ loading: true }, () => {
        this.props
          .getUserExpenses({ ...this.state.query, ...this.props.options })
          .then((data) => {
            if (this._isMounted)
              this.setState({
                loading: false,
                expenses: data.expenses,
                totalExpenses: data.total,
              });
          });
      });
  };

  onRowExpand = (e) => {
    this.setState({ expandedRowId: e[1] });
  };

  onClickEdit = (expense) => {
    this.setState({ editFormVisible: true, editExpense: expense });
  };

  onClickDelete = (expense) => {
    this.setState({ deleteFormVisible: true, deleteExpense: expense });
  };

  render() {
    return (
      <>
        <Card>
          <Row>
            <Col span={12}>
              <Title id="expenses-month" level={4}>
                {this.props.title || 'Expenses'}
              </Title>
            </Col>
            <Col span={12}>
              <Input
                id="expenses-search"
                style={{ float: 'right', maxWidth: '300px' }}
                placeholder="Search..."
                onChange={this.handleSearchChange}
              />
            </Col>
          </Row>
          <Row>
            <Table
              id="expenses-table"
              dataSource={this.state.expenses}
              columns={this.getColumns()}
              pagination={{
                current: this.state.query.page,
                total: this.state.totalExpenses,
                pageSize: this.state.query.per_page,
                responsive: true,
                showSizeChanger: false,
                position: ['bottomCenter'],
              }}
              scroll={{ y: this.props.tableHeight * 0.6 }}
              onChange={this.handleTableChange}
              loading={this.state.loading}
              rowKey="_id"
              expandable={{
                expandedRowKeys: [this.state.expandedRowId],
                expandIconColumnIndex: -1,
                expandRowByClick: true,
                expandedRowRender: (expense) => (
                  <ExpandedRow
                    expense={expense}
                    onClickEdit={this.onClickEdit}
                    onClickDelete={this.onClickDelete}
                  />
                ),
                onExpandedRowsChange: this.onRowExpand,
              }}
              rowClassName="table-row"
            />
          </Row>
        </Card>
        <ExpenseForm
          title="Edit expense"
          formId="edit-expense"
          visible={this.state.editFormVisible}
          optionsVisible={true}
          onCancel={() =>
            this.setState({ editFormVisible: false, editExpense: null })
          }
          editExpense={this.state.editExpense}
          categories={this.props.categories}
          groups={this.props.groups}
          onSubmit={(expense) => {
            this.props.editExpense(expense).then(() => {
              this.setState({ editFormVisible: false, editExpense: null });
            });
          }}
        />
        <DeleteForm
          title="Delete expense"
          visible={this.state.deleteFormVisible}
          onCancel={() =>
            this.setState({ deleteFormVisible: false, deleteExpense: null })
          }
          onSubmit={() => {
            this.props.deleteExpense(this.state.deleteExpense._id).then(() => {
              this.setState({ deleteFormVisible: false, deleteExpense: null });
            });
          }}
          itemName={
            this.state.deleteExpense ? this.state.deleteExpense.title : ''
          }
        />
      </>
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
    editExpense: (expense) => dispatch(editExpense(expense)),
    deleteExpense: (expense_id) => dispatch(deleteExpense(expense_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
