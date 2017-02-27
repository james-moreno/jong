$scope.actionTimer = function(){
    $scope.time = 10;
    $scope.startTimer = setInterval(function() {
        if($scope.time === 0){
            console.log('time up!');
            clearInterval($scope.startTimer);
            $scope.time = undefined;
        }
        else {
            $scope.time --;
            $scope.$apply();
        }
    }, 1000);
};

$scope.killTimer = function(){
    clearInterval($scope.startTimer);
    $scope.time = undefined;
};
