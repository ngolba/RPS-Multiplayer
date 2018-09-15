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
    number: 1,
    connected: true,
    inGame: false,
    ID: Math.floor(Math.random() * 100000),
    wins: 0,
    ties: 0,
    choice: '',
    gamesPlayed: 0
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
let submitted = 0;
let opponentNumber = 0;
let opponentChoice = '';
let opponentRef = '';
let opponentWins = 0;
const rpsArray = ['paper', 'scissors', 'rock'];


/////////////// Necessary Functions

const submitAnswer = () => {
    submitted++;
    $(".rpsBtn").each(function () {
        if ($(this).hasClass('active')) {
            user.choice = $('.active').attr('sign');
            playerRef.update({
                'choice': user.choice
            })
            // database.ref('/game/submitted/').once('value', (snap) => {
            //     submitted = snap.val();
            // })
            
            gameRef.update({
                'submitted': submitted
            })
            console.log(submitted);
            // $(`#player1Ready`).attr('src', "assets/images/checkmark.png");
            $('#player1Ready').attr('src', `assets/images/${user.choice}Player.png`);
            $(`#player1Submitted`).attr('disabled', false).addClass('btn-primary').text('Submitted');
            disableButtons();
        }
    })
}

const enableButtons = () => {
    $('#fightButton').click((event) => {
        submitAnswer()
    })
}
const disableButtons = () => {
    $('#fightButton').off('click');
}

const setOpponent = () => {
    if (user.number === 1) {
        opponentNumber = 2;
    } else {
        opponentNumber = 1;
    }
    opponentRef = gameRef.orderByChild('number').equalTo(opponentNumber);
    fillOpponentChoice(opponentRef);
}

const fillOpponentChoice = (opponentRef) => {
    opponentRef.on('child_changed', (snap) => {
        if (gameKey != snap.key && snap.val().choice) {
            opponentKey = snap.key
            opponentChoice = snap.val().choice;
            console.log('here')
            if (opponentChoice) {
                $(`#player2Ready`).attr('src', "assets/images/checkmark.png");
                $(`#player2Submitted`).attr('disabled', false).addClass('btn-primary').text('Submitted');
            }
            opponentRef.off('child_changed');
        }

    })

}



const directoryMover = (oldDirectory, newDirectory) => {
    oldDirectory.update({
        'inGame': true
    })
    oldDirectory.once('value', (snap) => {
        let file = snap.val();
        oldDirectory.remove();
        userDirectory = '';
        user.inGame = true;
        gameKey = newDirectory.push(file).key
        gameDirectory = '/game/' + gameKey;
        playerRef = database.ref(gameDirectory);
        console.log(user)
    })
}
const playerChecker = () => {
    if (!user.inGame) {
        return false;
    } else {
        setOpponent();
        enableButtons();

    }
}

const resetGame = () => {
    user.choice = '';
    opponentChoice = '';
    submitted = 0;
    $('#player1Ready, #player2Ready').attr('src', "assets/images/questionMark.png");
    $('#player1Submitted, #player2Submitted').text('Not Submitted').removeClass('btn-success btn-danger').attr('disabled', true);
    $('#statusButton').text('Waiting').attr('disabled', true);
    $('#battleGround').attr('src', "assets/images/waiting.png");
    $("label[sign]").each(function () {
        $(this).removeClass('active')
    });
    playerRef.update({
        'choice': user.choice
    })
    gameRef.update({
        'submitted': submitted
    })
}

const win = () => {
    user.wins++
    playerRef.update({
        'wins': user.wins
    })
    $('#playerDisplay').text(user.wins);
    $('#player1Submitted').text('Winner').removeClass('btn-primary').addClass('btn-success')
    $('#player2Submitted').text('Loser').removeClass('btn-primary').addClass('btn-danger')
    setTimeout(() => {
        resetGame()
        fillOpponentChoice(opponentRef)
    }, 3000)
}

const loss = () => {
    opponentWins++;
    $('#opponentDisplay').text(opponentWins)
    $('#player2Submitted').text('Winner').removeClass('btn-primary').addClass('btn-success')
    $('#player1Submitted').text('Loser').removeClass('btn-primary').addClass('btn-danger')
    setTimeout(() => {
        resetGame()
        fillOpponentChoice(opponentRef)
    }, 3000)
}

const tie = () => {
    user.ties++;
    playerRef.update({
        'ties': user.ties
    })
    $('#tiesDisplay').text(user.ties);
    $('#player1Submitted').text('Tie').removeClass('btn-primary').addClass('btn-secondary')
    $('#player2Submitted').text('Tie').removeClass('btn-primary').addClass('btn-secondary')
    setTimeout(() => {
        resetGame()
        fillOpponentChoice(opponentRef)
    }, 3000)
}

const decideWinner = (userChoice, oppChoice) => {
    const userChoiceIndex = rpsArray.indexOf(userChoice);
    const oppChoiceIndex = rpsArray.indexOf(oppChoice);
    $('#player2Ready').attr('src', `assets/images/${oppChoice}Opp.png`);
    setTimeout(() => {
        switch (userChoiceIndex) {
            case 0:
                switch (oppChoiceIndex) {
                    case 0:
                        tie();
                        break;
                    case 1:
                        loss();
                        break;
                    case 2:
                        win();
                        break;
                }
                break;
            case 1:
                switch (oppChoiceIndex) {
                    case 0:
                        win();
                        break;
                    case 1:
                        tie();
                        break;
                    case 2:
                        loss();
                        break;
                }
                break;
            case 2:
                switch (oppChoiceIndex) {
                    case 0:
                        loss();
                        break;
                    case 1:
                        win();
                        break;
                    case 2:
                        tie()
                        break;
                }
                break;
        }
    }, 3000)
    user.gamesPlayed++;
    playerRef.update({
        'gamesPlayed': user.gamesPlayed
    })
    $('#gamesPlayedDisplay').text(user.gamesPlayed);
}

///////////
// Initializes each player's spot in line on load 
allUsers.once('value', function (snap) {
    user.number = snap.numChildren();
    userRef.update({
        'number': user.number
    });
    gameRef.once('value', (snap) => {
        numInGame = (snap.numChildren() - 2);
        if (numInGame < 2) {
            user.number = (numInGame + 1)
            userRef.update({
                'number': user.number
            })
            $('#queueRow').slideUp();
            directoryMover(userRef, gameRef);
        } else {
            $('#placeQueue').text(user.number);
        }
    })
})
//////////////////////////////////////////////////
allUsers.on('child_removed', (snap) => {
    const removedIndex = snap.val().number
    if (userDirectory) {
        database.ref(userDirectory + '/number').once('value').then((snap) => {
            if (snap.val() < removedIndex) {
                //do nothing
            } else {
                user.number = snap.val();
                if (user.number > 1) {
                    user.number--;
                    userRef.update({
                        'number': user.number
                    });
                    $('#placeQueue').text(user.number);
                }
            }
        })
    } else {
        console.log('null')
    }
})
userRef.onDisconnect().remove();


gameRef.on('value', (snap) => {
    if (snap.numChildren() === 4) {
        gameRef.update({
            'running': true
        })
    } else {
        gameRef.update({
            'running': false
        })
    }
    if (playerRef) {
        playerRef.onDisconnect().remove();
    }
})

gameRef.on('child_removed', (snap) => {
    if (snap.val().number === 1 && user.inGame === true) {
        user.number = 1;
        playerRef.update({
            'number': user.number
        })
        console.log(user);
    }
    submitted = 0;
    gameRef.update({
        'submitted': submitted
    })
    if (!user.inGame) {
        userRef.once('value', (snap) => {
            if (snap.val().number === 1) {
                user.number = 2;
                userRef.update({
                    'number': user.number
                })
                $('#queueRow').slideUp();
                directoryMover(userRef, gameRef)
            }
        })
    }
})

database.ref('/game/running/').on('value', (snap) => {
    if (!snap.val()) {
        disableButtons();
    } else {
        enableButtons();
        playerChecker();
    }
})

database.ref('/game/submitted/').on('value', (snap) => {
    if (!user.inGame) {
        return;
    }
    if (snap.val() === 2) {
        $('#battleGround').attr('src', 'assets/images/versus.png').slideDown(300);
        $('#statusButton').text('Deciding Winner').attr('disabled', false)
        decideWinner(user.choice, opponentChoice)
    }
})


///////////////// Game Space ///////////////////////////