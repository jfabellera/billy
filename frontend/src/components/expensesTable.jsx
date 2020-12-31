import React, { Component } from 'react';

import './expensesTable.css';
import { Table, Container, Card, Row } from 'react-bootstrap';

class ExpensesTable extends Component {
  populateTable = () => {
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

  render() {
    return (
      <Container
        as={Card}
        className='d-flex flex-column p-3 '
        style={{ display: 'inline-table', height: '100%' }}
      >
        <h2>Expenses</h2>
        <div className='d-flex flex-fill overflow-auto' style={{height: '0px'}}>
          <Table
            borderless
            hover
            variant='light'
            size='sm'
            className='m-0'
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>{this.populateTable()}</tbody>
          </Table>
        </div>
        {/* <Row>
          <h1>test</h1>
        </Row> */}
      </Container>
    );
  }
}

export default ExpensesTable;
