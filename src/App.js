import React, { Component } from 'react';
import './App.css';
//import { Route, Link, Switch } from 'react-router-dom';
import List from './ListComp.js';
import Filter from './Filter.js';

class App extends Component {

  state = {
    map: {},
    service: {},
    request: {
      query: 'coffee',
      type: 'cafe',
      location: { lat: 39.685585, lng: -104.98727 },
      radius: '5000'
    },
    listings: [],
    markers: [],
    filteredResults: [],
    infoWindow: {}
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
   * Markers to the map!
   */
  createMarkers = (map) => {
    let mkrs = this.state.filteredResults.map((mark, index) => {
      let marker = new window.google.maps.Marker({
        map: map,
        position: mark.geometry.location,
        id: index,
        animation: window.google.maps.Animation.drop
      });

      const callback = this.populateInfoWindow;

      marker.addListener('click', function() {
        callback(this);
        console.log("you clicked a marker!");
      });
      return marker;
    })

    // Also create an info window
    const infoWin = new window.google.maps.InfoWindow();

    this.setState({ markers: mkrs, infoWindow: infoWin});


  }

  /**
   * Populate info Window
   */
  populateInfoWindow = (marker) => {
    //marker.id is the index of the cafe object in state.filteredResults
    if(this.state.infoWindow.marker !== marker) {

      this.setState(state => {
        state.infoWindow.marker = marker;
        state.infoWindow.setContent(`${marker.id}`);
        state.infoWindow.open(state.map, marker);
        state.infoWindow.addListener('closeClick', () => {
          state.infoWindow.setMarker(null);
        })

      })





    }
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

    const Cmarker = new window.google.maps.Marker({position: { lat: 39.685585, lng: -104.98727 }, name: 'Center', map: map })

    const service = new window.google.maps.places.PlacesService(map);
    this.setState({service, map});
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
        this.createMarkers(this.state.map);
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
