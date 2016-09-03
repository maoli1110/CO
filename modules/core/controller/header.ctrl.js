/**
 * Created by sdergt on 2016/8/24.
 */
//var app = angular.module("myApp",[]);
angular.module("core").controller("headerCtrl",function($scope,headerService){
    //console.info("我是头部标签")
    //   点击工具栏三角形出现二级菜单
    //$(".header_menus").hide()
    $scope.menus = function(){
        $(".header_menus").slideToggle();
        $(".header_menus ul li").hover(function(){
            //console.info(123)
            $(this).css({"background":"#e6e6e6","color":"#fff"}).children().find("ol").show();
        },function(){
            $(this).css({"background":"#fff","color":"#000"}).children().find("ol").hide()
        })
    }
    //  头部信息的数据显示
    headerService.enterpriseInfoList({epid:0,isAll:3}).then(function(data){
        $scope.headerMenus = data.data
    });

    //最大化、最小化、还原、关闭
    //SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
    //窗口缩小
    $scope.minimize = function () {
        BimCo.SysCommand('SC_MINIMIZE');
    }

    //窗口放大还原
    var num=0; 
    $scope.max = true;
    $scope.maxRestore = function ($event) {
        if(num++ %2 == 0){ 
            console.log('max');
            $scope.max = false;
            $scope.restore = true;
            //对接pc
            BimCo.SysCommand('SC_MAXIMIZE');
        } else { 
            console.log('restore');
            $scope.max = true;
            $scope.restore = false;
            //对接pc
            BimCo.SysCommand('SC_RESTORE');
        }
    }
    

    //窗口关闭
    $scope.close = function () {
        BimCo.SysCommand('SC_CLOSE');
    }

})
//默认还原//点击放大