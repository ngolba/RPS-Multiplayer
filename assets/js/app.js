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
     ties: 0,
     choice: '',
 }

 let allUsers = database.ref('/users/');
 let userKey = allUsers.push(user).key;
 let userDirectory = '/users/' + userKey;
 const userRef = database.ref(userDirectory);
 const gameRef = database.ref('/game/');
 let gameKey = '';
 let gameDirectory = '';
 let playerRef = '';
 
 let numInGame = 0;

 const directoryMover = (oldDirectory, newDirectory) => {
     oldDirectory.update({
         'inGame': true
     })
     oldDirectory.once('value', (snap) => {
         let file = snap.val();
         oldDirectory.remove();
         userDirectory = null;
         gameKey = newDirectory.push(file).key
         gameDirectory = '/game/' + gameKey;
         playerRef = database.ref(gameDirectory);
         playerRef.onDisconnect().remove();
       
     })
 }

 // Initializes each player's spot in line on load 
 allUsers.once('value', function (snap) {
     user.number = snap.numChildren();
     userRef.update({
         'number': user.number
     });
     //  userRef.once('value').then((snap) => {

     gameRef.once('value', (snap) => {
         numInGame = (snap.numChildren() - 1);
         if (numInGame < 2) {
             user.number = (numInGame + 1)
             userRef.update({
                 'number': user.number
             })
             directoryMover(userRef, gameRef);
         }
     })
 })
 //  })

 allUsers.orderByChild('number');


userRef.onDisconnect().remove();

 allUsers.on('child_removed', (snap) => {
     const removedIndex = snap.val().number
     console.log(removedIndex)
     if (userDirectory != null) {
         database.ref(userDirectory + '/number').once('value').then((snap) => {
             if (snap.val().number < removedIndex) {
                 //do nothing
             } else {
                 user.number = snap.val();
                 if (user.number > 1) {
                     user.number--;
                     userRef.update({
                         'number': user.number
                     });
                 }
             }
         })
     }
     
 })

 const playerChecker = () => {
     if (!user.inGame) {
         return
     } else {
         enableButtons();
     }
 }

 const submitAnswer = (playerNumber) => {
     $("label[sign]").each(function () {
         if ($(this).hasClass('active')) {
             user.choice = $('.active').attr('sign');
             userRef.update({
                 'choice': user.choice
             })
             $(`#player${playerNumber}Ready`).attr('src', "assets/images/checkmark.png");
             $(`#player${playerNumber}Submitted`).attr('disabled', false).addClass('btn-success').text('Submitted');
             disableButtons();
         }
     })


 }
 const enableButtons = () => {
     $('#fightButton').click((event) => {
         submitAnswer(user.number)
     })
 }

 const disableButtons = () => {
     $('#fightButton').off('click');
 }

 database.ref(userDirectory + '/inGame').on('value', (snap) => {
     if (snap.val() === true) {
         enableButtons();
     } else {
         disableButtons();
     }
 })

 allUsers.on('value', (snap) => {
     if (snap.numChildren() >= 2) {
         gameRef.update({
             'running': true
         })
     } else {
         gameRef.update({
             'running': false
         })
     }
 })


 ///////////////// Game Space ///////////////////////////