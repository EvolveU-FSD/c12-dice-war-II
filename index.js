

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
let winner

function newPlayer(name) {
    return { 
        name,
        score: 0
    }
}

function newTurn() {
    return { 
        score: 0,
        dice: 6,
        rolls: [],
        farkled: false,
        consideredScore: 0
    }
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

function updateScoreboard() {
    let playerScores = ''
    players.forEach((player, index) => {
        let currentPlayer = (index == currentPlayerIndex) ? ' current-player' : '' 
        let scoreboardEntry = 
            "<div class='scoreboard-entry " + currentPlayer + "'>" + 
            "  <div class='scoreboard-player'>" + player.name + "</div>" +
            "  <div class='scoreboard-score'>" + player.score + "</div>" +
            "</div>"
        playerScores += scoreboardEntry
    })

    const scoreboard = document.getElementById("scoreboard")
    scoreboard.innerHTML = playerScores    
    scoreboard.style.display = null    
}

function hideScoreboard() {
    document.getElementById("scoreboard").style.display = "none"  
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
    hideScoreboard()
    changeScreen('titleScreen')
}

function startGame() {
    players = []
    addPlayerIfValid(1)
    addPlayerIfValid(2)
    addPlayerIfValid(3)
    addPlayerIfValid(4)
    currentPlayerIndex = 0

    winner = ''
    
    showTurnChange()
}

function showTurnChange() {
    const currentPlayer = players[currentPlayerIndex]
    document.getElementById('titleName').innerHTML = currentPlayer.name
    document.getElementById('confirmName').innerHTML = currentPlayer.name
    updateScoreboard()

    changeScreen('turnChangeScreen')
}

function showWin(winner) {
    updateScoreboard()
    document.getElementById('winner').innerHTML = winner
    changeScreen('winScreen')
}

function startTurn() {
    const currentPlayer = players[currentPlayerIndex]
    currentTurn = newTurn()

    updateScoreboard()
    refreshDice()

    document.getElementById('diceCount').innerHTML = currentTurn.dice
    document.getElementById('rollDiceButton').style.display = null
    document.getElementById('endTurnButton').innerHTML = 'Bank Points and End Turn'

    changeScreen('playTurnScreen')
}

function rollDice() {
    currentTurn.score = currentTurn.score + currentTurn.consideredScore

    currentTurn.rolls = []
    for(let die = 0; die < currentTurn.dice; die++) {
        currentTurn.rolls.push({
            value: d6(),
            selectedForScoring: false
        })
    }

    refreshDice()
    if (noDiceScore()) {
        farkle()
    }
}

function refreshDice() {
    let diceDivs = ''
    currentTurn.rolls.forEach((roll, index) => {
        const scoringSelected = (roll.selectedForScoring) ? 'dice-selected' : ''
        diceDivs += "<div class='dice "+scoringSelected+"' onclick='toggleScoreDice("+index+")'>"+roll.value+"</div>"
    })

    document.getElementById('diceMat').innerHTML = diceDivs
}

function getUnScoringDice() {
    return currentTurn.rolls.filter((d) => !d.selectedForScoring)
}

function getScoringDice() {
    return currentTurn.rolls.filter((d) => d.selectedForScoring)
}

function toggleScoreDice(index) {
    currentTurn.rolls[index].selectedForScoring = !currentTurn.rolls[index].selectedForScoring
    const unScoredDiceCount = getUnScoringDice().length
    currentTurn.dice = unScoredDiceCount
    currentTurn.consideredScore = score(getScoringDice())

    refreshDice()

    document.getElementById('diceCount').innerHTML = currentTurn.dice
    document.getElementById('turnScore').innerHTML = currentTurn.score+currentTurn.consideredScore

}

function score(rolls) {
    consideredScore = 0
    rolls.forEach((roll) => {
        if (roll.value === 5) consideredScore += 50
        if (roll.value === 1) consideredScore += 100
    })
    return consideredScore
}

function noDiceScore() {
    return score(currentTurn.rolls) === 0    
}

function d6() {
    return Math.floor(Math.random()*6)+1
}

function farkle() {
    currentTurn.farkled = true
    document.getElementById('rollDiceButton').style.display = 'none'
    document.getElementById('turnScore').innerHTML = 'FARKLED!'
    document.getElementById('endTurnButton').innerHTML = 'End Turn'
}

function endTurn() {
    if (!currentTurn.farkled) {
        currentTurn.score = currentTurn.score + currentTurn.consideredScore

        const currentPlayer = players[currentPlayerIndex]
        currentPlayer.score += currentTurn.score    
    }
    gotoNextPlayer()
}

function gotoNextPlayer() {
    currentPlayerIndex++
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0
        checkWinner()
    }

    if (!winner) {
        showTurnChange()
    }
    else {
        showWin(winner)
    }
}

function checkWinner() {
    winner=''
    highestScore = 0
    players.forEach((player, index) => {
        if ((player.score >= 10000) && (player.score > highestScore)){
            winner = player.name
            highestScore = player.score
            currentPlayerIndex = index
        }
    })
}

showTitleScreen()