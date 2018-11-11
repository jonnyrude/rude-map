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
        // init google API - appends script to page
        initGoogleAPI();
    }

    componentDidUpdate(prevProps) {
        // Open infoWindow on selected item, if selection made via list
        this.props.selection && this.state.markers.forEach(marker => {
            if (marker.foursquareID === this.props.selection) {
                this.populateInfoWindow(marker);
                marker.setAnimation(window.google.maps.Animation.BOUNCE)
            } else {
                marker.getAnimation() !== null && marker.setAnimation(null);
            }
        })

        /**
         * FILTER MARKERS
         */
         if (prevProps.showingListings !== this.props.showingListings ) {
            this.setState(state => {
                let showing = this.props.showingListings.map(place => place.id);
                this.state.markers.forEach(marker => {
                        if (showing.includes(marker.id)) {
                            marker.setMap(this.state.map);
                        }
                        else {
                            marker.setMap(null);
                        }
                    })
                // Close infoWindow if selection set to null (i.e. new filtering action)
                if (this.props.selection === null && this.state.infoWindow.marker) {
                    state.infoWindow.close();
                };
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
     * ADD MARKERS TO MAP
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
            });

            const callback = this.props.selectItem;

            marker.addListener('click', function (event) {
                callback(this);
                // toggle bounce animation
                if(marker.getAnimation !== null) {
                    marker.setAnimation(null)
                }
            });
            bounds.extend(marker.position);
            return marker;
        })

        // Also create an info window
        const infoWin = new window.google.maps.InfoWindow();

        this.setState({markers: mkrs, infoWindow: infoWin, boundary: bounds });
    }


    /**
     * POPULATE INFOWINDOW ON GIVEN MARKER
     */
    populateInfoWindow = (marker) => {
        //marker.id is the index of the cafe object in state.filteredResults
        if (this.state.infoWindow.marker !== marker) {
            // Populate infoWin with info from Foursquare
            this.props.fourSqAPIcall(marker.index)
            // console.log("Requests", requests)
            // Promise.all(requests)
                .then(resp => {
                    console.log("RESPONSES",resp[0], resp[1]); //TODO REmove this console.log
                    this.setState(state => {
                        state.infoWindow.marker = marker;
                        state.infoWindow.setContent(this.createInfoWinContent(resp[0], resp[1], marker.index));
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
     * Helper Function - Create HTML for infowindow
     */
    createInfoWinContent(foursqData, foursqPhotoInfo, markerIndex) {
        let googleInfo = this.props.places[markerIndex]

        let DataAvailable = (foursqData.meta) && (foursqData.meta.code === 200) && (foursqPhotoInfo.meta.code === 200) ? true: false;
        let urlSuffix = (DataAvailable && foursqPhotoInfo.response.photos.items[0] && foursqPhotoInfo.response.photos.items[0].suffix) ? foursqPhotoInfo.response.photos.items[0].suffix : null;
        let urlPrefix = (DataAvailable && foursqPhotoInfo.response.photos.items[0] && foursqPhotoInfo.response.photos.items[0].prefix) ? foursqPhotoInfo.response.photos.items[0].prefix : null;
        let photoURL = (urlPrefix && urlSuffix) ? urlPrefix + '100x100' + urlSuffix : null;

        let content = '<h3 class="info-window-title">' + googleInfo.name + '</h3>';

        content += (DataAvailable && foursqData.response.venue.hours) ? '<p class="open-status">' + foursqData.response.venue.hours.status + '</p>' : '';
        content += photoURL ? '<img class="info-window-image" src="' + photoURL + '">' : '<div class="no-info-window-photo">Photo Not Available</div>';
        content += '<h4 class="ratings-header">Ratings:</h4>'
        content += googleInfo.rating ? '<p class="google-rating">Google: ' + googleInfo.rating.toString() + '</p>': "";
        content += (DataAvailable && foursqData.response.venue.rating) ? '<p class="foursquare-rating">FourSquare: ' +  foursqData.response.venue.rating.toString() + '</p>' : "";
        content += (DataAvailable) ? '<a class="foursquare-attribution" href="' + foursqData.response.venue.canonicalUrl +
        '?ref=RGZFKSSZOTBZKW0JHI0DEHD34LIHGBICEWFHRH3TBGZZ4QFY" target="_blank" rel="noopener">POWERED BY FOURSQUARE</a>' : "" ;

        return content
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