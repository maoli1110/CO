'use strict';
bvShare.directive('profit', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }

        }

    };
});

bvShare.directive('profit1', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished1');
                });
            }

        }

    };
});

bvShare.directive('profitSwitch', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinishedSwitch');
                });
            }

        }

    };
});

bvShare.directive('copyRadio', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, ele, attr) {
           
            //var checkObj= angular.element('.sub-nav li');
            ////console.log(checkObj);
            //checkObj.on('click', function () {
            //  if($(this).find(':checkbox').prop('checked')){
            //      $(this).siblings().find(':checkbox').prop('checked',false);
            //      $(this).parent().parent().siblings().find(':checkbox').prop('checked', false);
            //  }
            //})
            //点击新建协作把统计页面给关闭
            $(".new_cooper").click(function(){
                $(".data_count").hide();
            })
            //点击返回按钮关闭当前对话框
            $(".data_back").click(function(){
                $(".data_count").hide();
                $(".table-list.basic-project").show();
                $(".table-list.draft-box").hide();
            })
                    //动态列表图片定位动画
            //$(".list").on("mouseenter",".tools_bar",function(){
            //  $(this).children(".bar").animate({"bottom":'0'})
            //});
            //$(".list").on("mouseleave",".tools_bar",function(){
            //    $(this).children(".bar").animate({"bottom":'-28px'})
            //});

         //   协作首页点击表格编辑状态
         //   $(".table-list>table").on('click','edit-click',function(){
         //       alert(123)
         //       $(this).find(".cop-edit").hide();
         //   })
         //   新建负责人点击选中状态时间委托
            $(".select-person-responsible-modal .person-list").on("click",".checkA",function(){
                $(".user-chioce").hide();
                $(this).find(".user-chioce").show();
            })
         //   新建相关人点击选中事件委托
            $(".select-person-related-modal .left .person-list").on("click",".select-check",function(){
                //删除默认状态
                $('li ').css("background",'#fff')
                $(".user-chioce").hide();
                //给当前获取焦点添加一个样式
                //debugger;
                $(this).find(".user-chioce").show().siblings().find(".user-chioce").hide();
                $(this).css("background",'#eceef0').siblings().css("background","#fff");

            })
            $(".edit-related .left .person-list").on("click",".select-check",function(){
                //删除默认状态
                $('li ').css("background",'#fff')
                $(".user-chioce").hide();
                //给当前获取焦点添加一个样式
                //debugger;
                $(this).find(".user-chioce").show().siblings().find(".user-chioce").hide();
                $(this).css("background",'#eceef0').siblings().css("background","#fff");

            })

        }
    };
});


bvShare.directive('showIcon', function () {
    return {
        restrict: 'AE',
        link: function (scope, ele, attr) {
            //        导航栏效果
            $(".navbar-nav li").click(function(){
                //判断有没有这个class 有的话就删除没有的话就添加toggleClass("navActive")
                $(this).addClass("navActive").siblings().removeClass("navActive");
            })
        }
    };
});

//选中阴影
bvShare.directive('boxShadow', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {

            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('shadowFinsh');
                });
            }
        }
    };
});
bvShare.directive('detail', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {

            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('detailTools');
                });
            }
        }

    };
});

bvShare.directive('showSelect', function($timeout) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
                $timeout(function() {
                    $('.selectpicker').selectpicker({
                        style: '',
                        size: 'auto'
                    });
                },0);
            }
    };
});

bvShare.directive('bvOperation', function($document) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            var rightDistance = document.getElementsByClassName('content_right_bv')[0].offsetWidth;
            var rightDistance1 = document.getElementsByClassName('paly-model')[0].offsetWidth;
            // $("#content_right_bv").ontouchMove(function(){
            //     $('body').css('overflow','hidden');
            // },function(){
            //     $('body').css('overflow','auto');
            // });
            $(".btn_box_bv").click(function(){
            console.log('rightDistance1', rightDistance);
                $(".show_btn").toggleClass("glyphicon-menu-left")
                //toggleClass增加一个class      
                //通过判断这个class的状态来决定是开操作还是关操作
                $(".content_right_bv").toggleClass("menus");
                if($(".content_right_bv").hasClass("menus")){
                    $('body').css('overflow-y','hidden');
                    $('body').css('position','fixed');
                    $(".btn_box_bv").animate({right:rightDistance})
                    $(".content_right_bv").animate({right:"0"})
                    $(".glyphicon-menu-right").css("display",'inline-block');
                    $(".mobile-mark").show();

                }else{
                    $('body').css('overflow-y','auto');
                    $('body').css('position','');
                     $(".btn_box_bv").animate({"right":"0"});
                     $(".content_right_bv").animate({"right": -rightDistance});
                    $(".glyphicon-menu-right").css('display','none');
                    $(".mobile-mark").hide();
                }
              });
            $('.mobile-mark').click(function() {
                $(".show_btn").toggleClass("glyphicon-menu-left")
                //toggleClass增加一个class      
                        //通过判断这个class的状态来决定是开操作还是关操作
                        $(".content_right_bv").toggleClass("menus");
                if($(".content_right_bv").hasClass("menus")){
                    $('body').css('overflow-y','hidden');
                    $('body').css('position','fixed');
                    $(".btn_box_bv").animate({right:rightDistance})
                    $(".content_right_bv").animate({right:"0"})
                    $(".glyphicon-menu-right").css("display",'inline-block');
                    $(".mobile-mark").show();

                }else{
                    $('body').css('overflow-y','auto');
                     $('body').css('position','');
                     $(".btn_box_bv").animate({"right":"0"});
                     $(".content_right_bv").animate({"right": -rightDistance});
                    $(".glyphicon-menu-right").css('display','none');
                    $(".mobile-mark").hide();
                }
            });
        }
    };
});
//$(" #content-a3").height($(window).height()-125)
window.onresize = function(){
    $(" #content-a3").height($(window).height()-52);
    $(" #content-b1").height($(window).height()-52);
}
