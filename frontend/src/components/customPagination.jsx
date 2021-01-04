import React, { Component } from 'react';

import { Pagination } from 'react-bootstrap';

/**
 * Component that deals with pagination i.e. determines
 * which page numbers to show depending on the current
 * page, and the number of total pages.
 */
class CustomPagination extends Component {
  // Props: total, value, onChange
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      prevValue: -1,
    };
  }

  componentDidUpdate() {
    const e = {
      target: {
        name: this.props.name || 'currentPage',
        value: this.state.currentPage,
      },
    };

    if (
      this.state.currentPage !== this.props.value &&
      this.state.prevValue === this.props.value
    ) {
      if (this.props.onChange) this.props.onChange(e);
    } else if (this.state.prevValue !== this.props.value) {
      this.setState({
        prevValue: this.props.value,
        currentPage: this.props.value,
      });
    }
  }

  render() {
    // Some weird mathgic I came up with while working on the initial course project
    // if (this.props.value) this.setState({ currentPage: this.props.value });
    let low, high;
    let current = this.props.value;
    let total = this.props.total || 1;
    if (current < 5) {
      low = 2;
      high = Math.min(5, total - 1);
    } else if (current > total - 4) {
      low = total - 4;
      high = total - 1;
    } else {
      low = current - 1;
      high = current + 1;
    }
    let diff = high - low + 1;
    let pages = diff > 0 ? [...Array(diff).keys()].map((i) => i + low) : [];

    return (
      <Pagination className='m-0'>
        <Pagination.Prev
          disabled={current === 1}
          onClick={() => {
            this.setState({ currentPage: Math.max(current - 1, 1) });
          }}
        />
        <Pagination.Item
          active={current === 1}
          onClick={() => {
            this.setState({ currentPage: 1 });
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
              this.setState({ currentPage: i });
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
              this.setState({ currentPage: total });
            }}
          >
            {total}
          </Pagination.Item>
        )}
        <Pagination.Next
          disabled={current === total}
          onClick={() => {
            this.setState({ currentPage: Math.min(current + 1, total) });
          }}
        />
      </Pagination>
    );
  }
}

export default CustomPagination;
