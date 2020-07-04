import React from 'react'
import * as firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyBTXmyT81Te0NAf0UvVTl-er2lle_m16xQ",
    authDomain: "chat-app-38428.firebaseapp.com",
    databaseURL: "https://chat-app-38428.firebaseio.com",
    projectId: "chat-app-38428",
    storageBucket: "chat-app-38428.appspot.com",
    messagingSenderId: "436808828911",
    appId: "1:436808828911:web:6bc16c21dc89eb1400581a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase