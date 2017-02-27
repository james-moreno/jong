var game = {};

var Player = require('./player.js');
var Wall = require('./wall.js');

game.players = {};

game.players.pOne = new Player('one');
game.players.pTwo = new Player('two');
game.players.pThree = new Player('three');
game.players.pFour = new Player('four');

var testWall = new Wall();

console.log(game.players);

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
