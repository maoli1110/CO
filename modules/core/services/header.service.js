/**
 * Created by sdergt on 2016/8/24.
 */
angular.module("core").service("headerService",function($http,$q){
    var headerService = {};

    // 获取头部菜单数据
    headerService.enterpriseInfoList = function(params){
        var url_join = "/bimco/rs/co/enterpriseInfoList";
        var delay = $q.defer();
        var obj = JSON.stringify(params);
        $http.post(url_join,obj,{transformRequest:angular.identity}).then(function(data){
            delay.resolve(data);
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }
    return headerService;
})