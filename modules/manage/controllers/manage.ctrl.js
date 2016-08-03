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
        //跳转页面
        $scope.turnPage = function(){
            $(".good_list").hide();
            $(".pro_list").show();
        }
        //对dom直接进行操作

    //    图片查看器
        $scope.lookSelector = function(){
            $(".mask").show();
            $(".showImg").show();
            $(".turnDown").show();
        }
        var slid = $('ul.slide_box li')
        console.info(slid)
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

        //var timer = setInterval(switchi, 3000);

        function options(indexs) {
            slid.addClass('none');
            slid.eq(indexs).removeClass('none');
        }
        $(".list>li").click(function(){
            var index = $(this).index()
            //console.info()
            var $img = $(".slide_box img");
            //获取一组数据中小图片的个数，来判断插入多少张大图；
            var aLiChild = $(this).find(".bx-controls").children();
            //动态插入一组数据，通过索引值的方式插入指定文件夹下面的图片；
            for(var i=0;i<aLiChild.length;i++){
                //通过attr属性改变图片的src路径
                var url = "imgs/show/"+index+"/"+(i+1)+".jpg";
                $img.eq(i).attr('src',url);
            }
        });

        //判断是第几页的内容

        //前进后退的效果
        //如果恒等于0的时候就等于三，执行减操作，执行上一个动作

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
            //clearInterval(timer);
            options(slideindex);
        });
    //    关闭图片选择器
        $scope.closeSelector = function(){
            //$(this).hide();
            $(".mask").hide();
            $(".showImg").hide();
        }


    //获取项目部列表
    Manage.getDeptInfoList().then(function (data) {
        //console.log(data);
        $scope.deptInfoList = data;

    })
    //获取工程列表
    $scope.init = function(){
        var params = {deptId:1,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            //console.info("我是项目统计列表信息",data)
            $scope.trentsCount = data.data;
        });
    }
    $scope.init();

    $scope.childItems = function(id){
        //alert(123)

        Manage.getProjectInfoList(id).then(function (data) {
            //alert(id)
            //console.log("123",data);
            $scope.projectInfoList = data;
        });
        //    获取项目统计列表
        var params = {deptId:id,searchText:""}
        var obj = JSON.stringify(params)
        Manage.getProjectTrends(obj).then(function(data){
            console.info("我是项目统计列表信息",data)
            $scope.trentsCount = data.data;
        });

    }


    //获取动态列表
        $scope.trentsList = function(id){
            //alert(id)
            Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:id,searchKey:"",searchType:""}).then(function(data){
                $scope.trentsListInfo = data.data;
                console.info($scope.trentsListInfo)
            });
            $(".good_list").click(function(){
                alert(123)
                $(".good_list").hide();
                $(".pro_list").show();
            })
        }
    $scope.getProjectList = function (index) {
        $scope.isOpen = !$scope.isOpen;
    }
//        获取项目动态列表的数据

    
       
}]);