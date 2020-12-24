import React, { Component } from 'react';
import axios from 'axios';

import { Container, Card, Form, Button, Col, Row } from 'react-bootstrap';

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    usernameTaken: null,
    passwordMismatch: null,
  };

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onChangefirstName = (e) => {
    this.setState({ firstName: e.target.value });
  };

  onChangeLastName = (e) => {
    this.setState({ lastName: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value }, () => {
      this.confirmPasswords();
    });
  };

  onChangeConfirmPassword = (e) => {
    this.setState({ confirmPassword: e.target.value }, () => {
      this.confirmPasswords();
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.confirmUsername(() => {
      if (this.state.usernameTaken) return;
      else {
        const user = {
          username: this.state.username,
          name: {
            first: this.state.firstName,
            last: this.state.lastName,
          },
          password: this.state.password,
        };
        axios
          .post('http://localhost:5000/users', user)
          .then((res) => {
            // logged in
          })
          .catch((err) => {
            if (err.response) {
              // Username is taken
              if (err.response.status === 409) {
                this.setState({
                  usernameTaken: true,
                });
              }
            }
          });
      }
    });
  };

  /**
   * Checks if the username is available
   */
  confirmUsername = (callback) => {
    // TODO: Get actual username count or a boolean
    let usernameCount = 0;
    if (this.state.username === 'jan') usernameCount = 1;
    this.setState({ usernameTaken: usernameCount !== 0 }, callback);
  };

  /**
   * Checks that the two password fields match.
   */
  confirmPasswords = (callback) => {
    this.setState(
      {
        passwordMismatch:
          this.state.password &&
          this.state.confirmPassword &&
          this.state.password !== this.state.confirmPassword,
      },
      callback
    );
  };

  render() {
    return (
      <>
        <div className='d-flex flex-fill align-items-center overflow-auto'>
          <Container as={Card} style={{ maxWidth: '500px' }}>
            <Form className='m-3' onSubmit={this.onSubmit}>
              <h1 className='mb-3 text-center'>Register</h1>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={this.onChangefirstName}
                  ></Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type='text'
                    onChange={this.onChangeLastName}
                  ></Form.Control>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} lg='6'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type='text'
                    isInvalid={this.state.usernameTaken}
                    required
                    onChange={this.onChangeUsername}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    Username is taken
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    required
                    onChange={this.onChangePassword}
                  ></Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    isInvalid={this.state.passwordMismatch}
                    required
                    onChange={this.onChangeConfirmPassword}
                  ></Form.Control>
                  <Form.Control.Feedback type='invalid'>
                    Passwords do not match
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className='justify-content-md-center'>
                <Button variant='success' type='submit' className='mt-4'>
                  Register
                </Button>
              </Row>
            </Form>
          </Container>
        </div>
      </>
    );
  }
}

export default Register;
