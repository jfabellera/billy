import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userRegisterRequest } from '../../store/actions/usersActions';

import { Container, Card, Form, Button, Col, Row } from 'react-bootstrap';

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
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

    const user = {
      username: this.state.username,
      name: {
        first: this.state.firstName,
        last: this.state.lastName,
      },
      password: this.state.password,
    };

    this.props.userRegisterRequest(user);
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
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

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
                    isInvalid={this.props.usernameTaken}
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

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    usernameTaken: state.usernameTaken,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userRegisterRequest: (userInfo) => dispatch(userRegisterRequest(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
