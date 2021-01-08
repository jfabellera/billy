import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUserExpenses,
  editExpense,
  deleteExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';
import { animateScroll } from 'react-scroll';

import './expensesTable.css';
import {
  Table,
  Card,
  Row,
  Col,
  FormControl,
  Form,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import CustomInputSelect from './customInputSelect';
import CustomPagination from './customPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faSortDown,
  faSortUp,
  faSort,
  faTrash,
  faTimes,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

class ExpensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 'dsc',
      sort: 'date',
      perPage: 100,
      currentPage: 1,
      editExpense: {
        id: null,
        title: null,
        amount: null,
        category: null,
        date: null,
      },
      selectedExpenseId: null,
      deleteExpenseId: null,
      search: '',
      update: this.props.update,
      prevProps: null,
    };
  }

  componentDidMount() {
    this.fetchExpenses();
  }

  componentDidUpdate(props, state) {
    if (this.state.update !== this.props.update) {
      this.setState({ update: this.props.update });

      // don't scroll to top on an edit or delete
      this.fetchExpenses(
        this.props.updateAction !== 'edit' &&
          this.props.updateAction !== 'delete'
      );
    }
  }

  /**
   * Function to update redux stored expenses
   * Used to update the table
   */
  fetchExpenses = (scrollToTop = true) => {
    this.resetDeleteExpense();
    this.resetEditExpense();
    let query = {
      sort: this.state.sort,
      direction: this.state.direction,
      per_page: this.state.perPage,
      page: this.state.currentPage,
      search: this.state.search,
    };
    if (this.props.variant) {
      if (this.props.variant === 'currentMonth') {
        query.start_date = moment()
          .clone()
          .startOf('month')
          .format('YYYY/MM/DD');
        query.end_date = moment().clone().endOf('month').format('YYYY/MM/DD');
      } else if (
        this.props.variant === 'month' &&
        this.props.month &&
        this.props.year
      ) {
        const month = moment(
          this.props.year + '/' + this.props.month,
          'YYYY/M'
        );
        query.start_date = month.clone().startOf('month').format('YYYY/MM/DD');
        query.end_date = month.clone().endOf('month').format('YYYY/MM/DD');
      } else if (this.props.variant === 'year' && this.props.year) {
        const year = moment(this.props.year, 'YYYY');
        query.start_date = year.clone().startOf('year').format('YYYY/MM/DD');
        query.end_date = year.clone().endOf('year').format('YYYY/MM/DD');
        console.log(query.start_date + ' ' + query.end_date);
      }
    }
    query = { ...query, ...this.props.options };
    this.props.getUserExpenses(query).then(() => {
      if (scrollToTop)
        animateScroll.scrollToTop({ containerId: 'table', duration: 0 });
    });
  };

  resetEditExpense = () => {
    this.setState({
      editExpense: {
        id: null,
        title: null,
        amount: null,
        category: null,
        date: null,
      },
    });
  };

  resetDeleteExpense = () => {
    this.setState({ deleteExpenseId: null });
  };

  resetSelectExpense = () => {
    this.setState({ selectedExpenseId: null });
  };

  getGroupName = (group_id) => {
    if (group_id && this.props.groups && this.props.groups.length > 0) {
      const group_index = this.props.groups.findIndex(
        (obj) => obj._id === group_id
      );
      if (group_index >= 0) return this.props.groups[group_index].name;
      else return 'No group';
    } else {
      return 'No group';
    }
  };

  /**
   * Update the sort criteria or order depending
   * on the clicked table header.
   * @param {Event} e
   */
  onClickHeader = (e) => {
    new Promise((resolve) => {
      if (this.state.sort !== e.target.id) {
        this.setState({
          sort: e.target.id,
          direction: 'asc',
        });
        resolve();
      } else {
        this.setState({
          direction: this.state.direction === 'asc' ? 'dsc' : 'asc',
        });
        resolve();
      }
    }).then(() => {
      this.fetchExpenses();
    });
  };

  onPageChange = (e) => {
    this.setState({ currentPage: e.target.value }, () => {
      this.fetchExpenses();
    });
  };

  onSearchChange = (e) => {
    this.setState({ search: e.target.value, currentPage: 1 }, () => {
      this.fetchExpenses();
    });
  };

  /**
   * Sets state state variables for the selected expense
   * @param {Event} e
   */
  onClickEdit = (e) => {
    this.resetDeleteExpense();
    const expense = e.currentTarget.closest('tr');
    let origVals = {};
    expense.querySelectorAll('td:not(.expense-action)').forEach((element) => {
      origVals[element.getAttribute('name')] = element.getAttribute('orig');
    });
    this.setState({
      editExpense: {
        id: expense.getAttribute('id'),
        ...origVals,
      },
    });
  };

  onClickDelete = (e) => {
    const expenseId = e.currentTarget.closest('tr').getAttribute('id');
    this.resetEditExpense();
    this.setState({
      deleteExpenseId: expenseId,
    });
  };

  onClickCancel = () => {
    this.resetEditExpense();
    this.resetDeleteExpense();
    this.resetSelectExpense();
  };

  /**
   * Updates state variables when input fields change
   * @param {Event} e
   */
  onEditChange = (e) => {
    this.setState({
      editExpense: {
        ...this.state.editExpense,
        [e.target.name]: e.target.value,
      },
    });
  };

  onEditSubmit = (e) => {
    e.preventDefault();
    const expenseDetails = {
      ...this.state.editExpense,
      date: moment(this.state.editExpense.date).format('YYYY/MM/DD'),
      category: this.state.editExpense.category
        ? this.state.editExpense.category
        : 'Other',
    };
    this.props.editExpense(expenseDetails).then(this.resetEditExpense);
  };

  onDeleteSubmit = () => {
    this.props
      .deleteExpense(this.state.deleteExpenseId)
      .then(this.resetEditExpense);
  };

  onClickRow = (e) => {
    const expenseId = e.currentTarget.closest('tr').getAttribute('id');
    const newSelected =
      expenseId === this.state.selectedExpenseId ? null : expenseId;
    this.setState({
      selectedExpenseId: newSelected,
    });
  };

  /**
   * Renders the passed expense as plain, formatted text
   * @param {Object} expense
   * @param {Int} i
   */
  renderRowAsOutput = (expense, i) => {
    return (
      <OverlayTrigger
        show={this.state.selectedExpenseId === expense._id}
        key={i}
        placement='bottom'
        overlay={
          <Popover style={{ transition: 'none' }}>
            <Popover.Title as='h3'>
              {this.getGroupName(expense.group_id)}
            </Popover.Title>
            <Popover.Content>
              {expense.description ? (
                expense.description
              ) : (
                <i>No description</i>
              )}
            </Popover.Content>
          </Popover>
        }
      >
        <tr
          className={
            expense._id === this.state.deleteExpenseId
              ? 'expense-delete'
              : expense._id === this.state.selectedExpenseId
              ? 'expense-select'
              : 'expense'
          }
          id={expense._id}
        >
          <td name='title' orig={expense.title} onClick={this.onClickRow}>
            <span>{expense.title}</span>
          </td>
          <td name='amount' orig={expense.amount} onClick={this.onClickRow}>
            <span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(expense.amount)}
            </span>
          </td>
          <td name='category' orig={expense.category} onClick={this.onClickRow}>
            <span>{expense.category}</span>
          </td>
          <td
            name='date'
            orig={moment(expense.date).format('YYYY-MM-DD')}
            onClick={this.onClickRow}
          >
            <span>{moment(expense.date).format('MM/DD/YYYY')}</span>
          </td>
          <td className='expense-action text-center'>
            {expense._id !== this.state.deleteExpenseId ? (
              <div className='expense-normal h-100 d-flex align-items-center'>
                <FontAwesomeIcon
                  className='mr-1'
                  icon={faPen}
                  onClick={this.onClickEdit}
                />
                <FontAwesomeIcon
                  className='ml-1'
                  icon={faTrash}
                  onClick={this.onClickDelete}
                />
              </div>
            ) : (
              <div className='expense-confirm h-100 d-flex align-items-center'>
                <FontAwesomeIcon
                  className='mr-1'
                  icon={faTimes}
                  onClick={this.onClickCancel}
                />
                <FontAwesomeIcon
                  className='ml-1'
                  icon={faCheck}
                  onClick={this.onDeleteSubmit}
                />
              </div>
            )}
          </td>
        </tr>
      </OverlayTrigger>
    );
  };

  /**
   * Renders the passed expense as a form to edit values
   * @param {Object} expense
   * @param {Int} i
   */
  renderRowAsInput = (expense, i) => {
    return (
      <tr className='expense-edit' id={expense._id} key={i}>
        <td>
          <Form onSubmit={this.onEditSubmit}>
            <FormControl
              name='title'
              required
              value={this.state.editExpense.title}
              onChange={this.onEditChange}
            />
          </Form>
        </td>
        <td>
          <Form onSubmit={this.onEditSubmit}>
            <FormControl
              name='amount'
              type='number'
              required
              value={this.state.editExpense.amount}
              onChange={this.onEditChange}
            />
          </Form>
        </td>
        <td>
          <CustomInputSelect
            name='category'
            options={this.props.categories}
            value={this.state.editExpense.category}
            onChange={this.onEditChange}
          />
        </td>
        <td>
          <FormControl
            name='date'
            type='date'
            required
            value={this.state.editExpense.date}
            onChange={this.onEditChange}
          />
        </td>
        <td className='expense-action'>
          <div className='expense-confirm'>
            <FontAwesomeIcon
              className='mr-1'
              icon={faTimes}
              onClick={this.onClickCancel}
            />
            <FontAwesomeIcon
              className='ml-1'
              icon={faCheck}
              onClick={this.onEditSubmit}
            />
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Maps fetched expenses to table rows
   */
  renderTableBody = () => {
    if (this.props.expenses)
      return this.props.expenses.map((expense, i) =>
        expense._id === this.state.editExpense.id
          ? this.renderRowAsInput(expense, i)
          : this.renderRowAsOutput(expense, i)
      );
  };

  renderSortArrow = (headerName) => {
    return (
      <FontAwesomeIcon
        icon={
          this.state.sort === headerName
            ? this.state.direction === 'asc'
              ? faSortUp
              : faSortDown
            : faSort
        }
        size='xs'
      />
    );
  };

  render() {
    return (
      <Card
        className='expenses-table d-flex flex-column p-3 '
        style={{ ...{ height: '100%', width: '100%' }, ...this.props.style }}
      >
        <Row>
          <Col>
            <h2>{this.props.title ? this.props.title : 'Expenses'}</h2>
          </Col>
          <Col>
            <FormControl
              placeholder='Search...'
              className='ml-auto'
              style={{ maxWidth: '300px' }}
              value={this.state.search}
              onChange={this.onSearchChange}
            />
          </Col>
        </Row>
        <div
          id='table'
          className='d-flex flex-fill my-3'
          style={{ height: '0px', overflowY: 'scroll' }}
          onScroll={
            this.state.selectedExpenseId ? this.resetSelectExpense : null
          }
        >
          <Table borderless variant='light' size='sm' className='m-0'>
            <thead>
              <tr>
                <th>
                  <span id='title' onClick={this.onClickHeader}>
                    Title{' '}
                  </span>
                  {this.renderSortArrow('title')}
                </th>
                <th>
                  <span id='amount' onClick={this.onClickHeader}>
                    Amount{' '}
                  </span>
                  {this.renderSortArrow('amount')}
                </th>
                <th>
                  <span id='category' onClick={this.onClickHeader}>
                    Category{' '}
                  </span>
                  {this.renderSortArrow('category')}
                </th>
                <th>
                  <span id='date' onClick={this.onClickHeader}>
                    Date{' '}
                  </span>
                  {this.renderSortArrow('date')}
                </th>
                <th className='fixed-width'>{/* just for expense action */}</th>
              </tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <CustomPagination
            value={this.state.currentPage}
            total={this.props.totalPages}
            onChange={this.onPageChange}
          />
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expenses: state.expenses.expenses,
    categories: state.expenses.categories,
    totalExpenses: state.expenses.totalExpenses,
    totalPages: state.expenses.totalPages,
    update: state.expenses.update,
    updateAction: state.expenses.updateAction,
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    editExpense: (expense) => dispatch(editExpense(expense)),
    deleteExpense: (expenseId) => dispatch(deleteExpense(expenseId)),
    getUserCategories: () => dispatch(getUserCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
