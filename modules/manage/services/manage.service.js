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
                //console.info(data)
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
        //var params = JSON.stringify(params);
        //var delay = $q.defer();
        //var url_join = trendUrl+ "/rs/trends/viewUrl";
        //$http.post(url_join,params,{transformRequest: angular.identity}).then(function(data){
        //    delay.resolve(data);
        //},function(data){
        //    delay.reject(data)
        //})
        //return delay.promise;
    }
    //系统时间
    this.getCurrentDate = function () {
        var cDate = new Date();
        //console.info($scope.date)
        var cYear = cDate.getFullYear();
        var cMouth = cDate.getMonth()+1;
        var cDay = cDate.getDate();
        var cWeekday=new Array(7);
        cWeekday[0]="星期日";
        cWeekday[1]="星期一";
        cWeekday[2]="星期二";
        cWeekday[3]="星期三";
        cWeekday[4]="星期四";
        cWeekday[5]="星期五";
        cWeekday[6]="星期六";
       var currentDate =  cYear+"年"+ cMouth+"月"+cDay+"日"+cWeekday[cDate.getDay()];
       return currentDate;
    }
//    获取服务器时间
    this.getTrendsSystem = function(params){
        var delay = $q.defer();
        var url_join = trendUrl+"/rs/trends/system";
        var obj = JSON.stringify(params);
        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
            console.info(data)
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }

});