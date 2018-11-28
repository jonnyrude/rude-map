import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import MapApp from './mapApp.js';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <MapApp />
            </HashRouter>
        )
    }
}

export default App;