'use strict';

angular.module('manage').service('Manage', function ($http, $q) {
    var url = ApplicationConfiguration.urls.apiUrl;

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

    this.getProjectInfoList = function () {
        var delay = $q.defer();
        var url_join = url + 'projectInfoList/' + '1';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }


});