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
        console.log(data);
        $scope.deptInfoList = data;

    })
    //获取工程列表
    $scope.init = function(){
        var params = {deptId:1,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            console.info("我是项目统计列表信息",data)
            $scope.trentsCount = data.data;
        });
    }
    $scope.init();

    $scope.childItems = function(id){
        //alert(123)

        Manage.getProjectInfoList(id).then(function (data) {
            //alert(id)
            //console.log("123",data);
            $scope.projectInfoList = data;
        });
        //    获取项目统计列表
        var params = {deptId:id,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            console.info("我是项目统计列表信息",data)
            $scope.trentsCount = data.data;
        });

    }


    //获取动态列表
        $scope.trentsList = function(id){
            //alert(id)
            Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:id,searchKey:"",searchType:""}).then(function(data){
                $scope.trentsListInfo = data.data;
                console.info($scope.trentsListInfo)
            })
        }
    $scope.getProjectList = function (index) {
        $scope.isOpen = !$scope.isOpen;
    }
//        获取项目动态列表的数据

    
       
}]);