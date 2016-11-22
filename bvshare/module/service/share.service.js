'use strict';

bvShare.service('Share', function ($http, $q) {
    var url = basePath;
    //分享页面的详情
    this.shareDetail = function(coid){
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: basePath+'rs/co/shareDetail',
            // url: 'detail.json',
            data:coid,
            async:false,
            contentType:'text/plain',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){
                delay.reject(error);
            }

        });
        return delay.promise;
    }
    //分享页面的
    this.shareOperation = function(coid){
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: basePath+'rs/co/shareOperation',
            data:coid,
            async:false,
            contentType:'text/plain',
            success: function(data){
                delay.resolve(data);
            },
            error:function(){
                delay.reject(error);
            }

        });
        return delay.promise;
    }
});