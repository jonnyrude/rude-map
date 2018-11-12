import React, { Component } from 'react';
import './App.css';
import List from './ListComp.js';
import Filter from './Filter.js';
import * as data from './locations.json';
import Map from './MapComp.js';

class App extends Component {

  state = {
    listings: [],
    filteredResults: [],
    selectedItemID: null,
    error: false
  }

  render() {
    return (
      <main role="main" id="app-container">
        <div id="list-filter">
          <h1>Denver Cafe Map</h1>
          {/* Filter component */}
          <Filter query={this.filter} />

          {/* List component */}
          <List places={this.state.filteredResults} selectItem={(arg) => this.selectItem(arg)}
            selection={this.state.selectedItemID} />
        </div>

        {/* Map Component - Info Windows display Foursquare API info */}
        <Map places={this.state.listings} fourSqAPIcall={this.getFourSq} selectItem={(arg) => this.selectItem(arg)}
          selection={this.state.selectedItemID} showingListings={this.state.filteredResults} foursqPhoto={this.getPhoto}
          error={this.apiCallWorked} />
        <div className={"error-message " + (this.state.error ? "showing":"hidden" )}>Problem loading information:<br /><span className="err-subtext">Some information was not gathered from the API</span></div>
      </main>
    );

  }


  componentWillMount() {
    // initGoogleAPI();
    const myPlaces = data.default;
    // Load info from JSON file (hard-coded info on coffee shops in Denver)
    this.setState({ listings: myPlaces, filteredResults: myPlaces });

    window.gm_authFailure= () => {
      window.alert("Google Maps Auth Failure")
    }
  }


  /**
   * GET SELECTED ITEM FROM CLICK
   * - Marker or list items are clicked on
   * - List items can be selected with keyboard (Tab through + Enter to select)
   */
  selectItem(eventObject) {
    if (typeof eventObject === "object" && eventObject.target && eventObject.target.tagName === "BUTTON") {
      this.setState({ selectedItemID: eventObject.target.id })
    } else if (typeof eventObject === "string") {
      this.setState({ selectedItemID: eventObject });
    } else if (eventObject.foursquareID) {
      // console.log('Selection attempt: ',eventObject);
      this.setState({ selectedItemID: eventObject.foursquareID })
    }
  }

  /**
   * FILTER FUNCTIONALITY
   * - Changes state of Parent/App component with input from Filter component
   *   child components update themselves
   */
  filter = (query) => {
    if (!query) this.setState({ filteredResults: this.state.listings });

    let results = this.state.listings.filter((cafe, index) => {
      return cafe.name.toLowerCase().includes(query.toLowerCase());
    })
    this.setState({ filteredResults: results, selectedItemID: null })
  }


  /**
   * FOURSQUARE API CALL
   *  - returns a Promise.all array of 2 Json items
   */
  getFourSq = (markerID) => {
    // Set varialbes to create url for Foursquare API requests
    let id = this.state.listings[markerID].foursquareID;
    let url = 'https://api.foursquare.com/v2/venues/';
    let authentication = 'client_id=RGZFKSSZOTBZKW0JHI0DEHD34LIHGBICEWFHRH3TBGZZ4QFY' +
      '&client_secret=H5N1I1ECCDDGALKI5GZU1XQGYKKJJHWGAUEYG5FYZFEFTIQT' +
      '&v=20181020';

    // create 2 promises - first for venue information
    let getFourData = fetch(`${url}${id}?${authentication}`).then(venueReponse => venueReponse.json());
    // second for photo information
    let getFourPhoto = fetch(`https://api.foursquare.com/v2/venues/${id}/photos?group=venue&size=50x50&limit=2` +
      `&${authentication}`).then(photoResponse => photoResponse.json())

    // Use Promise.all to submit fetch requests asynchronously
    let requests = [getFourData, getFourPhoto];
    return Promise.all(requests)
    .then(resp => {
      this.apiCallWorked(true)
      return resp
    })
    .catch(error => {
      this.apiCallWorked(false, error)
      return [ "","" ]
    })

  }

  apiCallWorked(bool, err) {
    if(bool) {
      // Error not caught, so clear if needed
      this.setState({error: false})
    }
    else {
      // Error Caught
      this.setState({error: true})
      console.log(err)
    }
  }
}

export default App;