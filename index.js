

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

function showTitleScreen() {
    changeSubtitle()
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