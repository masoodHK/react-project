import * as firebase from "firebase";

import { FIREBASE_AUTH } from "./authApi";

firebase.initializeApp(FIREBASE_AUTH);

export default firebase;