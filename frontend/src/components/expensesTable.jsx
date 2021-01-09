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
  Modal,
  Button,
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
} from '@fortawesome/free-solid-svg-icons';

const emptyExpense = {
  _id: null,
  title: null,
  amount: null,
  category: null,
  date: null,
  group_id: null,
  description: null,
};

class ExpensesTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: 'dsc',
      sort: 'date',
      perPage: 100,
      currentPage: 1,
      editExpense: emptyExpense,
      selectExpense: emptyExpense,
      deleteExpense: emptyExpense,
      search: '',
      update: this.props.update,
      prevProps: null,
    };

    this.wrapperRef = React.createRef();
    this.onClickOutside = this.onClickOutside.bind(this);
  }
  componentDidMount() {
    this.fetchExpenses();
    document.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutside);
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

  onClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.resetSelectExpense();
    }
  }

  getExpenseAttributes = (e) => {
    const expense = e.currentTarget.closest('tr');
    let origVals = {
      _id: expense.getAttribute('_id'),
      title: expense.getAttribute('title'),
      amount: expense.getAttribute('amount'),
      category: expense.getAttribute('category'),
      date: expense.getAttribute('date'),
      group_id:
        expense.getAttribute('group_id') ||
        (this.props.groups && this.props.groups.length > 0
          ? this.props.groups[
              this.props.groups.findIndex((obj) => obj.default === true)
            ]._id
          : ''),
      description: expense.getAttribute('description') || '',
    };
    return origVals;
  };

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
      }
    }
    query = { ...query, ...this.props.options };
    this.props.getUserExpenses(query).then(() => {
      if (scrollToTop)
        animateScroll.scrollToTop({ containerId: 'table', duration: 0 });
    });
  };

  resetEditExpense = () => {
    this.setState({ editExpense: emptyExpense });
  };

  resetDeleteExpense = () => {
    this.setState({ deleteExpense: emptyExpense });
  };

  resetSelectExpense = () => {
    this.setState({ selectExpense: emptyExpense });
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
    this.onCancel();
    this.setState({
      editExpense: this.getExpenseAttributes(e),
    });
  };

  onClickDelete = (e) => {
    this.onCancel();
    this.setState({
      deleteExpense: this.getExpenseAttributes(e),
    });
  };

  onCancel = () => {
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
    let expense = this.state.editExpense;
    if (!expense.group_id) delete expense['group_id'];
    const expenseDetails = {
      ...expense,
      date: moment(expense.date).format('YYYY/MM/DD'),
      category: expense.category || 'Other',
    };
    this.props.editExpense(expenseDetails).then(this.resetEditExpense);
  };

  onDeleteSubmit = () => {
    this.props
      .deleteExpense(this.state.deleteExpense._id)
      .then(this.resetEditExpense);
  };

  onClickRow = (e) => {
    const expense = this.getExpenseAttributes(e);
    const newSelected =
      expense._id === this.state.selectExpense._id ? emptyExpense : expense;
    this.setState({
      selectExpense: newSelected,
    });
  };

  /**
   * Maps fetched expenses to table rows
   */
  renderTableBody = () => {
    if (this.props.expenses)
      return this.props.expenses.map((expense, i) => (
        <OverlayTrigger
          show={this.state.selectExpense._id === expense._id}
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
              expense._id === this.state.deleteExpense._id
                ? 'expense-delete'
                : expense._id === this.state.selectExpense._id
                ? 'expense-select'
                : expense._id === this.state.editExpense._id
                ? 'expense-edit'
                : 'expense'
            }
            _id={expense._id}
            title={expense.title}
            amount={expense.amount}
            category={expense.category}
            date={moment(expense.date).utc().format('YYYY-MM-DD')}
            group_id={expense.group_id}
            description={expense.description}
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
            <td
              name='category'
              orig={expense.category}
              onClick={this.onClickRow}
            >
              <span>{expense.category}</span>
            </td>
            <td
              name='date'
              orig={moment(expense.date).utc().format('YYYY-MM-DD')}
              onClick={this.onClickRow}
            >
              <span>{moment(expense.date).utc().format('MM/DD/YYYY')}</span>
            </td>
            <td className='expense-action text-center'>
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
            </td>
          </tr>
        </OverlayTrigger>
      ));
  };

  renderDeleteModal = () => {
    return (
      <Modal
        show={this.state.deleteExpense._id !== null}
        onHide={this.onCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete "{this.state.deleteExpense.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to the expense, "
          {this.state.deleteExpense.title}
          "? This cannot be undone!
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.onCancel}>
            Cancel
          </Button>
          <Button variant='danger' onClick={this.onDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderEditModal = () => {
    return (
      <Modal show={this.state.editExpense._id !== null} onHide={this.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name='title'
                  value={this.state.editExpense.title || ''}
                  onChange={this.onEditChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  name='amount'
                  type='number'
                  value={this.state.editExpense.amount || ''}
                  onChange={this.onEditChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Category</Form.Label>
                <CustomInputSelect
                  name='category'
                  options={this.props.categories}
                  value={this.state.editExpense.category || ''}
                  onChange={this.onEditChange}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  name='date'
                  type='date'
                  value={this.state.editExpense.date || ''}
                  onChange={this.onEditChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Group</Form.Label>
                <Form.Control
                  name='group_id'
                  as='select'
                  value={this.state.editExpense.group_id || ''}
                  onChange={this.onEditChange}
                  disabled={!this.props.groups || !this.props.groups.length > 0}
                >
                  {this.props.groups && this.props.groups.length > 0 ? (
                    this.props.groups.map((group, i) => (
                      <option key={i} value={group._id}>
                        {group.name}
                      </option>
                    ))
                  ) : (
                    <option value=''>You have no groups</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name='description'
                  value={this.state.editExpense.description || ''}
                  onChange={this.onEditChange}
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.onCancel}>
            Cancel
          </Button>
          <Button variant='success' onClick={this.onEditSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
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
        ref={this.wrapperRef}
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
            this.state.selectExpense._id ? this.resetSelectExpense : null
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
        {this.renderDeleteModal()}
        {this.renderEditModal()}
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
