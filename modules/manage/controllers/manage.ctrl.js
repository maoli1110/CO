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
        //console.log("mmmmmm",data);
        $scope.deptInfoList = data;

    })
    $scope.init = function(){
        var params = {deptId:1,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            //console.info("我是项目统计列表信息11111",data)
            $scope.trentsCount = data.data;
        });
    }
    $scope.init();

        var deptId = '';
    $scope.childItems = function(id){
        $(".good_list").show();
        $(".pro_list").hide();
        $(".goodlist_left").show();
        $(".prolist_left").hide();
        //if($scope.projectInfoList.length){
            Manage.getProjectInfoList(id).then(function (data) {
            //console.log("侧边菜单栏子菜单",data);
                $scope.projectInfoList = [];
                $scope.projectInfoList = data.slice(0,6);
            });
            deptId = id;
            //    获取项目统计列表
            var params = {deptId:id,searchText:""}
            var obj = JSON.stringify(params)
            Manage.getProjectTrends(obj).then(function(data){
                //console.info("我是项目统计列表信息",data)
                $scope.trentsCount = data.data.slice(0,6);
            });
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
            //console.info(searchBox)
            var params = {deptId:deptId,searchText:searchBox};
            var obj = JSON.stringify(params);
            Manage.getProjectTrends(obj).then(function(data){
                //console.info("我是项目统计搜索列表信息",data)
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
            //$(".list>li").click(function(){
            //    var index = $(this).index();
            //    //console.info(index)
            //    var $img = $(".slide_box img");
            //    //获取一组数据中小图片的个数，来判断插入多少张大图；
            //    var aLiChild = $(this).find(".bx-controls").children();
            //    //console.info(aLiChild);
            //    //动态插入一组数据，通过索引值的方式插入指定文件夹下面的图片；
            //    for(var i=0;i<aLiChild.length;i++){
            //        //通过attr属性改变图片的src路径
            //        var url = "imgs/show/"+index+"/"+(i+1)+".jpg";
            //        $img.eq(i).attr('src',url);
            //    }
            //});
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
                //console.info(123)
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
        var searchId ;
        $scope.turnPage = function(id){
            //debugger;
            searchId = id;
            $(".good_list").hide();
            $(".pro_list").show();
           $(".goodlist_left").hide();
            $(".prolist_left").show();
            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:id,searchKey:"",searchType:""}).then(function(data){
                $scope.trentsListInfo = data.data;
                //console.info("详情列表",$scope.trentsListInfo)
            });
            //searchId
           //console.info("跳转页面的id",id)

        }
        //动态列表搜索关键字
        $scope.manageSeacher = function(){
            //console.info(123)
            //获取搜索类型关键字
            $scope.seacherKey = $("#exampleInputName3").val();
            //$scope.doc_type?0:$scope.doc_type;
            if($scope.docType==undefined){
                $scope.docType=1;
            }else{
                $scope.docType=$scope.docType;
            }


            Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
                $scope.trentsListInfo = data.data;
                //console.info($scope.docType)
                //console.info("我是搜索列表", $scope.trentsListInfo )
            });
        }
        //判断是否按下enter键进行搜索（动态工程列表页面）
        //工程列表enter键搜索
        $scope.previewList = function(e){
            var keyCode = e.keyCode|| e.which;
            if($("#exampleInputName2").val()!="" && keyCode==13){
                if(!deptId){
                    deptId = 1;
                }else{
                    deptId = deptId;
                }
                var searchBox = $("#exampleInputName2").val();
                //console.info(searchBox)
                var params = {deptId:deptId,searchText:searchBox};
                var obj = JSON.stringify(params);
                Manage.getProjectTrends(obj).then(function(data){
                    //console.info("我是项目统计搜索列表信息",data)
                    $scope.trentsCount = data.data;
                });
                //console.info("鲁班软件222")
            }
        }

        //判断是否按下enter键进行搜索（动态工程动态列表页面）
        //工程动态列表enter键搜索
        $scope.keyUp = function(e){
            var keyCode = e.keyCode|| e.which;
            if($("#exampleInputName3").val()!="" && keyCode==13){
                $scope.seacherKey = $("#exampleInputName3").val();
                //$scope.doc_type?0:$scope.doc_type;
                if($scope.docType==undefined){
                    $scope.docType=1;
                }else{
                    $scope.docType=$scope.docType;
                }


                Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
                    $scope.trentsListInfo = data.data;
                    //console.info($scope.docType)
                    //console.info("我是搜索列表", $scope.trentsListInfo )
                });

            }
        }
        //通过侧边栏的子元素去调出动态列表
        $scope.trentsList = function($event,id) {
            searchId = id;
            //alert(id);
            //console.info(12131313)
            $(".good_list").hide();
            $(".pro_list").show();
            $(".goodlist_left").hide();
            $(".prolist_left").show();
            Manage.getTrends({
                lastUploadTime: "",
                lastUsername: "",
                ppid: id,
                searchKey: "",
                searchType: ""
            }).then(function (data) {
                $scope.trentsListInfo = data.data;
                //console.info("侧边栏的动态列表", $scope.trentsListInfo);
            //    angular.forEach($scope.trentsListInfo, function(value, key) {
            //        //如果存在后缀名
            //        // debugger;
            //        angular.forEach(value.docs,function(value1, key1){
            //            console.log(value);
            //            if(value1.docName.indexOf('.') !== -1) {
            //                var unit = value1.docName.split('.')[value1.docName.split('.').length - 1];
            //                $scope.trentsListInfo[key].docs[key1].suffix = unit;
            //            }
            //        });
            //        //if(value.name.indexOf('.') !== -1){
            //        //    var unit = value.name.split('.')[value.name.split('.').length - 1];
            //        //    //1.获取后缀 把后缀你push到数组
            //        //    $scope.collaList.docs[key].suffix = unit;
            //        //    console.log($scope.collaList.docs);
            //        //}
            //        console.info("侧边栏的动态列表2222222222", $scope.trentsListInfo);
            //});




            });

            $scope.id = id;

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
        $scope.transformBig = function(uuid,docName){
            var data ={fileName:docName,uuid:uuid};
            // $.ajax({
            //     contentType: "application/json; charset=utf-8",
            //     //dataType : 'json',
            //     url: "rs/trends/viewUrl",
            //     type: "POST",
            //     data: data,
            //     async: false,
            //     success: function(result){
            //         //console.info(result)
            //         $scope.previewimg = result;
            //         layer.open({
            //             type: 2,
            //             //skin: 'layui-layer-lan',
            //             title: 'layer弹层组件',
            //             fix: false,
            //             shadeClose: true,
            //             maxmin: true,
            //             area: ['1000px', '500px'],
            //             content: $scope.previewimg
            //         });
            //     }

            // });

            Manage.getTrendsFileViewUrl(data).then(function (result) {
                $scope.previewimg = result;
                layer.open({
                        type: 2,
                        //skin: 'layui-layer-lan',
                        title: '预览',
                        fix: false,
                        shadeClose: true,
                        maxmin: true,
                        area: ['1000px', '500px'],
                        content: $scope.previewimg
                    });
            },function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.message);
            });
            
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
        //系统时间
       //$scope.currentDate =  Manage.getCurrentDate();
//        服务器时间
        $scope.currentTime= function(){
            Manage.getTrendsSystem({sysTime:"",sysWeek:""}).then(function(data){
                $scope.serviceTime = data.data;
            })
        }
        $scope.currentTime();

        $scope.transCooperation = function () {
            $state.go('cooperation', {'transignal':'be'});
        }
}]);