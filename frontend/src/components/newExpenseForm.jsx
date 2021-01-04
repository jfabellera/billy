import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addNewExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';

import { Card, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import CustomInputSelect from './customInputSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

class NewExpenseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      amount: '',
      category: '',
      date: moment().format('YYYY-MM-DD'),
    };
  }

  componentDidMount() {
    this.props.getUserCategories();
  }

  onInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState({ [field]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.props
      .addNewExpense({
        title: this.state.title,
        amount: this.state.amount,
        category: this.state.category ? this.state.category : 'Other',
        date: moment(this.state.date).format('YYYY/MM/DD'),
      })
      .then(() => {
        this.setState({
          title: '',
          amount: '',
          category: '',
          date: moment().format('YYYY-MM-DD'),
        });
      });
  };

  render() {
    return (
      <Accordion>
        <Card className='p-3'>
          <h3>Add new expense</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  name='title'
                  placeholder='Title'
                  required
                  onChange={this.onInputChange}
                  value={this.state.title}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  name='amount'
                  type='number'
                  placeholder='Amount'
                  required
                  onChange={this.onInputChange}
                  value={this.state.amount}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <CustomInputSelect
                  name='category'
                  value={this.state.category}
                  options={this.props.categories}
                  onChange={this.onInputChange}
                  placeholder='Category'
                />
              </Form.Group>
              <Form.Group as={Col} style={{ width: '25%' }}>
                <Form.Control
                  name='date'
                  type='date'
                  required
                  value={this.state.date}
                  onChange={this.onInputChange}
                />
              </Form.Group>
            </Form.Row>
            <Row>
              <Accordion.Toggle
                as={Button}
                variant='link'
                eventKey='0'
                className='mr-auto px-3 shadow-none'
              >
                More options <FontAwesomeIcon icon={faChevronDown} size='xs' />
              </Accordion.Toggle>
              <div className='px-3'>
                <Button type='submit'>Add Expense</Button>
              </div>
            </Row>
            <Accordion.Collapse eventKey='0'>
              <div>
                <h4 className='text-warning'>This area does nothing</h4>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Account</Form.Label>
                    <Form.Control as='select'>
                      <option>Default</option>
                      <option>Secondary</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                <Form.Row className='mt-3'>
                  <Form.Group as={Col} className='mb-0'>
                    <Form.Check
                      type='switch'
                      id='custom-switch'
                      label='Subscription'
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Billing Period</Form.Label>
                    <Form.Control as='select' disabled>
                      <option>Monthly</option>
                      <option>Yearly</option>
                      <option>Biweekly</option>
                      <option>Custom</option>
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
              </div>
            </Accordion.Collapse>
          </Form>
        </Card>
      </Accordion>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.expenses.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewExpense: (expense) => dispatch(addNewExpense(expense)),
    getUserCategories: () => dispatch(getUserCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewExpenseForm);
