'use strict';
/**
 * 协作管理
 */
angular.module('manage').controller('manageCtrl', ['$scope', '$http', '$uibModal', '$state','FileUploader',
    function ($scope, $http, $uibModal, $state, FileUploader) {
    console.log('1111');

    $scope.openSignal = false;
    
    $scope.openNew = function () {
    	$scope.openSignal = true;
    }

    $scope.closeNew = function () {
    	$scope.openSignal = false;
    }

    $scope.trans = function () {
    	var url = $state.href('newcopper', {parameter: "parameter"});
		window.open(url,'_blank');
    }

    
       
}]);