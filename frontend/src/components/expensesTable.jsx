import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUserExpenses,
  editExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';

import './expensesTable.css';
import { Table, Card, Row, Col, FormControl, Form } from 'react-bootstrap';
import CustomInputSelect from './customInputSelect';
import CustomPagination from './customPagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faSave,
  faSortDown,
  faSortUp,
  faSort,
} from '@fortawesome/free-solid-svg-icons';

class ExpensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 'dsc',
      sort: 'date',
      perPage: 100,
      currentPage: 1,
      totalPages: 1,
      editExpense: {
        id: null,
        title: null,
        amount: null,
        category: null,
        date: null,
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

  /**
   * Function to update redux stored expenses
   * Used to update the table
   */
  fetchExpenses = () => {
    this.props
      .getUserExpenses({
        sort: this.state.sort,
        direction: this.state.direction,
        per_page: this.state.perPage,
        page: this.state.currentPage,
      })
      .then(() => {
        // Determine number of pages
        let total = Math.ceil(this.props.totalExpenses / this.state.perPage);
        this.setState({
          totalPages: total > 0 ? total : 1,
        });
      });
    this.props.getUserCategories();
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
      this.props.getUserExpenses({
        sort: this.state.sort,
        direction: this.state.direction,
        per_page: this.state.perPage,
        page: this.state.currentPage,
      });
    });
  };

  onPageChange = (e) => {
    this.setState({ currentPage: e.target.value }, this.fetchExpenses);
  };

  /**
   * Sets state state variables for the selected expense
   * @param {Event} e
   */
  onClickEdit = (e) => {
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

  /**
   * Makes PUT request to update the selected expense
   * @param {Event} e
   */
  onSubmit = (e) => {
    e.preventDefault();
    const expenseDetails = {
      ...this.state.editExpense,
      date: moment(this.state.editExpense.date).format('YYYY/MM/DD'),
      category: this.state.editExpense.category
        ? this.state.editExpense.category
        : 'Other',
    };
    this.props.editExpense(expenseDetails).then(() => {
      this.setState({
        editExpense: {
          id: null,
          title: null,
          amount: null,
          category: null,
          date: null,
        },
      });
    });
  };

  /**
   * Renders the passed expense as plain, formatted text
   * @param {Object} expense
   * @param {Int} i
   */
  renderRowAsOutput = (expense, i) => {
    return (
      <tr id={expense._id} key={i}>
        <td name='title' orig={expense.title}>
          <span>{expense.title}</span>
        </td>
        <td name='amount' orig={expense.amount}>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(expense.amount)}
          </span>
        </td>
        <td name='date' orig={moment(expense.date).format('YYYY-MM-DD')}>
          <span>{moment(expense.date).format('MM/DD/YYYY')}</span>
        </td>
        <td name='category' orig={expense.category}>
          <span>{expense.category}</span>
        </td>
        <td className='expense-action text-center'>
          <div className='h-100 d-flex align-items-center'>
            <FontAwesomeIcon icon={faPen} onClick={this.onClickEdit} />
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Renders the passed expense as a form to edit values
   * @param {Object} expense
   * @param {Int} i
   */
  renderRowAsInput = (expense, i) => {
    return (
      <tr className='selected' id={expense._id} key={i}>
        <td>
          <Form onSubmit={this.onSubmit}>
            <FormControl
              name='title'
              required
              value={this.state.editExpense.title}
              onChange={this.onEditChange}
            />
          </Form>
        </td>
        <td>
          <Form onSubmit={this.onSubmit}>
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
          <FormControl
            name='date'
            type='date'
            required
            value={this.state.editExpense.date}
            onChange={this.onEditChange}
          />
        </td>
        <td>
          <CustomInputSelect
            name='category'
            value={this.state.editExpense.category}
            onChange={this.onEditChange}
            options={this.props.categories}
            placeholder='Category'
          />
        </td>
        <td className='expense-action text-center'>
          <div className='h-100 d-flex align-items-center'>
            <FontAwesomeIcon icon={faSave} onClick={this.onSubmit} />
          </div>
        </td>
      </tr>
    );
  };

  /**
   * Maps fetched expenses to table rows
   */
  renderTableBody = () => {
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
        className='d-flex flex-column p-3 '
        style={{ height: '100%', width: '100%' }}
      >
        <Row>
          <Col>
            <h2>Expenses</h2>
          </Col>
          <Col>
            <FormControl
              placeholder='Search...'
              className='ml-auto'
              style={{ maxWidth: '300px' }}
            />
          </Col>
        </Row>
        <div
          className='d-flex flex-fill overflow-auto my-3'
          style={{ height: '0px' }}
        >
          <Table
            borderless
            striped
            hover
            variant='light'
            size='sm'
            className='m-0'
          >
            <thead>
              <tr>
                <th className='fa fa-sort-asc'>
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
                  <span id='date' onClick={this.onClickHeader}>
                    Date{' '}
                  </span>
                  {this.renderSortArrow('date')}
                </th>
                <th>
                  <span id='category' onClick={this.onClickHeader}>
                    Category{' '}
                  </span>
                  {this.renderSortArrow('category')}
                </th>
                <th>{/* just for expense action */}</th>
              </tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <CustomPagination
            value={this.state.currentPage}
            total={this.state.totalPages}
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
    update: state.expenses.update,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
    editExpense: (expense) => dispatch(editExpense(expense)),
    getUserCategories: () => dispatch(getUserCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
