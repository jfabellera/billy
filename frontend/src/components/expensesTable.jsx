import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getUserExpenses,
  editExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';

import './expensesTable.css';
import {
  Table,
  Card,
  Row,
  Col,
  FormControl,
  Pagination,
  Form,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSave } from '@fortawesome/free-solid-svg-icons';

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
    // TODO(jan) add fontawesome arrows to show sort direction
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
          <FontAwesomeIcon icon={faPen} onClick={this.onClickEdit} />
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
      <tr bgcolor='lightgray' className='selected' id={expense._id} key={i}>
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
          <FormControl
            name='category'
            as='select'
            required
            value={this.state.editExpense.category}
            onChange={this.onEditChange}
          >
            {this.props.categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </FormControl>
        </td>
        <td className='expense-action text-center'>
          <FontAwesomeIcon icon={faSave} onClick={this.onSubmit} />
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

  /**
   * Determines which page numbers to display.
   */
  renderPagination = () => {
    // Some weird mathgic I came up with while working on the initial course project
    let low, high;
    let current = this.state.currentPage,
      total = this.state.totalPages;
    if (this.state.currentPage < 5) {
      low = 2;
      high = Math.min(5, this.state.totalPages - 1);
    } else if (this.state.currentPage > this.state.totalPages - 4) {
      low = this.state.totalPages - 4;
      high = this.state.totalPages - 1;
    } else {
      low = this.state.currentPage - 1;
      high = this.state.currentPage + 1;
    }
    let diff = high - low + 1;
    let pages = diff > 0 ? [...Array(diff).keys()].map((i) => i + low) : [];

    return (
      <Pagination className='m-0'>
        <Pagination.Prev
          disabled={current === 1}
          onClick={() => {
            this.setState(
              { currentPage: Math.max(current - 1, 1) },
              this.fetchExpenses
            );
          }}
        />
        <Pagination.Item
          active={current === 1}
          onClick={() => {
            this.setState({ currentPage: 1 }, this.fetchExpenses);
          }}
        >
          {1}
        </Pagination.Item>
        {current > 4 && total > 7 ? <Pagination.Ellipsis disabled /> : null}
        {pages.map((i) => (
          <Pagination.Item
            key={i}
            active={current === i}
            onClick={() => {
              this.setState({ currentPage: i }, this.fetchExpenses);
            }}
          >
            {i}
          </Pagination.Item>
        ))}
        {current < total - 3 && total > 7 ? (
          <Pagination.Ellipsis disabled />
        ) : null}
        {total === 1 ? null : (
          <Pagination.Item
            active={current === total}
            onClick={() => {
              this.setState({ currentPage: total }, this.fetchExpenses);
            }}
          >
            {total}
          </Pagination.Item>
        )}
        <Pagination.Next
          disabled={current === total}
          onClick={() => {
            this.setState(
              { currentPage: Math.min(current + 1, total) },
              this.fetchExpenses
            );
          }}
        />
      </Pagination>
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
          <Table borderless hover variant='light' size='sm' className='m-0'>
            <thead>
              <tr>
                <th className='fa fa-sort-asc'>
                  <span id='title' onClick={this.onClickHeader}>
                    Title
                  </span>
                </th>
                <th>
                  <span id='amount' onClick={this.onClickHeader}>
                    Amount
                  </span>
                </th>
                <th>
                  <span id='date' onClick={this.onClickHeader}>
                    Date
                  </span>
                </th>
                <th>
                  <span id='category' onClick={this.onClickHeader}>
                    Category
                  </span>
                </th>
                <th>{/* just for expense action */}</th>
              </tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          {this.renderPagination()}
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
