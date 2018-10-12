import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from './config/firebase';
import Map from './Components/Map'

class App extends Component {

  state = {
    lat: 0,
    lng: 0
  }
  setPosition = () => {
    navigator.geolocation.getCurrentPosition((data) => {
      console.log(data.coords)
      this.setState({
        lat: data.coords.latitude,
        lng: data.coords.longitude
      })
    })
  }

  updatePosition = (position) => {
    console.log(position)
    this.setState({
      lat: position.latLng.lat(),
      lng: position.latLng.lng()
    })
  }

  componentDidMount() {
    this.setPosition()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        {/* AIzaSyDfwTE7dOzHOiYsboRp-iAl72nskOS_FsM */}
        <Map 
        isMarkerShown={true}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB-DFqmoDxeJOilR96Key3WEVFYKk__AX4"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        position={{lat: this.state.lat, lng: this.state.lng}}
        updatePosition={this.updatePosition}
        />
      </div>
    );
  }
}

export default App;
