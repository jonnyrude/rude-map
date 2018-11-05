import React, { Component } from 'react';
import './App.css';

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
        this.props.selection && this.state.markers.forEach(marker => {
            if(marker.foursquareID === this.props.selection) {
                this.populateInfoWindow(marker);
            }
        })

        // ATTEMPT to filter markers - doesn't work
        // // filter markers, if needed
        // if (prevProps.places !== this.props.places ) {

        //     this.setState((state) => {
        //         // console.log("Maps places changed"); // This fires
        //         let showing = this.props.places.map(place => place.id);
        //         return {
        //             markers:  state.markers.forEach(marker => {
        //                 if (showing.includes(marker.id)) {
        //                     marker.map = this.state.map;
        //                 }
        //                 else {
        //                     marker.map = null;
        //                 }
        //             })
        //         }
        //     })
        // }
    }
    /**
     * GOOGLE MAP CREATION
     */

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 39.685585, lng: -104.98727 },
            zoom: 13,
            styles: []
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
        let mkrs = this.props.places.map((mark, index) => {
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


        this.setState({ markers: mkrs, infoWindow: infoWin, boundary: bounds });
    }


    /**
 * Populate info Window
 */
    populateInfoWindow = (marker) => {
        //marker.id is the index of the cafe object in state.filteredResults
        if (this.state.infoWindow.marker !== marker) {

            // Populate infoWin with info from Foursquare
            this.props.fourSqAPIcall(marker.index)
                .then(res => res.json())
                .then(resp => {
                    console.log(`Foursquare data fetched: ${resp.response.venue.name}`)
                    // Populate infoWindow with info from Google
                    this.setState(state => {
                        state.infoWindow.marker = marker;
                        state.infoWindow.setContent(this.createInfoWinContent(resp));
                        state.infoWindow.open(state.map, marker);
                        state.infoWindow.addListener('closeClick', () => {
                            state.infoWindow.setMarker(null);
                        });
                        state.currentVenue = resp; // TODO use or remove
                    })
                }).catch(err => {
                    console.log(`Error with 4sq req: ${err}`)
                })
        }
        // Send selection id up to parent
        if(marker.foursquareID !== this.props.selection) {
            this.props.selectItem(marker.foursquareID);
        }
    }

    createInfoWinContent = (resp) => {
        return `${resp.response.venue.name} </br> FourSquare Rating: ${resp.response.venue.rating}`
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