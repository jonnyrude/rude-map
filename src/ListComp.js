import React, { Component } from 'react';
import './App.css';

class List extends Component {
    render () {
        return (
            <div className="list" >
                <ul onClick={this.clickedOn}>
                    {this.props.places && this.props.places.map(cafe => {
                        return <li key={cafe.id} id={cafe.foursquareID}>{cafe.name}</li>
                    })}
                </ul>
            </div>
        )
    }

    clickedOn(e) {

        // console.log(this);
        console.log(e.target.color);
        e.target.className = "chosen";
    }
}

export default List