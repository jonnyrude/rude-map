import React, { Component } from 'react';
import './App.css';

class List extends Component {
  render() {
    return (
      <div className="list" >
        <ul role="list" onClick={this.props.selectItem}>
          {this.props.places && this.props.places.map(cafe => {

            if (this.props.selection && this.props.selection.toString() === cafe.foursquareID) {
              return (<div key={cafe.id} className="selectedCafe chosen">
                <li className="cafe-list-item" key={cafe.id} ><button aria-label={`Select ${cafe.name}`} id={cafe.foursquareID} className="cafe-select-btn" type="button">{cafe.name}</button></li>
                <div className="listInfo">
                  <p className="address-line">{this.streetAddressString(cafe.formatted_address)}<br />{this.cityStateZip(cafe.formatted_address)}</p>
                </div>
              </div>)

            } else {
              return <li className="cafe-list-item" key={cafe.id} ><button aria-label={`Select ${cafe.name}`} id={cafe.foursquareID} className="cafe-select-btn" type="button">{cafe.name}</button></li>
            }
          })}
        </ul>
      </div>
    )
  }

  streetAddressString(addressString) {
    return addressString.slice(0, addressString.indexOf(','))
  }

  cityStateZip(addressString) {
    return addressString.slice(addressString.indexOf(',') + 1)
  }
}

export default List