let tests = {
    testScoreTriples_noTriple_returnsRemainingDice: function() {
        const rolls = [ { value: 1 }, { value: 6 }, {value: 5 }]
        const {triplesScore, remainingDice } = scoreTriples(rolls)
        assert('No score', 0, triplesScore)
        assert('none of the dice matched a triple', 3, remainingDice.length)
        assertRemainingDice(remainingDice, 1,6,5)
    },

    testScoreTriples_onlyTriple_ones: function() {
        const rolls = [ { value: 1 }, { value: 1 }, {value: 1 }]
        const {triplesScore, remainingDice } = scoreTriples(rolls)
        assert('Score', 1000, triplesScore)
        assert('no remaining dice', 0, remainingDice.length)
    },

    testScoreTriples_onlyTriple_threes: function() {
        const rolls = [ { value: 3 }, { value: 3 }, {value: 3 }]
        const {triplesScore, remainingDice } = scoreTriples(rolls)
        assert('Score', 300, triplesScore)
        assert('no remaining dice', 0, remainingDice.length)
    },

    testScoreTriples_triple_with_remaining_dice: function() {
        const rolls = [ { value: 3 }, {value: 5}, { value: 3 }, {value: 3 }]
        const {triplesScore, remainingDice } = scoreTriples(rolls)
        assert('No score', 300, triplesScore)
        assertRemainingDice(remainingDice, 5)
    },

    testScoreTriples_twoTriples: function() {
        const rolls = [ {value : 2}, { value: 3 }, {value: 1}, { value: 3 }, {value : 2}, {value: 3 }, {value : 2} ]
        const {triplesScore, remainingDice } = scoreTriples(rolls)
        assert('No score', 500, triplesScore)
        assertRemainingDice(remainingDice, 1)
    },

    testScore_actualRoll: function() {
        const rolls = [ {value : 5}, { value: 3 }, {value: 3}, { value: 1 }, {value : 3}, {value: 3 }]
        const actualScore = score(rolls)
        assert('Score', 450, actualScore)
        assertRemainingDice(remainingDice, 3)
    },

}

function assert(message, expected, actual) {
    if (expected !== actual) {
        throw new Error(message + ': expected '+ expected + ' actual ' + actual)
    }
}

function assertRemainingDice(actualRolls, ...expected) {
    expected.sort((a,b)=> a-b)
    const sorted = actualRolls.map(r => r.value).sort((a,b) => a-b)
    message = 'Remaining dice did not match expected ' + expected + ' actual ' + sorted
    assert(message, expected.length, sorted.length )
    expected.forEach((expectedRoll, index) => {
        assert(message, expectedRoll, sorted[index])
    })
}

function runTests() {
    let results = {}
    Object.keys(tests).forEach((testName) => {
        try {
            tests[testName]()
            results[testName] = 'pass'
        }
        catch (error) {
            results[testName] = error
        }
    })
    return results
}