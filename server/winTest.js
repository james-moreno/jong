var Tile = require('./tile.js');

var testHand = [];

testHand.push(new Tile('aspot', 1));
testHand.push(new Tile('aspot', 2));
testHand.push(new Tile('aspot', 3));
testHand.push(new Tile('aspot', 4));
testHand.push(new Tile('aspot', 5));
testHand.push(new Tile('aspot', 6));
testHand.push(new Tile('aspot', 7));
testHand.push(new Tile('aspot', 8));
testHand.push(new Tile('aspot', 9));
testHand.push(new Tile('bamboo', 1));
testHand.push(new Tile('bamboo', 1));
testHand.push(new Tile('bamboo', 1));
testHand.push(new Tile('bamboo', 2));
testHand.push(new Tile('bamboo', 2));
testHand.push(new Tile('bamboo', 2));
testHand.push(new Tile('bamboo', 3));

function checkWin(tile, hand){
    hand.push(tile);
    var total = 0;
    for (var i = 0; i < testHand.length; i++) {
        total += testHand[i].value;
    }
    total = (total%3);
    if(total === 0){
        zeroModCheck(testHand);
    }
    else if(total == 1){

    }
    else if(total == 2){

    }
}
function zeroModCheck(hand){
    //remove pair, then check for triplets
    var testNums = [3, 6, 9];
    for (var i = 0; i < testNums.length; i++) {
        var testNum = testNums[i];
        var checkHand = removePair(testNum, hand);
        console.log(checkHand);
    }

}

function removePair(num, hand){
    var pairTile;
    for (var i = 0; i < hand.length; i++) {
        hand[i]
    }
}


var testWinTile = new Tile('bamboo', 3);

checkWin(testWinTile, testHand);
