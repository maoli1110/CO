'use strict';
/**
 * 概况
 */
angular.module('home').controller('allCtrl', ['$scope', 'Home', '$http',
    function ($scope, Home, $http) {

       $scope.list1 = {
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
        'e': 5,
        'f': 6
       };

        $scope.list1.g = Number($scope.list1.a) +  Number($scope.list1.b) + Number($scope.list1.c) ;

        $scope.change = function() {
             $scope.list1.g = Number($scope.list1.a) +  Number($scope.list1.b) + Number($scope.list1.c) ;
        }


        $scope.list2 = [1,2,3,4,5,6];

        $scope.list2[6] = eval($scope.list2.join('+'));

        $scope.change1 = function() {
            $scope.list2[6] = eval($scope.list2.join('+')) - $scope.list2[6];
        }

        $scope.user= {
            name: '11'
        }

        $scope.update = function  () {
            // body...
            console.log($scope.user.name);
        };
    }]);