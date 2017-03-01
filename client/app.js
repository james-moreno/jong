var app = angular.module('app', ['ngCookies', 'btford.socket-io']);

app.factory('gameSocket', function (socketFactory){
    var jongSocket = socketFactory();
    jongSocket.forward('playerDataUpdate');
    jongSocket.forward('gameDataUpdate');
    jongSocket.forward('timerUpdate');
    jongSocket.forward('assignID');
    return jongSocket;
});

app.controller('gameController', ['$scope', '$cookies', 'gameSocket',  function($scope, $cookies, gameSocket){

    function readyPlayers(players){
        var count = 0;
        for(var player in players){
            if(players[player].ready === true){
                count++;
            }
        }
        return count;
    }
    $scope.$on('socket:gameDataUpdate', function(event, gameData){
        console.log(gameData);
        $scope.turn = gameData.turn;
        $scope.readyPlayers = readyPlayers(gameData.players);
        $scope.started = gameData.started;
    });
    $scope.$on('socket:assignID', function(event, id){
        $scope.myId = id;
    });
    $scope.$on('socket:playerDataUpdate', function(event, playerData){
        console.log(playerData);
        $scope.player = playerData;
        $scope.myId = $scope.player.name;
    });
    $scope.$on('socket:timerUpdate', function(event, time){
        console.log($scope.player.isTurn);
        $scope.time = time;
    });
    $scope.ready = function(){
        gameSocket.emit('ready', $scope.player);
        $scope.player.ready = true;
    };
    $scope.unready = function(){
        gameSocket.emit('unready', $scope.player);
        $scope.player.ready = false;
    };
    $scope.startGame = function(){
        if($scope.readyPlayers == 4){
            console.log('starting game');
            gameSocket.emit('startGame');
        }
        else{
            console.log('game is not full yet');
        }
    };
    $scope.discard = function(tile){
        if($scope.turn == $scope.player.position && $scope.player.isTurn){
            $scope.time = undefined;
            disardData = {
                tile: tile,
                player: $scope.player
            };
            gameSocket.emit('discard', tile);
            console.log('discarding: '+tile);
        }
        else {
            console.log('not your turn!');
        }
    };
}]);
