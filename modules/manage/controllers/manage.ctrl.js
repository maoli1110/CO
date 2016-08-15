'use strict';
/**
 * 协作管理
 */
angular.module('manage').controller('manageCtrl', ['$scope', '$http', '$uibModal', '$state','FileUploader','Manage',
    function ($scope, $http, $uibModal, $state, FileUploader,Manage) {

    $scope.deptInfoList = [];
    $scope.projectInfoList = [];

    $scope.openSignal = false;
    
    $scope.openNew = function () {
    	$scope.openSignal = true;
    }

    $scope.closeNew = function () {
    	$scope.openSignal = false;
    }

    $scope.trans = function () {
    	var url = $state.href('newcopper', {parameter: "parameter"});
		window.open(url,'_blank');
        //window.open(url, "", "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    //获取项目部列表
    Manage.getDeptInfoList().then(function (data) {
        //console.log(data);
        $scope.deptInfoList = data;

    })
    $scope.init = function(){
        var params = {deptId:1,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            //console.info("我是项目统计列表信息",data)
            $scope.trentsCount = data.data.slice(0,9);
        });
    }
    $scope.init();

        var deptId = '';
    $scope.childItems = function(id){
        if(!$scope.projectInfoList.length){
            Manage.getProjectInfoList(id).then(function (data) {
            //console.log("侧边菜单栏子菜单",data);
                $scope.projectInfoList = data.slice(0,9);
            });
            deptId = id;
            //    获取项目统计列表
            var params = {deptId:id,searchText:""}
            var obj = JSON.stringify(params)
            Manage.getProjectTrends(obj).then(function(data){
                console.info("我是项目统计列表信息",data)
                $scope.trentsCount = data.data;
            });

        }
    }
        //    项目统计列表搜索功能
        $scope.getDeptId = function(){
            //console.info(123)
            if(!deptId){
                 deptId = 1;
            }else{
                 deptId = deptId;
            }
            var searchBox = $("#exampleInputName2").val();
            console.info(searchBox)
            var params = {deptId:deptId,searchText:searchBox};
            var obj = JSON.stringify(params);
            Manage.getProjectTrends(obj).then(function(data){
                console.info("我是项目统计搜索列表信息",data)
                $scope.trentsCount = data.data;
            });
        }





        //图片预览效果
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var slid = $('ul.slide_box li')
            slid.addClass('none');
            slid.eq(0).removeClass('none');
            var slideindex = 0;
            function switchi() {
                if(slideindex == slid.length - 1){
                    slideindex = 0;
                }else {
                    slideindex = slideindex + 1;
                }
                slid.addClass('none');
                slid.eq(slideindex).removeClass('none');
            }
            var timer = setInterval(switchi, 3000);
            function options(indexs) {
                slid.addClass('none');
                slid.eq(indexs).removeClass('none');
            }
            $(".list>li").click(function(){
                var index = $(this).index();
                //console.info(index)
                var $img = $(".slide_box img");
                //获取一组数据中小图片的个数，来判断插入多少张大图；
                var aLiChild = $(this).find(".bx-controls").children();
                //console.info(aLiChild);
                //动态插入一组数据，通过索引值的方式插入指定文件夹下面的图片；
                for(var i=0;i<aLiChild.length;i++){
                    //通过attr属性改变图片的src路径
                    var url = "imgs/show/"+index+"/"+(i+1)+".jpg";
                    $img.eq(i).attr('src',url);
                }
            });
            //
            ////判断是第几页的内容
            //
            ////前进后退的效果
            ////如果恒等于0的时候就等于三，执行减操作，执行上一个动作
            //
            $('a.options').click(function(){
                var drec = $(this).data('drec');
                if(drec == 'pre') {
                    if(slideindex == 0) {
                        slideindex = 3;
                    }else {
                        slideindex = slideindex - 1;
                    }
                    //如果恒等于3的时候就等于0 ，执行加操作,执行下一个
                }else {
                    if(slideindex == 3) {
                        slideindex = 0;
                    }else {
                        slideindex = slideindex + 1;
                    }
                }
                clearInterval(timer);
                options(slideindex);
            });
            $('ul > li >.bx-controls >.img_list>.tools_bar>.bookSection').click(function(){
                console.info(123)
                slideindex = $(this).index();
                clearInterval(timer);
                options(slideindex);
                $(".mask").show();
                $(".showImg").show();
                $(".turnDown").show();
            });
            $(".turnDown").click(function(){
                $(this).hide();
                $(".mask").hide();
                $(".showImg").hide();
            })

            // 动态列表图片定位动画
            $(".img_list").hover(function(){
               $(this).children().find(".bar").stop().animate({"bottom":"0"})
            },function(){
                $(this).children().find(".bar").stop().animate({"bottom":"-28px"})
            })
        //    下载弹出遮罩层和下载进度
            $(".pro-down").click(function(){
                $(".tools_bar>.pro_mask").animate({top:0});
                $(".bar").hide();
            })
        });

    //获取动态列表
    //跳转页面
    //跳转页面
    //    $(".manage_back").hide();
        $scope.turnPage = function(id){
            //debugger;
            $(".good_list").hide();
            $(".pro_list").show();
           $(".goodlist_left").hide();
            $(".prolist_left").show();
            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:id,searchKey:"",searchType:""}).then(function(data){
                $scope.trentsListInfo = data.data;
                console.info("详情列表",$scope.trentsListInfo)
            });
            $scope.id= id;
    //动态列表搜索关键字
            $scope.manageSeacher = function(){
                console.info(123)
    //获取搜索类型关键字
                $scope.seacherKey = $("#exampleInputName3").val();
    //$scope.doc_type?0:$scope.doc_type;
              if($scope.docType==undefined){
                  $scope.docType=1;
              }else{
                  $scope.docType=$scope.docType;
              }
                Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:$scope.id,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
                    $scope.trentsListInfo = data.data;
                    //console.info($scope.docType)
                    console.info("我是搜索列表", $scope.trentsListInfo )
                });
            }
        }

        //通过侧边栏的子元素去调出动态列表
        $scope.trentsList = function($event,id) {
            //alert(id);
            $(".good_list").hide();
            $(".pro_list").show();
            $(".manage_back").show();
            Manage.getTrends({
                lastUploadTime: "",
                lastUsername: "",
                ppid: id,
                searchKey: "",
                searchType: ""
            }).then(function (data) {
                $scope.trentsListInfo = data.data;
                console.info("侧边栏的动态列表", $scope.trentsListInfo)
            });

            $scope.id = id;
            //动态列表搜索关键字
            $scope.manageSeacher = function () {
                //获取搜索类型关键字
                $scope.seacherKey = $(exampleInputName2).val();
                //$scope.doc_type?0:$scope.doc_type;
                $scope.doc_type = 0;
                Manage.getTrends({
                    lastUploadTime: "",
                    lastUsername: "",
                    ppid: $scope.id,
                    searchKey: $scope.seacherKey,
                    searchType: $scope.doc_type
                }).then(function (data) {
                    $scope.trentsListInfo = data.data;
                    console.info("我是搜索列表", $scope.trentsListInfo)
                });
            }
            //$("span.ng-binding").removeClass("active");
            //获取所有span下面的class名为ng-binding并且移除所有active;
            $("span[class*=ng-binding]").removeClass("menusActive");
            //获取当前元素
            $($event.target).children("span").hide()
            $($event.target).addClass("menusActive").parent().siblings().find("menusActive").removeClass("menusActive");
            $($event.target).children().css('opacity','1').parent().parent().siblings().find(".font_radius").css('opacity','0');
        }


    $scope.getProjectList = function (index) {
        $scope.isOpen = !$scope.isOpen;
    }
//通过动态列表的图片获取大图的资源路径
        $scope.transformBig = function(uuid){
            Manage.getTrendsFileViewUrl({uuid:uuid}).then(function(e){
                console.info(e)
            },function(err){
                console.info(err)
            })

        }


//        回退按钮关闭列表页面
        $scope.listBack = function(){
            $(".good_list").show();
            $(".pro_list").hide();
            $(".goodlist_left").show();
            $(".prolist_left").hide();
        }
//更新资料和选中模块加阴影效果
        $scope.$on('shadowFinsh', function (ngRepeatFinishedEvent) {
            //$($event.target).find(".updateNub").text("1111");
            $(".good_list dl").click(function(){
                $(this).find(".updateNub").text("0")
                $(this).addClass("dlActive").siblings().removeClass("dlActive")
            })

        })

        //   点击工具栏三角形出现耳机菜单
        //$(".header_menus").hide()
        $scope.menus = function(){
            $(".header_menus").slideToggle();
            $(".header_menus ul li").hover(function(){
                //console.info(123)
                $(this).css("background","#69C080").children().find("ol").show();
            },function(){
                $(this).css("background","#fff").children().find("ol").hide()
            })
        }



}]);