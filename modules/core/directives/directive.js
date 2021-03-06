'use strict';
angular.module('core').directive('profit', function($timeout) {
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

angular.module('core').directive('colistRepeatFinished', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('colistRepeatFinished');
                });
            }

        }

    };
});



angular.module('core').directive('profitDept', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinishedDept');
                });
            }

        }

    };
});

angular.module('core').directive('profitSwitch', function($timeout) {
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

angular.module('core').directive('getCooperlist', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
        	element.bind('click',function(){
        		debugger;
        	})
        }

    };
});

angular.module('core').directive('copyRadio', function ($timeout) {
    return {
		restrict: 'AE',
		link: function (scope, ele, attr) {
           
			//var checkObj= angular.element('.sub-nav li');
			////console.log(checkObj);
			//checkObj.on('click', function () {
			//	if($(this).find(':checkbox').prop('checked')){
			//		$(this).siblings().find(':checkbox').prop('checked',false);
			//		$(this).parent().parent().siblings().find(':checkbox').prop('checked', false);
			//	}
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
            //	$(this).children(".bar").animate({"bottom":'0'})
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
            //新建相关人点击选中事件委托
            $(".select-person-related-modal .left .person-list").on("click",".select-check",function(){
                //删除默认状态
                $('li ').css("background",'#fff')
                // $(".user-chioce").hide();
                //给当前获取焦点添加一个样式
                //debugger;
                // $(this).find(".user-chioce").show().siblings().find(".user-chioce").hide();
                // $(this).css("background",'#eceef0').siblings().css("background","#fff");
                $(this).find(".user-chioce").show();
                $(this).css("background",'#eceef0');

            });
            //编辑页面
            $(".edit-related .left .person-list").on("click",".select-check",function(){
                //删除默认状态
                $('li ').css("background",'#fff')
                // $(".user-chioce").hide();
                //给当前获取焦点添加一个样式
                //debugger;
                // $(this).find(".user-chioce").show().siblings().find(".user-chioce").hide();
                // $(this).css("background",'#eceef0').siblings().css("background","#fff");
                $(this).find(".user-chioce").show();
                $(this).css("background",'#eceef0');

            })


		}
	};
});

angular.module('core').directive('showIcon', function () {
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

angular.module('core').directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
//滚动条
angular.module('core').directive('scrollDirective', function () {
        return {
            restrict: 'AE',
            link: function (scope, ele, attr) {

                var sideHeight = $(window).height()-124;
               $("#content-a2").mCustomScrollbar({
                   mouseWheelPixels:200,
                   scrollAmount:10,
                   scrollSpeed:10,
                    theme:"minimal"
                });
                $("#content-a3").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                     setHeight:$(window).height()-52,
                    theme:"minimal"
                });
                $("#content-a4").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a5").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a6").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a7").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a8").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a9").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a10").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    theme:"minimal"
                });
                $("#content-a11").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a12").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a13").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a14").mCustomScrollbar({
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-a15").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    theme:"minimal"
                });
                $("#content-a16").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    theme:"minimal"
                });
                $("#detail-1").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    theme:"minimal"
                });
                //$("#content-a3").mCustomScrollbar({
                //    theme:"minimal"
                //});
                $("#content-b1").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:5,
                    setHeight:$(window).height()-52,
                    theme:"minimal",
                    advanced:{
                        updateOnBrowserResize:false
                    }
                });
                $("#content-b2").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,
                    setHeight:sideHeight,
                    theme:"minimal"
                });

                $("#statistic_marker").mCustomScrollbar({
                    mouseWheelPixels:200,
                    scrollAmount:10,
                    scrollSpeed:10,// 统计页面--标识
                    setHeight:240,
                    theme:"minimal"
                });
                
                $("#content-b7").mCustomScrollbar({
                    setHeight:sideHeight,
                    theme:"minimal"
                });
                $("#content-b8").mCustomScrollbar({
                    theme:"minimal"
                });


                //});

            }
        };
    });
//搜索部分搜索关键字高亮显示
angular.module('core').directive('lightHeight', function () {
    return {
        restrict: 'AE',
        link: function (scope, ele, attr) {
            //$(window).load(function(){
            //    console.log('22222');

            jQuery.fn.highlight = function(pat) {
                function innerHighlight(node, pat) {
                    var skip = 0;
                    if (node.nodeType == 3) {
                        var pos = node.data.toUpperCase().indexOf(pat);
                        if (pos >= 0) {
                            var spannode = document.createElement('span');
                            spannode.className = 'highlight';
                            var middlebit = node.splitText(pos);
                            var endbit = middlebit.splitText(pat.length);
                            var middleclone = middlebit.cloneNode(true);
                            spannode.appendChild(middleclone);
                            middlebit.parentNode.replaceChild(spannode, middlebit);
                            skip = 1;
                        }
                    }
                    else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                        for (var i = 0; i < node.childNodes.length; ++i) {
                            i += innerHighlight(node.childNodes[i], pat);
                        }
                    }
                    return skip;
                }
                return this.each(function() {
                    innerHighlight(this, pat.toUpperCase());
                });
            };
            jQuery.fn.removeHighlight = function() {
                function newNormalize(node) {
                    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
                        var child = children[i];
                        if (child.nodeType == 1) {
                            newNormalize(child);
                            continue;
                        }
                        if (child.nodeType != 3) { continue; }
                        var next = child.nextSibling;
                        if (next == null || next.nodeType != 3) { continue; }
                        var combined_text = child.nodeValue + next.nodeValue;
                        var new_node = node.ownerDocument.createTextNode(combined_text);
                        node.insertBefore(new_node, child);
                        node.removeChild(child);
                        node.removeChild(next);
                        i--;
                        nodeCount--;
                    }
                }
                return this.find("span.highlight").each(function() {
                    var thisParent = this.parentNode;
                    thisParent.replaceChild(this.firstChild, this);
                    newNormalize(thisParent);
                }).end();
            };



            //$('#exampleInputName2').bind('keyup change', function(ev) {
            //    // pull in the new value
            //    var searchTerm = $(this).val();
            //    // remove any old highlighted terms
            //    $('.project_name').removeHighlight();
            //    // disable highlighting if empty
            //    if ( searchTerm) {
            //    // highlight the new term
            //        $('.project_name').highlight( searchTerm );
            //    }
            //});
            //
            //
            //
            //$('#exampleInputName3').bind('keyup change', function(ev) {
            //    // pull in the new value
            //    var searchTerm = $(this).val();
            //    // remove any old highlighted terms
            //    $('.menName').removeHighlight();
            //    // disable highlighting if empty
            //    if (searchTerm) {
            //        // highlight the new term
            //        $('.menName').highlight( searchTerm );
            //    }
            //});
            //// be高亮搜索
            //$('#linkbeSear').bind('keyup change', function(ev) {
            //    // pull in the new value
            //    var searchTerm = $(this).val();
            //    // remove any old highlighted terms
            //    $('.linkbeMatter').removeHighlight();
            //    // disable highlighting if empty
            //    if ( searchTerm ) {
            //        // highlight the new term
            //        $('.linkbeMatter').highlight( searchTerm );
            //    }
            //});
        }
    };
});
//选中阴影
angular.module('core').directive('boxShadow', function($timeout) {
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
angular.module('core').directive('detail', function($timeout) {
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

angular.module('core').directive('attrSelect', function($timeout) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
                $timeout(function() {
                   $('.selectpicker').selectpicker({
                      style: 'btn-default',
                      width: '102px'
                    });
                },0);
            }
    };
});

angular.module('core').directive('showSelect', function($timeout) {
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

angular.module('core').directive('pcOperation', function() {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            $(".btn_box_pc").click(function(){
                $(".show_btn").toggleClass("glyphicon-menu-left")
                //toggleClass增加一个class      
                //通过判断这个class的状态来决定是开操作还是关操作
                $(".content_right_pc").toggleClass("menus");
                if($(".content_right_pc").hasClass("menus")){
                    $('body').css('overflow-y','hidden');
                    $(".btn_box_pc").animate({right:"260px"})
                    $(".content_right_pc").animate({right:"0"})
                    $(".glyphicon-menu-right").css("display",'inline-block');
                    $(".mobile-mark").show();

                }else{
                    $('body').css('overflow-y','auto');
                     $(".btn_box_pc").animate({"right":"0"});
                     $(".content_right_pc").animate({"right":"-260px"});
                    $(".glyphicon-menu-right").css('display','none');
                    $(".mobile-mark").hide();
                }
              });
            $('.mobile-mark').click(function() {
                 $(".show_btn").toggleClass("glyphicon-menu-left")
                //toggleClass增加一个class      
                //通过判断这个class的状态来决定是开操作还是关操作
                $(".content_right_pc").toggleClass("menus");
                if($(".content_right_pc").hasClass("menus")){
                    $('body').css('overflow-y','hidden');
                    $(".btn_box_pc").animate({right:"260px"})
                    $(".content_right_pc").animate({right:"0"})
                    $(".glyphicon-menu-right").css("display",'inline-block');
                    $(".mobile-mark").show();

                }else{
                    $('body').css('overflow-y','auto');
                     $(".btn_box_pc").animate({"right":"0"});
                     $(".content_right_pc").animate({"right":"-260px"});
                    $(".glyphicon-menu-right").css('display','none');
                    $(".mobile-mark").hide();
                }
            });
        }
    };
});

angular.module('core').directive('bvOperation', function($document) {
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

//window-reize窗口大小变动
angular.module('core').directive('windowResize', function($document,$window) {
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            scope.onResize = function() {
                //当前combobox
                if(!$('.comboBox').outerHeight()) return;
               var currentTaleHeight1 = document.documentElement.clientHeight - 110 - $('.comboBox').outerHeight()-48;
                $('.content-container').height(currentTaleHeight1);
            }
            scope.onResize();
            angular.element($window).bind('resize', function() {
                scope.onResize();
            })
        }
    };
});

//$(" #content-a3").height($(window).height()-125)
window.onresize = function(){
    $(" #content-a3").height($(window).height()-52);
    $(" #content-b1").height($(window).height()-52);
}
    //模态框可拖动的指令
angular.module('core').directive('draggable', ['$document', function($document) {
        return function(scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            element= angular.element(document.getElementsByClassName("modal-dialog"));
            element.css({
                position: 'relative',
                cursor: 'move'
            });

            element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    }]);