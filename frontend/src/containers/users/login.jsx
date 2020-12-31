import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLoginRequest } from '../../store/actions/usersActions';
import { Redirect } from 'react-router-dom';

import { Container, Card, Form, Button, Row } from 'react-bootstrap';

class Login extends Component {
  state = {
    username: '',
    password: '',
    invalid: null,
  };

  onChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const login = {
      username: this.state.username,
      password: this.state.password,
    };

    this.props.userLoginRequest(login);
  };

  displayInvalid = () => {
    if (this.props.invalidUser) {
      return (
        <Row className='justify-content-md-center'>
          <br />
          <p className='text-danger m-3'>Invalid username or password</p>
        </Row>
      );
    }
    return null;
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
              <h1 className='text-center'>Login</h1>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  onChange={this.onChangeUsername}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  onChange={this.onChangePassword}
                ></Form.Control>
              </Form.Group>
              <Row className='justify-content-md-center'>
                <Button variant='success' type='submit'>
                  Login
                </Button>
              </Row>
              {this.displayInvalid()}
            </Form>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    invalidUser: state.users.invalidUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLoginRequest: (userLogin) => dispatch(userLoginRequest(userLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
