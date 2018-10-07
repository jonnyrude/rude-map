import React, { Component } from 'react';
import './App.css';

class Filter extends Component {
    render () {
        return (
            <div class="filter" >
                <input id="filter-query" type="text"></input>
            </div>
        )
    }
}

export default Filter