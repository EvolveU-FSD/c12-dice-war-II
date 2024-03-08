

const subTitles = [
    'Rise of the Farklnauts',
    'Get ready to roll',
    'Farkles on a train',
    'Farkling for fun and profit',
    'This time with rules...',
    'A game formerly known as Farkle'
]

let players = []
let currentPlayerIndex = 0
let currentTurn = {}

function newPlayer(name) {
    return { 
        name,
        score: 0
    }
}

function newTurn() {
    return { 
        score: 0,
        dice: 5,
        farkled: false
    }
}

function getNextPlayerName() {

}

function changeSubtitle() {
    const randomSubTitleIndex = Math.floor((Math.random()*subTitles.length))
    const randomSubTitle = subTitles[randomSubTitleIndex]
    document.getElementById("subTitle").innerHTML = randomSubTitle
}

function showOrHide(elementId, desiredElementId) {
    document.getElementById(elementId).style.display = (elementId !== desiredElementId ) ? 'none' : null
}

function changeScreen(screenId) {
    showOrHide("titleScreen", screenId)
    showOrHide("turnChangeScreen", screenId)
    showOrHide("playTurnScreen", screenId)
    showOrHide("winScreen", screenId)
}

function changeEndTurnButton() {
    showOrHide("endTurnButton", screenId)
    showOrHide("turnChangeScreen", screenId)
}

function isValidPlayer(playerNumber) {
    const playerInputId = "player" + playerNumber
    return document.getElementById(playerInputId).value !== ''
}

function addPlayerIfValid(playerNumber) {
    const playerInputId = "player" + playerNumber
    let playerName = document.getElementById(playerInputId).value
    if (playerName) {
        players.push(newPlayer(playerName))
    }
}

function validateAtLeastTwoPlayers() {
    let playerCount = 0
    if (isValidPlayer(1)) playerCount++
    if (isValidPlayer(2)) playerCount++
    if (isValidPlayer(3)) playerCount++
    if (isValidPlayer(4)) playerCount++

    if(playerCount >=2) {
        document.getElementById('startButton').disabled = false
        document.getElementById('twoPlayersRequired').style.display = 'none'
    }
    else {
        document.getElementById('startButton').disabled = true
        document.getElementById('twoPlayersRequired').style.display = null
    }

}

function showTitleScreen() {
    changeSubtitle()
    validateAtLeastTwoPlayers()
    changeScreen('titleScreen')
}

function showTurnChange() {
    const currentPlayer = players[currentPlayerIndex]
    document.getElementById('titleName').innerHTML = currentPlayer.name
    document.getElementById('confirmName').innerHTML = currentPlayer.name
    changeScreen('turnChangeScreen')
}

function showPlayTurn() {
    changeScreen('playTurnScreen')
}

function showWin() {
    changeScreen('winScreen')
}

function startGame() {
    players = []
    addPlayerIfValid(1)
    addPlayerIfValid(2)
    addPlayerIfValid(3)
    addPlayerIfValid(4)
    currentPlayerIndex = 0

    showTurnChange()
}

function startTurn() {
    const currentPlayer = players[currentPlayerIndex]
    currentTurn = newTurn()

    document.getElementById('playerName').innerHTML = currentPlayer.name
    document.getElementById('playerScore').innerHTML = currentPlayer.score

    refreshTurnScoring()

    document.getElementById('rollDiceButton').style.display = null
    document.getElementById('endTurnButton').innerHTML = 'Bank Points and End Turn'

    showPlayTurn()
}

function rollDice() {
    currentTurn.dice = currentTurn.dice-1
    currentTurn.score = currentTurn.score + Math.floor(Math.random()*5)*100

    refreshTurnScoring()

    if (currentTurn.dice === 0) {
        farkle()
    }
}

function refreshTurnScoring() {
    document.getElementById('diceCount').innerHTML = currentTurn.dice
    document.getElementById('turnScore').innerHTML = currentTurn.score
}

function farkle() {
    currentTurn.farkled = true
    document.getElementById('rollDiceButton').style.display = 'none'
    document.getElementById('turnScore').innerHTML = 'FARKLED!'
    document.getElementById('endTurnButton').innerHTML = 'End Turn'
}

function endTurn() {
    if (!currentTurn.farkled) {
        const currentPlayer = players[currentPlayerIndex]
        currentPlayer.score += currentTurn.score    
    }
    gotoNextPlayer()
}


function gotoNextPlayer() {
    currentPlayerIndex++
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0
    }
    showTurnChange()
}

showTitleScreen()