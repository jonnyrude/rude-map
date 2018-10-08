import React, { Component } from 'react';
import './App.css';
//import { Route, Link, Switch } from 'react-router-dom';
import List from './ListComp.js';
import Filter from './Filter.js';

class App extends Component {

  state = {
    service: {},
    request: {
      query: 'coffee',
      type: 'cafe',
      location: { lat: 39.685585, lng: -104.98727 },
      radius: '5000'
    },
    listings: [],
    markers: [],
    filteredResults: []
  }

  render() {

    return (
      <div id="app-container">
        <div id="list-filter">
          {/* Search component */}
          <Filter query={this.filter}/>

          {/* List component */}
          <List places={this.state.filteredResults}/>
        </div>

        <div id="map"></div>
      </div>
    );
  }

  /**
   * GOOGLE MAP CREATION
   */
  componentDidMount() {
    // push initMap to a global (so it can be used as a callback by google's API <script>)
    window.initMap = this.initMap;
    // init google API
    initGoogleAPI();
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.685585, lng: -104.98727 },
        zoom: 13,
        styles: []
    });

    const service = new window.google.maps.places.PlacesService(map);
    this.setState({service});
    this.getListings(this.state.request);
  }

  /**
   * GET LOCAL CAFE's FROM GOOGLE PLACES
   */
  getListings = (req) => {
    this.state.service.textSearch(req, (results, status) => {
      if(status === "OK") {
        this.setState({listings: results,
        filteredResults: results});
      }
      else {
        console.log(`Problem with Google Places query: ${status}`)
      }
    });
  }

  /**
   * FILTER FUNCTIONALITY
   */
  filter = (query) => {
    if (!query) this.setState({filteredResults: this.state.listings});

    let results = this.state.listings.filter((cafe, index) => {
      return cafe.name.toLowerCase().includes(query.toLowerCase());
    })
    this.setState({filteredResults: results})
  }


}


function initGoogleAPI() {
  // create script to fetch google API
  const script = window.document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFsdADbayWDjmwhIHX6nI9uY8qKZ-bPW4&v=3&callback=initMap&libraries=places";
  script.async = true;
  script.defer = true;

  // fix that script to the top of the html doc
  const index = window.document.getElementsByTagName('script')[0];
  index.parentNode.insertBefore(script, index);
}

export default App;
