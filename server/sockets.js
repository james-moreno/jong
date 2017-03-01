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

    var actionTimer = {};
    actionTimer.timer = function(){
        actionTimer.time = 10;
        actionTimer.startTimer = setInterval(function() {
            if(actionTimer.time === 0){
                console.log('time up!');
                clearInterval(actionTimer.timer);
                actionTimer.time = 10;
            }
            else {
                console.log(actionTimer.time);
                actionTimer.time --;
            }
        }, 1000);
    };

    function killTimer(){
        clearInterval(actionTimer.timer.startTimer);
        actionTimer.time = 10;
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
