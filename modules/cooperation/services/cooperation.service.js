'use strict';

angular.module('cooperation').service('Cooperation', function ($http, $q) {
    var url = ApplicationConfiguration.urls.apiUrl;
    var coUrl = ApplicationConfiguration.urls.coUrl;
    /**
     *获取项目部列表
     */
    this.getDeptInfo = function () {
        var delay = $q.defer();
        var url_join= url + 'deptInfoList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    //获取项目部下对应的用户列表
    this.getUserList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'userList/' + params;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取协作详情列表
    this.getCollaboration = function (coid) {
        var delay = $q.defer();
        var url_join= url + 'detail/' + coid;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

});