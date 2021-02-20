import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PageLayout from './containers/pageLayout';
import LandingPage from './containers/home/landingPage';
import Terms from './containers/home/terms';
import Login from './containers/users/login';
import Register from './containers/users/register';
import Dashboard from './containers/expenses/dashboard';
import Expenses from './containers/expenses/expenses';
import Groups from './containers/expenses/groups';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <PageLayout
          children={
            <>
              {' '}
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/about/terms" component={Terms} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/expenses" component={Expenses} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/groups" component={Groups} />
            </>
          }
        />
      </Router>
    );
  }
}

export default App;
