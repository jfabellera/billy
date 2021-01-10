import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLoginRequest } from '../../store/actions/usersActions';
import { Redirect } from 'react-router-dom';

import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

class Login extends Component {
  state = {
    username: '',
    password: '',
    submitted: false,
  };

  displayInvalid = () => {
    if (this.state.submitted && this.props.invalidUser) {
      return (
        <p style={{ color: 'red', textAlign: 'center' }}>
          Invalid username or password
        </p>
      );
    }
    return null;
  };

  onSubmit = (user) => {
    this.props.userLoginRequest(user).then(() => {
      this.setState({ submitted: true });
    });
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card style={{ width: '400px' }} bordered>
          <h1 style={{ textAlign: 'center' }}>Login</h1>
          <Form
            name='normal_login'
            initialValues={{
              remember: true,
            }}
            onFinish={this.onSubmit}
          >
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: 'Required',
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder='Username' />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Required',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type='primary' htmlType='submit'>
                Log in
              </Button>
            </Form.Item>
          </Form>
          {this.displayInvalid()}
        </Card>
      </div>
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
