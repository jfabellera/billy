import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class NavBar extends Component {
  state = {
    session: null,
  };

  /**
   * Renders links on the left of the navbar depending on the user session
   */
  renderLinks() {
    if (this.state.session) {
      return <Nav.Link href="/users">Users</Nav.Link>;
    } else {
      return (
        <NavDropdown title="About" id="collasible-nav-dropdown">
          <NavDropdown.Item href="/about/terms">
            Terms and Conditions
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/about/contributors">
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
          title={"Hi, " + this.state.firstName}
          id="dropdown-menu-align-right"
          className="mx-1"
        >
          <Dropdown.Item eventKey="1">Summary</Dropdown.Item>
          <Dropdown.Item eventKey="2">About</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="3">Account</Dropdown.Item>
          <Dropdown.Item eventKey="4">Logout</Dropdown.Item>
        </DropdownButton>
      );
    } else {
      return (
        <>
          <Button variant="outline-secondary" className="mx-1" href="/register">
            Create Account
          </Button>{" "}
          <Button variant="success" className="mx-1" href="/login">
            Login
          </Button>{" "}
        </>
      );
    }
  }

  render() {
    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">Billy</Navbar.Brand>
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
