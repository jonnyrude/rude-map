import React, { Component } from 'react';
import './App.css';
//import { Route, Link, Switch } from 'react-router-dom';
import Map from './Map.js';
import List from './ListComp.js';
import Filter from './Filter.js';

class App extends Component {
  render() {
    return (
      <div id="app-container">
        <div id="list-filter">
          {/* Search component */}
          <Filter />

          {/* List component */}
          <List />
        </div>

        <Map />
      </div>
    );
  }
}

export default App;
