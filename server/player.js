
module.exports = Player;

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

Player.prototype.returnIsEat = function(){
    if(this.actions.eat === true){
        return true;
    }
    else {
        return false;
    }
};

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
Player.prototype.sortHand = function(){
    this.hand.sort(this.sortBy('suit', this.sortBy('value')));
};

Player.prototype.discard = function(tile){
    var discard;
    for(var idx = 0; idx<this.hand.length; idx++){
        if(this.hand[idx].suit == tile.suit && this.hand[idx].value == tile.value){
            discard = this.hand.splice(idx, 1);
            break;
        }
    }
    this.discards.push(discard[0]);
    this.isTurn = false;
    this.sortHand();
};
Player.prototype.autoDiscard = function(){
    var tile = this.hand.pop();
    this.discards.push(tile);
};

Player.prototype.draw = function(tile){
    this.hand.push(tile);
};

Player.prototype.drawDeal = function(tiles){
    for(var tile in tiles){
        this.hand.push(tiles[tile]);
    }
};

Player.prototype.drawCheckConcealedKong = function(tile){
    var count = 0;
    for(var idx = 0; idx < this.hand.length; idx++){
        if(this.hand[idx].suit == tile.suit && this.hand[idx].value == tile.value){
            count++;
            if (count == 4) {
                this.hasAction = true;
                this.actions.kong.concealed = true;
                return true;
            }
        }
    }
    return false;
};

Player.prototype.drawCheckMeldKong = function(tile){
    var count = 0;
    for(var idx = 0; idx < this.played.length; idx++){
        for (var i = 0; i < this.played[idx].length; i++) {
            if(this.played[idx][i].suit == tile.suit && this.played[idx][i].value == tile.value){
                count++;
                if (count == 3) {
                    this.hasAction = true;
                    this.actions.kong.meld = true;
                    return true;
                }
            }
        }
    }
    return false;
};

//EAT FUNCTIONS

Player.prototype.checkEat = function(tile){
    var runs = [];
    var low = this.lowEat(tile);
    if(low){
        runs.push(low);
    }
    var mid = this.midEat(tile);
    if(mid){
        runs.push(mid);
    }
    var high = this.highEat(tile);
    if(high){
        runs.push(high);
    }
    if(runs.length > 0){
        this.hasAction = true;
        this.actions.eat = {
            isEat: true,
            runs : runs
        };
    }
};

Player.prototype.lowEat = function(tile){
    var run = [];
    for(var idx = 0 ; idx < this.hand.length; idx ++){
        if(tile.value-1 == this.hand[idx].value && tile.suit == this.hand[idx].suit){
            for(var i = idx; i > -1; i--){
                if(tile.value-2 == this.hand[i].value && tile.suit == this.hand[i].suit){
                    run.push(this.hand[i], tile, this.hand[idx]);
                    return run;
                }
            }
        }
    }
    return;
};
Player.prototype.midEat = function(tile){
    var run = [];
    for(var idx = 0 ; idx < this.hand.length; idx ++){
        if(tile.value-1 == this.hand[idx].value && tile.suit == this.hand[idx].suit){
            for(var i = idx; i < this.hand.length; i++){
                if(tile.value+1 == this.hand[i].value && tile.suit == this.hand[i].suit){
                    run.push(this.hand[idx], tile, this.hand[i]);
                    return run;
                }
            }
        }
    }
    return;
};
Player.prototype.highEat = function(tile){
    var run = [];
    for(var idx = 0 ; idx < this.hand.length; idx ++){
        if(tile.value+1 == this.hand[idx].value && tile.suit == this.hand[idx].suit){
            for(var i = idx; i < this.hand.length; i++){
                if(tile.value+2 == this.hand[i].value && tile.suit == this.hand[i].suit){
                    run.push(this.hand[idx], tile, this.hand[i]);
                    return run;
                }
            }
        }
    }
    return;
};
Player.prototype.pickupEat = function(run){
    var runToPlay = [];
    for(var idx = 0; idx < run.length; idx++){
        for(var i = 0; i < this.hand.length; i++){
            if(this.hand[i].value == run[idx].value && this.hand[i].suit == run[idx].suit){
                var tile = this.hand.splice(i, 1);
                runToPlay.push(tile[0]);
                break;
            }
        }
    }
    this.played.push(runToPlay);
};

// PUNG FUNCTIONS
Player.prototype.checkPungKong = function(tile){
    var count = 0;
    for(var idx = 0; idx < this.hand.length; idx++){
        if(this.hand[idx].suit == tile.suit && this.hand[idx].value == tile.value){
            count++;
        }
    }
    if (count == 2) {
        this.hasAction = true;
        this.actions.pung = true;
        return true;
    }
    else if(count == 3) {
        this.hasAction = true;
        this.actions.pung = true;
        this.actions.kong.discard = true;
        return true;
    }
    else {
        return false;
    }
};

Player.prototype.pickupPung = function(tile){
    var pungToPlay = [];
    for(var j = 0; j < 3; j++){
        for(var idx = 0; idx < this.hand.length; idx ++){
            if(tile.suit == this.hand[idx].suit && tile.value == this.hand[idx].value){
                var pushTile = this.hand.splice(idx, 1);
                pungToPlay.push(pushTile[0]);
                break;
            }
        }
    }
    this.played.push(pungToPlay);
};

//KONG FUNCITONS

Player.prototype.pickupKong = function(tile){
    var kongToPlay = [];
    for(var j = 0; j < 4; j++){
        for(var idx = 0; idx < this.hand.length; idx ++){
            if(tile.suit == this.hand[idx].suit && tile.value == this.hand[idx].value){
                var pushTile = this.hand.splice(idx, 1);
                kongToPlay.push(pushTile[0]);
                break;
            }
        }
    }
    this.played.push(kongToPlay);
};

Player.prototype.concealedKong = function(){
    var tile = this.hand[this.hand.length-1];
    var kongToPlay = [];
    for(var j = 0; j < 4; j++){
        for(var idx = 0; idx < this.hand.length; idx ++){
            if(tile.suit == this.hand[idx].suit && tile.value == this.hand[idx].value){
                var pushTile = this.hand.splice(idx, 1);
                kongToPlay.push(pushTile[0]);
                break;
            }
        }
    }
    this.played.push(kongToPlay);
};

Player.prototype.meldKong = function(){
    var tile = this.hand.pop();
    for (var i = 0; i < this.played.length; i++) {
        if(this.played[i][0].suit == tile.suit && this.played[i][0].value == tile.value){
            this.played[i].push(tile);
        }
    }
};

Player.prototype.winCheck = function(tile){
    var total = 0;
    for (var i = 0; i < this.hand.length; i++) {
        total += this.hand[i].value;
    }
    total+=tile.value;
    total = (total%3);
    if(total === 0){
        if(removePairCheckWin(tile, [3, 6, 9], this)){
            this.hasAction = true;
            this.actions.win = true;
            return true;
        }
    }
    else if(total == 1){
        if(removePairCheckWin(tile, [2, 5, 8], this)){
            this.hasAction = true;
            this.actions.win = true;
            return true;
        }
    }
    else if(total == 2){
        if(removePairCheckWin(tile, [1, 4, 7], this)){
            this.hasAction = true;
            this.actions.win = true;
            return true;
        }
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
