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
    }
  }

  render() {

    return (
      <div id="app-container">
        <div id="list-filter">
          {/* Search component */}
          <Filter />

          {/* List component */}
          <List />
        </div>

        <div id="map"></div>
      </div>
    );
  }

  componentDidMount() {
    window.initMap = this.initMap;
    initGoogleAPI();
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.685585, lng: -104.98727 },
        zoom: 13,
        styles: []
    });

    const gService = new window.google.maps.places.PlacesService(map);
    // // this.setState({service});
    gService.textSearch(this.state.request, (results, status) => {
      console.log(results)
    });
  }

  getListings = (results, status) => {
      console.log(status);
      console.table(results);
  }

}


function initGoogleAPI() {
  // create script to fetch google API
  const script = window.document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFsdADbayWDjmwhIHX6nI9uY8qKZ-bPW4&v=3&callback=initMap&libraries=places";
  script.async = true;
  script.defer = true;

  // fix that script to the top of the doc
  const index = window.document.getElementsByTagName('script')[0];
  index.parentNode.insertBefore(script, index);
}

export default App;
