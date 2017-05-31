var app = angular.module('app', ['ngCookies', 'btford.socket-io']);

app.factory('gameSocket', function (socketFactory){
    var jongSocket = socketFactory();
    jongSocket.forward('playerDataUpdate');
    jongSocket.forward('gameDataUpdate');
    jongSocket.forward('timerUpdate');
    jongSocket.forward('winner');
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
        $scope.gameData = gameData;
        //if statement for no discards on first player's turn
        $scope.rightPlayerDiscards = gameData.players[($scope.player.position+1)%4].discards;
        $scope.rightPlayerPlayed = gameData.players[($scope.player.position+1)%4].played;
        $scope.rightPlayerHand = gameData.players[($scope.player.position+1)%4].hand;
        $scope.topPlayerDiscards = gameData.players[($scope.player.position+2)%4].discards;
        $scope.topPlayerPlayed = gameData.players[($scope.player.position+2)%4].played;
        $scope.topPlayerHand = gameData.players[($scope.player.position+2)%4].hand;
        $scope.leftPlayerDiscards = gameData.players[($scope.player.position+3)%4].discards;
        $scope.leftPlayerPlayed = gameData.players[($scope.player.position+3)%4].played;
        $scope.leftPlayerHand = gameData.players[($scope.player.position+3)%4].hand;
    });
    $scope.$on('socket:playerDataUpdate', function(event, playerData){
        $scope.player = playerData;
        console.log(playerData);
        $scope.myId = $scope.player.name;
        $scope.hasAction = playerData.hasAction;
        $scope.actions = playerData.actions;
        if($scope.actions.eat.isEat){
            console.log('adding eat runs to scope');
            $scope.eats = $scope.actions.eat.runs;
            console.log($scope.eats);
        }
        else {
            $scope.eatPressed = false;
        }
    });
    $scope.$on('socket:timerUpdate', function(event, time){
        $scope.time = time;
    });
    $scope.$on('socket:winner', function(event, winner){
        console.log(winner+" is the winner!")
        $scope.winner = winner;
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
            var discardData = {
                tile: tile,
                player: $scope.player
            };
            gameSocket.emit('discard', discardData);
            console.log('discarding: '+tile);
        }
        else {
            console.log('not your turn!');
        }
    };
    $scope.cancel = function(){
        gameSocket.emit('cancel', $scope.player);
    };
    $scope.eatPress = function(){
        $scope.eatPressed = true;
        $scope.hasAction = false;
    };
    $scope.eat = function(tiles){
        console.log('tiles clicked to eat');
        var eatData = {
            run: tiles,
            player: $scope.player
        };
        $scope.eatPressed = false;
        $scope.eats = undefined;
        gameSocket.emit('eat', eatData);
    };
    $scope.pung = function(){
        var pungData = {
            player: $scope.player.position,
            tile: $scope.gameData.players[$scope.turn].discards.pop()
        };
        console.log(pungData);
        gameSocket.emit('pung', pungData);
    };
    $scope.kong = function(type){
        var kongData = {
            player: $scope.player.position,
            type: type
        };
        if(type == 'discard'){
            kongData.tile = $scope.gameData.players[$scope.turn].discards.pop();
        }
        else {
            kongData.tile = $scope.player.hand.pop();
        }
        console.log(kongData);
        gameSocket.emit('kong', kongData);
    };
    $scope.win = function(){
        var winData = {
            player: $scope.player.position
        };
        if($scope.player.position == $scope.turn){
            winData.tile = $scope.player.hand.pop();
        }
        else {
            winData.tile = $scope.gameData.players[$scope.turn].discards.pop();
        }
        gameSocket.emit('win', winData);
    };

    //Tests for CSS

    // $scope.testRuns = [[{suit: 'char', value: '1'},
    // {suit: 'char', value: '2'},
    // {suit: 'char', value: '3'}],
    // [{suit: 'char', value: '3'},
    // {suit: 'char', value: '4'},
    // {suit: 'char', value: '5'}]];
}]);
