var game = {};
module.exports = game;

var Player = require('./player.js');
var Wall = require('./wall.js');

game.players = {};
game.gameData = {
    started: false
};
game.full = false;
var count = 1;

//Game Joining and Starting Functions
game.addPlayer = function(socket){
    if(!game.full){
        game.players[socket] = new Player(socket);
        game.players[socket].position = count;
        count++;
    }
    checkFull();
};
game.removePlayer = function(socket){
    delete game.players[socket];
    count --;
};

game.readyUp = function(socket){
    game.players[socket].ready = true;
    game.gameData[socket] = {
        ready: true
    };
};
game.unReady = function(socket){
    game.players[socket].ready = false;
    game.gameData[socket] = {
        ready: false
    };
};
function readyCheck(){
    for(var player in game.players){
        if(!game.players[player].ready){
            return false;
        }
    }
    return true;
}
game.startGame = function(timerEmit){
    if(readyCheck() && !game.started){
        game.wall = new Wall();
        game.wall.shuffle();
        dealTiles();
        game.gameData.started = true;
        turnStart();
    }
};
function dealTiles(wall){
    var playerNum = 1;
    for(var idx = 0; idx < 4; idx++){
        for(var player in game.players){
            if(game.players[player].position == playerNum){
                game.players[player].drawDeal(game.wall.drawDeal());
                playerNum++;
            }
        }
        playerNum = 1;
    }
    for(var guy in game.players){
        game.players[guy].sortHand();
    }
}
function checkFull(){
    var playerCount = Object.keys(game.players).length;
    if(playerCount == 4){
        game.full = true;
    }
}

//Game Turn Loop
function turnStart(){
    console.log('turns starting');
}

game.gameData.time = undefined;
game.actionTimer = function(player){
    game.gameData.time = 10;
    game.startTimer = setInterval(function() {
        if(game.time === 0){
            console.log('time up!');
            clearInterval(game.startTimer);
            game.time = undefined;
        }
        else {
            game.gameData.time --;
        }
    }, 1000);
};

game.killTimer = function(){
    clearInterval(game.startTimer);
    game.gameData.time = undefined;
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
