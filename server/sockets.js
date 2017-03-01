var webSocket = function(client){

    var game = require('./game.js');

    function playerDataUpdate(){
        for(var player in game.players){
            io.to(game.players[player].name).emit('playerDataUpdate', game.players[player]);
        }
    }
    function gameDataUpdate(){
        io.sockets.emit('gameDataUpdate', game.gameData);
    }
    function timerUpdate(time){
        io.sockets.emit('timerUpdate', time);
    }

    var turnLoop = {};
    turnLoop.timer = function(){
        turnLoop.time = 5;
        turnLoop.turnTimer = setInterval(function() {
            if(turnLoop.time === 0){
                console.log('time up!');
                turnLoop.time = undefined;
                timerUpdate(turnLoop.time);
                clearInterval(turnLoop.turnTimer);
                game.turnChanger();
                playerDataUpdate();
                gameDataUpdate();
                turnLoop.timer();
            }
            else {
                timerUpdate(turnLoop.time);
                turnLoop.time --;
            }
        }, 1000);
    };


    function killTimer(){
        clearInterval(turnLoop.turnTimer);
        turnLoop.time = undefined;
    }



    var io = require('socket.io').listen(client);
    io.sockets.on('connection', function (socket) {
        game.addPlayer(socket.id);
        playerDataUpdate();
        gameDataUpdate();
        socket.on('ready', function(playerData){
            game.readyUp(playerData.position);
            gameDataUpdate();
        });
        socket.on('unready', function(playerData){
            game.unReady(playerData.position);
            gameDataUpdate();
        });
        socket.on('startGame', function(){
            game.startGame();
            playerDataUpdate();
            gameDataUpdate();
            turnLoop.timer();
        });
        socket.on('discard', function(discardData){
            killTimer();
        });
        socket.on('disconnect', function(){
            console.log('client disconnected');
            game.removePlayer(socket.id);
        });
    });
    return io;
};

module.exports = function(appServer){
    return webSocket(appServer);
};
