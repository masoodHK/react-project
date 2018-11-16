/* eslint-disable no-undef */
/* global google */

import React, { Component } from 'react'

import swal from 'sweetalert2'

import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"

const Map = withScriptjs(withGoogleMap((props) => <GoogleMap
    defaultZoom={14} center={props.position}
    googleMapUrl="">
    <Marker
        position={props.position}
        draggable={props.setLocation}
        onDragEnd={(coords) => props.updatePosition(coords)} />
    {props.showDirections && <Marker position={this.props.destination}></Marker>}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
</GoogleMap>));

class MapReact extends Component {
    state = {
        position: {
            lat: 0,
            lng: 0,
        },
        directions: null
    }

    setPosition = () => {
        navigator.geolocation.getCurrentPosition((data) => {
            this.setState({
                position: {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude
                }
            })
        })
    }

    updatePosition = (position) => {
        this.props.handle(position)
        this.setState({ position: position.position })
    }

    showDirections = () => {
        const directionRenderer = new google.maps.DirectionsService();
        const origin = new google.maps.LatLng(this.state.position.lat, this.state.position.lng)
        const destination = new google.maps.LatLng(this.props.destination.lat, this.props.destination.lng)
        console.log(directionRenderer)
        console.log(this.props.destination.lat)
        console.log(this.props.destination.lng)

        console.log(origin);
        console.log(destination);

        directionRenderer.route({
            origin: new google.maps.LatLng(24.8812296, 67.0727269),
            destination: new google.maps.LatLng(24.8861479, 67.0595196),
            travelMode: this.props.google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({ directions: result })
            }
            else {
                swal(
                    'Oops',
                    'Something went wrong' + result,
                    'warning'
                )
            }
        })
    }

    componentDidMount() {
        this.setPosition()
        if(this.props.showDirections) {
            this.showDirections()
        }
    }
    render() {
        return (
            <Map 
                loadingElement={<div style={{ height: `100%` }} />}
                googleMapUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDfwTE7dOzHOiYsboRp-iAl72nskOS_FsM"
                containerElement={<div style={{
                    width: "90vw",
                    height: "60vh"
                }}></div>}
                mapElement={<div style={{
                    height: `100%`
                }}></div>}
                position={this.state.position}
                showDirections={this.props.showDirections}
                setLocation={this.props.setLocation}
                destination={this.props.destination}
                directions={this.state.directions}
            />
        )
    }
}

export default MapReact;