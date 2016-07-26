'use strict';

angular.module('cooperation').service('Cooperation', function ($http, $q) {
    var url = ApplicationConfiguration.urls.apiUrl;

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

    this.getUserList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'userList/' + params;
        $http.get('a.json')
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }


});