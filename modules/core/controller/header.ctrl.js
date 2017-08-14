/**
 * Created by sdergt on 2016/8/24.
 */
//var app = angular.module("myApp",[]);
var clickCount = 0;		// 头部小三角点击次数
angular.module("core").controller("headerCtrl",function($scope,headerService,$state,Cooperation,$timeout){
    //console.info("我是头部标签")
    //分公司列表的状态
    //   点击工具栏三角形出现二级菜单
    $scope.$on("ngRepeatFinished",function(ngRepeatFinishedEvent){
    	if(clickCount > 0) {		// 第一次点击也要显示
    		$(".header_menus").slideToggle("fast");
            $('.headerMask').show();
            $(".header_menus ul li").hover(function(){
                $(this).css({"color":"#69c080"}).children().find("ol").show();
            },function(){
                $(this).css({"color":"#333"}).children().find("ol").hide();
                $('.header-shape').removeClass('dispatcher-database');
            })
            $('.header_menus').mouseleave(function(){
                $('.header_menus').hide();
                $('.headerMask').hide();
            })
            //$(".header_menus
    	}
    	$(".header-shape").click(function(){
            $('.headerMask').show();
            $(".header_menus").slideToggle("fast");
            $(".header_menus ul li").hover(function(){
                $(this).css({"color":"#69c080"}).children().find("ol").show();
            },function(){
                $(this).css({"color":"#333"}).children().find("ol").hide();
                $('.header-shape').removeClass('dispatcher-database');
            })
            $('.header_menus').mouseleave(function(){
                $('.header_menus').hide();
                $('.headerMask').hide();
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
         if(data.realname){
             $scope.currentUser.name = data.realname;
         } else {
             $scope.currentUser.name = data.userName;
         }
         $scope.currentUser.job = data.roleName;
         $scope.currentUser.compName = data.enterpriseName;
         //获取用户信息再去获取权限码
         accessCode = BimCo.GetAuthCode()?BimCo.GetAuthCode():'';
         //给客户端推送当前用户姓名
         BimCo.GetCurrentUserInfo($scope.currentUser.name);
         // alert(accessCode+'accessCode');
    });
    function restrom(){
        $('#w-middle').css('display','inline-block');
        $('#w-max').css('display','none');
        $('#w-middle2').css('display','inline-block');
        $('#w-max2').css('display','none');
        $('#w-middle-inner').css('display','inline-block');
        $('#w-max-inner').css('display','none');
    }
   
    //最大化、最小化、还原、关闭
    //SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
    //窗口缩小
    $scope.minimize = function () {
        BimCo.SysCommand('SC_MINIMIZE');

    }
    //窗口放大还原
    $scope.maxRestore = function ($event) {
        //对接pc
        BimCo.SysCommand('SC_MAXIMIZE');
    }
        
    
    //窗口关闭
    $scope.close = function () {
        BimCo.SysCommand('SC_CLOSE');
    }

    //切换企业
    $scope.switchCompany = function(enterpriseId){
        BimCo.ChangeEnterprise(enterpriseId)
    }
    
    //协作跳转(当前未定位只在header页面保留，代码勿删)
    $scope.transCoManageFrombe = function() {
        // 勿删
        // var deptId = $('#deptId_formbe').val();
        // var ppid = $('#ppid_formbe').val();
        $state.go('cooperation',{'deptId':'', 'ppid':''},{ reload:true});
    }

    //调用心跳机制
    Cooperation.heartBeat();
    //跳转新页面去除心跳机制
    $scope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){
        //console.log(toState, toParams, fromState);
        clearInterval(ApplicationConfiguration.refreshID);
    })

    var  status = BimCo.GetWindowStatus();
    if(status){
        $timeout(function(){
            restrom()
        },100)
    }

})
 