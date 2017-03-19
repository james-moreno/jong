
module.exports = Player;

var Tile = require('./tile.js');

function Player(name){
    this.name = name;
    this.hand = [];
    this.discards = [];
    this.played = [];
    this.position = undefined;
    this.isTurn = false;
    this.ready = false;
    this.hasAction = false;
    this.actions = {
        kong: {
            concealed: false,
            meld: false,
            discard: false
        },
        listen: false,
        win: false,
        eat: false,
        pung: false
    };
}

Player.prototype.sortBy = function (key, minor) {
return function (o, p) {
    var a, b;
    if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[key];
        b = p[key];
        if (a === b) {
            return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
            return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
        }
    };
};
Player.prototype.sortHand = function(hand){
    if(hand){
        hand.sort(this.sortBy('suit', this.sortBy('value')));
    }
    else {
        this.hand.sort(this.sortBy('suit', this.sortBy('value')));
    }
};


Player.prototype.winCheck = function(tile){
    var total = 0;
    for (var i = 0; i < this.hand.length; i++) {
        total += this.hand[i].value;
    }
    total = (total%3);
    if(total === 0){
        return removePairCheckWin(tile, [3, 6, 9], this);
    }
    else if(total == 1){
        return removePairCheckWin(tile, [1, 4, 7], this);
    }
    else if(total == 2){
        return removePairCheckWin(tile, [2, 5, 8], this);
    }
    return false;
};

function removePairCheckWin(tile, testNums, player){
    //remove pair, then check for triplets
    for (var i = 0; i < testNums.length; i++) {
        var testNum = testNums[i];
        for (var j = 0; j < player.hand.length; j++) {
            var tempHand = player.hand.slice();
            tempHand.push(tile);
            player.sortHand(tempHand);
            // console.log(tempHand);
            if(tempHand[j+1] && tempHand[j].value == testNum && tempHand[j+1].value == tempHand[j].value && tempHand[j+1].suit == tempHand[j].suit){
                tempHand.splice(j, 2);
                if(onlySetsAndRunsRemaining(tempHand)){
                    return true;
                }
            }
        }
    }
    return false;
}

function onlySetsAndRunsRemaining(hand){
    while(hand.length !== 0){
        var i = j = k = 0;
        if(hand[i].value == hand[i+1].value && hand[i].suit == hand[i+1].suit && hand[i].value == hand[i+2].value && hand[i].suit == hand[i+2].suit){
            hand.splice(0, 3);
            continue;
        }
        for (var h = i; h < hand.length; h++){
            if (hand[h].value == hand[i].value+1 && hand[h].suit == hand[i].suit) {
                j = h;
            }

            if (hand[h].value == hand[i].value+2 && hand[h].suit == hand[i].suit) {
                k = h;
            }

            if (j !== 0 && k !== 0) {
                hand[i] = hand[j] = hand[k] = undefined;
                hand = hand.filter(function(item){
                    return item !== undefined;
                });
                break;
            }
        }

        if(j === 0 || k === 0){
            return false;
        }
    }
    return true;
}


var testWinTile = new Tile('bamboo', 3);

var testPlayer = new Player();



testPlayer.hand.push(new Tile('aspot', 1));
testPlayer.hand.push(new Tile('aspot', 1));
testPlayer.hand.push(new Tile('aspot', 2));
testPlayer.hand.push(new Tile('aspot', 2));
testPlayer.hand.push(new Tile('aspot', 3));
testPlayer.hand.push(new Tile('aspot', 3));
testPlayer.hand.push(new Tile('aspot', 7));
testPlayer.hand.push(new Tile('aspot', 8));
testPlayer.hand.push(new Tile('aspot', 9));
testPlayer.hand.push(new Tile('bamboo', 1));
testPlayer.hand.push(new Tile('bamboo', 1));
testPlayer.hand.push(new Tile('bamboo', 1));
testPlayer.hand.push(new Tile('bamboo', 2));
testPlayer.hand.push(new Tile('bamboo', 2));
testPlayer.hand.push(new Tile('bamboo', 2));
testPlayer.hand.push(new Tile('bamboo', 3));

console.log(testPlayer.winCheck(testWinTile));
