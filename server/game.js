var game = {};
module.exports = game;

var Player = require('./player.js');
var Wall = require('./wall.js');
var TestWall = require('./testWall.js');

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
var count = 0;

//Game Joining and Starting Functions
game.addPlayer = function(socket){
    if(!game.full){
        game.players[count] = new Player(socket);
        game.players[count].position = count;
        game.gameData.players[count] = {};
        game.gameData.players[count].ready = false;
        count++;
    }
    checkFull();
};
game.removePlayer = function(socket){
    delete game.players[socket];
    count --;
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

game.turnChanger = function(){
    if(!game.gameData.started){
        game.gameData.turn = 0;
        game.players[game.gameData.turn].isTurn = true;
    }
    else if(game.gameData.started){
        game.players[game.gameData.turn].isTurn = false;
        game.gameData.turn = ((game.gameData.turn+1)%4);
        game.players[game.gameData.turn].isTurn = true;
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
function checkFull(){
    var playerCount = Object.keys(game.players).length;
    if(playerCount == 4){
        game.full = true;
    }
}
game.clearAllActions = function(){
    console.log('clearing all players actions');
    for (var i = 0; i < 4; i++) {
        console.log(i+'**********')
        game.clearActions(i);
    }
};

game.clearActions = function(player){
    console.log('clearing actions of player'+player);
    game.players[player].hasAction = false;
    game.players[player].actions = {
        kong: {
            concealed: false,
            meld: false
        },
        listen: false,
        win: false,
        eat: false,
        pung: false
    };
};

game.actionsExist = function(){
    for(var player in game.players){
        if(game.players[player].hasAction){
            return true;
        }
    }
    return false;
};

game.startGame = function(timerEmit){
    if(readyCheck() && !game.started){
        game.wall = new Wall();
        console.log(game.wall.wall.length);
        game.wall.shuffle();
        console.log(game.wall.wall.length);
        dealTiles();
        game.turnChanger();
        game.gameData.started = true;
    }
};

game.drawTile = function(){
    var tile = game.wall.draw();
    var player = game.gameData.turn;
    game.players[player].draw(tile);
    return checkDraw(tile, player);
};

function checkDraw(tile, player){
    console.log('checking draw');
    game.players[player].drawCheckConcealedKong(tile);
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
            game.gameData.players[idx].name = game.players[idx].name;

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
    checkPungs(tile);
    checkEat(tile);
    var checkResults = playersHaveActions();
    return checkResults;
}
function checkEat(tile){
    console.log('checking for eats');
    var nextPlayer = (game.gameData.turn+1)%4;
    game.players[nextPlayer].checkEat(tile);
}
function checkPungs(tile){
    console.log('checking for pung');
    for (var player in game.players) {
        if(player == game.gameData.turn){
            console.log('skipping discarding player');
            continue;
        }
        else if(game.players[player].checkPung(tile)){
            console.log('there is a pung');
            return player;
        }
    }
}

function grabTile(player){
    var tile = game.players[game.gameData.turn].discards.pop();
    game.players[player].hand.push(tile);
}
game.pickup = function(type, player, tiles){
    grabTile(player);
    if(type == 'eat'){
        game.players[player].pickupEat(tiles);
    }
    else if(type == 'pung'){
        game.players[player].pickupPung(tiles);
    }
};

// game.players.pOne = new Player('one');
// game.players.pTwo = new Player('two');
// game.players.pThree = new Player('three');
// game.players.pFour = new Player('four');




// function turnDecider(turnData, player){
//     if(turnData.type == 'draw'){
//         var draw = drawTile();
//         //run action/timer based on draw
//         if(checkWin(draw)){
//             action('win', player);
//         }
//         else if(checkListen(draw)){
//             action('listen', player);
//         }
//         else if(checkKong(draw)){
//             action('kong', player);
//         }
//         else if(checkFlower(draw)){
//             action('flower', player);
//         }
//         else {
//             action('normal', player);
//         }
//     }
//     else if(turnData.type == 'kong'){
//         action('kong', player);
//     }
//     else if(turnData.type == 'pickup'){
//         action('pickup', player);
//     }
// }
//
// function action(type, player){
//     if(type === 'kong'){
//         actionTimer();
//         if(discard == chosen){
//             clearInterval(actionTimer);
//             discard(discard);
//         }
//     }
//     else if(type == 'pickup'){
//         actionTimer();
//         if(discard == chosen){
//             clearInterval(actionTimer);
//             discard(discard);
//         }
//     }
// }
//
// function discard(tile, player){
//     var possibleActions = {};
//     checkKong(tile, player){
//         /*checks other players for kong*/
//         if(kong){
//             possibleActions.kong = true;
//         }
//     }
//     checkPung(tile, player){
//         /*checks other players for pung*/
//         if(pung){
//             possibleActions.pung = true;
//         }
//     }
//     checkEat(tile, player){
//         /*checks next player for eat*/
//         if(eat){
//             possibleActions.eat = true;
//         }
//     }
//     if(possibleActions.kong || possibleActions.pung || possibleActions.eat){
//         actionTimer('discard', possibleActions);
//     }
//     else {
//         nextTurn();
//         turnDecider('draw', nextPlayer);
//     }
// }
