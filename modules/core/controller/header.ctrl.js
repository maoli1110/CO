/**
 * Created by sdergt on 2016/8/24.
 */
//var app = angular.module("myApp",[]);
var clickCount = 0;		// 头部小三角点击次数
angular.module("core").controller("headerCtrl",function($scope,headerService){
    //console.info("我是头部标签")
    //分公司列表的状态
    //   点击工具栏三角形出现二级菜单
    $scope.$on("ngRepeatFinished",function(ngRepeatFinishedEvent){
    	if(clickCount > 0) {		// 第一次点击也要显示
    		$(".header_menus").slideToggle("fast");
            $(".header_menus ul li").hover(function(){
                $(".header_menus").show();
                $(this).css({"background":"#f5f6f7","color":"#69c080"}).children().find("ol").show();
            },function(){
                $(this).css({"background":"#fff","color":"#333"}).children().find("ol").hide();
                $(".header_menus").hide();
                $('.header-shape').removeClass('dispatcher-database')
            })
    	}
    	$(".header-shape").click(function(){
            $(".header_menus").slideToggle("fast");
            $(".header_menus ul li").hover(function(){
                $(".header_menus").show();
                $(this).css({"background":"#f5f6f7","color":"#69c080"}).children().find("ol").show();
            },function(){
                $(this).css({"background":"#fff","color":"#333"}).children().find("ol").hide();
                $(".header_menus").hide();
                $('.header-shape').removeClass('dispatcher-database')
            })
        })
    })
    $scope.headerMenus=[];
    //  头部信息的数据显示
        $scope.menus = function(){
            $('.header-shape').toggleClass("dispatcher-database");
            if($('.header-shape').hasClass("dispatcher-database")){
            	clickCount++;
                headerService.enterpriseInfoList({epid:0,isAll:3,queryFromBV:false}).then(function(data){
                    $scope.headerMenus = data.data;
                });
            }
        }
    
    //获取当前用户信息
    $scope.currentUser={
		img:"",
		name:"",
		job:"",
		compName:""
	};
    headerService.currentUserInfo().then(function(data){
        $scope.currentUser.img = data.avatarUrl;
    	$scope.currentUser.name = data.userName;
    	$scope.currentUser.job = data.roleName;
    	$scope.currentUser.compName = data.enterpriseName;
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
    //分公司下拉列表


})
 