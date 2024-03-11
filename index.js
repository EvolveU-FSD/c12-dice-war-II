

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

function getCurrentPlayer() {
    return players[currentPlayerIndex]
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
    const currentPlayer = getCurrentPlayer()
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
    const currentPlayer = getCurrentPlayer()
    currentTurn = newTurn()

    updateScoreboard()
    refreshDice()

    document.getElementById('diceCount').innerHTML = currentTurn.dice
    document.getElementById('rollDiceButton').style.display = null
    document.getElementById('endTurnButton').innerHTML = 'Bank Points and End Turn'

    changeScreen('playTurnScreen')
}

function rollDice() {
    // commit what has been scored so far
    currentTurn.score = currentTurn.score + currentTurn.consideredScore
    currentTurn.consideredScore = 0

    // make new rolls
    currentTurn.rolls = []
    for(let die = 0; die < currentTurn.dice; die++) {
        currentTurn.rolls.push({
            value: d6(),
            selectedForScoring: false
        })
    }

    // update gui
    refreshScoreAndDice()
    if (noDiceScore() && !unscoredDicePair()) {
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

function unscoredDicePair() {
    const unscoringDice = getUnScoringDice()
    return (unscoringDice.length === 2) && (unscoringDice[0].value === unscoringDice[1].value) 
}

function toggleScoreDice(index) {
    currentTurn.rolls[index].selectedForScoring = !currentTurn.rolls[index].selectedForScoring
    refreshScoreAndDice()
}

function refreshScoreAndDice() {
    const unScoredDiceCount = getUnScoringDice().length    
    currentTurn.dice = unScoredDiceCount
    if ((unScoredDiceCount === 0) || unscoredDicePair()) {
        currentTurn.dice = 6
    }
    currentTurn.consideredScore = score(getScoringDice())

    refreshDice()

    const someSelectedDiceDontCountInScore = notAllDiceCount(getScoringDice())

    document.getElementById('rollDiceButton').style.display = (!currentTurn.consideredScore || someSelectedDiceDontCountInScore) ? 'none': null
    document.getElementById('diceCount').innerHTML = currentTurn.dice
    document.getElementById('turnScore').innerHTML = currentTurn.score+currentTurn.consideredScore
}

function score(rolls) {
    let { triplesScore, remainingDice } = scoreTriples(rolls)
    let { singlesScore  } = scoreSingles(remainingDice)
    return triplesScore + singlesScore
}

function notAllDiceCount(rolls) {
    let { remainingDice: afterTriples } = scoreTriples(rolls)
    let { remainingDice: afterSingles } = scoreSingles(afterTriples)
    console.log('Not all dice count:', afterSingles)
    return afterSingles.length > 0
}

function scoreTriples(rolls) {

    let triplesScore = 0
    let remainingDice = []

    let sortedDice = [ ...rolls ]
    sortedDice.sort((a, b) => a.value - b.value)

    if (rolls.length < 3) return { triplesScore, remainingDice: sortedDice}

    lastValueChangeIndex = 0
    currentValue = sortedDice[0].value
    for(let index = 0; index < sortedDice.length; index++) {
        nextDice = sortedDice[index]
        if (nextDice.value !== currentValue) {
            remainingDice.push(...sortedDice.slice(lastValueChangeIndex, index))
            lastValueChangeIndex = index
            currentValue = nextDice.value
        }
        else if ((index - lastValueChangeIndex) === 2) {
            triplesScore += (nextDice.value ===1) ? 1000 : (nextDice.value * 100) 
            lastValueChangeIndex = index+1  // start a new possible triple
        }
    }
    remainingDice.push(...sortedDice.slice(lastValueChangeIndex))
    return { triplesScore, remainingDice }
}

function scoreSingles(rolls) {
    let singlesScore = 0
    let remainingDice = []
    rolls.forEach((roll) => {
        if (roll.value === 5) {
            singlesScore += 50
        }
        else if (roll.value === 1) {
            singlesScore += 100
        }
        else {
            remainingDice.push(roll)
        }
    })
    return { singlesScore, remainingDice }
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

        const currentPlayer = getCurrentPlayer()
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