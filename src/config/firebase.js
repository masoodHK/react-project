import * as firebase from "firebase";

var config = {
	apiKey: "AIzaSyBXJa772lzBfls67WPtXUGqjN59ToF9qGY",
	authDomain: "tindr-clone.firebaseapp.com",
	databaseURL: "https://tindr-clone.firebaseio.com",
	projectId: "tindr-clone",
	storageBucket: "tindr-clone.appspot.com",
	messagingSenderId: "797490154119"
};

firebase.initializeApp(config);

export default firebase;