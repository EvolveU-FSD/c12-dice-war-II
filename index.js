

const subTitles = [
    'Rise of the Farklnauts',
    'Get ready to roll',
    'Farkles on a train',
    'Farkling for fun and profit',
    'This time with rules...',
    'A game formerly known as Farkle'
]

function changeSubtitle() {
    const randomSubTitleIndex = Math.floor((Math.random()*subTitles.length))
    const randomSubTitle = subTitles[randomSubTitleIndex]
    document.getElementById("subTitle").innerHTML = randomSubTitle
}

function changeScreen(title, turnChange, playTurn, win) {
    document.getElementById("titleScreen").style.display = title
    document.getElementById("turnChangeScreen").style.display = turnChange
    document.getElementById("playTurnScreen").style.display = playTurn
    document.getElementById("winScreen").style.display = win
}

function isValidPlayer(playerNumber) {
    const playerInputId = "player" + playerNumber
    return document.getElementById(playerInputId).value !== ''
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
    changeScreen(null, 'none', 'none', 'none')
}

function showTurnChange() {
    changeScreen('none', null, 'none', 'none')
}

function showPlayTurn() {
    changeScreen('none', 'none', null, 'none')
}

function showWin() {
    changeScreen('none', 'none', 'none', null)
}

function startGame() {
    // so something with the names ??
    showTurnChange()
}

function startTurn() {
    showPlayTurn()
}

showTitleScreen()