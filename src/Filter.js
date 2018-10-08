import React, { Component } from 'react';
import './App.css';

class Filter extends Component {
    render () {
        return (
            <div className="filter" >
                <input id="filter-query" type="text"></input>
            </div>
        )
    }
}

export default Filter