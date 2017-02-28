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
    $scope.$on('socket:gameDataUpdate', function(event, data){
        $scope.readyPlayers = readyPlayers(data);
        $scope.started = data.started;
    });
    $scope.$on('socket:assignID', function(event, id){
        $scope.myId = id;
    });
    $scope.$on('socket:playerDataUpdate', function(event, data){
        console.log(data);
        $scope.player = data;
        $scope.myId = $scope.player.name;
    });
    $scope.$on('socket:timerUpdate', function(event, time){
        $scope.time = time;
    });
    $scope.ready = function(){
        gameSocket.emit('ready');
        $scope.player.ready = true;
    };
    $scope.unready = function(){
        gameSocket.emit('unready');
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
}]);
