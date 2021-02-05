import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { userRegisterRequest } from '../../store/actions/usersActions';

import { Form, Input, Button, Card, Typography } from 'antd';
const { Title } = Typography;

const rule = [
  {
    required: true,
    message: 'Required',
  },
];

class Register extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      loading: false,
      usernameTaken: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSubmit = (newUser) => {
    this.setState({ loading: true }, () => {
      this.props
        .userRegisterRequest({
          username: newUser.username,
          password: newUser.password,
          name: {
            first: newUser.first,
            last: newUser.last,
          },
        })
        .then(() => {
          if (this._isMounted)
            this.setState({ loading: false, usernameTaken: false });
        })
        .catch(() => this.setState({ loading: false, usernameTaken: true }));
    });
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card style={{ width: '400px' }} bordered>
            <Title level={2} style={{ textAlign: 'center' }}>
              Register
            </Title>
            <Form
              name='normal_login'
              layout='vertical'
              initialValues={{
                remember: true,
              }}
              onFinish={this.onSubmit}
            >
              <Form.Item label='First name' name='first' rules={rule}>
                <Input placeholder='First' />
              </Form.Item>

              <Form.Item label='Last name' name='last' rules={rule}>
                <Input placeholder='Last' />
              </Form.Item>
              <Form.Item
                label='Username'
                name='username'
                rules={rule}
                validateStatus={this.state.usernameTaken ? 'error' : ''}
                help={this.state.usernameTaken ? 'Username unavailable' : null}
              >
                <Input placeholder='Username' />
              </Form.Item>
              <Form.Item name='password' label='Password' rules={rule}>
                <Input.Password placeholder='Password' />
              </Form.Item>

              <Form.Item
                name='confirm'
                label='Confirm Password'
                dependencies={['password']}
                hasFeedback
                rules={[
                  ...rule,
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        'The two passwords that you entered do not match!'
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder='Confirm password' />
              </Form.Item>

              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={this.state.loading}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </>
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
    userRegisterRequest: (userInfo) => dispatch(userRegisterRequest(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
