module.exports = TestWall;

var Tile = require('./tile.js');

function TestWall() {
    this.wall = [];
    for(var j = 1; j <= 4; j++){
        for(var i = 1; i <= 9; i++){
            this.wall[this.wall.length] = new Tile('char', 2);
            this.wall[this.wall.length] = new Tile('char', 2);
            this.wall[this.wall.length] = new Tile('char', 2);
        }
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        this.wall[this.wall.length] = new Tile("char", 2);
        // this.wall[this.wall.length] = new Tile("flower", j);
        // this.wall[this.wall.length] = new Tile("season", j);
    }
}

TestWall.prototype.shuffle = function(){
    var m = this.wall.length, t, i;

    while(m){
        i = Math.floor(Math.random() * m--);
        t = this.wall[m];
        this.wall[m] = this.wall[i];
        this.wall[i] = t;
    }
    return this.wall;
};
TestWall.prototype.draw = function(){
    return this.wall.pop();
};
TestWall.prototype.drawDeal = function(){
    var tiles = {
        tileOne: this.wall.pop(),
        tileTwo: this.wall.pop(),
        tileThree: this.wall.pop(),
        tileFour: this.wall.pop()
    };
    return tiles;
};
