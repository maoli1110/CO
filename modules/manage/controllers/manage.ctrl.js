'use strict';
/**
 * 协作管理
 */
angular.module('manage').controller('manageCtrl', ['$scope', '$http', '$uibModal', '$state','FileUploader','Manage',
    function ($scope, $http, $uibModal, $state, FileUploader,Manage) {

    $scope.deptInfoList = [];
    $scope.projectInfoList = [];

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
        //window.open(url, "", "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    //获取项目部列表
    Manage.getDeptInfoList().then(function (data) {
        //console.log(data);
        $scope.deptInfoList = data;
    })
    //获取工程列表
    Manage.getProjectInfoList().then(function (data) {
        //console.log(data);
        $scope.projectInfoList = data;
    });
    $scope.getProjectList = function (index) {
        $scope.isOpen = !$scope.isOpen;
    }
    
       
}]);