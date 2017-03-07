
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
    console.log(run);
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
    console.log(runToPlay);
    this.played.push(runToPlay);
    console.log(this.played);
};
