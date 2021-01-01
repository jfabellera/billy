import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUserExpenses } from '../store/actions/expensesActions';

import './expensesTable.css';
import {
  Table,
  Container,
  Card,
  Row,
  Col,
  FormControl,
  Pagination,
} from 'react-bootstrap';

class ExpensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 'dsc',
      sort: 'date',
      perPage: 100,
      currentPage: 1,
      totalPages: 1,
    };
  }

  componentDidMount() {
    this.fetchExpenses();
  }

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
  };

  /**
   * Update the sort criteria or order depending
   * on the clicked table header.
   *
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
   * Maps fetched expenses to table rows
   */
  renderTableBody = () => {
    return this.props.expenses.map((expense, i) => (
      <tr key={i}>
        <td>{expense.title}</td>
        <td>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(expense.amount)}
        </td>
        <td>{new Date(expense.date).toLocaleDateString()}</td>
        <td>{expense.category}</td>
      </tr>
    ));
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
      <Container
        as={Card}
        className='d-flex flex-column p-3 '
        style={{ display: 'inline-table', height: '100%' }}
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
              </tr>
            </thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          {this.renderPagination()}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expenses: state.expenses.expenses,
    totalExpenses: state.expenses.totalExpenses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserExpenses: (options) => dispatch(getUserExpenses(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
