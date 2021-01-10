import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PageLayout from './containers/pageLayout';
import LandingPage from './containers/home/landingPage';
import Terms from './containers/home/terms';
import Login from './containers/users/login';
import Register from './containers/users/register';
import Dashboard from './containers/expenses/dashboard';
import Expenses from './containers/expenses/expenses';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <PageLayout
          children={
            <>
              {' '}
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/about/terms' component={Terms} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/expenses' component={Expenses} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
            </>
          }
        />
      </Router>
    );
  }
}

export default App;
