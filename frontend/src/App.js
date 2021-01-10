import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  DollarOutlined,
  BarChartOutlined,
  UserOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';

import LandingPage from './containers/home/landingPage';
import Terms from './containers/home/terms';
import Login from './containers/users/login';
import Register from './containers/users/register';
import Dashboard from './containers/expenses/dashboard';
import Expenses from './containers/expenses/expenses';

const { Header, Sider, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      broken: false,
    };

    this.sidebar = React.createRef();
  }

  onClickOutside = (event) => {
    if (this.sidebar && !this.sidebar.current.contains(event.target)) {
      this.setState({ collapsed: true });
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutside);
  }

  // Sidebar links for logged in users
  userLinks = (
    <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
      <Menu.Item key='1' icon={<DashboardOutlined />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key='2' icon={<DollarOutlined />}>
        Expenses
      </Menu.Item>
      <Menu.Item key='3' icon={<BarChartOutlined />}>
        Statistics
      </Menu.Item>
    </Menu>
  );

  // Sidebar links for guests
  guestLinks = (
    <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
      <Menu.Item key='1' icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.Item key='2' icon={<QuestionCircleOutlined />}>
        About
      </Menu.Item>
    </Menu>
  );

  // Account drop down for logged in user
  userMenu = (
    <Menu mode='horizontal' style={{ float: 'right' }}>
      <Menu.Item key='1'>Account</Menu.Item>
      <Menu.Item key='2'>Logout</Menu.Item>
    </Menu>
  );

  // Navbar buttons for logged in users
  user = (
    <div className='user-buttons' style={{ cursor: 'pointer' }}>
      <Dropdown
        overlay={this.userMenu}
        trigger={['click']}
        placement='bottomRight'
        arrow
        align='right'
      >
        <div>
          <span style={{ marginRight: '8px' }}>
            Hi, {this.props.authenticatedUser.name.first}
          </span>
          <UserOutlined />
          <CaretDownOutlined style={{ fontSize: '14px' }} />
        </div>
      </Dropdown>
    </div>
  );

  // Navbar buttons for guests
  guest = (
    <div className='user-buttons'>
      <Button type='link'>Sign in</Button>
      <Button type='primary' shape='round'>
        Sign up
      </Button>
    </div>
  );

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <div ref={this.sidebar}>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            breakpoint='md'
            collapsedWidth={this.state.broken ? 0 : 80}
            onBreakpoint={(e) => {
              this.setState({ broken: e });
            }}
            style={{ zIndex: 100, position: 'fixed', height: '100vh' }}
          >
            <div className='logo'>
              <h2>Billy</h2>
              {!this.state.collapsed ? (
                <CloseOutlined
                  onClick={() => this.setState({ collapsed: true })}
                />
              ) : null}
            </div>
            {this.props.isAuthenticated ? this.userLinks : this.guestLinks}
          </Sider>
        </div>
        <Layout
          className='site-layout'
          style={{ marginLeft: this.state.broken ? 0 : 80, height: '100vh' }}
        >
          <div
            className='dim-overlay'
            style={{
              visibility: this.state.collapsed ? 'hidden' : 'visible',
              opacity: this.state.collapsed ? 0 : 0.5,
            }}
          />
          <Header
            className='site-layout-background'
            style={{
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {React.createElement(
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'navbar-icon',
                onClick: this.toggle,
              }
            )}
            {this.props.isAuthenticated ? this.user : this.guest}
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Router>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/about/terms' component={Terms} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/expenses' component={Expenses} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route
                render={() => {
                  return (
                    <Redirect
                      to={this.props.isAuthenticated ? '/dashboard' : '/'}
                    />
                  );
                }}
              />
            </Router>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: true, //state.users.isAuthenticated,
    authenticatedUser: { name: { first: 'bro' } }, //state.users.authenticatedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
