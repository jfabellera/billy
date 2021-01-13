import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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

import { userLogoutRequest } from '../store/actions/usersActions';

const { Header, Sider, Content } = Layout;

class PageLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      broken: false,
      sidebarKey: 1,
      userMenuVisible: false,
    };
    this.sidebar = React.createRef();
  }

  onClickOutside = (event) => {
    if (
      this.sidebar &&
      !this.sidebar.current.contains(event.target) &&
      !this.state.collapsed
    ) {
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
  userLinks = () => {
    return (
      <>
        <Menu.Item key='/dashboard' icon={<DashboardOutlined />}>
          <Link to='/dashboard'>Dashboard</Link>
        </Menu.Item>
        <Menu.Item key='/expenses' icon={<DollarOutlined />}>
          <Link to='/expenses'>Expenses</Link>
        </Menu.Item>
        <Menu.Item key='/statistics' icon={<BarChartOutlined />}>
          <Link to='/statistics'>Statistics</Link>
        </Menu.Item>
      </>
    );
  };

  // Sidebar links for guests
  guestLinks = () => {
    return (
      <>
        <Menu.Item key='/' icon={<HomeOutlined />}>
          <Link to='/'>Home</Link>
        </Menu.Item>
        <Menu.Item key='/about' icon={<QuestionCircleOutlined />}>
          <Link to='/about'>About</Link>
        </Menu.Item>
      </>
    );
  };

  // To prevent memory leak when dropdown is unmounted
  handleMenuClick = (e) => {
    if (e.key !== '/logout') {
      this.setState({ userMenuVisible: false });
    }
  };

  handleVisibleChange = (flag) => {
    this.setState({ userMenuVisible: flag });
  };

  // Account drop down for logged in user
  userMenu = () => {
    return (
      <Menu style={{ float: 'right' }} onClick={this.handleMenuClick}>
        <Menu.Item key='/account'>
          <Link to='/account'>Account</Link>
        </Menu.Item>
        <Menu.Item key='/logout'>
          <Link
            to='/'
            onClick={() => {
              this.props
                .userLogoutRequest()
                .then(() => this.setState({ userMenuVisible: false }));
            }}
          >
            Logout
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  // Navbar buttons for logged in users
  user = () => {
    return (
      <div className='user-buttons' style={{ cursor: 'pointer' }}>
        <Dropdown
          overlay={this.userMenu()}
          trigger={['click']}
          placement='bottomRight'
          onVisibleChange={this.handleVisibleChange}
          visible={this.state.userMenuVisible}
          arrow
          align='right'
        >
          <div>
            <span style={{ marginRight: '8px' }}>
              Hi, {this.props.authenticatedUser.name.first}
            </span>
            <UserOutlined />
            <CaretDownOutlined style={{ fontSize: '12px' }} />
          </div>
        </Dropdown>
      </div>
    );
  };

  // Navbar buttons for guests
  guest = () => {
    return (
      <div className='user-buttons'>
        <Button type='link'>
          <Link to='/login'>Sign in</Link>
        </Button>
        <Button type='primary' shape='round'>
          <Link to='/register'>Sign up</Link>
        </Button>
      </div>
    );
  };

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

            <Menu
              theme='dark'
              mode='inline'
              selectedKeys={[this.props.location.pathname]}
              onClick={() => {
                if (!this.state.collapsed) this.setState({ collapsed: true });
              }}
            >
              {this.props.isAuthenticated
                ? this.userLinks()
                : this.guestLinks()}
            </Menu>
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
                className: 'drawer',
                onClick: this.toggle,
              }
            )}
            {this.props.isAuthenticated ? this.user() : this.guest()}
          </Header>
          <Content
            className='site-layout-background'
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              // display: 'flex',
              // flexDirection: 'column'
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.users.isAuthenticated,
    authenticatedUser: state.users.authenticatedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogoutRequest: () => dispatch(userLogoutRequest()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PageLayout)
);
