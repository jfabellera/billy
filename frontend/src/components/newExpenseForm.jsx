import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addNewExpense,
  getUserCategories,
} from '../store/actions/expensesActions';
import moment from 'moment';

import { Card, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
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

  onSelectChange = (selectedOption, action) => {
    if (action.action === 'clear') this.setState({ category: '' });

    if (
      selectedOption &&
      (action.action === 'select-option' || action.action === 'create-option')
    )
      this.setState({ category: selectedOption });
  };

  onSelectInputChange = (selectInputValue, action) => {
    if (action.action === 'input-change') {
      this.setState({ category: selectInputValue });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    // To fix CreatableSelect stupid behavior
    let category;
    if (this.state.category.value) category = this.state.category.value;
    else if (this.state.category) category = this.state.category;
    else category = 'Other';

    this.props
      .addNewExpense({
        title: this.state.title,
        amount: this.state.amount,
        category: category,
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

  /**
   * Stupid function to make up for CreatableSelect's
   * stupid behavior this shouldn't even be necessary
   * I spend 3 hours trying to find a solution but this
   * will do I guess.
   */
  renderSelect = () => {
    const selectElement = (
      <CreatableSelect
        name='category'
        required
        isClearable
        openMenuOnFocus
        onChange={this.onSelectChange}
        onInputChange={this.onSelectInputChange}
        placeholder='Category'
        options={this.props.categories.map((cat) => {
          return { value: cat, label: cat };
        })}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    );
    if (this.state.category.value) {
      return React.cloneElement(selectElement, { value: this.state.category });
    } else if (this.state.category) {
      return React.cloneElement(selectElement, {
        inputValue: this.state.category,
      });
    } else {
      return React.cloneElement(selectElement, { value: null });
    }
  };

  render() {
    return (
      <Accordion>
        <Card className='p-3'>
          <h3>Add new expense</h3>
          <Form onSubmit={this.onSubmit} style={{ zIndex: 9999 }}>
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
              <Form.Group as={Col}>{this.renderSelect()}</Form.Group>
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
