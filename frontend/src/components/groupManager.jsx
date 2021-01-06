import React, { Component } from 'react';
import { connect } from 'react-redux';

import './groupManager.css';
import { ListGroup } from 'react-bootstrap';

class GroupManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
  }

  onClick = (e) => {
    this.setState({ selected: e.target.id });
  };

  render() {
    let groups = [{ _id: '', name: 'All expenses' }];
    if (this.props.groups) {
      groups = [...groups, ...this.props.groups];
    }
    return (
      <>
        <div className='h-100'>
          <ListGroup variant='flush'>
            {groups.map((group, i) => (
              <ListGroup.Item
                key={i}
                name={group.name}
                id={group._id}
                onClick={this.onClick}
                active={this.state.selected === group._id}
              >
                {group.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupManager);
