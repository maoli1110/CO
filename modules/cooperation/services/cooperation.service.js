'use strict';

angular.module('cooperation').service('Cooperation', function ($http, $q) {
    var url = ApplicationConfiguration.urls.apiUrl;
    var coUrl = ApplicationConfiguration.urls.coUrl;
    var tempUrl = 'http://192.168.13.222:8080/bimco/rs/co/';
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

    //获取项目部下对应的联系人列表€
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

    //获取项目部下工程列表（BE）
    this.getProjectList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'projectList/' + params;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //选择BE资料-工程所属资料标签树
    this.getDocTagList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'docTagList/' + params;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取工程对应资料列表
    this.getDocList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'docList';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //获取工程树节点
    this.getProjectTree = function () {
        var delay = $q.defer();
        var url_join = url + 'projectTree';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取构件
    this.getFloorCompClassList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'floorCompClassList';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //获取协作详情列表
    this.getCollaboration = function (coid) {
        var delay = $q.defer();
        // var url_join= tempUrl + 'detail/' + coid;
        var url_join= url + 'detail/' + coid;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    //获取类型列表
    this.getTypeList = function () {
        var delay = $q.defer();
        var url_join= url + 'typeList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    //获取选择表单列表
    this.getTemplateNode = function (params) {
        var delay = $q.defer();
        var url_join= url + 'template/' + params;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    //创建协作
    this.createCollaboration = function (params) {
        var delay = $q.defer();
        var url_join = url + 'collaboration';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }

    //获取标识
    this.getMarkerList = function (params) {
        var delay = $q.defer();
        var url_join= url + 'markers';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

});