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

const userID = Math.random();

 let database = firebase.database();

 let connectionsRef = database.ref("/connections");

 let usersConnectedRef = database.ref(".info/connected");

 connectionsRef.push(userID);
 connectionsRef.on('child_added', function(snap) {
     console.log(snap.numUsers);
 })
//  console.log(connectionsRef.numChildren());

//  let userNumber = connectionsRef.numChildren();

//  usersConnectedRef.on('value', function (snapshot) {
//      console.log(connectionsRef.numChildren());

//  })