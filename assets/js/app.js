 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyBKVfQM8kE7hpS0dksP7uJlkPJ_q_N_-yQ",
     authDomain: "pvp-rps.firebaseapp.com",
     databaseURL: "https://pvp-rps.firebaseio.com",
     projectId: "pvp-rps",
     storageBucket: "",
     messagingSenderId: "742631516397"
 };
 firebase.initializeApp(config);

 let database = firebase.database();

 let connectionsRef = database.ref("/connections");

 let usersConnectedRef = database.ref(".info/connected");

 usersConnectedRef.on('value', function (snapshot) {
     if (snapshot.val()) {
         let connect = connectionsRef.push(true);
         connect.onDisconnect().remove();
     }
 })