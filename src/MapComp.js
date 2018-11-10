import React, { Component } from 'react';
import './App.css';
import monochromeMapStyle from './map-style.js'

class Map extends Component {
    state = {
        map: null,
        boundary: null,
        markers: null,
        infoWindow: null,
        currentVenue: null
    }

    render() {
        return <div id="map"></div>
    }

    componentWillMount() {
        // push initMap to a global (so it can be used as a callback by google's API <script>)
        window.initMap = this.initMap;
        // init google API
        initGoogleAPI();
    }

    componentDidUpdate(prevProps) {
        // Open infoWindow on selected item, if selection made
        this.props.selection && this.state.markers.forEach(marker => {
            if (marker.foursquareID === this.props.selection) {
                this.populateInfoWindow(marker);
            }

        })

        // // filter markers, if needed
        if (prevProps.showingListings !== this.props.showingListings ) {


                let showing = this.props.showingListings.map(place => place.id);

                window.appMarkers.forEach(marker => {
                        if (showing.includes(marker.id)) {
                            marker.setMap(this.state.map);
                        }
                        else {
                            marker.setMap(null);
                        }
                    })
        }
    }
    /**
     * GOOGLE MAP CREATION
     */

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 39.685585, lng: -104.98727 },
            zoom: 13,
            styles: monochromeMapStyle
        });

        this.setState({ map });
        this.createMarkers(this.state.map);
        this.state.map.fitBounds(this.state.boundary);
    }

    /**
     * Markers to the map!
     */
    createMarkers = (map) => {
        let bounds = new window.google.maps.LatLngBounds();
        let mkrs = this.props.showingListings.map((mark, index) => {
            let marker = new window.google.maps.Marker({
                map: map,
                position: mark.geometry.location,
                id: mark.id,
                foursquareID: mark.foursquareID,
                index: index,
                animation: window.google.maps.Animation.drop // not working TODO
            });

            const callback = this.populateInfoWindow;

            marker.addListener('click', function () {
                callback(this);
                console.log(`you clicked this: ${mark.name}`);
            });
            bounds.extend(marker.position);
            return marker;
        })

        // Also create an info window
        const infoWin = new window.google.maps.InfoWindow();
        window.appMarkers = mkrs;


        this.setState({infoWindow: infoWin, boundary: bounds });
    }


    /**
 * Populate info Window
 */
    populateInfoWindow = (marker) => {
        //marker.id is the index of the cafe object in state.filteredResults
        if (this.state.infoWindow.marker !== marker) {

            // Populate infoWin with info from Foursquare
            this.props.fourSqAPIcall(marker.index)
                .then(data => {
                    //    console.log(data)
                    return Promise.all(data)
                })  //data.map(elem => elem.json()))  LEFT OFF HERE_NEED TO FIRE
                .then(resp => {
                    console.log(resp)
                    // console.log(`Foursquare data fetched: ${resp.response.venue.name}`)
                    // Populate infoWindow with info from Google
                    this.setState(state => {
                        state.infoWindow.marker = marker;
                        state.infoWindow.setContent(this.createInfoWinContent(resp[0], resp[1]));
                        state.infoWindow.open(state.map, marker);
                        state.infoWindow.addListener('closeClick', () => {
                            state.infoWindow.setMarker(null);
                        });
                        state.currentVenue = resp; // TODO use or remove
                    })
                })

            // Send selection id up to parent
            if (marker.foursquareID !== this.props.selection) {
                this.props.selectItem(marker.foursquareID);
            }
        }
    }
    /**
     * Create HTML for infowindow
     */

    createInfoWinContent(foursqData, foursqPhotoInfo) {
        let googleInfo = this.props.places.find(loc => loc.foursquareID === foursqData.response.venue.id);
        let photoURL = foursqPhotoInfo.response.photos.items[0].prefix + '100x100' + foursqPhotoInfo.response.photos.items[0].suffix;

        return '<img src="' + photoURL + '">';
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


export default Map