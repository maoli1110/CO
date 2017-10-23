'use strict';

// 定义主模块和添加依赖模块
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies)
    .config(function($httpProvider) {
        $httpProvider.defaults.transformRequest = function(data) {
            if (data === undefined) {
                return data;
            }
            return $.param(data);
        };
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
    })
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('');
        }
    ])
    .config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push(['$q', 'i18n', 'alertService',
                function($q, i18n, alertService) {
                    return {
                        // status < 300
                        response: function(response) {
                            var data = response.data;
                            // 统一处理result为false的情况
                            if (data.result && data.result == "false" && data.errormsg) {
                                alertService.add('danger', data.errormsg);
                            }
                            //if(!navigator.onLine){
                            //    layer.alert('网络出错了!')
                            //}
                            return response;
                        },
                        // status >= 400
                        responseError: function(rejection) {
                            switch (rejection.status) {
                                // 401 Unauthorized: jump to login page
                                //case 401:
                                //    location.pathname = membersysConfig.loginPage;
                                //    break;
                                case 404:
                                    layer.confirm('当前网络服务出错！', {
                                        btn: ['确定','取消'] //按钮
                                    }, function() {
                                        layer.closeAll();
                                    });
                                    break;
                                case 500:
                                    if(rejection.data.infoCode !== '1007'){ //账号被踢或者超时由客户端提示，前端过滤掉提示信息
                                        layer.confirm(rejection.data.message, {
                                            btn: ['确定','取消'] //按钮
                                        }, function() {
                                            layer.closeAll();
                                        }, function(){
                                            layer.closeAll();
                                        });
                                        break;
                                    }
                                default:
                                    //alertService.add('danger', i18n.get('error.message'));
                            }
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);
        }
    ])
    .run([
      "$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        return $rootScope.$stateParams = $stateParams;
      }
    ]).filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            //angular信任机制
            return $sce.trustAsHtml(text); 
        };
    }]);


angular.element(document).ready(function() {
    // if (window.location.hash === '#_=_') window.location.hash = '#!';
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
