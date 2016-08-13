'use strict';

angular.module('manage').service('Manage', function ($http, $q) {

    //var trendUrl = ApplicationConfiguration.urls.trendUrl?ApplicationConfiguration.urls.trendUrl:"";
    var trendUrl = "/bimco";
    //trendUrl="http://172.16.21.69:8080/bimco";
    /**
     *获取项目部列表
     */
    this.getDeptInfoList = function () {
        var delay = $q.defer();
        var url_join = trendUrl + '/rs/trends/deptInfoList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
                console.info(data)
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    this.getProjectInfoList = function (params) {

        var delay = $q.defer();
        var url_join = trendUrl + '/rs/trends/projectInfoList/' + params;
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
        var url_join = trendUrl+"/rs/trends/projectTrends";
        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data)
        },function(data){
            delay.resolve(data)
        })
        return delay.promise;
    }


    //静态数据
    //var param = {
    //    count:10,
    //    lastUploadTime:"",
    //    lastUsername:"",
    //    ppid:1000,
    //    searchKey:"",
    //    searchType:""
    //};
//    获取动态列表
    this.getTrends = function(params){
        var delay = $q.defer();
        var url_join = trendUrl+"/rs/trends/trends";
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


//    获取大图效果（获取资料地址）
//    getTrendsFileViewUrl
    this.getTrendsFileViewUrl = function(params){
        var delay = $q.defer();
        var url_join = trendUrl+ "/rs/trends/viewUrl";
        $http.post(url_join,params,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(data){
            delay.reject(data)
        })
        return delay.promise;
    }



});