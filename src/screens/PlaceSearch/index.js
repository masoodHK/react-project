import React, { Component } from 'react';
import { FOURSQUARE_API_ID, FOURSQUARE_API_SECRET } from '../../config/authApi';
import axios from 'axios';
import PickyDateTime from 'react-picky-date-time';
import Button from '../../Components/Button/Button'
import firebase from '../../config/firebase';
import swal from 'sweetalert2';

import './PlaceSearch.css'

const firestore = firebase.firestore();

export default class PlaceSearch extends Component {
    state = {
        searchQuery: "",
        data: [],
        searchData: [],
        selectedDate: "",
        selectedLocation: "",
        ll: ``
    }
    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(data => {
            const URL = `https://api.foursquare.com/v2/venues/explore?client_id=${FOURSQUARE_API_ID}&client_secret=${FOURSQUARE_API_SECRET}&limit=3&v=20180323&ll=${data.coords.latitude},${data.coords.longitude}`
            console.log(URL);
            axios.get(URL).then(result => {
                console.log(result.data.response.groups[0].items);
                this.setState({data: result.data.response.groups[0].items, ll: `${data.coords.latitude},${data.coords.longitude}`})
            }).catch(error => {
                console.log(error)
            })
        })
    }

    onDatePicked = (date) => {
        let formattedDate = `${date.date}/${date.month}/${date.year}`
        console.log(date)
        this.setState({ selectedDate: formattedDate })
    }

    searchResult = () => {
        const {ll, searchQuery} = this.state
        const URL = `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_API_ID}&client_secret=${FOURSQUARE_API_SECRET}&limit=3&v=20180323&ll=${ll}&query=${searchQuery}`;
        axios.get(URL).then(result => {
            console.log(result.data.response.venues);
            this.setState({searchData: result.data.response.venues})
        }).catch(error => {
            console.log(error)
        })
    }

    pickLocation = (locationName) => {
        swal({
            title: "Success",
            text: `Location Picked: ${locationName}`
        }).then(res => {
            this.setState({selectedLocation: locationName})
        })
    }
    

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value })
    }

    saveSelection = () => {
        swal({
            title: "Are you sure?",
            text: "Confirm the meeting place and location?",
            showCancelButton: true,
            confirmButtonText: "Set Meeting",
            cancelButtonText: "Cancel"
        }).then(res => {
            if(res.value) {
                firestore.collection('user')
                    .doc(firebase.auth().currentUser.uid)
                    .collection('meetings')
                    .doc().set({
                        meetingWith: this.props.location.state.name,
                        date: this.state.selectedDate,
                        location: this.state.selectedLocation
                    }).then(res => {
                        console.log(res)
                        this.props.history.push('/dashboard')
                    })
            }
        })
    }
    
    render() {
        console.log(this.props)
        const { data, searchData, searchQuery } = this.state
        return (
            <div id="location-picker">
                <h1>Pick the location and time for the meeting</h1>
                <input onChange={event => this.handleSearch(event)} value={searchQuery}/>
                <Button onClick={this.searchResult}>Search</Button>
                {searchData.length === 0 ?
                    data.map(locations => {
                        return <div className="location" key={locations.venue.id}>
                            <h3>{locations.venue.name}</h3>
                            <p>{locations.venue.location.formattedAddress.join(" ")}</p>
                            <Button className="selction" onClick={() => this.pickLocation(locations.venue.name)}>Pick Location</Button>
                        </div>
                    }) :
                    searchData.map(locations => {
                        return <div className="location" key={locations.id}>
                            <h3>{locations.name}</h3>
                            <p>{locations.location.formattedAddress.join(" ")}</p>
                            <Button className="selction" onClick={() => this.pickLocation(locations.name)}>Pick Location</Button>
                        </div>
                    })
                }
                <h2>Pick the time</h2>
                <PickyDateTime
                    size="m"
                    mode={0}
                    locale="en-us"
                    show={true}
                    onDatePicked={res => this.onDatePicked(res)}
                />
                <Button onClick={this.saveSelection}>Select Date</Button>
            </div>
        )
    }
}
