
module.exports = Player;

function Player(name){
    this.name = name;
    this.hand = [];
    this.discards = [];
    this.played = [];
    this.position = undefined;
    this.isTurn = false;
    this.ready = false;
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
        }
    }
    if(discard){
        return(discard[0]);
    }
    else{
        console.log('no tile with that suit/value');
    }
};
Player.prototype.draw = function(tile){
    this.hand.push(tile);
};
Player.prototype.drawDeal = function(tiles){
    for(var tile in tiles){
        this.hand.push(tiles[tile]);
    }
};
