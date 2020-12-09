import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from "./components/navBar";
import LandingPage from "./containers/home/landingPage";
import Terms from "./containers/home/terms";
import Login from "./containers/users/login";
import Register from "./containers/users/register";

class App extends Component {
  render() {
    return (
      <Router>
        <NavBar />
        <br />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/about/terms" component={Terms} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Router>
    );
  }
}

export default App;
