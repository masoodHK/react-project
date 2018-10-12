import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";
import React, { Component } from 'react';

const Map = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={20}
    defaultCenter={props.position}
  >
	{props.isMarkerShown && <Marker position={props.position} draggable={true}
		onDragEnd={(pos) => {
			props.updatePosition(pos)
		}}
	/>}
  </GoogleMap>
))

export default Map