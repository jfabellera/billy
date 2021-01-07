import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import {
  getGroups,
  addGroup,
  editGroup,
  deleteGroup,
  setDefaultGroup,
} from '../store/actions/groupsActions';

import './groupManager.css';
import { Button, ListGroup, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';

class GroupManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev_selected_id: '-1',
      selected_id: null,
      selected_name: 'All expenses',
      edit_mode: false,
      edit_groups: null,
      new_group_name: '',
      show_delete_modal: false,
      delete_id: null,
      delete_name: '',
    };
  }

  componentDidUpdate() {
    if (
      this.state.prev_selected_id !== this.state.selected_id &&
      this.props.onChange
    ) {
      this.setState({ prev_selected_id: this.state.selected_id });
      this.props.onChange({
        id: this.state.selected_id,
        name: this.state.selected_name,
      });
    }
  }

  onClickGroup = (e) => {
    const group = e.currentTarget.closest('.list-group-item');
    this.setState({
      selected_id: group.getAttribute('id'),
      selected_name: group.getAttribute('name'),
    });
  };

  onClickEdit = () => {
    let newState = { edit_mode: !this.state.edit_mode };
    if (!this.state.edit_mode) newState.edit_groups = this.props.groups;
    this.setState(newState, () => {
      if (!this.state.edit_mode) {
        // find differences in state.edit_groups and props.groups and make api requests accordingly
        this.props.groups.forEach((group, i) => {
          const edit_group = this.state.edit_groups[i];
          if (group.name !== edit_group.name) {
            // Update group
            this.props.editGroup(edit_group).then(this.props.getGroups);
          }
          if (edit_group.default && group.default !== edit_group.default) {
            // Update user's default_group_id
            this.props
              .setDefaultGroup(edit_group._id)
              .then(this.props.getGroups);
          }
        });
      }
    });
  };

  onEditChange = (e) => {
    const group_id = e.target.closest('.list-group-item').getAttribute('id');
    const group_index = this.state.edit_groups.findIndex(
      (obj) => obj._id === group_id
    );
    if (e.target.type === 'text') {
      this.setState({
        edit_groups: update(this.state.edit_groups, {
          [group_index]: { name: { $set: e.target.value } },
        }),
      });
    } else if (e.target.type === 'radio') {
      const old_default_index = this.state.edit_groups.findIndex(
        (obj) => obj.default === true
      );
      this.setState(
        {
          // Unset default
          edit_groups: update(this.state.edit_groups, {
            [old_default_index]: { default: { $set: false } },
          }),
        },
        () => {
          // Set default
          this.setState({
            edit_groups: update(this.state.edit_groups, {
              [group_index]: { default: { $set: true } },
            }),
          });
        }
      );
    }
  };

  onAddChange = (e) => {
    this.setState({ new_group_name: e.target.value });
  };

  onClickAdd = () => {
    this.props
      .addGroup(this.state.new_group_name)
      .then(this.props.getGroups)
      .then(() => {
        this.setState({ edit_groups: this.props.groups, new_group_name: '' });
      });
  };

  onClickDelete = (e) => {
    this.setState({
      show_delete_modal: true,
      delete_id: e.target.closest('.list-group-item').getAttribute('id'),
      delete_name: e.target.closest('.list-group-item').getAttribute('name'),
    });
  };

  onHideModal = () => {
    this.setState({ show_delete_modal: false, delete_id: '', delete_name: '' });
  };

  onDelete = () => {
    this.props
      .deleteGroup(this.state.delete_id)
      .then(this.props.getGroups)
      .then(() => {
        this.setState({
          edit_groups: this.props.groups,
          show_delete_modal: false,
          delete_id: '',
          delete_name: '',
        });
      });
  };

  renderList = () => {
    let groups = [{ _id: null, name: 'All expenses' }];
    if (this.state.edit_mode && this.state.edit_groups) {
      groups = [...groups, ...this.state.edit_groups];
    } else if (this.props.groups) {
      groups = [...groups, ...this.props.groups];
    }

    if (this.state.edit_mode)
      return (
        <ListGroup variant='flush'>
          {groups.map((group, i) => (
            <ListGroup.Item key={i} name={group.name} id={group._id}>
              <div className='d-flex align-items-center justify-content-end'>
                {!group._id ? (
                  <span className='mr-auto'>{group.name}</span>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faTimes}
                      onClick={this.onClickDelete}
                    />
                    <Form.Control
                      className='mx-2'
                      type='text'
                      value={group.name}
                      onChange={this.onEditChange}
                    />
                    <Form.Check
                      type='radio'
                      name='default'
                      id={i}
                      checked={group.default}
                      onChange={this.onEditChange}
                    />
                  </>
                )}
              </div>
            </ListGroup.Item>
          ))}
          <ListGroup.Item>
            <div className='d-flex'>
              <Form.Control
                className='mr-2'
                placeholder='New group name'
                value={this.state.new_group_name}
                onChange={this.onAddChange}
              />
              <Button onClick={this.onClickAdd}>Add</Button>
            </div>
          </ListGroup.Item>
        </ListGroup>
      );
    else
      return (
        <ListGroup variant='flush'>
          {groups.map((group, i) => (
            <ListGroup.Item
              key={i}
              name={group.name}
              id={group._id}
              onClick={this.onClickGroup}
              active={this.state.selected_id === group._id}
            >
              <div className='d-flex align-items-center justify-content-end'>
                <span className='mr-auto'>{group.name}</span>
                {group.default ? (
                  <small className='font-italic'>Default</small>
                ) : null}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      );
  };

  render() {
    return (
      <>
        <div className='group-manager h-100'>
          <div className='group-header d-flex p-2 align-items-center'>
            <h3>Groups</h3>
            <Button
              className='d-flex ml-auto m-1 align-items-center p-2'
              variant='outline-dark'
              size='sm'
              onClick={this.onClickEdit}
            >
              <FontAwesomeIcon icon={faPen} size='sm' />
            </Button>
          </div>
          {/* TODO : manage overflow for list */}
          <div className='h-100'>{this.renderList()}</div>
        </div>

        <Modal show={this.state.show_delete_modal} onHide={this.onHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete "{this.state.delete_name}"</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the group, "{this.state.delete_name}
            "? This cannot be undone!
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.onHideModal}>
              Cancel
            </Button>
            <Button variant='danger' onClick={this.onDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
    addGroup: (group_name) => dispatch(addGroup(group_name)),
    editGroup: (group) => dispatch(editGroup(group)),
    deleteGroup: (group_id) => dispatch(deleteGroup(group_id)),
    setDefaultGroup: (group_id) => dispatch(setDefaultGroup(group_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupManager);
