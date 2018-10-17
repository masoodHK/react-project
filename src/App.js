import React, { Component } from 'react';
import './App.css';

import Routes from './config/routes'
// import Map from './Components/Map'

class App extends Component {

  state = {
    lat: 0,
    lng: 0, 
    displayName: ""
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
        <Routes />
        {/* <Map 
        isMarkerShown={true}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDfwTE7dOzHOiYsboRp-iAl72nskOS_FsM"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        position={{lat: this.state.lat, lng: this.state.lng}}
        updatePosition={this.updatePosition}
        /> */}
      </div>
    );
  }
}

export default App;
