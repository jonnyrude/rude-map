import React, { Component } from 'react';
import './App.css';

class List extends Component {
    render () {
        return (
            <div className="list" >
                <ul onClick={this.props.selectItem}>
                    {this.props.places && this.props.places.map(cafe => {

                        if(this.props.selection && this.props.selection.toString() === cafe.foursquareID) {
                            return (<div key={cafe.id} className="selectedCafe chosen">
                                        <li class="cafe-list-item" key={cafe.id} id={cafe.foursquareID}>{cafe.name}</li>
                                        <div className="listInfo">
                                            <p class="address-line">{cafe.formatted_address}</p>
                                        </div>
                                    </div>)

                        } else {
                            return <li class="cafe-list-item" key={cafe.id} id={cafe.foursquareID}>{cafe.name}</li>
                        }
                    })}
                </ul>
            </div>
        )
    }

}

export default List