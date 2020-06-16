import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom'
import LocationForm from './LocationForm';
import Map from './Map';
import '../styles/index.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <header>
          <h1>WYA Dimagi?</h1>
          <section className="nav">
            <NavLink to='/' exact activeClassName="selected">Location Form</NavLink>
            <NavLink to='/map' activeClassName="selected">Map</NavLink>
          </section>
        </header>
        <Switch>
          <Route exact path="/">
            <LocationForm />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;