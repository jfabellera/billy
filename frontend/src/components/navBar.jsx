import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Nav,
  Navbar,
  NavDropdown,
  Button,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';

class NavBar extends Component {
  state = {
    session: null,
  };

  /**
   * Renders links on the left of the navbar depending on the user session
   */
  renderLinks() {
    if (this.state.session) {
      return (
        <Nav.Link as={Link} to="/users">
          Users
        </Nav.Link>
      );
    } else {
      return (
        <NavDropdown title="About" id="collasible-nav-dropdown">
          <NavDropdown.Item as={Link} to="/about/terms">
            Terms and Conditions
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/about/contributors">
            Contributors
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

  /**
   * Renders account buttons or links depending on user session
   */
  renderAccount() {
    if (this.state.session) {
      return (
        <DropdownButton
          variant="dark"
          menuAlign="right"
          title={'Hi, ' + this.state.firstName}
          id="dropdown-menu-align-right"
          className="mx-1"
        >
          <Dropdown.Item as={Link} to="/summary">
            Summary
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/about">
            About
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/account">
            Account
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/logout">
            Logout
          </Dropdown.Item>
        </DropdownButton>
      );
    } else {
      return (
        <>
          <Button
            as={Link}
            variant="outline-secondary"
            className="mx-1"
            to="/register"
          >
            Create Account
          </Button>{' '}
          <Button as={Link} variant="success" className="mx-1" to="/login">
            Login
          </Button>{' '}
        </>
      );
    }
  }

  render() {
    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">
            Billy
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">{this.renderLinks()}</Nav>
            <Nav className="ml-auto">{this.renderAccount()}</Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default NavBar;
