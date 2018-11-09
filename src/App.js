import React, { Component } from "react";
import "./App.css";
import Routes from "./config/routes";
import { Provider } from "react-redux";
import { store, persist } from "./store";

import { PersistGate } from "redux-persist/integration/react";

class App extends Component {
  state = {
    lat: 0,
    lng: 0,
    displayName: ""
  };
  setPosition = () => {
    navigator.geolocation.getCurrentPosition(data => {
      console.log(data.coords);
      this.setState({
        lat: data.coords.latitude,
        lng: data.coords.longitude
      });
    });
  };

  updatePosition = position => {
    console.log(position);
    this.setState({
      lat: position.latLng.lat(),
      lng: position.latLng.lng()
    });
  };

  componentDidMount() {
    this.setPosition();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persist}>
          <div className="App">
            <Routes />
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
