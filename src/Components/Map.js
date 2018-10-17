import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '90vw',
  height: '60vh',
  position: 'relative',
};

export class MapContainer extends Component {
  state = {
    position: {
      lat: 0,
      lng: 0,
    }
  }
  setPosition = () => {
    navigator.geolocation.getCurrentPosition((data) => {
      this.setState({position: {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      }})
    })
  }

  updatePosition = (position) => {
    this.props.handle(position)
    this.setState({position: position.position})
  }

  componentDidMount() {
    this.setPosition()
  }
  render() {
    const {position} = this.state
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        center={position}
      >
        <Marker position={position}
        draggable={true}
        onDragend={(coords) => this.updatePosition(coords)}></Marker>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDfwTE7dOzHOiYsboRp-iAl72nskOS_FsM'
})(MapContainer);