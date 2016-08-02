'use strict';

angular.module('manage').service('Manage', function ($http, $q) {
    var url = ApplicationConfiguration.urls.apiUrl;
    var trendUrl = ApplicationConfiguration.urls.trendUrl;

    /**
     *获取项目部列表
     */
    this.getDeptInfoList = function () {
        var delay = $q.defer();
        var url_join = url + 'deptInfoList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    this.getProjectInfoList = function (params) {

        var delay = $q.defer();
        var url_join = url + 'projectInfoList/' + params;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }
//    获取项目动态统计
    this.getProjectTrends = function(obj){
        var delay = $q.defer();
        var url_join = trendUrl+"projectTrends";
        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data)
        },function(data){
            delay.resolve(data)
        })
        return delay.promise;
    }

//    获取动态列表
    this.getTrends = function(params){
        var delay = $q.defer();
        var url_join = trendUrl+"trends";
        //静态数据
        //var param = {
        //    count:10,
        //    lastUploadTime:"",
        //    lastUsername:"",
        //    ppid:1000,
        //    searchKey:"",
        //    searchType:""
        //};
        var obj = JSON.stringify(params);
        console.log(obj);
        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
            //console.info(data)
        },function(data){
            delay.reject(data)
        })
        return delay.promise;
    }



});