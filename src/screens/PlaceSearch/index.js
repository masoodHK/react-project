import React, { Component } from "react";
import { FOURSQUARE_API_ID, FOURSQUARE_API_SECRET } from "../../config/authApi";
import axios from "axios";
import PickyDateTime from "react-picky-date-time";
import Button from "../../Components/Button";
import firebase from "../../config/firebase";
import swal from "sweetalert2";
import Map from "../../Components/Map";
import * as moment from 'moment';
import "./PlaceSearch.css";

const firestore = firebase.firestore();

export default class PlaceSearch extends Component {
  state = {
    searchQuery: "",
    data: [],
    searchData: [],
    selectedDate: "",
    selectedTime: "",
    hour: "",
    duration: "",
    minute: "",
    second: "",
    meridian: "",
    selectedLocation: "",
    ll: ``,
    showDirections: false,
    currentLocation: {},
    destination: {}
  };
  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(data => {
      const URL = `https://api.foursquare.com/v2/venues/explore?client_id=${FOURSQUARE_API_ID}&client_secret=${FOURSQUARE_API_SECRET}&limit=3&v=20180323&ll=${
        data.coords.latitude
      },${data.coords.longitude}`;
      axios
        .get(URL)
        .then(result => {
          console.log(result.data.response.groups[0].items);
          this.setState({
            data: result.data.response.groups[0].items,
            ll: `${data.coords.latitude},${data.coords.longitude}`,
            currentLocation: data.coords
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  onDatePicked = date => {
    let formattedDate = `${date.date}-${date.month}-${date.year}`;
    console.log(date);
    this.setState({ selectedDate: formattedDate });
  };
  onSecondPicked = time => {
    console.log(time.value);
    this.setState({second: time.value})
  };
  onMinutePicked = time => {
    console.log(time.value);
    this.setState({minute: time.value})
  };
  onHourPicked = time => {
    console.log(time.value);
    this.setState({hour: time.value})
  };
  onMeridianPicked = time => {
    console.log(time.value);
    this.setState({meridian: time.value})
  };

  searchResult = () => {
    const { ll, searchQuery } = this.state;
    const URL = `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_API_ID}&client_secret=${FOURSQUARE_API_SECRET}&limit=3&v=20180323&ll=${ll}&query=${searchQuery}`;
    axios
      .get(URL)
      .then(result => {
        console.log(result.data.response.venues);
        this.setState({ searchData: result.data.response.venues });
      })
      .catch(error => {
        console.log(error);
      });
  };

  pickLocation = locationName => {
    swal({
      title: "Success",
      text: `Location Picked: ${locationName}`
    }).then(res => {
      this.setState({ selectedLocation: locationName });
    });
  };

  handleSearch = event => {
    this.setState({ searchQuery: event.target.value });
  };

  saveSelection = () => {
    swal({
      title: "Are you sure?",
      text: "Confirm the meeting place and location?",
      showCancelButton: true,
      confirmButtonText: "Set Meeting",
      cancelButtonText: "Cancel"
    }).then(res => {
      if (res.value) {
        firestore
          .collection("user")
          .doc(firebase.auth().currentUser.uid)
          .collection("meetings")
          .doc()
          .set({
            meetingWith: this.props.location.state.name,
            setBy: firebase.auth().currentUser.displayName,
            setterID: firebase.auth().currentUser.uid,
            userID: this.props.location.state.userID,
            date: moment(this.state.selectedDate, "DD-MM-YYYY").format("MM-DD-YYYY"),
            time: moment(`${this.state.hour}:${this.state.minute}:${this.state.second} ${this.state.meridian}`, "HH:mm:ss A").format("HH:mm A"),
            location: this.state.selectedLocation,
            status: "pending",
            userDisplayPic: this.props.location.imageUrl,
            senderDisplayPic: firebase.auth().currentUser.photoURL,
          })
          .then(res => {
            console.log(res);
            this.props.history.push("/dashboard");
          });
      }
    });
  };



  showDirections = destination => {
    console.log(destination);
    this.setState({ showDirections: true, destination });
  };

  goBack = () => {
    this.setState({ showDirections: false, destination: {} });
  };

  render() {
    console.log(this.props);
    const { data, searchData, searchQuery, showDirections } = this.state;
    return (
      <div>
        {!showDirections ? (
          <div id="location-picker">
            <h1>Pick the location and time for the meeting</h1>
            <input
              onChange={event => this.handleSearch(event)}
              value={searchQuery}
            />
            <Button onClick={this.searchResult}>Search</Button>
            {searchData.length === 0
              ? data.map(locations => {
                  return (
                    <div className="location" key={locations.venue.id}>
                      <h3>{locations.venue.name}</h3>
                      <p>
                        {locations.venue.location.formattedAddress.join(", ")}
                      </p>
                      <Button
                        className="selction"
                        onClick={() => this.pickLocation(locations.venue.name)}
                      >
                        Pick Location
                      </Button>
                      <Button
                        className="selction"
                        onClick={() =>
                          this.showDirections(locations.venue.location)
                        }
                      >
                        Show Directions
                      </Button>
                    </div>
                  );
                })
              : searchData.map(locations => {
                  return (
                    <div className="location" key={locations.id}>
                      <h3>{locations.name}</h3>
                      <p>{locations.location.formattedAddress.join(", ")}</p>
                      <Button
                        className="selction"
                        onClick={() => this.pickLocation(locations.name)}
                      >
                        Pick Location
                      </Button>
                      <Button
                        className="selction"
                        onClick={() => this.showDirections(locations.location)}
                      >
                        Show Directions
                      </Button>
                    </div>
                  );
                })}
            <h2>Pick the time</h2>
            <PickyDateTime
              size="l"
              mode={1}
              locale="en-us"
              show={true}
              onDatePicked={res => this.onDatePicked(res)}
              onSecondChange={res => this.onTimePicked(res)}
              onMinuteChange={res => this.onTimePicked(res)}
              onHourChange={res => this.onTimePicked(res)}
              onMeridiemChange={res => this.onTimePicked(res)}
            />
            <p>
              Enter the duration
              <input name="duration" value={this.state.duration} onChange={event => this.setState({[event.target.name]: event.target.value})}/>
            </p>
            <Button onClick={this.saveSelection}>Select Date</Button>
          </div>
        ) : (
          <div id="directions">
            <h2>Directions</h2>
            <Map
              showDirections={true}
              destination={this.state.destination}
            />
            <Button onClick={this.goBack}>Back</Button>
          </div>
        )}
      </div>
    );
  }
}
