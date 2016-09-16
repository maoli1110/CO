/**
 * Created by sdergt on 2016/8/24.
 */
//var app = angular.module("myApp",[]);
angular.module("core").controller("headerCtrl",function($scope,headerService){
    //console.info("我是头部标签")
    //   点击工具栏三角形出现二级菜单
    $scope.$on("ngRepeatFinished",function(ngRepeatFinishedEvent){
        $(".navbar-header").click(function(){
            $(".header_menus").slideToggle("fast");

            $(".header_menus ul li").hover(function(){
                $(".header_menus").show();
                $(this).css({"background":"#e6e6e6","color":"#fff"}).children().find("ol").show();
            },function(){
                $(this).css({"background":"#fff","color":"#000"}).children().find("ol").hide();
                $(".header_menus").hide();
            })
        })

    })
    $scope.headerMenus=[];
    //  头部信息的数据显示

        $scope.menus = function(){
            //if( $scope.statusT){
            $('.navbar-header').toggleClass("dispatcher-database");
            if($('.navbar-header').hasClass("dispatcher-database")){
                //$scope.menus();
                headerService.enterpriseInfoList({epid:0,isAll:3}).then(function(data){
                    $scope.headerMenus = data.data;
                });
            }
        }





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
 