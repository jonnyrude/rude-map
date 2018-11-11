import React, { Component } from 'react';
import './App.css';

class Filter extends Component {
  render() {
    return (
      <div className="filter" >
        <input aria-label="Filter" id="filter-query" type="text" placeholder="Filter Coffee Shops by Name"
          onChange={e => this.props.query(e.target.value)}></input>
      </div>
    )
  }
}

export default Filter