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
      lng: 0
    }
  }
  showDirection = true

  setPosition = () => {
    navigator.geolocation.getCurrentPosition((data) => {
      this.setState({position: {
        lat: data.coords.latitude,
        lng: data.coords.longitude
      }})
    })
  }

  showDirections =() => {
    const directionRenderer = new this.props.google.maps.DirectionsService();
    const origin = new this.props.google.maps.LatLng(this.state.position.lat, this.state.position.lng)
    const destination = new this.props.google.maps.LatLng(this.props.destination.lat, this.props.destination.lng)
    console.log(directionRenderer)
    console.log(this.props.destination.lat)
    console.log(this.props.destination.lng)
    
    console.log(origin);
    console.log(destination);
    
    directionRenderer.route({
      origin: new this.props.google.maps.LatLng(24.8812296, 67.0727269),
      destination: new this.props.google.maps.LatLng(24.8861479, 67.0595196),
      travelMode: this.props.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      console.log(result)
      console.log(status)
    })
  }

  updatePosition = (position) => {
    this.props.handle(position)
    this.setState({position: position.position})
  }

  componentDidMount() {
    this.setPosition()
    this.setState({ setLocation: this.props.showMarker });
    if(this.props.showDirections && this.showDirection) {
      this.showDirections()
    }
  }
  
  render() {
    const {position} = this.state
    console.log(this.props.google.maps)
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        center={position}
      >
        <Marker position={position}
        draggable={this.props.setLocation}
        onDragend={(coords) => this.updatePosition(coords)}></Marker>
        {this.props.showDirections && <Marker position={this.props.destination}></Marker>}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDfwTE7dOzHOiYsboRp-iAl72nskOS_FsM'
})(MapContainer);