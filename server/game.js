var game = {};
module.exports = game;

var Player = require('./player.js');
var Wall = require('./wall.js');

game.players = {};
game.gameData = {
    started: false,
    players: {}
};
game.full = false;
var count = 0;

//Game Joining and Starting Functions
game.addPlayer = function(socket){
    if(!game.full){
        game.players[count] = new Player(socket);
        game.players[count].position = count;
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

game.startGame = function(timerEmit){
    if(readyCheck() && !game.started){
        game.wall = new Wall();
        game.wall.shuffle();
        dealTiles();
        game.turnChanger();
        game.gameData.started = true;
    }
};

game.drawTile = function(){
    var tile = game.players[game.gameData.turn].draw(game.wall.draw());
};

game.discard = function(discardData){
    var discardTile = discardData.tile;
    game.players[discardData.player.position].discard(discardTile);
    console.log('running and return discardChecks');
    return discardChecks(discardTile);
};
game.autoDiscard = function(){
    game.players[game.gameData.turn].autoDiscard();
};

// check discard functions, returns an object with boolean and player if true

function discardChecks(tile){
    console.log('hit discardChecks function');
    var checkResults = {
        kong: false,
        pung: false,
        eat: checkEat(tile)
    };
    return checkResults;
}
function checkEat(tile){
    console.log('checking for eats');
    var nextPlayer = (game.gameData.turn+1)%4;
    return game.players[nextPlayer].checkEat(tile);
}

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
