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

    var io = require('socket.io').listen(client);
    io.sockets.on('connection', function (socket) {
        game.addPlayer(socket.id);
        playerDataUpdate();
        gameDataUpdate();
        socket.on('ready', function(){
            game.readyUp(socket.id);
            gameDataUpdate();
        });
        socket.on('unready', function(){
            game.unReady(socket.id);
            gameDataUpdate();
        });
        socket.on('startGame', function(){
            game.startGame(timerUpdate(time));
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
