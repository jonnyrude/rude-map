import React, { Component } from 'react';
import './App.css';
// TODO Markers?

class Map extends Component {

    componentWillMount() {
        window.initMap = this.initMap;
        initGoogleAPI();
    }

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 39.685585, lng: -104.98727 },
            zoom: 13,
            styles: []
        })
    }

    render() {
        return (
            <div id="map"></div>
        )
    }


}

function initGoogleAPI() {
    // create script to fetch google API
    const script = window.document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFsdADbayWDjmwhIHX6nI9uY8qKZ-bPW4&v=3&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;

    // fix that script to the top of the doc
    const index = window.document.getElementsByTagName('script')[0];
    index.parentNode.insertBefore(script, index);
}

export default Map