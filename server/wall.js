module.exports = Wall;

var Tile = require('./tile.js');

function Wall() {
    this.wall = [];
    for(var j = 1; j <= 4; j++){
        for(var i = 1; i <= 9; i++){
            this.wall[this.wall.length] = new Tile('aspot', i);
            this.wall[this.wall.length] = new Tile('bamboo', i);
            this.wall[this.wall.length] = new Tile('char', i);
        }
        this.wall[this.wall.length] = new Tile("dnorth", 1);
        this.wall[this.wall.length] = new Tile("deast", 1);
        this.wall[this.wall.length] = new Tile("dsouth", 1);
        this.wall[this.wall.length] = new Tile("dwest", 1);
        this.wall[this.wall.length] = new Tile("emiddle", 1);
        this.wall[this.wall.length] = new Tile("eprosperity", 1);
        this.wall[this.wall.length] = new Tile("ewhite", 1);
        // this.wall[this.wall.length] = new Tile("flower", j);
        // this.wall[this.wall.length] = new Tile("season", j);
    }
}

Wall.prototype.shuffle = function(){
    var m = this.wall.length, t, i;

    while(m){
        i = Math.floor(Math.random() * m--);
        t = this.wall[m];
        this.wall[m] = this.wall[i];
        this.wall[i] = t;
    }
    return this.wall;
};
Wall.prototype.draw = function(){
    return this.wall.pop();
};
Wall.prototype.drawDeal = function(){
    var tiles = {
        tileOne: this.wall.pop(),
        tileTwo: this.wall.pop(),
        tileThree: this.wall.pop(),
        tileFour: this.wall.pop()
    };
    return tiles;
};
