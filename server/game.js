var game = {};
module.exports = game;

var Player = require('./player.js');
var Wall = require('./wall.js');

// Items for Test purposes
var TestWall = require('./testWall.js');
var KongWall = require('./kongWall.js');
var MeldKongWall = require('./meldKongWall.js');
var Tile = require('./tile.js');
var DiscardKongWall = require('./discardKongWall.js');

game.players = {};
game.gameData = {
  started: false,
  players: {
    0: {},
    1: {},
    2: {},
    3: {}
  }
};
game.full = false;
// var count = 0;
var slots = [3, 2, 1, 0];

//Game Joining and Starting Functions
game.addPlayer = function(socket, username){
    if(!game.full){
      var position = assignPlayerPosition();
      game.players[position] = new Player(socket, username);
      game.players[position].position = position;
      game.gameData.players[position] = {};
      game.gameData.players[position].ready = false;
      // count++;
    }
    checkFull();
};

function assignPlayerPosition(){
  if(slots.length > 0){
    return slots.pop();
  }
  else {
    return false;
  }
}
function replacePosition(position){
  slots.push(position);
}

game.removePlayer = function(socket){
  for(var player in game.players){
    if(game.players[player].id == socket){
      console.log('removing player '+player);
      replacePosition(player);
      game.unReady(player);
      delete game.players[player];
    }
  }
  checkFull();
};

game.readyUp = function(player){
    game.players[player].ready = true;
    game.gameData.players[player] = {
        ready: true
    };
};
game.unReady = function(player){
    game.players[player].ready = false;
    game.gameData.players[player] = {
        ready: false
    };
};

game.turnChanger = function(player){
    if(typeof(player) == 'number'){
        game.players[game.gameData.turn].isTurn = false;
        game.gameData.turn = player;
        game.players[player].isTurn = true;
    }
    else {
        if(!game.gameData.started){
            game.gameData.turn = 0;
            game.players[game.gameData.turn].isTurn = true;
        }
        else if(game.gameData.started){
            game.players[game.gameData.turn].isTurn = false;
            game.gameData.turn = ((game.gameData.turn+1)%4);
            game.players[game.gameData.turn].isTurn = true;
        }
    }
};

function readyCheck(){
    for(var player in game.players){
        if(!game.players[player].ready){
            return false;
        }
    }
    return true;
}


function dealTiles(wall){
    var playerNum = 0;
    for(var idx = 0; idx < 4; idx++){
        for(var player in game.players){
            if(game.players[player].position == playerNum){
                game.players[player].drawDeal(game.wall.drawDeal());
                playerNum++;
            }
        }
        playerNum = 0;
    }
    for(var hand in game.players){
        game.players[hand].sortHand();
    }
}

// Tile drawing for test purposes
function testDealTiles(wall){
    for (var i = 0; i < 4; i++) {
        game.players[i].drawDeal(game.wall.drawDeal());
        game.players[i].drawDeal(game.wall.drawDeal());
        game.players[i].drawDeal(game.wall.drawDeal());
        game.players[i].drawDeal(game.wall.drawDeal());
    }
}
// Test drawing for test purposes

function checkFull(){
  var playerCount = Object.keys(game.players).length;
  console.log('Game has '+playerCount+' players.');
  if(playerCount == 4){
    game.full = true;
  }
  else {
    game.full = false;
  }
}

game.clearAllActions = function(){
    console.log('clearing all players actions');
    for (var player in game.players) {
        game.clearActions(player, null);
    }
};

game.clearActions = function(player, type){
    game.players[player].hasAction = false;
    game.players[player].actions = {
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
    if(type == 'pung' || type == 'kong'){
        console.log('clearing actions of '+type+' and below');
        for(var guy in game.players){
            if(game.players[guy].actions.eat){
                game.clearActions(guy, null);
            }
        }
    }
};

game.otherActionsExist = function(){
  for(var player in game.players){
    if(game.players[player].hasAction){
      return true;
    }
  }
  return false;
};

game.startGame = function(timerEmit){
  if(readyCheck() && !game.started){
    clearHands();
    game.wall = new Wall();
    game.wall.shuffle();
    dealTiles();
    game.gameData.started = false;
    game.turnChanger();
    game.gameData.started = true;
  }
};

game.cancelGame = function(){
  clearHands();
  game.clearAllActions();
  game.gameData.started = false;
  for(var player in game.gameData.players){
    game.gameData.players[player].hand = [];
    game.gameData.players[player].discards = [];
    game.gameData.players[player].played = [];
  }
};

function clearHands(){
  for(var player in game.players){
    game.players[player].hand = [];
    game.players[player].discards = [];
    game.players[player].played = [];

  }
}

game.drawTile = function(){
    var tile = game.wall.draw();
    var player = game.gameData.turn;
    game.players[player].draw(tile);
    return checkDraw(tile, player);
};

function checkDraw(tile, player){
    console.log('checking draw');
    game.players[player].drawCheckConcealedKong(tile);
    game.players[player].drawCheckMeldKong(tile);
    game.players[player].winCheck(tile);
    return game.players[player].hasAction;
}

game.discard = function(discardData){
    var discardTile = discardData.tile;
    game.players[discardData.player.position].discard(discardTile);
    console.log('running and return discardChecks');
    return discardChecks(discardTile);
};
game.autoDiscard = function(){
    game.players[game.gameData.turn].autoDiscard();
};

game.grabGameData = function(){
    grabPlayersHands();
};
function grabPlayersHands(){
    if(game.gameData.started){
        for(var idx = 0; idx < 4; idx++){
            game.gameData.players[idx].hand = playerHiddenHand(game.players[idx].hand.length);
            game.gameData.players[idx].discards = game.players[idx].discards;
            game.gameData.players[idx].played = game.players[idx].played;
            game.gameData.players[idx].username = game.players[idx].username;

        }
    }
}
function playerHiddenHand(handLength){
    var handArray = [];
    for(var idx = 0; idx < handLength; idx++){
        handArray.push({});
    }
    return handArray;
}

// check discard functions, returns an object with boolean and player if true
function playersHaveActions(){
    for(var player in game.players){
        if(game.players[player].hasAction){
            return true;
        }
    }
    return false;
}

function discardChecks(tile){
    console.log('hit discardChecks function');
    if(checkPungsKongs(tile)){
        console.log('There is a Pung or Kong');
    }
    if(checkEat(tile)){
        console.log('There is an Eat');
    }
    if(checkWin(tile)){
        console.log('There is a Win');
    }
    var checkResults = playersHaveActions();
    return checkResults;
}
function checkEat(tile){
    console.log('checking for eats');
    var nextPlayer = (game.gameData.turn+1)%4;
    game.players[nextPlayer].checkEat(tile);
}
function checkPungsKongs(tile){
    console.log('checking for pung and kong');
    console.log(game.gameData.turn+" this player's turn");
    for (var player in game.players) {
        if(player == game.gameData.turn){
            console.log('skipping discarding player');
            continue;
        }
        else if(game.players[player].checkPungKong(tile)){
            console.log('there is a kong and/or pung');
            return player;
        }
    }
}
function checkWin(tile){
    console.log('checking for win');
    for(var player in game.players){
        if(player == game.gameData.turn){
            console.log('skipping discarding player');
            continue;
        }
        else if(game.players[player].winCheck(tile)){
            console.log('there is a win');
            return player;
        }
    }
}

function grabTile(player){
    var tile = game.players[game.gameData.turn].discards.pop();
    game.players[player].hand.push(tile);
}
game.pickup = function(type, player, tiles){
    if(type == 'eat'){
        grabTile(player);
        game.players[player].pickupEat(tiles);
    }
    else if(type == 'pung'){
        grabTile(player);
        game.players[player].pickupPung(tiles);
    }
    else if(type == 'discard'){
        grabTile(player);
        game.players[player].pickupKong(tiles);
    }
    else if(type == 'concealed'){
        game.players[player].concealedKong();
    }
    else if(type == 'meld'){
        game.players[player].meldKong();
    }
};
