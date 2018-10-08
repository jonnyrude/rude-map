import React, { Component } from 'react';
import './App.css';

class List extends Component {
    render () {
        return (
            <div className="list" >
                <ul>
                    {this.props.places && this.props.places.map(cafe => {
                        return <li key={cafe.id}>{cafe.name}</li>
                    })}
                </ul>
            </div>
        )
    }
}

export default List