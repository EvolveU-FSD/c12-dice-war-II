

const subTitles = [
    'Rise of the Farklnauts',
    'Get ready to roll',
    'Farkles on a train',
    'Farkling for fun and profit',
    'This time with rules...',
    'A game formerly known as Farkle'
]

const randomSubTitleIndex = Math.floor((Math.random()*subTitles.length))
const randomSubTitle = subTitles[randomSubTitleIndex]
document.getElementById("subTitle").innerHTML = randomSubTitle


// show the screen I want to see
document.getElementById("titleScreen").style.display = null
document.getElementById("turnChangeScreen").style.display = 'none'
document.getElementById("playTurnScreen").style.display = 'none'