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
      suggestions: this.props.categories,
      group_id: this.props.groups[
        this.props.groups.findIndex((obj) => obj.default === true)
      ]._id,
    };
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
        group_id: this.state.group_id,
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

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : this.props.categories.filter(
          (category) =>
            category.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    return (
      <Accordion>
        <Card className='p-3' style={{ overflow: 'visible' }}>
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
                  options={this.props.categories}
                  value={this.state.category}
                  onChange={this.onInputChange}
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
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>Group</Form.Label>
                    <Form.Control
                      as='select'
                      name='group_id'
                      value={this.state.group_id}
                      onChange={this.onInputChange}
                    >
                      {this.props.groups.map((group) => (
                        <option value={group._id} selected={group.default}>
                          {group.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Form.Row>
                <h4 className='text-warning'>This area does nothing</h4>
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
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewExpense: (expense) => dispatch(addNewExpense(expense)),
    getUserCategories: () => dispatch(getUserCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewExpenseForm);
