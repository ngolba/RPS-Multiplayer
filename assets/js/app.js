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

 let user = {
     number: 0,
     connected: true,
     inGame: false,
     ID: Math.floor(Math.random() * 100000),
     wins: 0,
     ties: 0
 }

 let allUsers = database.ref('/users/');
 const userKey = allUsers.push(user).key;
 console.log(userKey);
 const userRef = database.ref('/users/' + userKey);


 // Initializes each player's spot in line on load 
 allUsers.once('value').then(function (snap) {
     let numOfUsers = snap.numChildren();
     userRef.update({
         'number': numOfUsers
     });
    userRef.once('value').then(function(snap){
        if(snap.val().number < 3)  {
            userRef.update({
                'inGame': true
            })
        }
     })
 })

 allUsers.orderByChild('number');


 userRef.onDisconnect().remove();

 allUsers.on('child_removed', function (snap) {
     var removedIndex = snap.val().number
     database.ref('/users/' + userKey + '/number').once('value').then(function (snap) {
         if (snap.val().number < removedIndex) {
             //do nothing
         }else {
             user.number = snap.val();
             if (user.number > 1) {
                 user.number--;
                 userRef.update({
                     'number': user.number
                 });
             }
             if (user.number <= 2) {
                console.log('here');
                userRef.update({
                    'inGame': true
                })
            }
         }
         
     })
 })

 const playerChecker = () => {
     if (!user.inGame) {
         return
     } else {
         enableButtons();
     }
 }

 const enableButtons = () => {

 }