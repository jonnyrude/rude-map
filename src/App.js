import React, { Component } from 'react';
import './App.css';
//import { Route, Link, Switch } from 'react-router-dom';
import List from './ListComp.js';
import Filter from './Filter.js';
import * as data from './locations.json';
import Map from './MapComp.js';

class App extends Component {

  state = {
    listings: [],
    filteredResults: [],
    selectedItemID: null
  }

  render() {
    return (
      <div id="app-container">
        <div id="list-filter">
        <h1>Denver Cafe Map</h1>
          {/* Search component */}
          <Filter query={this.filter}/>

          {/* List component */}
          <List places={this.state.filteredResults} selectItem={(arg) => this.selectItem(arg)}
          selection={this.state.selectedItemID}/>
        </div>

        {/* <div id="map"></div> */}
        <Map places={this.state.listings} fourSqAPIcall={this.getFourSq} selectItem={(arg) => this.selectItem(arg)}
          selection={this.state.selectedItemID} showingListings={this.state.filteredResults} foursqPhoto={this.getPhoto}/>
      </div>
    );
  }


  componentWillMount() {
   // initGoogleAPI();
   const myPlaces = data.default;

   this.setState({listings: myPlaces, filteredResults: myPlaces});
  }

  /**
   * GET LOCAL CAFE's FROM GOOGLE PLACES
   *
   *  - NO LONGER IN USE
   */
  // getListings = (req) => {
  //   this.state.service.textSearch(req, (results, status) => {
  //     if(status === "OK") {
  //       this.setState({listings: results,
  //       filteredResults: results});
  //       this.createMarkers(this.state.map);
  //     }
  //     else {
  //       console.log(`Problem with Google Places query: ${status}`)
  //     }
  //   });
  // }

/**
 * GET SELECTED ITEM FROM CLICK
 *
 */
  selectItem(eventObject) {
  if(typeof eventObject === "object" && eventObject.target && eventObject.target.tagName === "BUTTON") {
      console.log(eventObject.key );
      this.setState({ selectedItemID: eventObject.target.id})
  } else if (typeof eventObject === "string") {
    this.setState({selectedItemID: eventObject});
  } else if(eventObject.foursquareID) {
    // console.log('Selection attempt: ',eventObject);
    this.setState({ selectedItemID: eventObject.foursquareID})
  }
  }

  /**
   * FILTER FUNCTIONALITY
   */
  filter = (query) => {
    if (!query) this.setState({filteredResults: this.state.listings});

    let results = this.state.listings.filter((cafe, index) => {
      return cafe.name.toLowerCase().includes(query.toLowerCase());
    })
    this.setState({filteredResults: results, selectedItemID: null})
  }


  /**
   * FOURSQUARE API CALL
   *
   *  - returns a Promise.all array of 2 Json items
   */
  getFourSq = (markerID) => {
    // Set varialbes to create url for Foursquare API requests
    let id = this.state.listings[markerID].foursquareID;
    let url = 'https://api.foursquare.com/v2/venues/';
    let authentication = 'client_id=RGZFKSSZOTBZKW0JHI0DEHD34LIHGBICEWFHRH3TBGZZ4QFY'+
              '&client_secret=H5N1I1ECCDDGALKI5GZU1XQGYKKJJHWGAUEYG5FYZFEFTIQT'+
              '&v=20181020';

    // create 2 promises - first for venue information
    let getFourData = fetch(`${url}${id}?${authentication}`).then(venueReponse => venueReponse.json());
    // second for photo information
    let getFourPhoto = fetch(`https://api.foursquare.com/v2/venues/${id}/photos?group=venue&size=50x50&limit=2` +
    `&${authentication}`).then(photoResponse => photoResponse.json())

    // Use Promise.all to submit fetch requests asynchronously
    let requests = [getFourData, getFourPhoto];
    return Promise.all(requests)

  }

}

export default App;