import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLoginRequest } from '../../store/actions/usersActions';
import { Redirect } from 'react-router-dom';

import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

class Login extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      username: '',
      password: '',
      invalid: false,
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  displayInvalid = () => {
    if (this.state.invalid) {
      return (
        <p style={{ color: 'red', textAlign: 'center' }}>
          Invalid username or password
        </p>
      );
    } else return null;
  };

  onSubmit = (user) => {
    if (this._isMounted)
      this.setState({ loading: true }, () => {
        this.props.userLoginRequest(user).then((valid) => {
          if (this._isMounted && !valid)
            this.setState({ invalid: true, loading: false });
        });
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
          <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
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
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Password'
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type='primary'
                htmlType='submit'
                loading={this.state.loading}
              >
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLoginRequest: (userLogin) => dispatch(userLoginRequest(userLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
