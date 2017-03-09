module.exports = MeldKongWall;

var Tile = require('./tile.js');

function MeldKongWall() {
    this.wall = [];
    for(var j = 1; j <= 4; j++){
        for(var i = 1; i <= 9; i++){
            this.wall[this.wall.length] = new Tile('char', i);
            this.wall[this.wall.length] = new Tile('aspot', i);
            this.wall[this.wall.length] = new Tile('bamboo', i);
        }
        this.wall[this.wall.length] = new Tile("dnorth", null);
        this.wall[this.wall.length] = new Tile("deast", null);
        this.wall[this.wall.length] = new Tile("dsouth", null);
        this.wall[this.wall.length] = new Tile("dwest", null);
        this.wall[this.wall.length] = new Tile("eprosperity", null);
        this.wall[this.wall.length] = new Tile("ewhite", null);
        // this.wall[this.wall.length] = new Tile("flower", j);
        // this.wall[this.wall.length] = new Tile("season", j);
    }
    this.wall[this.wall.length-65] = new Tile('emiddle', null);
}

MeldKongWall.prototype.shuffle = function(){
    var m = this.wall.length, t, i;

    while(m){
        i = Math.floor(Math.random() * m--);
        t = this.wall[m];
        this.wall[m] = this.wall[i];
        this.wall[i] = t;
    }
    return this.wall;
};
MeldKongWall.prototype.draw = function(){
    return this.wall.pop();
};
MeldKongWall.prototype.drawDeal = function(){
    var tiles = {
        tileOne: this.wall.pop(),
        tileTwo: this.wall.pop(),
        tileThree: this.wall.pop(),
        tileFour: this.wall.pop()
    };
    return tiles;
};
