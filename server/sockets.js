var webSocket = function(client){

    var game = require('./game.js');
    var wantsToEat = {
        wants: false
    };
    var wantsToPung = {
        wants: false
    };
    var wantsToKong = {
        wants: false
    };

    function playerDataUpdate(){
        for(var player in game.players){
            io.to(game.players[player].name).emit('playerDataUpdate', game.players[player]);
        }
    }
    function gameDataUpdate(){
        game.grabGameData();
        io.sockets.emit('gameDataUpdate', game.gameData);
    }
    function timerUpdate(time){
        io.sockets.emit('timerUpdate', time);
    }
    function gamePlayerDataUpdate(){
        playerDataUpdate();
        gameDataUpdate();
    }
    function drawAction(actionData){
        console.log('drawAction function');
        var currentPlayer = game.gameData.turn;
        console.log(game.players[currentPlayer].name);
        io.to(game.players[currentPlayer].name).emit('drawAction', actionData);
    }
    function turnController(type, data){
        if(type == 'draw'){
            var drawCheck = game.drawTile();
            gamePlayerDataUpdate();
            if(drawCheck){
                turnLoop.timer('drawAction');
            }
            else {
                turnLoop.timer('turn');
            }
        }
        else if(type == 'discard'){
            var actionData = game.discard(data);
            gamePlayerDataUpdate();
            if(actionData){
                console.log('there is an action!');
                turnLoop.timer('discardAction');
            }
            else {
                game.turnChanger();
                turnController('draw', null);
            }
            /*Return if there is an action on the discard
            if there is then do discard action if not then do
            next player turn stuff
            */
        }
        else if(type == 'eat'){
            game.clearActions(data.player.position, type);
            if(!game.otherActionsExist()){
                console.log('no other actions, eating tile');
                killTimer();
                game.pickup('eat', data.player.position, data.run);
                game.turnChanger();
                gamePlayerDataUpdate();
                turnLoop.timer('turn');
            }
            else {
                console.log('another action, saving eat action data');
                wantsToEat = {
                    wants: true,
                    eat: 'eat',
                    position: data.player.position,
                    run: data.run
                };
                //Players eat data is saved until timer runs out
            }
        }
        else if(type == 'pung'){
            game.clearActions(data.player, type);
            if(!game.otherActionsExist()){
                console.log('no other actions, punging tile');
                killTimer();
                wantsToEat.wants = false;
                game.pickup('pung', data.player, data.tile);
                game.turnChanger(data.player);
                gamePlayerDataUpdate();
                turnLoop.timer('turn');
            }
            else {
                console.log('another action, saving pung action data');
                wantsToPung = {
                    wants: true,
                    pung: 'pung',
                    position: data.player,
                    tile: data.tile
                };
            }
        }

        else if(type == 'kong'){
            if(data.type == 'meld' || data.type =='concealed'){
                killTimer();
                game.clearAllActions();
                wantsToEat.wants = false;
                if(data.type == 'concealed'){
                    game.pickup('concealed', data.player, data.tile);
                    turnController('draw', null);
                }
                else if(data.type == 'meld'){
                    game.pickup('meld', data.player, data.tile);
                    turnController('draw', null);
                }
            }
            else if(data.type == 'discard'){
                game.clearActions(data.player, type);
                if(!game.otherActionsExist()){
                    game.pickup('discard', data.player, data.tile);
                    game.turnChanger(data.player);
                    turnController('draw', null);
                }
                else {
                    console.log('another action, saving pung action data');
                    wantsToKong = {
                        wants: true,
                        kong: data.type,
                        position: data.player,
                        tile: data.tile
                    };
                }

            }
        }
        else if (type == 'win'){
            killTimer();
            game.clearAllActions();
            var winner = game.players[winData].name;
            io.sockets.emit('winner', winner);
        }
        else if(type == 'actionCancelled'){
            game.clearActions(data.position);
            if(wantsToKong.wants){
                game.pickup(wantsToKong.kong, wantsToKong.player, wantsToKong.tile);
                game.turnChanger(data.player);
                turnController('draw', null);
            }
            else if(wantsToPung.wants){
                game.pickup(wantsToPung.pung, wantsToPung.position, wantsToPung.tile);
            }
            else if(wantsToEat.wants){
                game.pickup(wantsToEat.eat, wantsToEat.position, wantsToEat.run);
            }
            if(!game.otherActionsExist()){
                killTimer();
                game.turnChanger();
                turnController('draw', null);
            }
            /* Need to check if there is still a player needing to make
            an action. if there is, then don't kill the timer, if there isn't
            then kill timer and move to next turn */
        }
        else if(type == 'drawActionTimeUp'){
            game.clearActions(game.gameData.turn);
            gamePlayerDataUpdate();
            turnLoop.timer('turn');
        }
        else if (type == 'discardActionTimeUp'){
            game.clearAllActions();
            game.turnChanger();
            gamePlayerDataUpdate();
            turnController('draw', null);
        }
        else if(type == 'timeUpTurn'){
            game.autoDiscard();
            game.turnChanger();
            turnController('draw', null);
        }
    }
    var turnLoop = {};
    turnLoop.timer = function(type){
        turnLoop.time = 10;
        turnLoop.turnTimer = setInterval(function() {
            if(turnLoop.time === 0){
                turnLoop.time = undefined;
                timerUpdate(turnLoop.time);
                clearInterval(turnLoop.turnTimer);
                if(type == 'drawAction'){
                    turnController('drawActionTimeUp', null);
                    console.log('action time up!');
                }
                else if(type == 'discardAction'){
                    if(wantsToKong.wants){
                        game.pickup(wantsToKong.kong, wantsToKong.player, wantsToKong.tile);
                        game.turnChanger(data.player);
                        turnController('draw', null);
                    }
                    else if(wantsToPung.wants){
                        game.pickup(wantsToPung.pung, wantsToPung.position, wantsToPung.tile);
                    }
                    else if(wantsToEat.wants){
                        game.pickup(wantsToEat.eat, wantsToEat.position, wantsToEat.run);
                    }
                    turnController('discardActionTimeUp', null);
                    console.log('discardAction Timer is up!');
                }
                else if(type == 'turn'){
                    turnController('timeUpTurn', null);
                    console.log('turn time up!');
                }
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
        timerUpdate();
    }



    var io = require('socket.io').listen(client);
    io.sockets.on('connection', function (socket) {
        game.addPlayer(socket.id);
        gamePlayerDataUpdate();
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
            turnController('draw', null);
        });
        socket.on('discard', function(discardData){
            killTimer();
            turnController('discard', discardData);
        });
        socket.on('cancel', function(playerData){
            turnController('actionCancelled', playerData);
        });
        socket.on('eat', function(eatData){
            turnController('eat', eatData);
        });
        socket.on('pung', function(pungData){
            turnController('pung', pungData);
        });
        socket.on('kong', function(kongData){
            turnController('kong', kongData);
        });
        socket.on('win', function(winData){
            turnController('win', winData);
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
