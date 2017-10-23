/**
 * Created by sdergt on 2016/8/24.
 */
//var app = angular.module("myApp",[]);
var clickCount = 0;		// 头部小三角点击次数
angular.module("core").controller("headerCtrl", function ($scope, headerService, $state, Cooperation, $timeout) {
    // console.info("我是头部标签")
    $scope.headerMenus = [];//头部信息显示
    $scope.currentUser = { //当前用户信息
        img: "",
        name: "",
        job: "",
        compName: ""
    };
    // 分公司列表的状态
    // 点击工具栏三角形出现二级菜单
    $scope.$on("ngRepeatFinished", function (ngRepeatFinishedEvent) {
        if (clickCount > 0) {		// 第一次点击也要显示
            $(".header_menus").slideToggle("fast");
            $('.headerMask').show();
            $(".header_menus ul li").hover(function () {
                $(this).css({"color": "#69c080"}).children().find("ol").show();
            }, function () {
                $(this).css({"color": "#333"}).children().find("ol").hide();
                $('.header-shape').removeClass('dispatcher-database');
            })
            $('.header_menus').mouseleave(function () {
                $('.header_menus').hide();
                $('.headerMask').hide();
            })
            //$(".header_menus
        }
        $(".header-shape").click(function () {
            $('.headerMask').show();
            $(".header_menus").slideToggle("fast");
            $(".header_menus ul li").hover(function () {
                $(this).css({"color": "#69c080"}).children().find("ol").show();
            }, function () {
                $(this).css({"color": "#333"}).children().find("ol").hide();
                $('.header-shape').removeClass('dispatcher-database');
            })
            $('.header_menus').mouseleave(function () {
                $('.header_menus').hide();
                $('.headerMask').hide();
            })
        })
    })
    
    // 头部信息的数据显示
    $scope.menus = function () {
        $('.header-shape').toggleClass("dispatcher-database");
        if ($('.header-shape').hasClass("dispatcher-database")) {
            clickCount++;
            headerService.enterpriseInfoList({epid: 0, isAll: 3, queryFromBV: true}).then(function (data) {
                $scope.headerMenus = data.data;
            });
        }
    }
    /**
     * 切换用户
     */
    $scope.switchUser = function () {
        layer.alert('您是否要使用其他账号登录?', {
            title: '提示',
            btn: ['确定', '取消'] //按钮
        }, function () {
            BimCo.ChangeUser();
            layer.closeAll();
            // $uibModalInstance.dismiss();
        }, function () {
            layer.closeAll();
        });
    }

    //获取当前用户信息
    headerService.currentUserInfo().then(function (data) {
        $scope.currentUser.img = data.avatarUrl;
        if (data.realname) {
            $scope.currentUser.name = data.realname;
        } else {
            $scope.currentUser.name = data.userName;
        }
        $scope.currentUser.job = data.roleName;
        $scope.currentUser.compName = data.enterpriseName;
        //获取用户信息再去获取权限码
        accessCode = BimCo.GetAuthCode() ? BimCo.GetAuthCode() : '';
        // accessCode = '33012001;33012002;33012003;33012004';
        //给客户端推送当前用户姓名
        BimCo.GetCurrentUserInfo($scope.currentUser.name);
        // alert(accessCode+'accessCode');
    });

    //窗口中等大小的样式初始化
    function restrom() {
        $('#w-middle').css('display', 'inline-block');
        $('#w-max').css('display', 'none');
        $('#w-middle2').css('display', 'inline-block');
        $('#w-max2').css('display', 'none');
        $('#w-middle-inner').css('display', 'inline-block');
        $('#w-max-inner').css('display', 'none');
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
        /**
         * $scope.isToolstatus关闭窗口提醒框的提示状态
         * 0 显示提示框
         * 1 不显示提示框&&最小化托盘&&勾选不再提醒
         * 2 不显示提示框&&退出应用程序&&勾选不再提醒
         */
        var contentInfo = ''
        //前端保存页面不再提醒的勾选状态
        if(sessionStorage.noRember === "false"){
                contentInfo = '<div><label class="quit-style"><input type="radio" name="close-button" value="min" checked/>最小化到系统托盘</label> <br> <label class="quit-style"><input type="radio" name="close-button" value="logout" /> 退出鲁班协作</label></div><br/><br/><div class="clearfix rember" ><label><input type="checkbox" name="rember">不再提醒</label></div>';
        } else {
                contentInfo ='<div><label class="quit-style"><input type="radio" name="close-button" value="min" checked/>最小化到系统托盘</label> <br> <label class="quit-style"><input type="radio" name="close-button" value="logout" /> 退出鲁班协作</label></div><br/><br/><div class="clearfix rember" ><label><input type="checkbox" name="rember" checked>不再提醒</label></div>'
        }
        $scope.isToolstatus = BimCo.GetSaveState();//关闭之前去客户端拿状态
        if ($scope.isToolstatus==0) {
            layer.confirm('dfdf', {
                title: '提示',
                area:['300px','200px'],
                skin:'layer-skin',
                content: contentInfo,
                btn: ['确定', '取消'] //按钮
            }, function () {
                var closeSignal = $("input:radio[name='close-button']:checked").val();
                var noRember = $("input[name='rember']").prop('checked');
                sessionStorage.noRember = noRember;
                if (!noRember) {
                    if (closeSignal == 'min') {
                        BimCo.SysCommand('SC_MINSHOW', false);
                    } else {
                        BimCo.SysCommand('SC_CLOSE', false);
                    }
                } else {
                    if (closeSignal == 'min') {
                        BimCo.SysCommand('SC_MINSHOW', true);
                    } else {
                        BimCo.SysCommand('SC_CLOSE', true);
                    }
                }
                layer.closeAll();
            }, function () {
                layer.closeAll();
            });
        } else if ($scope.isToolstatus == 1) {
            BimCo.SysCommand('SC_MINSHOW', true);
        } else if ($scope.isToolstatus == 2) {
            BimCo.SysCommand('SC_CLOSE', true);
        }

    }

    //切换企业
    $scope.switchCompany = function (enterpriseId) {
        if($state.current.name === 'cooperationNew.detail'){
            $state.go('cooperationNew.threeCloumn');
        }
        BimCo.ChangeEnterprise(enterpriseId)
    }

    //协作跳转(当前未定位只在header页面保留，代码勿删)
    $scope.transCoManageFrombe = function () {
        $state.go('cooperation', {'deptId': '', 'ppid': ''}, {reload: true});
    }

    //调用心跳机制
    Cooperation.heartBeat();
    //跳转新页面去除心跳机制
    $scope.$on('$stateChangeStart',function (event, toState, toParams, fromState, fromParams) {
        //console.log(toState, toParams, fromState);
        clearInterval(ApplicationConfiguration.refreshID);
    })

    //调用客户端获取当前窗口状态
    var status = BimCo.GetWindowStatus();
    if (status) {
        $timeout(function () {
            restrom()
        }, 100)
    }
})
