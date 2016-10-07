/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	// 注册核心模块
	ApplicationConfiguration.registerModule('core');

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('core').config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/manage');
	
			$stateProvider.
			 state('login', {
				url:"/",
				templateUrl: 'template/core/login.html',
				data: {
					displayName: 'login'
				}
			});
		}
	]);

/***/ },
/* 14 */
/***/ function(module, exports) {

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
	            $(".list").on("mouseenter",".tools_bar",function(){
	            	$(this).children(".bar").animate({"bottom":'0'})
	            });
	            $(".list").on("mouseleave",".tools_bar",function(){
	                $(this).children(".bar").animate({"bottom":'-28px'})
	            });
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
	                     setHeight:$(window).height(),
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
	                    setHeight:sideHeight,
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
	                //$("#content-a3").mCustomScrollbar({
	                //    theme:"minimal"
	                //});
	                $("#content-b1").mCustomScrollbar({
	                    mouseWheelPixels:200,
	                    scrollAmount:10,
	                    scrollSpeed:5,
	                    setHeight:'90%',
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
	
	angular.module('core').directive('showSelect', function($timeout) {
	    return {
	        restrict: 'AE',
	        link: function(scope, element, attr) {
	                $('.identify').addClass('selectpicker');
	                $timeout(function() {
	                    $('.selectpicker').selectpicker({
	                        style: '',
	                        size: 'auto'
	                    });
	                }, 300);
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
	                    $(".btn_box_pc").animate({right:"260px"})
	                    $(".content_right_pc").animate({right:"0"})
	                    $(".glyphicon-menu-right").css("display",'inline-block');
	                    $(".mobile-mark").show();
	
	                }else{
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
	
	            $(".btn_box_bv").click(function(){
	            console.log('rightDistance1', rightDistance);
	                $(".show_btn").toggleClass("glyphicon-menu-left")
	                //toggleClass增加一个class      
	                        //通过判断这个class的状态来决定是开操作还是关操作
	                        $(".content_right_bv").toggleClass("menus");
	                if($(".content_right_bv").hasClass("menus")){
	
	                    $(".btn_box_bv").animate({right:rightDistance})
	                    $(".content_right_bv").animate({right:"0"})
	                    $(".glyphicon-menu-right").css("display",'inline-block');
	                    $(".mobile-mark").show();
	
	                }else{
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
	
	                    $(".btn_box_bv").animate({right:rightDistance})
	                    $(".content_right_bv").animate({right:"0"})
	                    $(".glyphicon-menu-right").css("display",'inline-block');
	                    $(".mobile-mark").show();
	
	                }else{
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
	    $(" #content-a3").height($(window).height()-125);
	}
	//angular.module('core').directive('canvas', function($timeout) {
	//    return {
	//        restrict: 'AE',
	//        link: function(scope, element, attr) {
	//
	//        }
	//    };
	//});

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('core').directive('niceScroll', function () {
	    return {
	        restrict: 'AE',
	        link: function (scope, ele, attr) {
	
	          
	
	                $('.sider-bar').niceScroll({cursorborderradius:"5px",cursorcolor:"#00F"})
	
	
	        }
	    };
	});
	
	angular.module('core').directive('scrollcDirective1', function () {
	        return {
	            restrict: 'AE',
	            link: function (scope, ele, attr) {
	                
	
	                    $("#content-1").mCustomScrollbar({
	                        theme:"minimal"
	                    });
	                    $("#content-2").mCustomScrollbar({
	                        theme:"minimal"
	                    });
	                    $("#content-3").mCustomScrollbar({
	                        theme:"minimal"
	                    });
	                    $("#content-4").mCustomScrollbar({
	                        theme:"minimal"
	                    });
	                    $("#content-9").mCustomScrollbar({
	                        theme:"minimal"
	                    });
	   
	            }
	        };
	    });

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 通用方法
	 */
	angular.module('core').service('Common', function () {
	
		var self = this;
	
		// 补零
		this.zero = function (num) {
			num = num < 10 ? "0" + num : num;
	        return num;
		};
	
		this.createTimeList = function (arr) {
			var i = 0,
	            start = ":00:00",
	            end = ":59:59";
	        while (i < 24) {
	            var num = self.zero(i);
	            arr.push({
	                start: num + start,
	                end: num + end
	            });
	            i++;
	        }
		};
	
	    this.dateFormat = function (date) {
	        var dateStr = date.getFullYear() + "-" + self.zero(date.getMonth() + 1) + "-" + self.zero(date.getDate()) + " " + self.zero(date.getHours()) + ":" + self.zero(date.getMinutes()) + ":" + self.zero(date.getSeconds());
	        return dateStr;
	    };
	
	    this.dateFormat1 = function (date) {
	        var dateStr = date.getFullYear() + "-" + self.zero(date.getMonth() + 1) + "-" + self.zero(date.getDate());
	        return dateStr;
	    };
	});

/***/ },
/* 17 */
/***/ function(module, exports) {

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
	 

/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Created by sdergt on 2016/8/24.
	 */
	angular.module("core").service("headerService",function($http,$q){
	    var headerService = {};
	
	    // 获取头部菜单数据
	    headerService.enterpriseInfoList = function(params){
	        var url_join = "/bimco/rs/co/enterpriseInfoList";
	        var delay = $q.defer();
	        var obj = JSON.stringify(params);
	        $http.post(url_join,obj,{transformRequest:angular.identity}).then(function(data){
	            delay.resolve(data);
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	    
	    headerService.currentUserInfo = function () {
	        var delay = $q.defer();
	        var url_join= "/bimco/rs/co/userInfo";
	        $http.get(url_join,{cache:true})
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    };
	    
	    return headerService;
	})

/***/ },
/* 19 */
/***/ function(module, exports) {

	ApplicationConfiguration.registerModule('manage');

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('core').config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/manage');
	
			$stateProvider.
			 state('manage', {
				url:"/manage",
				templateUrl: 'template/manage/manage.html',
				controller: 'manageCtrl',
				data: {
					displayName: 'manage'
				},
				params: {
					'deptId': null,
					'ppid': null
				}
			});
			// .state('home.part', {
			// 	'url':"/part",
			// 	templateUrl: 'template/home/part.html',
			// 	controller: 'homeCtrl',
			// 	data: {
			// 		displayName: 'part'
			// 	}
			// })
			// .state('home.all', {
			// 	'url': "/all",
			// 	templateUrl: 'template/home/all.html',
			// 	controller: 'allCtrl',
			// 	data: {
			// 		displayName: 'all'
			// 	}
			// });
		}
	]);

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 协作管理
	 */
	angular.module('manage').controller('manageCtrl', ['$scope', '$http', '$uibModal', '$state','FileUploader','Manage','$stateParams',
	    function ($scope, $http, $uibModal, $state, FileUploader,Manage,$stateParams) {
		var firstreackflag = true;//进入页面只加载一次定位
		var firstdeptid; //第一个项目部id
	    var searchId = $stateParams.ppid?$stateParams.ppid:'';//工程ppid
		var deptId = $stateParams.deptId?$stateParams.deptId:'';
		var changeProj = false;
		$scope.docType = "1";
	    $scope.deptInfoList = [];
	    $scope.projectInfoList = [];
	    $scope.openSignal = false;
	    $scope.isNoSearchValue = false;//搜索无工程
	    $scope.isNoSearchValueBook = false;//搜索资料
	    $scope.isNoSearchValueReject = false;//搜索无结果
	    $scope.openNew = function () {
	    	$scope.openSignal = true;
	    }
	
	    $scope.closeNew = function () {
	    	$scope.openSignal = false;
	    }
	
	    $scope.trans = function () {
	    	var url = $state.href('newcopper', {parameter: "parameter"});
			window.open(url,'_blank');
	    }
	    //加载更多
	    var moreTrents;
	    var searchBox = $("#exampleInputName2").val();//项目部下面的工程搜索参数
	    //获取项目部列表
	    Manage.getDeptInfoList().then(function (data) {
	        $scope.deptInfoList = data;
	        if(!deptId){
	        	 firstdeptid = data[0].deptId;
	        }
	    })
	
	    $scope.initScrollend = function(id){
	          //如果当前企业和切换的企业id不一样，初始化$scope.scrollend
	          if(searchId != id){
	                $scope.scrollend = false;
	                lastUploadTime = '';
	                lastUsername = '';
	            }
	     }
	  
	    //点击项目部追加工程列表，并且绑定click事件
	    function getimgurl(treeItems,deptId){
	    	$("#dept_"+deptId).empty();
			for(var i = 0 ; i< treeItems.length;i++){
				if(treeItems[i].projectType=="土建预算"){
					treeItems[i].imgsrc="imgs/icon/1.png";
				}else if(treeItems[i].projectType=="钢筋预算"){
					treeItems[i].imgsrc="imgs/icon/2.png";
				}else if(treeItems[i].projectType=="安装预算"){
					treeItems[i].imgsrc="imgs/icon/3.png";
				}else if(treeItems[i].projectType=="Revit"){
					treeItems[i].imgsrc="imgs/icon/4.png";
				}else if(treeItems[i].projectType=="Tekla"){
					treeItems[i].imgsrc="imgs/icon/5.png";
				};
				$("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>"+treeItems[i].projectName+"</span>&nbsp;<b class='coop-countElement'>("+treeItems[i].count+")</b></span>")
	        }
			
			$("span[id^='projectbutton_']").bind("click", function(){
	             $(".manage-menus").removeClass("menusActive");
			   	  $("span").removeClass("menusActive");
			        //获取当前元素
			   	  $(this).addClass("menusActive").siblings().removeClass("menusActive");
			   	  $(" .data_count").hide();
	              $scope.trentsListInfo = [];
	              changeProj = true;
			   	  $scope.trentsList($(this).attr("id").split("_")[1]);
			});
		}
	    
	    //获取项目部下的工程列表
	    $scope.childItems = function(id,$event,open){
	        var searchBox = $("#exampleInputName2").val();
	        $(".good_list").show();
	        $(".pro_list").hide();
	        $(".goodlist_left").show();
	        $(".prolist_left").hide();
	        $('.manage-menus').removeClass('menusActive');
	        $("span.spanwidth").removeClass("menusActive");
	        if( $scope.isNoSearchValue){
	            $(".good_list").css({'display':'none'});
	        }
	        if(!open){
	        	Manage.getProjectInfoList(id).then(function (data) {
	            	getimgurl(data,id);
	            });
	            deptId = id;
	            //获取项目统计列表
	            var params = {deptId:id,searchText:searchBox};
	            var obj = JSON.stringify(params);
	            Manage.getProjectTrends(obj).then(function(data){
	                $scope.trentsCount = data.data;
	               if(data.data.length==0){
	                    $scope.isNoSearchValue = true;
	                    $(".good_list").css({'display':'none'});
	                }else{
	                   $scope.isNoSearchValue = false;
	                   $(".good_list").css({'display':'block'})
	               }
	            });
	        }
	        if(!deptId){
	            deptId = deptId;
	        }
	        if(deptId != deptId ){
	           deptId = deptId;
	        }
	    }
	        //项目统计列表搜索功能
	        //搜索功能
	        $scope.searchProject = function(deptId,searchBox){
	            var params = {deptId:deptId,searchText:searchBox};
	            var obj = JSON.stringify(params);
	            Manage.getProjectTrends(obj).then(function(data){
	                $scope.trentsCount = data.data;
	                //setTimeout(addProjectStyle,100);
	                if($scope.trentsCount.length==0){
	                    $scope.isNoSearchValue = true;
	                    $(".good_list").css({'display':'none'})
	                }else{
	                    $scope.isNoSearchValue = false;
	                    $(".good_list").css({'display':'block'})
	                }
	            });
	        }
	        $scope.getDeptId = function(){
	            if(!deptId){
	                 deptId = firstdeptid;
	            }
	            else{
	                 deptId = deptId;
	            }
	            var searchBox = $("#exampleInputName2").val();
	            if(searchBox.length>0){
	                $scope.searchProject(deptId,searchBox);
	
	            }else if(searchBox.length==0){
	                if(!deptId){
	                    deptId = firstdeptid;
	                }else{
	                    deptId = deptId;
	                }
	                searchBox='';
	                $scope.searchProject(deptId,searchBox);
	
	            }
	        }
	
	        function addProjectStyle(){
	            var searchTerm = $("#exampleInputName2").val();
	            $('.project_name').removeHighlight();
	            if (searchTerm) {
	                $('.project_name').highlight(searchTerm);
	            }
	        }
	        function addEpcStyle(){
	            var searchTerm = $("#exampleInputName3").val();
	            $('.menName').removeHighlight();
	            if (searchTerm) {
	                $('.menName').highlight(searchTerm);
	            }
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
	                clearInterval(timer);
	                options(slideindex);
	            });
	            $('ul > li >.bx-controls >.img_list>.tools_bar>.bookSection').click(function(){
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
	         
	            //下载弹出遮罩层和下载进度
	            $(".pro-down").click(function(){
	                $(".tools_bar>.pro_mask").animate({top:0});
	                $(".bar").hide();
	            })
	            $(".proName").click(function(){
	                if($(this).find(".panel-body").height()<=20){
	                    //alert("子元素为空，没有子元素");
	                    $(this).find(".panel-body").css("padding-bottom",'0px')
	                }
	            })
	            $(".manage-menus").bind("click", function(){
	                $("manage-menus").removeClass("menusActive");
	                //获取当前元素
	                $(this).addClass("menusActive").siblings().removeClass("menusActive");
	            });
	
	        });
	
	        //动态列表搜索关键字
	        $scope.trentsSearch = function(seacherKey){
	            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:seacherKey,searchType:$scope.docType}).then(function(data){
	                $scope.trentsListInfo = data.data;
	                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
	                angular.forEach(data.data, function (value, key) {
	                    angular.forEach(value.docs, function (value1, key1) {
	                        if(typeArr.indexOf(value1.fileType) == -1) {
	                            $scope.trentsListInfo[key].docs[key1].fileType = 'other';
	                            console.log( $scope.trentsListInfo[key].docs[key1].fileType );
	                        }
	                    });
	                });
	                //setTimeout(addEpcStyle,100);
	                if(data.data.length==0 ){
	                    $scope.isNoSearchValueReject =true;
	                    $('.pro_list').css('display','none');
	                }else{
	                    $scope.isNoSearchValueReject =false;
	                    $('.pro_list').css('display','block');
	                }
	            });
	        }
	        $scope.manageSeacher = function(){
	            //获取搜索类型关键字
	            $scope.trentsListInfo=[];
	            $scope.seacherKey = $("#exampleInputName3").val();
	            if(!$scope.docType){
	                $scope.docType="1";
	            }else{
	                $scope.docType=$scope.docType;
	            }
	            $scope.trentsSearch( $scope.seacherKey)
	        }
	
	        $scope.changeAttr = function (docType) {
	            $scope.trentsListInfo = [];
	            $scope.seacherKey = $("#exampleInputName3").val();
	            if(!$scope.docType){
	                $scope.docType=1;
	            }else{
	                $scope.docType=$scope.docType;
	            }
	            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
	                $scope.trentsListInfo = data.data;
	                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
	                angular.forEach(data.data, function (value, key) {
	                    angular.forEach(value.docs, function (value1, key1) {
	                        if(typeArr.indexOf(value1.fileType) == -1) {
	                            $scope.trentsListInfo[key].docs[key1].fileType = 'other';
	                            console.log( 'qqqqq',$scope.trentsListInfo[key].docs[key1].fileType );
	                        }
	                    });
	                });
	                //setTimeout(addEpcStyle,100);
	                if(data.data.length==0){
	                    $scope.isNoSearchValueReject = true;
	                    $('.pro_list').css('display','none')
	                }else{
	                    $scope.isNoSearchValueReject =false;
	                    $('.pro_list').css('display','block')
	                }
	            });
	            //Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
	            //    $scope.trentsListInfo = data.data;
	            //});
	        }
	        //判断是否按下enter键进行搜索（动态工程列表页面）
	        //工程列表enter键搜索
	        $("#exampleInputName2").val();
	        $scope.previewList = function(e){
	            var keyCode = e.keyCode|| e.which;
	            if($("#exampleInputName2").val()!="" && keyCode==13){
	                $scope.getDeptId();
	            }else if($("#exampleInputName2").val()==''){
	                $scope.trentsCount=[];
	                searchBox = $("#exampleInputName2").val();
	                searchBox=''
	                if(!deptId){
	                    deptId = firstdeptid;
	                }else{
	                    deptId = deptId;
	                }
	                $scope.searchProject(deptId,searchBox);
	            }
	        }
	        //判断是否按下enter键进行搜索（动态工程动态列表页面）
	        //工程动态列表enter键搜索
	        $scope.keyUp = function(e){
	            var keyCode = e.keyCode|| e.which;
	            if($("#exampleInputName3").val()!="" && keyCode==13){
	                $scope.seacherKey = $("#exampleInputName3").val();
	                $scope.manageSeacher();
	            }else if($("#exampleInputName3").val()==''){
	                var searchValue = $("#exampleInputName3").val();
	                searchValue='';
	                $scope.trentsListInfo=[];
	                $scope.trentsSearch(searchValue)
	            }
	        }
	        /*滚动加载只防止多次提交请求问题start*/
	        //可以查询
	        var searchFlag;
	        var pollingFlag = true;
	        var checkSearchInterval;
	        //搜索高亮显示
	        $scope.addMoreData = function (){
	        	if(!changeProj){
	        		setSearchFlagFalse();
	                if(pollingFlag){
	                    pollingFlag = false;
	                    checkSearchInterval = setInterval(function() {checkCanSearch()},100);
	         		}
	         		setTimeout(function() {setSearchFlagTrue()},150);
	        	}else{
	        		changeProj = false;
	        	}
	            
	        };
	        var setSearchFlagFalse = function(){
	        	console.log(false);
	            searchFlag = false;
	        }
	        var setSearchFlagTrue = function(){
	        	console.log(true);
	            searchFlag = true;
	        }
	        var checkCanSearch = function(){
	        	console.log("轮询");
	            if(searchFlag){
	            	console.log("chaxun");
	                clearInterval(checkSearchInterval);
	                $scope.trentsList(searchId);
	                pollingFlag = true;
	            }
	        }
	        /*滚动加载只防止多次提交请求问题end*/
	        var lastUploadTime; //下一次请求的时间 第一次没有值
	        var lastUsername;//下一次请求的用户名 第一次没有值
	        $scope.trentsListInfo=[];
	        $scope.scrollend= false;
	        //点击右侧列表获取动态列表
	        $scope.turnPage = function(id){
	            $("span[id='projectbutton_"+id+"']").click();
	        }
	        //通过侧边栏的子元素去调出动态列表
	        $scope.trentsList = function(id) {
	            //如过却换工程 scrollend需要初始化设置
	            $(".manage-menus").removeClass("menusActive");
	            //$scope.initScrollend(id);
	            if(changeProj){
	            	 $scope.scrollend = false;
	                 lastUploadTime = '';
	                 lastUsername = '';
	                 //changeProj = false;
	            }
	        	if(!id){
	        		console.log("无id,查询失败");
	        		return;
	        	}
	            searchId = id;
	            $(".good_list").hide();
	            $(".pro_list").show();
	            $(".goodlist_left").hide();
	            $(".prolist_left").show();
	            var createindex = layer.load(1, {
	                shade: [0.1,'#000'] //0.1透明度的黑色背景
	            });
	            $scope.seacherKey = $("#exampleInputName3").val();
	            if(!$scope.docType){
	                $scope.docType =1;
	            }else{
	                $scope.docType = $scope.docType;
	            }
	            Manage.getTrends({
	                count:10,
	                lastUploadTime:lastUploadTime,
	                lastUsername:lastUsername,
	                ppid: id,
	                searchKey:$scope.seacherKey,
	                searchType:$scope.docType
	            }).then(function (data) {
	            	var size = 0;
	                if(data.data.length==0){
	                    $(".pro_list").css('display','none');
	                    $scope.isNoSearchValueReject = true;
	                } else{
	                    $(".pro_list").css('display','block');
	                    $scope.isNoSearchValueReject = false;
	                }
	                if(data.data.length!=0){
	                    for(var i=0 ;i<data.data.length;i++){
	                    	size++;
	                        $scope.trentsListInfo.push(data.data[i])
	                    }
	                    lastUploadTime = data.data[data.data.length-1].updateTime;
	                    lastUsername = data.data[data.data.length-1].username;
	                    console.info('动态详情列表',$scope.trentsListInfo)
	                }
	                if(data.data.length<10){
	                    $scope.scrollend = true;
	                }
	               // debugger;
	                var lh = 0;
	                if($scope.trentsListInfo.length > 10){
	                	lh = $scope.trentsListInfo.length - size;
	                }
	                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
	                angular.forEach(data.data, function (value, key) {
	                    angular.forEach(value.docs, function (value1, key1) {
	                        if(typeArr.indexOf(value1.fileType) == -1) {
	                        	var keys = lh + key;
	                            $scope.trentsListInfo[keys].docs[key1].fileType = 'other';
	                            //console.log( '格式数组',$scope.trentsListInfo[keys].docs[key1].fileType );
	                        }
	                    });
	                });
	                layer.close(createindex);
	            });
	            $scope.id = id;
	        }
	
	
	    $scope.getProjectList = function (index) {
	        $scope.isOpen = !$scope.isOpen;
	    }
	        //通过动态列表的图片获取大图的资源路径
	        $scope.transformBig = function(uuid,docName,isPreview){
	            var data ={fileName:docName,uuid:uuid};
	            if(isPreview == false){
	                alert('该文件暂不支持预览')
	                return;
	            }
	            Manage.getTrendsFileViewUrl(data).then(function (result) {
	                $scope.previewimg = result;
	                layer.open({
	                        type: 2,
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
	        //回退按钮关闭列表页面
	        $scope.listBack = function(){
	            $(".good_list").show();
	            $(".pro_list").hide();
	            $(".goodlist_left").show();
	            $(".prolist_left").hide();
	           $state.go('manage',{'deptId':deptId,'ppid':searchId},{ location: 'replace'});
	        }
	
	        //更新资料和选中模块加阴影效果
	        $scope.$on('shadowFinsh', function (ngRepeatFinishedEvent) {
	            $scope.updataBook = function(adds){
	                adds = adds;
	                if(adds>0){
	                    adds--
	                }
	                $(".good_list dl").click(function(){
	                    $(this).find(".updateNub").text(adds);
	                    $(this).addClass("dlActive").siblings().removeClass("dlActive")
	                })
	            }
	        })
	        
	        $scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){
		    	if(firstreackflag){
					//获取列表里面第一个项目部
					if(deptId){
						$("#deptbutton_"+deptId).click();
					}else{
						$("#deptbutton_"+firstdeptid).click();
					}
					firstreackflag = false;
				}
			})
	
	        //服务器时间
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

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('manage').service('Manage', function ($http, $q) {
	
	    //var trendUrl = ApplicationConfiguration.urls.trendUrl?ApplicationConfiguration.urls.trendUrl:"";
	    var trendUrl = basePath;
	    //trendUrl="http://172.16.21.69:8080/bimco";
	    /**
	     *获取项目部列表
	     */
	    this.getDeptInfoList = function () {
	        var delay = $q.defer();
	        var url_join = trendUrl + 'rs/trends/deptInfoList';
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	                //console.info(data)
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    };
	
	    this.getProjectInfoList = function (params) {
	
	        var delay = $q.defer();
	        var url_join = trendUrl + 'rs/trends/projectInfoList/' + params;
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	//    获取项目动态统计
	    this.getProjectTrends = function(obj){
	        var delay = $q.defer();
	        var url_join = trendUrl+"rs/trends/projectTrends";
	        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data)
	        },function(data){
	            delay.resolve(data)
	        })
	        return delay.promise;
	    }
	
	
	    //静态数据
	    //var param = {
	    //    count:10,
	    //    lastUploadTime:"",
	    //    lastUsername:"",
	    //    ppid:1000,
	    //    searchKey:"",
	    //    searchType:""
	    //};
	//    获取动态列表
	    this.getTrends = function(params){
	        var delay = $q.defer();
	        var url_join = trendUrl+"rs/trends/trends";
	        var obj = JSON.stringify(params);
	//        console.log(obj);
	        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	            //console.info(data)
	        },function(data){
	            delay.reject(data)
	        })
	        return delay.promise;
	    }
	
	
	//    获取大图效果（获取资料地址）
	//    getTrendsFileViewUrl
	    this.getTrendsFileViewUrl = function(params){
	        var params = JSON.stringify(params);
	        var delay = $q.defer();
	        var url_join = trendUrl+ "rs/trends/viewUrl";
	        $http.post(url_join,params,{transformRequest: angular.identity, transformResponse: angular.identity}).success(function(data){
	           delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    //系统时间
	    this.getCurrentDate = function () {
	        var cDate = new Date();
	        //console.info($scope.date)
	        var cYear = cDate.getFullYear();
	        var cMouth = cDate.getMonth()+1;
	        var cDay = cDate.getDate();
	        var cWeekday=new Array(7);
	        cWeekday[0]="星期日";
	        cWeekday[1]="星期一";
	        cWeekday[2]="星期二";
	        cWeekday[3]="星期三";
	        cWeekday[4]="星期四";
	        cWeekday[5]="星期五";
	        cWeekday[6]="星期六";
	       var currentDate =  cYear+"年"+ cMouth+"月"+cDay+"日"+cWeekday[cDate.getDay()];
	       return currentDate;
	    }
	//    获取服务器时间
	    this.getTrendsSystem = function(params){
	        var delay = $q.defer();
	        var url_join = trendUrl+"rs/trends/system";
	        var obj = JSON.stringify(params);
	        $http.get(url_join,obj,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	});

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	// 注册核心模块
	ApplicationConfiguration.registerModule('cooperation');

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('core').config(['$stateProvider', '$urlRouterProvider','$locationProvider',
		function($stateProvider, $urlRouterProvider,$locationProvider) {
			
			$urlRouterProvider.otherwise('/cooperation');
	
			$stateProvider.
			 state('cooperation', {
				url:"/cooperation?deptId&ppid",
				templateUrl: 'template/cooperation/cooperation.html',
				controller: 'coopreationCtrl',
				data: {
					displayName: 'cooperation'
				},
				params: {
					'deptId': null,
					'ppid': null,
					'status':null,
					'transignal': null
				}
			})
			.state('newcopper', {
				'url':"/newcopper?typeid",
				templateUrl: 'template/cooperation/newcopper.html',
				controller: 'newcoopreationCtrl',
				data: {
					displayName: 'newcopper'
				},
				params:{
					typeid:null,
					typename:null,
					deptId:null,
					ppid:null,
					deptName:null,
					ppidName:null
				}
			})
			.state('coopdetail', {
				'url':"/coopdetail/?coid",
				templateUrl: 'template/cooperation/coop_detail.html',
				controller: 'coopdetailCtrl',
				data: {
					displayName: 'coopdetail'
				},
				params: {
					'deptId':null,
					'ppid':null,
					'coid':null
				}
			}).state("editdetail",{
				'url':"/editdetail/?coid",
				templateUrl:"template/cooperation/coop_editdetail.html",
				controller:"editdetailCtrl"
			});
	
			// .state('home.all', {
			// 	'url': "/all",
			// 	templateUrl: 'template/home/all.html',
			// 	controller: 'allCtrl',
			// 	data: {
			// 		displayName: 'all'
			// 	}
			// });
	
			//$locationProvider.html5Mode(true);
	
		}
	]);

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 协作管理
	 */
	angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','$location','$timeout',
	    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,$location,$timeout) {
	    var urlParams = $location.search(); //截取url参数
	    $scope.flag = {};
	    $scope.flag.isEmptyUrl = $.isEmptyObject(urlParams); //判断当前url参数否为空 false:有值 true：空
	    var firstflag = true; //筛选全选只加载一次标识
	    var firstreackflag = true;//进入页面只加载一次定位
	    $scope.scrollend = false;//停止滚动加载
	    var firstdeptid; //第一个项目部id;
		var searId;
		$scope.branchList = false;//子公司弹窗列表初始状态
	    //查询列表初始值
	    $scope.currentDate =  Cooperation.getCurrentDate();
	    $scope.cooperationList = [];
	    var tempCooperationList = [];
	    var queryData = {};
	  	queryData.count = 20;
	  	queryData.deptId = (!$scope.flag.isEmptyUrl && urlParams.deptId >= -1)?urlParams.deptId:'';
	  	queryData.groups=[];
	  	queryData.modifyTime = '';
	    queryData.modifyTimeCount = 0;
	  	queryData.ppid = urlParams.ppid?urlParams.ppid:'';
	  	
	  	queryData.queryFromBV = true;
	  	queryData.searchKey = '';
	  	queryData.searchType = '';
	    $scope.isTypeChecked = false;
	    $scope.coopattr = '0';
	    $scope.openSignal = false;
	    $scope.projectInfoList = [];
	    $scope.deptIdToken = 0;//防止点击项目部多次提交
	    $scope.ppidToken = 0;//防止点击工程部多次提交
	    $scope.deptIdOpenToken = 0;//防止点击项目部关闭多次提交;
	    var oldSelsectType = [];//筛选旧值存储-协作类型
		var oldPriority = [];//筛选旧值存储-优先级
		var oldMark = [];//筛选旧值存储-标识
		$scope.checkboxSelsectType = [];//筛选实际checkbox旧值存储-协作类型
		$scope.checkboxPriority = [];//筛选实际checkbox旧值存储-优先级
		$scope.checkboxMark = [];//筛选实际checkbox旧值存储-标识
		
	    $scope.openNew = function () {
	    	$scope.openSignal = true;
	    	Cooperation.getTypeList().then(function (data) {
	        $('.overlay').css('top','0px');
	        $('.overlay').css('height','calc(100vh - 65px)');
	        $('.overlay').css('display','block');
	        angular.forEach(data,function(value,key) {
	          if(value.name == '问题整改'){
	            data[key].typeImg = 1;
	          } else if(value.name == '阶段报告'){
	            data[key].typeImg = 2;
	          }else if(value.name == '方案报审'){
	            data[key].typeImg = 3;
	          }else if(value.name == '方案会签'){
	            data[key].typeImg = 4;
	          }else if(value.name == '现场签证'){
	            data[key].typeImg = 5;
	          } else if(value.name == '图纸变更'){
	            data[key].typeImg = 6;
	          }
	        });
	    		$scope.typeList = data;
	
	    	});
	    }
	    
		$scope.link = function(id){
	        $scope.flag.isDraft = false;
			$scope.deptIdOpenToken = 0;
			//searId =id;
	//		console.info('searId',searId)
	        $scope.initScrollend(id);
			$scope.projectInfoList = [];
			queryData.groups = [];
				if(id==-1){
					queryData.deptId = '';
					queryData.ppid = '';
				}
				Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
				queryData.deptId = '';
				queryData.ppid = '';
			});
	      $(".general").removeClass('menusActive');
	      $("#draft").removeClass('menusActive');
			$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
			$(".basic-project").show();
			// $(".draft-box").hide();
		}
		
		$scope.drafts = function(id){
	    $scope.flag.isDraft = true;
			$scope.deptIdOpenToken = 0;
			searId = id;
	//		console.info('searId',searId)
	      $scope.initScrollend(id);
				$scope.projectInfoList = [];
				queryData = {};
				queryData.groups = [];
				queryData.count = 20;
				queryData.queryFromBV = true;
				queryData.modifyTimeCount = 0;
				if(id==-1){
					queryData.deptId = '';
					queryData.ppid = '';
				}else if(id==0){
					var group = {
						type:605,
						value:{
							key:"0"
						}
					};
					queryData.groups.push(group);
				}
				//alert("我是草稿箱")
	      $(".general").removeClass('menusActive'); 
	      $("#no-relate").removeClass('menusActive');
				$(".cop-filter ,.cop-list ,.btn_count").css("display",'none');
				$(".draft-box").show();
				Cooperation.getCollaborationList(queryData).then(function (data) {
					$scope.cooperationList = data;
					queryData.deptId = '';
					queryData.ppid = '';
					//console.info('$scope.cooperationList',$scope.typeList)
	//				console.info('xjmifsnfw',$scope.cooperationList)
					if($scope.cooperationList.isLock){
						$('.table  tbody .problems-rect .problems-box').css('margin-left','40px')
					}
				});
			}
	
	     //弹出筛选框
	    $scope.openfilter = function () {
	      $scope.isCollapsed = true;
	      $('.overlay').css('display','block');
	      $('.overlay').css('top','59px');
	      $('.overlay').css('height','calc(100vh - 115px)');
		  $('.operation-mask').css('display','block')
	    }
	    //点击蒙层隐藏筛选匡
	    $scope.clicklay = function () {
	      $scope.isCollapsed = false;
	      $scope.detailSignal = false;
	      $scope.openSignal = false;
	      $('.overlay').css('display','none');
		  $(".operation-mask").hide()
	    }
	
	    //点击显示列表每条协作的详情
	    $scope.openDetail = function (item) {
	      $scope.detailSignal = true;
	      $('.overlay').css('top','0px');
	       $('.overlay').css('height','calc(100vh - 65px)');
	      $('.overlay').css('display','block');
	      $scope.everyDetail = item;
	    }
	
	    $scope.trans = function (typeId,typeName) {
	    	$state.go('newcopper', {'typeid': typeId,'typename':typeName,'deptId':queryData.deptId,'ppid':queryData.ppid},{location:'replace'});
	    	//window.open(url,'_self');
	    }
	
	    //获取项目部列表3434
	    Cooperation.getDeptInfo().then(function (data) {
	    	$scope.deptInfoList = data;
	    	if(!queryData.deptId){
	    		firstdeptid = data[0].deptId;//确定第一个deptid
	            queryData.deptId = firstdeptid;
	    		$scope.deptIdToken = 0;
	    	}
	//      console.log(queryData.deptId);
	    });
	    
	    function getimgurl(treeItems,deptId){
	    	//清空旧数据
	    	$("#dept_"+deptId).empty();
			for(var i = 0 ; i< treeItems.length;i++){
				if(treeItems[i].projectType=="土建预算"){
					treeItems[i].imgsrc="imgs/icon/1.png";
				}else if(treeItems[i].projectType=="钢筋预算"){
					treeItems[i].imgsrc="imgs/icon/2.png";
				}else if(treeItems[i].projectType=="安装预算"){
					treeItems[i].imgsrc="imgs/icon/3.png";
				}else if(treeItems[i].projectType=="Revit"){
					treeItems[i].imgsrc="imgs/icon/4.png";
				}else if(treeItems[i].projectType=="Tekla"){
					treeItems[i].imgsrc="imgs/icon/5.png";
				};
				$("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>"+treeItems[i].projectName+"</span>&nbsp;<b class='coop-countElement'>("+treeItems[i].count+")</b></span>")
			}
			
			$("span[id^='projectbutton_']").bind("click", function(){
				  // $(".draft-box").hide();
	            $scope.flag.isDraft = false;
	            $('.manage-menus').removeClass('menusActive');
			   	$("span[class*=ng-binding]").removeClass("menusActive");
			    //获取当前元素
			   	$(this).addClass("menusActive").siblings().removeClass("menusActive");
			   	$(" .data_count").hide();
				$(".table-list.basic-project").show();
				$scope.getCollaborationList($(this).attr("id").split("_")[1]);
			});
		}
	
	    //获取工程列表
	   	$scope.getprojectInfoList = function (deptId, open) {
	         $scope.flag.isDraft = false;
	      $('#deptbutton_'+deptId).parent().addClass('menusActive');
	      $(':not(#deptbutton_'+deptId+')').parent().removeClass('menusActive'); 
	      
	       var ppid = queryData.ppid;
	   		//初始化数据
	   		$scope.scrollend = false;
	        queryData.modifyTime = '';
	        queryData.modifyTimeCount = 0;
	        queryData.ppid = '';
			$scope.projectInfoList=[];
			queryData.groups=[];
			$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
			$(".basic-project").show();
			// $(".draft-box").hide();
			if(!open){
				Cooperation.getProjectList(deptId).then(function (data) {
					getimgurl(data,deptId);
					if(ppid){
						$("span[id='projectbutton_"+ppid+"']").click();
					}
				});
				$scope.deptIdOpenToken = 0;
			}else{
				$scope.deptIdOpenToken = 1;
			}
	
			if(!queryData.deptId){
				queryData.deptId  = deptId;
			}
			//如果进入的deptid不同
			if(queryData.deptId != deptId ){
				queryData.deptId  = deptId;
			}
	    if(!queryData.ppid){
	      $scope.cooperationList = []; 
	      Cooperation.getCollaborationList(queryData).then(function (data) {
	        $scope.cooperationList = data;
	        $scope.deptIdToken = 1;
	        $scope.deptIdOpenToken = 0;
	      });
	    $(" .data_count").hide();
	    }
	   	}
	   
	   	
	   	/*滚动加载只防止多次提交请求问题start*/
	    //可以查询
	 	var searchFlag;
	 	var pollingFlag = true;
	 	var checkSearchInterval;
	 	$scope.addMoreData = function (){
	 		if($scope.deptIdToken == 0 ||  $scope.ppidToken == 1 || $scope.deptIdOpenToken == 1) {
	 			$scope.ppidToken = 0;
	 			return;
	 		}
	 		if(token == true){
	 			token = false;
	 			return;
	 		}
	 		setSearchFlagFalse();
	 		if(pollingFlag){
	 			pollingFlag = false;
	 			checkSearchInterval = setInterval(function() {checkCanSearch()},100);
	 		}
	 		setTimeout(function() {setSearchFlagTrue()},150);
	
	 	};
	 	var setSearchFlagFalse = function(){
	 		searchFlag = false;
	 	}
		var setSearchFlagTrue = function(){
			searchFlag = true;
	 	}
		var checkCanSearch = function(){
			if(searchFlag){
				clearInterval(checkSearchInterval);
				$scope.searchMoreData();
				pollingFlag = true;
			}
		}
		/*滚动加载只防止多次提交请求问题end*/
		
	     //当滚动加载到最后一页时候，$scope.scrollend全局变量为true，
	     //导致切换工程时候不能进行滚动加载，需要初始化$scope.scrollend的值
	     $scope.initScrollend = function(id){
	          //如果当前企业和切换的企业id不一样，初始化$scope.scrollend
	          if(queryData.ppid != id){
	             $scope.scrollend = false;
	             queryData.modifyTime = '';
	             queryData.modifyTimeCount = 0;
	          }
	     }
	
	    //下拉获取更多协同列表数据
	    $scope.searchMoreData = function () {
	    	
	        //默认获取第一个项目部列表的工程列表
	        if(!queryData.deptId) {
	           // queryData.deptId = firstdeptid;
	            queryData.searchType = 0;
	        }
	        //第一次queryData.modifyTime为空
	        //第二次modifyTime为最后一次的数据的时间值
	        if($scope.cooperationList.length) {
	            queryData.modifyTimeCount = 1;
	            for(var i = 0;i<$scope.cooperationList.length;i++){
	            	queryData.modifyTime = $scope.cooperationList[i].updateTime;
	            }
	            queryData.modifyTime =  $scope.cooperationList[$scope.cooperationList.length - 1].updateTime;
	        }
	        Cooperation.getCollaborationList(queryData).then(function (data) {
	        	if(!$scope.cooperationList.length) {
	                $scope.cooperationList = data;
	            } else {
	                if(data.length) {
	                	for(var j=0 ; j<data.length;j++){
	                		 $scope.cooperationList.push(data[j]);
	                	}
	                    if(data.length<20){
	                    	$scope.scrollend = true;
	                    }
	                }
	                return;
	            }
	        });
	    }
	    
	    
		$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
			$('.table-list table tbody tr').click(function(){
				$(this).find(".cop-edit").show();
				$(this).siblings().find(".cop-edit").hide();
			});
			if(firstflag){
				//第一次设置默认全选
		        $scope.typeCheck = true;
		        $scope.priorityCheck = true;
		    	$scope.markCheck = true;
		    	$scope.allType(firstflag);
		      	$scope.allPriority(firstflag);
		      	$scope.allMark(firstflag);
		      	firstflag = false;
			}
			//协作筛选状态被改变时触发
			if(!$scope.typeCheck ||!$scope.priorityCheck||!$scope.markCheck){
				$('.cop-filter').addClass('filter-active');
			}else{
				$('.cop-filter').removeClass('filter-active');
			}
	
		})
			//选择子公司关闭子公司列表弹框
			//$('.trent-branch ul li').click(function(){
			//	$scope.branchList = false;
			//})
			//console.info($('.trent-branch ul li'))
	
		$scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){
	
			if(firstreackflag){
				//获取列表里面第一个项目部
				if(queryData.deptId && queryData.deptId!=0 && queryData.deptId!=-1){
					$("#deptbutton_"+queryData.deptId).click();
					$("#deptbutton_"+queryData.deptId).parent().addClass('menusActive');
				}else if(queryData.deptId==-1){
					$scope.deptIdToken = 1;
					$('#no-relate').click();
					$("#no-relate").addClass('menusActive');
				}else if(queryData.deptId==0){
					$scope.deptIdToken = 1;
					$('#draft').click();
					$("#draft").addClass('menusActive');
				}else{
					$("#deptbutton_"+firstdeptid).click();
					$("#deptbutton_"+firstdeptid).parent().addClass('menusActive');
				}
				firstreackflag = false;
			}
	
	     $(".manage-menus").bind("click", function(){
	                $("manage-menus").removeClass("menusActive");
	                //获取当前元素
	                $(this).addClass("menusActive").siblings().removeClass("menusActive");
	            });
		})
	
		
		//删除草稿箱的内容
		$scope.deleteProject = function(coid){
			layer.confirm('是否删除该协作？', {
				btn: ['是','否'] //按钮
			}, function(){
				layer.closeAll();
				Cooperation.removeDraft(coid).then(function(data){
				})
				$scope.drafts(0);
			});
	
		}
		var token = false;
	   	//点击工程获取协同列表
	   $scope.getCollaborationList = function (ppid) {
		   var createindex = layer.load(1, {
			   shade: [0.1,'#000'] //0.1透明度的黑色背景
		   });
		  if(queryData.ppid==ppid && queryData.modifyTimeCount != 1){
			  return;
		  }else{
			  if($scope.scrollend == true && queryData.ppid != ppid){
	        	  token = true;
	          }
			  $scope.ppidToken = 0;
			  $scope.scrollend = false;
	          queryData.modifyTime = '';
	          queryData.modifyTimeCount = 0;
		  }
	
	      $scope.initScrollend(ppid);
	   	  queryData.ppid = ppid;
		  $scope.typeStatStr=[];
	   	  Cooperation.getCollaborationList(queryData).then(function (data) {
	   		   $scope.cooperationList = data;
	   		   $scope.ppidToken = 1;
			  layer.close(createindex)
	   	  });
	   }
	    
	    //获取动态筛选列表
	    Cooperation.getCoQueryFilter().then(function (data) {
	    	$scope.coQueryFilterList = data;
	    	data[0].list.shift();
	    	data[1].list.shift();
	    	data[2].list.shift();
	    	$scope.coQueryType = data[0].list;
	    	$scope.coPriority = data[2].list;
	    	$scope.coMark = data[1].list;
	    });
	
		var queryTypeSelected = [];
		var queryPriorityselected = [];
		var queryMarkSelected = [];
	    var updateSelected = function(action,id,type,index,signal){
	        var findIndex = _.findIndex(type, id);
	        if(action == 'add' && findIndex == -1){
	            type.push(id);
	       	}
	        if(action == 'add') {
	            if(signal == 1) {
	                $('.bg' + index).removeClass('bg' + index).addClass('bgs' + index);
	            }
	        }
	        if(action == 'remove' && findIndex !=-1){
	            type.splice(findIndex,1);
	        }
	        if(action == 'remove'){
	            if(signal == 1) {
	                $('.bgs' + index).removeClass('bgs' + index).addClass('bg' + index);
	                $('#allTypeId').prop('checked',false);
	            }else if(signal == 2 ){
	            	$('#allPriorityId').prop('checked',false); 
	            }else if(signal == 3){
	            	$('#allMarkId').prop('checked',false);
	            }
	        }else{
	        	 if(signal == 1) {
	        		 if($scope.coQueryType.length == type.length){
	        			 $('#allTypeId').prop('checked',true);
	        		 }
	             }else if(signal == 2 ){
	            	 if($scope.coPriority.length == type.length){
	            		 $('#allPriorityId').prop('checked',true); 
	            	 }
	             }else if(signal == 3){
	            	 if($scope.coMark.length == type.length){
	            		 $('#allMarkId').prop('checked',true); 
	            	 }
	             }
	        }
	     }
	    $scope.updateSelection = function($event,id,signal,index){
	    	var checkbox = $event.target;
	        var action = (checkbox.checked?'add':'remove');
	        var type;
			var obj = {index:index, flag:checkbox.checked};
	        switch (signal) {
	        	case 1:
	        		type = queryTypeSelected;
	        		$scope.checkboxSelsectType[index] = {index:index, checkbox:checkbox};
	        		break;
	        	case 2:
	        		type = queryPriorityselected;
	        		$scope.checkboxPriority[index] = {index:index, checkbox:checkbox};
	        		break;
	        	case 3:
	        		type = queryMarkSelected;
	        		$scope.checkboxMark[index] = {index:index, checkbox:checkbox};
	        		break;
	        }
	        updateSelected(action,id,type,index,signal);
	    }
	    
	    $scope.isSelected = function(id){
	//    	console.log(queryTypeSelected.indexOf(id));
	        return queryTypeSelected.indexOf(id)>=0;
	    }
	    //选中
		function isCheck(){
			$('.cop-filter').removeClass('filter-active');
			$(".icon-sub").attr("src",'imgs/icon/funnel.png');
		}
		//非选中
		function isNotCheck(){
			$('.cop-filter').addClass('filter-active');
			$(".icon-sub").attr("src",'imgs/icon/funnel-1.png');
		}
	    //alltype全选
		$scope.allType = function (firstflag) {
			$scope.checkboxSelsectType = new Array($scope.coQueryType.length);
			if(firstflag) {
				oldSelsectType = new Array($scope.coQueryType.length);
			} else {
				for(var i = 0; i<$scope.checkboxSelsectType.length;i++) {
					$scope.checkboxSelsectType[i] = $('.checkbox_type_' + i );
				}
			}
			if($scope.typeCheck) {
				$('.type-check').find('input').prop('checked',true);
	            queryTypeSelected = _.cloneDeep($scope.coQueryType);
	            for(var i=0;i<$scope.coQueryType.length;i++) {
	                $('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
	                if(firstflag) {
	                	var type = {name:$scope.coQueryType[i].name,flag:true};
						oldSelsectType[i] = type;
					}
	            }
			} else {
	            for(var i=0;i<$scope.coQueryType.length;i++) {
	                $('.bgs' + i).removeClass('bgs' + i).addClass('bg' + i);
	                if(firstflag) {
	                	var type = {name:$scope.coQueryType[i].name,flag:false};
						oldSelsectType[i] = type;
					}
	            }
				$('.type-check').find('input').prop('checked',false);
				queryTypeSelected = [];
			}
		}
	
		//allPriority全选-优先级
	    $scope.allPriority = function (firstflag) {
	    	$scope.checkboxPriority = new Array($scope.coPriority.length);
	    	if(firstflag) {
	    		oldPriority = new Array($scope.coPriority.length);
			} else {
				for(var i = 0; i<$scope.checkboxPriority.length;i++) {
					$scope.checkboxPriority[i] = $('.checkbox_priority_' + i );
				}
			}
	        $('.priority-check label').addClass('input-check');
	    	if($scope.priorityCheck) {
	    		$('.priority-check').find('input').prop('checked',true);
	    		queryPriorityselected = _.cloneDeep($scope.coPriority);
	    		if(firstflag) {
	    			for(var i = 0;i<$scope.coPriority.length;i++){
	    				var type = {name:$scope.coPriority[i].name,flag:true};
	    				oldPriority[i] = type;
	    			}
	    		}
	
	    	} else {
	    		$('.priority-check').find('input').prop('checked',false);
	    		queryPriorityselected = [];
	    		if(firstflag) {
	    			for(var i = 0;i<$scope.coPriority.length;i++){
	    				var type = {name:$scope.coPriority[i].name,flag:false};
	    				oldPriority[i] = type;
	    			}
	    		}
	    	}
	    }
	
	    //marking标识全选
	    $scope.allMark = function (firstflag) {
	    	$scope.checkboxMark = new Array($scope.coMark.length);
	    	if(firstflag) {
	    		oldMark = new Array($scope.coMark.length);
			} else {
				for(var i = 0; i<$scope.checkboxMark.length;i++) {
					$scope.checkboxMark[i] = $('.checkbox_mark_' + i );
				}
			}
	    	if($scope.markCheck) {
	    		$('.mark-check').find('input').prop('checked',true);
	    		queryMarkSelected = _.cloneDeep($scope.coMark);
	    		if(firstflag) {
	    			for(var i=0;i<$scope.coMark.length;i++){
	    				var type = {name:$scope.coMark[i].name,flag:true};
	    				oldMark[i] = type;
	    			}
	    		}
	    	} else {
	    		$('.mark-check').find('input').prop('checked',false);
	    		queryMarkSelected = [];
	    		if(firstflag) {
	    			for(var i=0;i<$scope.coMark.length;i++){
	    				var type = {name:$scope.coMark[i].name,flag:false};
	    				oldMark[i] = type;
	    			}
	    		}
	    	}
	    }
	
	    //动态筛选-确定-按钮-搜索
	    $scope.filterOk = function () {
			$('.operation-mask').css('display','none')
			if($scope.markCheck && $scope.priorityCheck &&$scope.typeCheck){
				isCheck()
			}else{
				isNotCheck()
			}
	        $scope.isCollapsed = false;
	        $('.overlay').css('display','none');
	    	var groups = [];
	    	var type601Selected = [];
	    	var type602Selected = [];
	    	var type603Selected = [];
			for(var i=0;i<oldSelsectType.length;i++) {	// 确定时 新值覆盖旧值-协作类型
				var oldName = oldSelsectType[i].name;
				for(var j=0;j<queryTypeSelected.length;j++) {
					var newName = queryTypeSelected[j].name;
					if(oldName == newName) {
						oldSelsectType[i].flag = true;
						break;
					} else {
						oldSelsectType[i].flag = false;
					}
				}
			}
			for(var i=0;i<oldPriority.length;i++) {	// 确定时 新值覆盖旧值-优先级
				var oldName = oldPriority[i].name;
				for(var j=0;j<queryPriorityselected.length;j++) {
					var newName = queryPriorityselected[j].name;
					if(oldName == newName) {
						oldPriority[i].flag = true;
						break;
					} else {
						oldPriority[i].flag = false;
					}
				}
			}
			
			for(var i=0;i<oldMark.length;i++) {	// 确定时 新值覆盖旧值-标识
				var oldName = oldMark[i].name;
				for(var j=0;j<queryMarkSelected.length;j++) {
					var newName = queryMarkSelected[j].name;
					if(oldName == newName) {
						oldMark[i].flag = true;
						break;
					} else {
						oldMark[i].flag = false;
					}
				}
			}
			
	    	angular.forEach(queryTypeSelected,function (value, key) {
				var unit = {};
				unit.type= 601;
				unit.value = {key:value.key};
				type601Selected.push(unit);
	    	});
	    	angular.forEach(queryPriorityselected,function (value, key) {
				var unit = {};
				unit.type= 602;
				unit.value = {key:value.key};
				type602Selected.push(unit);
	    	});
	    	angular.forEach(queryMarkSelected,function (value, key) {
	    		var unit = {};
	    		unit.type= 603;
	    		unit.value = {key:value.key};
	    		type603Selected.push(unit);
	    	});
	    	groups = groups.concat(type601Selected,type602Selected,type603Selected);
	    	if(groups!=null&&groups.length>0){
	    		queryData.groups = groups;
	        	queryData.modifyTime = 0;
	        	Cooperation.getCollaborationList(queryData).then(function (data) {
	       			$scope.cooperationList = data;
	       		});
	    	}else{
	    		$scope.cooperationList = [];
	    	}
	    	
	    }
	
	    $scope.filterCancel = function () {
			$('.operation-mask').css('display','none')
	        $scope.isCollapsed = false;
	        $('.overlay').css('display','none');
	        
			var typeLength = 0;
			for(var i=0;i<oldSelsectType.length;i++) {	// 取消时 旧值覆盖新值-协作类型(背景图片调整)
				if(oldSelsectType[i].flag){	// 选中
					$('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
					typeLength++;
				} else {	// 没选中
					$('.bgs' + i).removeClass('bgs' + i).addClass('bg' + i);
				}
				for(var j=0; j < $scope.checkboxSelsectType.length; j++) {
					if($scope.checkboxSelsectType[j] != undefined && i == j) {
						// 实际的checkbox选中状态
						$('.bg' + i  +' input, .bgs' + i  +' input' ).prop("checked",oldSelsectType[i].flag);
						break;
					}
				}
			}
			// 全选按钮样式
			if(oldSelsectType.length == typeLength){
				$('#allTypeId').prop('checked',true);
			} else {
				$('#allTypeId').prop('checked',false);
			}
			
			var priorityLength = 0;
			for(var i=0;i<oldPriority.length;i++) {	// 取消时 旧值覆盖新值-优先级(背景调整)
				if(oldPriority[i].flag){	// 选中
					$('.priority_' + i).attr("background", "#979ba8");
					priorityLength++;
				} else {	// 没选中
					$('.priority_' + i).attr("background", "#fff");
				}
				for(var j=0; j < $scope.checkboxPriority.length; j++) {
					if($scope.checkboxPriority[j] != undefined && i == j) {
						// 实际的checkbox选中状态
						$('.checkbox_priority_' + i ).prop("checked",oldPriority[i].flag);
						break;
					}
				}
			}
			// 全选按钮样式
			if(oldPriority.length == priorityLength){
				$('#allPriorityId').prop('checked',true);
			} else {
				$('#allPriorityId').prop('checked',false);
			}
			
			var markLength = 0;
			for(var i=0;i<oldMark.length;i++) {	// 取消时 旧值覆盖新值-标识(背景调整)
				if(oldMark[i].flag){	// 选中
					$('.mark_' + i).attr("background", "#979ba8");
					markLength++;
				} else {	// 没选中
					$('.mark_' + i).attr("background", "#fff");
				}
				for(var j=0; j < $scope.checkboxMark.length; j++) {
					if($scope.checkboxMark[j] != undefined && i == j) {
						// 实际的checkbox选中状态
						$('.checkbox_mark_' + i ).prop("checked",oldMark[i].flag);
						break;
					}
				}
			}
			// 全选按钮样式
			if(oldMark.length == markLength){
				$('#allMarkId').prop('checked',true);
			} else {
				$('#allMarkId').prop('checked',false);
			}
	    }
	   	//根据属性筛选
	   	$scope.changeAttr = function () {
	   		queryData.searchType = parseInt($scope.coopattr);
	   		queryData.modifyTime = 0;
	   		Cooperation.getCollaborationList(queryData).then(function (data) {
	   			$scope.cooperationList = data;
	   		});
	   	}
	
	   	//根据搜索框搜索
		$scope.getCollaborationListFun = function(){
			queryData.searchKey = $scope.searchkey;
			queryData.modifyTime = 0;
			Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
			});
		}
	   	$scope.inputSearch = function () {
			if(searId ==0){
				queryData.deptId=0;
				$scope.getCollaborationListFun();
			}else if(searId ==-1){
				queryData.deptId=-1;
				$scope.getCollaborationListFun();
			}else{
				if(queryData.deptId==""){
					queryData.deptId = firstdeptid;
				}
				$scope.getCollaborationListFun();
			}
	   	}
		//	按enter键进行筛选
			$scope.searchEnter = function(e){
				var keyCode = e.keyCode|| e.which;
				if($('#exampleInputName1').val()!='' && keyCode==13){
					$scope.inputSearch();
				}else if($('#exampleInputName1').val()==''){
					$scope.cooperationList=[];
					if(searId==0){
						queryData.deptId=searId;
						$scope.getCollaborationListFun()
					}else{
						if(queryData.deptId==""){
							queryData.deptId = firstdeptid;
						}
						$scope.getCollaborationListFun();
					}
	
	
				}
			}
	
		$scope.getCoCountInfo=[];
		var arr = [];
		$scope.arrString=[];
		var priorityArr = [];
		var arrCount =0;
	
		var deadline = [];
		$scope.deadlineStr = [];
		var timeLim =[];
		var deadlineCount = 0;
	
		var maker =[];
		$scope.makerStatStr = [];
		var blankId = [];
		var makerCount =0;
	
		var typeStatNub = [];
		$scope.typeStatStr=[];
		var coTypeObj = [];
		var typeCount =0;
			$('.draft-box').css('display','none');
		//统计页面
		var comboxCount = $("#comboBox_count");
		$scope.comboxCount = function(){
			$(".basic-project").hide();
			$('.draft-box').hide();
			$(" .data_count").show();
			$scope.getCoTotal();
		}
		//$(".data_back").click(function(){
		////	alert(123)
		//	$('.data_count').hide();
		//	$('.draft-box').css('display','none');
		//})
		$scope.getCoTotal = function(){
			//图标内容大小自适应
	
	
			priorityArr = [];
			timeLim =[];
			blankId = [];
			coTypeObj = [];
			$scope.arrString =[];
			$scope.deadlineStr =[];
			$scope.makerStatStr=[];
			$scope.typeStatStr=[];
			//$(".data_count").children().hide();
			if(!queryData.ppid){
				queryData.ppid ='';
			}
			Cooperation.getCoStatisticsInfo({deptId :queryData.deptId,ppid:queryData.ppid}).then(function(data){
				$scope.getCoCountInfo =data.data;
				//优先级
				$scope.priorityStat = data.data.priorityStat;
				//期限
				$scope.deadLineStat = data.data.deadLineStat;
				//标识
				$scope.makerStat = data.data.makerStat;
				//协作类型
				$scope.typeStat = data.data.typeStat;
				//判断返回的数据类型是空或者是NaN,如果是把对应的div给移除掉
				//判断返回数据是否为空
				function isEmpty(obj){
					for(var key in obj){
						return false
					}
					return true
				}
				//判断数组的值是否为空
				function isEmptyArr(array){
					var count = 0;
					for(var i = 0;i<array.length;i++){
						return  count +=array[i]
					}
				}
	
				var isPriorityStat = isEmpty($scope.priorityStat);
				var isDeadLineStat = isEmpty($scope.deadLineStat);
				var isMakerStat = isEmpty($scope.makerStat);
				var istypeStat = isEmpty($scope.typeStat);
				if(isPriorityStat){
					$("#data_graph").parent().hide();
				}else{
					$("#data_graph").parent().show();
				}
				if(isDeadLineStat){
					$("#data_graph2").parent().hide();
				}else{
					$("#data_graph2").parent().show();
				}
				if(isMakerStat){
					$("#data_graph3").parent().hide();
				}else{
					$("#data_graph3").parent().show();
				}
				if(istypeStat){
					$("#data_graph4").parent().hide();
				}else{
					$("#data_graph4").parent().show();
				}
					/*#E6D055  黄 III
						#5887FD 蓝 I
						#73CC6C 绿 II
					*/
					var colorStyle1= ["#5887FD","#73CC6C","#E6D055"];
					// 数据清零
					arr = [];
					arrCount = 0;
					//优先级别
					var statIndex = 0;
					angular.forEach( $scope.priorityStat, function (value, key) {
						arr.push(value);
						//页面优先级展示数据
						if((statIndex == 1) && key === "III") {
							$scope.arrString.push("II");
						} else if((statIndex == 2) && key === "II") {
							$scope.arrString.push("III");
						} else {
							$scope.arrString.push(key);
						}
						statIndex++;
					})
	
					for(var n in arr){
						arrCount += arr[n];
					}
					angular.forEach( $scope.priorityStat, function (value, key) {
						var unit = {
							value:'',
							name:'',
							itemStyle:{
								normal:{
									color:''
								}
							}
						};
						unit.value = value;
						if(isEmptyArr(arr)==0){
							//unit.name=value.toString();
							$("#data_graph").parent().hide();
						}else{
							$("#data_graph").parent().show();
	//						unit.name = parsePercent(value/arrCount);
	//						unit.name = parseInt((value/arrCount)*100)+"%";
							unit.name = value;
						}
						unit.itemStyle.normal.color = '';
						priorityArr.push(unit);
					});
					//循环数组给他添加颜色属性--优先级
					for(var t= 0;t<priorityArr.length;t++){
						priorityArr[t].itemStyle.normal.color  = colorStyle1[t];
					}
	
					// 数据清零
					deadline = [];
					deadlineCount = 0;
					//期限
					angular.forEach($scope.deadLineStat,function(val,key){
						deadline.push(val);
						$scope.deadlineStr.push(key);
					})
					for(var m in deadline){
						deadlineCount += deadline[m];
					}
					angular.forEach($scope.deadLineStat,function(val,key){
						var dataTime = {
							value:"",
							name:"",
							itemStyle:{
								normal:{
									color:""
								}
							}
						};
						dataTime.value= val;
						if(isEmptyArr(deadline)==0){
							 //dataTime.name =val.toString()
							$("#data_graph2").parent().hide();
						}else{
							$("#data_graph2").parent().show();
	//						dataTime.name = parsePercent(val/deadlineCount);
	//						dataTime.name=parseInt((val/deadlineCount)*100)+"%";
							dataTime.name=val;
						}
						timeLim.push(dataTime);
					});
					for(var a = 0;a<timeLim.length;a++){
						timeLim[a].itemStyle.normal.color= colorStyle1[a]
					}
					// 数据清零
					maker = [];
					makerCount = 0;
	
					//标识
					angular.forEach($scope.makerStat,function(obj,key){
						maker.push(obj.count);
						var makerObj ={
								name:"",
								color:""
							};
						makerObj.name = key;
						makerObj.color = obj.color;
						$scope.makerStatStr.push(makerObj);
	
					})
					for(var i in maker){
						makerCount += maker[i];
					}
					angular.forEach($scope.makerStat,function(obj,key){
						var blank = {
							value:"",
							name:"",
							itemStyle:{
								normal:{
									color:""
								}
							}
						};
						blank.value =obj.count;
						blank.itemStyle.normal.color = obj.color;
						if(isEmptyArr(maker)==0){
							//blank.name = val.toString();
							$("#data_graph3").parent().hide();
						}else{
							$("#data_graph3").parent().show();
	//						blank.name = parsePercent(val/makerCount);
	//						blank.name =parseInt((val/makerCount)*100)+"%";
							blank.name = obj.count;
						}
	
						blankId.push(blank);
					})
					/*for(var b = 0;b<blankId.length;b++){
						blankId[b].itemStyle.normal.color = colorStyle2[b];
	
					}*/
					// 数据清零
					typeStatNub = [];
					typeCount = 0;
					//协作类型
					angular.forEach($scope.typeStat,function(obj,key){
						typeStatNub.push(obj.count);
						var statObj ={
							name:"",
							color:""
						};
						statObj.name = key;
						statObj.color = obj.color;
						$scope.typeStatStr.push(statObj);
					});
					for(var k in typeStatNub){
						typeCount += typeStatNub[k]
	
					}
					angular.forEach($scope.typeStat,function(obj,key){
						var coType ={
							value:"",
							name:"",
							itemStyle:{
								normal:{
									color:""
								}
							}
						};
	
						coType.value = obj.count;
						coType.itemStyle.normal.color = obj.color;
						if(isEmptyArr(typeStatNub)==0){
							//coType.name =val.toString();
							$("#data_graph4").parent().hide()
						}else{
							$("#data_graph4").parent().show();
	//						coType.name = parsePercent(val/typeCount);
	//						coType.name = parseInt((val/typeCount)*100)+"%";
							coType.name = obj.count;
	
						}
						coTypeObj.push(coType);
	
					});
					/*for(var c= 0;c<coTypeObj.length;c++){
						coTypeObj[c].itemStyle.normal.color = colorStyle2[c];
					}*/
				var myChart1 = echarts.init(document.getElementById('data_graph'));
					//标识统计
				var option1 = {
					series: [
						{
							type:'pie',
							labelLine: {
								normal: {
									show: true
								}
							},
						},
						{
							type:'pie',
							radius: ['40%', '60%'],
							data:priorityArr
						}
					]
				};
					myChart1.setOption(option1);
	
					//	第二部分
				var myChart2 = echarts.init(document.getElementById('data_graph2'));
				var option2 = {
					series: [
						{
							type:'pie',
							labelLine: {
								normal: {
									show: true
								}
							},
						},
						{
							type:'pie',
							radius: ['40%', '60%'],
							data:timeLim
						}
					]
				};
					// 使用刚指定的配置项和数据显示图表。
					myChart2.setOption(option2);
				//图标内容大小自适应
				//window.onresize = myChart2.resize;
					//图形绘制
				var myChart3 = echarts.init(document.getElementById('data_graph3'));
					// 指定图表的配置项和数据
					//			app.title = '环形图';
				var option3 = {
					series: [
						{
							type:'pie',
							labelLine: {
								normal: {
									show: true
								}
							},
						},
						{
							type:'pie',
							radius: ['40%', '60%'],
							data:blankId
						}
					]
				};
	
					// 使用刚指定的配置项和数据显示图表。
					myChart3.setOption(option3);
				//图标内容大小自适应
				//	window.onresize = myChart3.resize;
					//图形绘制
					var myChart4 = echarts.init(document.getElementById('data_graph4'));
					var option4 = {
						series: [
							{
								type:'pie',
								labelLine: {
									normal: {
										show: true
									}
								},
							},
							{
								type:'pie',
								radius: ['40%', '60%'],
								data:coTypeObj
							}
						]
					};
					// 使用刚指定的配置项和数据显示图表。
					myChart4.setOption(option4);
				//图标内容大小自适应
				//window.onresize = myChart4.resize;
				window.onresize = function(){
					//alert(1)
					myChart1.resize();
					myChart2.resize();
					myChart3.resize();
					myChart4.resize();
				}
				})
	
			}
	
	    //跳转详情
	    $scope.transCoDetail = function(currentItem) {
	         $state.go('coopdetail',{'coid':currentItem.coid},{ location:'replace'});
	    }
	
	    //判断是否是从be过来的发起协作
	    if(urlParams.newcoop == 'frombe'){
	      $timeout(function() {
	                    $('.new_cooper').click();
	                });
	      
	    }
			//服务器时间
			$scope.currentTime= function(){
				Cooperation.getTrendsSystem({sysTime:"",sysWeek:""}).then(function(data){
					$scope.serviceTime = data.data;
				})
			}
			$scope.currentTime();
			if($stateParams.transignal == 'be') {
		    	$scope.openNew();
			}
	
			//编辑协作跳转
		   	 $scope.allowEditTrans = function (item) {
	//	   	 	if($scope.allowEdit) {
		   	 		Cooperation.checkOut(item.coid).then(function(data) {	
		   	 		});
		   	 		/*Cooperation.getCollaboration(item.coid).then(function (data) {
		   	 			$scope.collaList = data;
		   	 		});*/
		   	 		//跳转主页面需要定位到当前工程（延后再说）
	//	   	 		$state.go('cooperation', {coid: item.coid});
	//	   	 		$state.go('cooperation',{'deptId':0,'status':'草稿箱'},{ location: 'replace'});
	//	   	 	} else {
	//	   	 		var r=confirm("当前协作已结束，不允许再操作");
	//	   	 	}
	
		   	 }
			//分公司列表
			$scope.branchType = function(){
				$scope.branchList = false;
			}
			
			$scope.$on("ngRepeatFinished",function(ngRepeatFinishedEvent){
				// 页面渲染完成后 设置左侧sidebar的高度
				$(".sidebar").css("height", document.documentElement.clientHeight-$("header").height()-2);
		    })
		}]);
	
	$(window).resize(function () {          //当浏览器大小变化时
		// 设置左侧sidebar的高度
		$(".sidebar").css("height", document.documentElement.clientHeight-$("header").height()-2);
	});
	/**
	 * 拼接百分数 结果： xx.xx%
	 * @param number
	 * @returns {String}
	 */
	function parsePercent(number) {
		var persent = number*10000;
		var strName = parseInt(persent)+"";
		var length = strName.length;
		var integer = strName.substr(0,length - 2);
		var decimal = strName.substr(length - 2, length);
		if(integer === "") {
			integer = "0";
		}
		if(decimal === "") {
			return integer+"%";
		}
		return integer+"."+decimal+"%";
	}


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 新建协作
	 */
	angular.module('cooperation').controller('newcoopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Common','Manage','$sce','alertService','headerService',
	    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Common,Manage,$sce,alertService,headerService) {
	    //默认值
	    console.log($stateParams,'$stateParams');
		$scope.typeName = $stateParams.typename;
			//console.log($stateParams.typename,'$stateParams.typeid')
	    $scope.isDoc = false; //是否是doc
	    $scope.priority = '1'; //优先级
	    $scope.flag = {};
	    $scope.linkOpenSignal = true; 
	    $scope.linkProject1 =false;
	    $scope.linkComponent1 = false;
	    $scope.linkCategoty1 =false;
	    $scope.data = {};
	    $scope.link = {};
	    $scope.desc = '';
		$scope.isClick = true;//启用编辑按钮是否被按下
		$scope.responsiblePerson = {};//重组负责人
		$scope.createUser = {};
		
	//    console.log($stateParams.typeid);
	   	//获取当前用户信息
	   	//$.ajax({
		 //   type: "get",
		 //   url: basePath+'rs/co/currentUser',
		 //   contentType:'application/json',
		 //   success: function(data){
		 //   	$scope.responsiblePerson = data;
		 //   }
	    //});
	    if($stateParams.deptId!=-1&&$stateParams.deptId!=0){
	    	var currentdeptId = $stateParams.deptId?$stateParams.deptId:'';
	    	var currentppid  = $stateParams.ppid?$stateParams.ppid:'';
	    }
	
		headerService.currentUserInfo().then(function(data){
			$scope.responsiblePerson.username = data.userName;
			$scope.responsiblePerson.avatar = data.avatarUrl;
			$scope.createUser = $scope.responsiblePerson;
			var relateUser = {};
			relateUser.username = data.userName;
			relateUser.avatar = data.avatarUrl;
			relateUser.mustExist = true;
			relateUser.canSign = true;
			$scope.related.noSign[0]=relateUser;
		})
		
		
		Array.prototype.del=function(n) {
			if(n<0)
				return this;
			else
				return this.slice(0,n).concat(this.slice(n+1,this.length));
	};
		
	    //选择负责人
	    $scope.selectResponsible = function () {
	    	//alert('111');
	    	var modalInstance = $uibModal.open({
				windowClass: 'select-person-responsible-modal',
	    		backdrop : 'static',
	    		templateUrl: 'template/cooperation/select_person_responsible.html',
	    		controller:'selectpersonCtrl',
	    		resolve:{
	    			items: function () {
	    				return [];
	    			}
	    		}
	    	});
	    	modalInstance.result.then(function (selectedItem) {
	    		var responsiblePersonName = $scope.responsiblePerson.username;
	    		//如果选择的用户和负责人一样，什么都不做
	    		if(responsiblePersonName == selectedItem.username) {
	    			return;
	    		}
	    		//查询原先负责人在相关人中的位置
	    		var signIndex = null;
	    		var noSignIndex = null;
	    		for(var i = 0;i < $scope.related.sign.length;i++) {	
	    			if($scope.related.sign[i].username == responsiblePersonName){
	    				signIndex = i;
	    				break;
	    			}
	    		}
	    		for(var i = 0;i < $scope.related.noSign.length;i++) {	
	    			if($scope.related.noSign[i].username == responsiblePersonName){
	    				noSignIndex = i;
	    				break;
	    			}
	    		}
	    		
				//如果相关人里面有选择的用户，需要把原先的负责人删除
	    		for(var i = 0;i < $scope.related.sign.length;i++) {	// TODO
					if($scope.related.sign[i].username == selectedItem.username){
			    		if((signIndex != null) && (responsiblePersonName != $scope.createUser.username)){
			    			$scope.related.sign = $scope.related.sign.del(signIndex);
			    		}
			    		if(noSignIndex != null && (responsiblePersonName != $scope.createUser.username)){
			    			$scope.related.noSign = $scope.related.noSign.del(noSignIndex);
			    		}
						$scope.responsiblePerson = selectedItem;
						return;
					}
					
				}
				
				for(var i = 0;i < $scope.related.noSign.length;i++) {
					if($scope.related.noSign[i].username == selectedItem.username){
						if(signIndex != null){
							$scope.related.sign = $scope.related.sign.del(signIndex);
			    		}
			    		if(noSignIndex != null){
			    			$scope.related.noSign = $scope.related.noSign.del(noSignIndex);
			    		}
						$scope.responsiblePerson = selectedItem;
						return;
					}
				}
	    		
				for(var i = 0;i < $scope.related.sign.length;i++) {	// TODO
					if(($scope.related.sign[i].username == responsiblePersonName)&&(responsiblePersonName != $scope.createUser.username)){
						$scope.related.sign[i] = selectedItem;
						$scope.responsiblePerson = selectedItem;
						return;
					}
					
				}
				
				for(var i = 0;i < $scope.related.noSign.length;i++) {
					if(($scope.related.noSign[i].username == responsiblePersonName)&&(responsiblePersonName != $scope.createUser.username)){
						$scope.related.noSign[i] = selectedItem;
						$scope.responsiblePerson = selectedItem;
						return;
					}
				}
				$scope.related.noSign[$scope.related.noSign.length] = selectedItem;
				$scope.responsiblePerson = selectedItem;
	    	});
	    }
	    //选择相关人
	    $scope.related = {
	    	sign:[],
			noSign:[]
	    };
		var num;
	    var contracts = [];
	    $scope.selectRelated = function () {
	    	var modalInstance = $uibModal.open({
				windowClass: 'select-person-related-modal',
	    		backdrop : 'static',
				size:'lg',
	    		templateUrl: 'template/cooperation/select_person_related.html',
	    		controller:'selectpersonCtrl',
	    		resolve:{
	    			items: function () {
	    				for(var i=0;i<$scope.related.sign.length;i++){
	    					if($scope.related.sign[i].username == $scope.responsiblePerson.username){
	    						$scope.related.sign[i].mustExist = true;
	    					}
	    					$scope.related.sign[i].canSign = true;
	    				}
	    				for(var i=0;i<$scope.related.noSign.length;i++){
	    					if($scope.related.noSign[i].username == $scope.responsiblePerson.username){
	    						$scope.related.noSign[i].mustExist = true;
	    					}
	    					$scope.related.noSign[i].canSign = true;
	    				}
	    				return $scope.related;
	    			}
	    		}
	    	});
	    	modalInstance.result.then(function (selectedItem) {
	    		$scope.related.noSign = selectedItem.noSign;
	    		$scope.related.sign = selectedItem.sign;
	    		angular.forEach(selectedItem.noSign, function (value ,key) {
	    			var needSign = false;
	    			var a = {}
	    			a.needSign = needSign;
	    			a.username = value.username;
	    			contracts.push(a);
	    		});
	    		angular.forEach(selectedItem.sign, function (value ,key) {
	    			var needSign = true;
	    			var a = {}
	    			a.needSign = needSign;
	    			a.username = value.username;
	    			contracts.push(a);
	    		});
	    	});
	    }
			if(!$scope.responsiblePerson){
				$scope.responsiblePerson='创建人';
			}
	
	 //    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
	 //    	debugger;
	 //    	    $('.identify').addClass('selectpicker');
		// 		$('.selectpicker').selectpicker({
		// 		  	style: 'btn-default',
		// 		  	size: 'auto'
		// 		});
		// });
	
	    //获取标识
	    Cooperation.getMarkerList().then(function (data) {
	    	$scope.markerList = data;
	//    	console.log($scope.markerList);
	    	$scope.mark = $scope.markerList[0].markerId+'';
	    });
	
	    $scope.switchMark = function() {
	    	console.log($scope.mark);
	    }
	
	    //与工程关联
	    $scope.data.bindType = 0;
	    var deptId;
		var modalInstance;
			function isDelete(num){
				if($scope.linkProject1 ||$scope.linkComponent1 ||$scope.linkCategoty1){
					layer.confirm('您已关联的模型,是否重新关联？', {
						btn: ['是','否'] //按钮
					}, function(){
						layer.closeAll();
						if($scope.linkProject1 ){
							modalInstance = $uibModal.open({
								windowClass: 'link-project-modal',
								backdrop : 'static',
								templateUrl: 'template/cooperation/link_project.html',
								controller:'linkprojectCtrl'
							});
							modalInstance.result.then(function (dataList) {
								//关联工程页面显示的值
								$scope.link.linkProjectName = dataList.linkProjectSelected.name;
								$scope.link.linkProjectDptName = dataList.parentNode.name;
								if($scope.link.linkProjectDptName ){
									$(".new-del").show();
									$scope.data.bindType = 1;
									$scope.linkProject1 = true;
									$scope.linkComponent1 = false;
									$scope.linkCategoty1 =false;
								}
								//传给服务器的两个值
								$scope.data.assembleLps = dataList.assembleLps;
								$scope.data.ppid = dataList.assembleLps[0].ppid;
								$scope.data.deptId = dataList.parentNode.value;
							});
						}else if($scope.linkComponent1 ){
							modalInstance = $uibModal.open({
								windowClass:'link-component-modal',
								backdrop : 'static',
								templateUrl: 'template/cooperation/link_component.html',
								controller:'linkcomponentCtrl'
							});
							modalInstance.result.then(function (dataList) {
								//面显示的值
								$scope.link.linkProjectDptName = dataList.parentNode.name;
								$scope.link.linkProjectName = dataList.linkProjectSelected.name;
								//传给服务器的两个值
								$scope.data.assembleLps = dataList.assembleLps;
								$scope.data.deptId = dataList.parentNode.value;
								$scope.data.ppid = dataList.assembleLps[0].ppid;
								if($scope.link.linkProjectDptName ){
									$(".new-del").show();
									$scope.data.bindType = 2;
									$scope.linkProject1 = false;
									$scope.linkComponent1 = true;
									$scope.linkCategoty1 =false;
								}
							});
						}else if($scope.linkCategoty1){
							modalInstance = $uibModal.open({
								windowClass:'link-categoty-modal',
								backdrop : 'static',
								templateUrl: 'template/cooperation/link_component_category.html',
								controller:'linkprojectCtrl'
							});
							modalInstance.result.then(function (dataList) {
								//关联工程页面显示的值
								$scope.link.linkProjectName = dataList.linkProjectSelected.name;
								$scope.link.linkProjectDptName = dataList.parentNode.name;
								$scope.linkProjectSelected = dataList.selectedCategory;
								//传给服务器的两个值
								$scope.data.assembleLps = dataList.assembleLps;
								$scope.data.deptId = dataList.parentNode.value;
								$scope.data.ppid = dataList.assembleLps[0].ppid;
								console.log('ppid',dataList.assembleLps.ppid);
								if($scope.link.linkProjectDptName ){
									$scope.data.bindType = 3;
									$(".new-del").show();
									$scope.linkProject1 = false;
									$scope.linkComponent1 = false;
									$scope.linkCategoty1 =true;
								}
							});
						}
					},function(){
						return;
					});
				}else{
					if(num==1){
						layer.closeAll();
						modalInstance = $uibModal.open({
							windowClass: 'link-project-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_project.html',
							controller:'linkprojectCtrl',
						});
						modalInstance.result.then(function (dataList) {
							//关联工程页面显示的值
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							if($scope.link.linkProjectDptName ){
								$(".new-del").show();
								$scope.data.bindType = 1;
								$scope.linkProject1 = true;
								$scope.linkComponent1 = false;
								$scope.linkCategoty1 =false;
							}
							//传给服务器的两个值
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							$scope.data.deptId = dataList.parentNode.value;
						});
					}else if(num ==2){
						modalInstance = $uibModal.open({
							windowClass:'link-component-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_component.html',
							controller:'linkcomponentCtrl'
						});
						modalInstance.result.then(function (dataList) {
							//面显示的值
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							//传给服务器的两个值
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.deptId = dataList.parentNode.value;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							if($scope.link.linkProjectDptName ){
								$(".new-del").show();
								$scope.data.bindType = 2;
								$scope.linkProject1 = false;
								$scope.linkComponent1 = true;
								$scope.linkCategoty1 =false;
							}
						});
					}else if(num ==3){
						modalInstance = $uibModal.open({
							windowClass:'link-categoty-modal',
								backdrop : 'static',
								templateUrl: 'template/cooperation/link_component_category.html',
								controller:'linkprojectCtrl'
							});
						modalInstance.result.then(function (dataList) {
							//关联工程页面显示的值
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							$scope.linkProjectSelected = dataList.selectedCategory;
							//传给服务器的两个值
							//debugger
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.deptId = dataList.parentNode.value;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							console.log('ppid',dataList.assembleLps.ppid);
							if($scope.link.linkProjectDptName ){
								$scope.data.bindType = 3;
								$(".new-del").show();
								$scope.linkProject1 = false;
								$scope.linkComponent1 = false;
								$scope.linkCategoty1 =true;
							}
						});
					}
				}
			}
	    $scope.linkProject = function () {
			isDelete(1);
	    }
	    //与图上构件关联
	    $scope.linkComponent = function () {
			isDelete(2);
	    }
	    //与图上构件类别关联
	    $scope.linkCategoty = function () {
			isDelete(3);
	    }
	    //删除关联
	    $scope.removeLink = function () {
			if($scope.link.linkProjectName) {
				layer.confirm('您已关联了模型，是否删除关联？', {
					btn: ['是','否'] //按钮
				}, function(){
					$scope.linkProject1 = false;
					$scope.linkComponent1 = false;
					$scope.linkCategoty1 =false;
					$scope.data = {};
					$scope.data.bindType = 0;
					layer.closeAll();
					$scope.$apply();
				});
			}
	    }
	
		$scope.docSelectedList =[];
		$scope.formSelectedList = [];
		var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
		//引用BE资料
		$scope.linkBe = function () {
			$scope.beSourceType = 1;
			$scope.flag.isleast = false;
			var modalInstance = $uibModal.open({
				windowClass: 'link-be-modal',
				backdrop : 'static',
	    		templateUrl: 'template/cooperation/linkbe.html',
	    		controller:'linkbeCtrl',
	    		resolve: {
	    			items: function() {
	    				return $scope.docSelectedList;
	    			}
	    		}
			});
			modalInstance.result.then(function (selectedItem1) {
	    		var imgsrc = "imgs/pro-icon/icon-";
	    		var unit = '';
	    		angular.forEach(selectedItem1,function(value,key){
	    			if(typeArr.indexOf(value.fileType)!=-1){
	    				unit = value.fileType;
	    			} else {
	    				unit = 'other';
	    			}
	    			selectedItem1[key].imgSrc= imgsrc + unit + ".png";
	    		})
	    		$scope.docSelectedList = selectedItem1;
				//console.info('养你一辈子你要和果汁',$scope.docSelectedList)
				console.info('$scope.docSelectedList',$scope.docSelectedList.length)
	    	});
		}
		//选择表单
		$scope.linkForm = function () {
			$scope.formSourceType = 2;
			$scope.flag.isleast = false;
			var modalInstance = $uibModal.open({
				windowClass: 'link-form-modal',
				backdrop : 'static',
	    		templateUrl: 'template/cooperation/linkform.html',
	    		controller:'linkformCtrl',
	    		resolve: {
	    			items: function () {
	    				var trans = {
	    					typeid:$stateParams.typeid,
	    					formSelectedList:$scope.formSelectedList
	    				}
	    				return trans;
	    			}
	    		}
			});
			modalInstance.result.then(function (selectedItem2) {
	    		$scope.formSelectedList = selectedItem2;
	    		console.log("$scope.formSelectedList",$scope.formSelectedList.length);
	    	});
		}
		//选择表单勾选之后需要签字的文件
		// var formNeedSignList = [];
		// var updateSelected = function(action,id,name){
	 //        if(action == 'add' && formNeedSignList.indexOf(id) == -1){
	 //           formNeedSignList.push(id);
	 //       	}
	 //         if(action == 'remove' && formNeedSignList.indexOf(id)!=-1){
	 //            var idx = formNeedSignList.indexOf(id);
	 //            formNeedSignList.splice(idx,1);
	 //         }
	 //     }
	
	 //    $scope.updateSelection = function($event, id){
	 //        var checkbox = $event.target;
	 //        var action = (checkbox.checked?'add':'remove');
	 //        updateSelected(action,id,checkbox.name);
	 //        angular.forEach($scope.formSelectedList, function (value, key) {
		// 		angular.forEach(formNeedSignList, function (value1, key1) {
		// 			if(value == value1) {
		// 				value.needSign = true;
		// 				$scope.formSelectedList.splice(key,1,value);
		// 			}
		// 		})
		// 	});
		// 	console.log($scope.formSelectedList);
	 //    }
		//	删除be照片
			$scope.removePhoto = function(item){
				_.pull($scope.uploader.queue,item);
			}
		//删除be资料
		$scope.removeDoc = function (items) {
			//lodash删除数组中对象
			_.pull($scope.docSelectedList,items);
		}
		//删除表单资料
		$scope.removeForm = function (items) {
			//lodash删除数组中对象
			_.pull($scope.formSelectedList,items);
		}
		//上传照片
	    var uploader = $scope.uploader = new FileUploader({
	            url: '/bimco/fileupload/upload.do'
	   			// queueLimit: 30
		});
	    // FILTERS
	    var picturesUploadList = [];
	    var docsUploadList = [];
	    $scope.flag.docsRepeatMind = false; //图片上传超过30个防止多次提醒
	    $scope.flag.pictrueRepeatMind = false;//资料上传超过30个防止多次提醒
	    uploader.filters.push({
	        name: 'imageFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	            picturesUploadList.push(item);
	            if(picturesUploadList.length > 30){
	            	// alertService.add('time-bottom',"上传照片不能多于30个！");
	            	if(!$scope.flag.pictrueRepeatMind){
	            		// alert("上传资料不能多于30个！")
	            		// alertService.add('time-bottom','上传照片不能多于30个！')
	            		layer.alert('上传照片不能多于30个！', {
	            		  	title:'提示',
						  	closeBtn: 0
						});
	            	}
	            	$scope.flag.pictrueRepeatMind = true;
	            	return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
	            }
	            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
	        }
	    });
	    //上传资料
	    var uploader1 = $scope.uploader1 = new FileUploader({
	    		url: '/bimco/fileupload/upload.do'
	    		// queueLimit:30
	    });
	    //FILTERS
	    uploader1.filters.push({
	    	name: 'customFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	            docsUploadList.push(item);
	            if(docsUploadList.length > 30){
	            	if(!$scope.flag.docsRepeatMind){
	            		// alert("上传资料不能多于30个！")
	            		// alertService.add('time-bottom','上传资料不能多于30个！')
	            		layer.alert('上传资料不能多于30个！', {
						   	closeBtn: 0
						});
	            	}
	            	$scope.flag.docsRepeatMind = true;
	            	return this.queue.length < 30;
	            }
	            	return this.queue.length < 30;
	        }
	    });
	    //点击上传照片按钮
	    $scope.fileUpload = function () {
	    	$scope.flag.pictrueRepeatMind = false;
	    	$scope.flag.isleast = false;
	    	$('.upload-img').attr('uploader', 'uploader');
	    	$('.upload-img').attr('nv-file-select', '');
	    	$('.upload-img').click();
	    }
	    //点击上传资料按钮
	    $scope.docsUpload = function () {
	    	$scope.uploadSourceType = 3;
	    	$scope.flag.isleast = false;
	    	$scope.flag.docsRepeatMind = false;
	    	$('.upload-docs').attr('uploader', 'uploader1');
	    	$('.upload-docs').attr('nv-file-select', '');
	    	$('.upload-docs').click();
	    }
	    //设置日期相关
	    $scope.dateOptions = {
		    formatYear: 'yy',
		    maxDate: new Date(2020, 5, 22),
		    startingDay: 1,
		    showWeeks: false,
			minDate: new Date()
		};
		$scope.open2 = function() {
		    $scope.popup2.opened = true;
			$scope.isDeadlineNull = false;
		};
	
		$scope.popup2 = {
		    opened: false
		};
		$scope.checksignal = false;
		//根据复选框来判断是否显示日期控件
		$scope.isChecked = function () {
			$scope.checksignal = !$scope.checksignal;
			if(!$scope.checksignal){
				$scope.dt = null;
			}
		}
		//弹出框
		$scope.dynamicPopover = {
			templateUrl: 'template/cooperation/mypopovertemplate.html'
		}
		//	监听新建文本框的状态
		$scope.changeTopic = function(){
			// 名称字符控制
			$scope.flag.nameToLong = false;
		}
		//监听描述的状态
		$scope.changeDesc = function(){
			// 描述字符控制
			$scope.flag.descToLong = false;
		}
	
		var docsList = []; //组合doclist
		var uploadPictureList = []; //上传照片list
		var uploadDocList = [];		//上传资料list
		var onCompleteAllSignal = false; //是否上传成功signal
	
		$scope.test = function() {
			backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
	        backJson = JSON.parse(backJson);
	        alert(backJson.length);
	        var  a  ={
	        	modifys:[]
	        }; 
	        if(backJson){
						if(backJson){
							angular.forEach(backJson,function(value1, key1){
								if(!value1){
									return;
								}
	
			        				a.modifys.push(value1.PdfModify);
			        		});
						}
						console.log(a);
		        		
		        	}
		}
	
		
		//协作保存
		/**
		 * @param  {[status]} 0-草稿箱 1 提交
		 */
		$scope.save = function (status) {
			// if($scope.flag.beginCreate){
			// 	return;
			// }
			// debugger
	//		console.log('data.linkProjectDptName',$scope.link.linkProjectDptName);
			$scope.flag.beginCreate = true;
			//主题为空
			if(status==1){
				if(!$scope.coopname){
					$scope.flag.isTopicNull= true;
					return;
				}
				if($scope.coopname.length > 50){	//协作主题不能超过50个字符
					$scope.flag.nameToLong = true;
					return;
				} else {
					$scope.flag.nameToLong = false;
				}
				if($scope.desc.length > 250){	//协作描述不能超过250个字符
					$scope.flag.descToLong = true;
					return;
				} else {
					$scope.flag.descToLong = false;
				}
				//当主题不为空，资料照片为空
				if($scope.coopname && !uploader.queue.length && !uploader1.queue.length && !$scope.docSelectedList.length && !$scope.formSelectedList.length) {
					$scope.flag.isTopicNull = false;
					$scope.flag.isleast = true;
					return;
				}
			}
	
			var createindex = layer.load(1, {
				shade: [0.1,'#000'] //0.1透明度的黑色背景
			});
			
			if(uploader.queue.length && uploader1.queue.length) {
				//上传全部图片
	   			var uploadResult = uploader.uploadAll();
		   		//每个上传成功之后的回调函数
		   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			            console.info('onSuccessItem', fileItem, response, status, headers);
			            var unit = {};
			            unit.name = response[0].result.fileName;
			            unit.md5 = response[0].result.fileMd5;
			            unit.size = response[0].result.fileSize;
			            unit.uuid = response[0].result.uuid;
			            uploadPictureList.push(unit);
			            console.log('uploadPictureList',uploadPictureList);
				};
				//全部成功的回调函数
				uploader.onCompleteAll = function() {
					//上传全部
			   	 	uploader1.uploadAll();
			   		//每个上传成功之后的回调函数
			   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
				            console.info('onSuccessItem', fileItem, response, status, headers);
				            var unit = {};
				            unit.name = response[0].result.fileName;
				            unit.md5 = response[0].result.fileMd5;
				            unit.size = response[0].result.fileSize;
				            unit.uuid = response[0].result.uuid;
							unit.sourceType = 3;
				            uploadDocList.push(unit);
				            console.log('uploadDocList',uploadDocList);
					};
					//全部成功的回调函数
					uploader1.onCompleteAll = function() {
			            onCompleteAllSignal = true;
			        };
		        };
		    }
	
		    if( uploader.queue.length && !uploader1.queue.length) {
	   			var uploadResult = uploader.uploadAll();
	   		
		   		//每个上传成功之后的回调函数
		   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
	//		            console.info('onSuccessItem', fileItem, response, status, headers);
			   			if(response[0].type != "error") {
			   				var unit = {};
				            unit.name = response[0].result.fileName;
				            unit.md5 = response[0].result.fileMd5;
				            unit.size = response[0].result.fileSize;
				            unit.uuid = response[0].result.uuid;
				            uploadPictureList.push(unit);
			   			} else {	// 提交失败 弹框提示
			   				layer.open({
			                    type: 1,
			                    title: false,
			                    closeBtn: 0,
			                    shadeClose: true,
			                    skin: 'yourclass',
			                    content: '<div class="tips">'+response[0].info+'</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
			                  });
			       			return;
			   			}
				};
				//全部成功的回调函数
				uploader.onCompleteAll = function() {
		            onCompleteAllSignal = true;
		        };
	
		    }
	
		     if( !uploader.queue.length && uploader1.queue.length) {
	   			var uploadResult = uploader1.uploadAll();
	   		
		   		//每个上传成功之后的回调函数
		   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
	//		            console.info('onSuccessItem', fileItem, response, status, headers);
		   			if(response[0].type != "error") {
		   				var unit = {};
		   				unit.name = response[0].result.fileName;
		   				unit.md5 = response[0].result.fileMd5;
		   				unit.size = response[0].result.fileSize;
		   				unit.uuid = response[0].result.uuid;
		   				unit.sourceType = 3;
		   				uploadDocList.push(unit);
		   			} else {	// 提交失败 弹框提示
		   				// TODO 弹框提示错误信息 (上传文件size=0时会报错)
		   				condole.log(response.info);
		   				layer.open({
		                    type: 1,
		                    title: false,
		                    closeBtn: 0,
		                    shadeClose: true,
		                    skin: 'yourclass',
		                    content: '<div class="tips">'+response[0].info+'</div><div class="tips_ok"onclick="layer.closeAll();">好</div>'
		                  });
		       			return;
		   			}
				};
				//全部成功的回调函数
				uploader1.onCompleteAll = function() {
		            onCompleteAllSignal = true;
		        };
		    }
		    if( !uploader.queue.length && !uploader1.queue.length) {
	   			saveCooperation();
		    }
		    //轮询是否上传成功
		    var checkUploadInterval = setInterval(function() {
		    	if(onCompleteAllSignal == true){
		    		clearUploadInterval();
		    		//alert('onCompleteAllSignal',onCompleteAllSignal);
		    		saveCooperation();
		    	}
		    },100);
		    //清除轮询
		    function clearUploadInterval() {
		    	clearInterval(checkUploadInterval);
		    }
	        function saveCooperation () {
	        	
	        	// var backJson = BimCo.SubmitAll();
	        	// backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
	       	
	        	if(backJson){
	        		 backJson = JSON.parse(backJson);
	        	}
	        	if($scope.dt) {
	        		// console.log($scope.dt);
					var dt = Common.dateFormat($scope.dt);
				} else {
					dt = '';
				}
				//拼接资料数组
				var docSelectedList1 = [];
				var formSelectedList1 = [];
				angular.forEach($scope.docSelectedList, function(value, key){
					var a = {};
					if(backJson){
							angular.forEach(backJson,function(value1, key1){
								if(!value1){
									return;
								}
			        			if(key == value.uuid){
			        				a.modifys.push(value1.PdfModify);
			        			}
			        		});
		        	}
					a.md5 = value.filemd5;
					a.name = value.docName;
					a.needSign = false;
					a.uuid = value.uuid;
					a.size = value.filesize;
					a.sourceType = $scope.beSourceType;
					docSelectedList1.push(a);
				});
				angular.forEach($scope.formSelectedList, function(value, key){
					var a = {};
					if(backJson){
						backJson = JSON.parse(backJson);
						if(backJson){
							angular.forEach(backJson,function(value1, key1){
								if(!value1){
									return;
								}
			        			if(key == value.uuid){
			        				a.modifys.push(value1.PdfModify);
			        			}
			        		});
						}
		        		
		        	}
					a.md5 = value.md5;
					a.name = value.name +'.'+value.suffix;
					a.needSign = true;
					a.uuid = value.uuid;
					a.size = value.size;
					a.sourceType = $scope.formSourceType;
					formSelectedList1.push(a);
				});
				docsList = docSelectedList1.concat(formSelectedList1, uploadDocList);
	
	
				var binds = [];//bind的工程
				if($scope.data.bindType == 2) {
					binds = [];
				} else {
					//debugger
					binds = $scope.data.assembleLps?$scope.data.assembleLps:[];
				}
				$scope.data = {
			    	binds:binds,
			    	bindType: $scope.data.bindType,
			    	collaborator: $scope.responsiblePerson.username,
			    	contracts: contracts,
			    	deadline: dt,
			    	deptId: $scope.data.deptId,
			    	desc: $scope.desc,
			    	docs: docsList,
			    	markerid: $scope.mark,
			    	name: $scope.coopname,
			    	pictures: uploadPictureList,
			    	ppid: $scope.data.ppid,
			    	priority: $scope.priority,
			    	status:status,
			    	typeId:$stateParams.typeid
			    };
			    console.log(JSON.stringify($scope.data));
			    console.log($scope.data);
				var obj = JSON.stringify($scope.data);
	
				Cooperation.createCollaboration(obj).then(function (data) {
					//debugger
					layer.close(createindex);
					var coid = data;
					if(status==0){
						$scope.data.deptId = 0;
						alert('协作存入草稿箱成功！')
					}else if(status==1){
						if(!binds.length){
							$scope.data.deptId = -1;
						}	
						alert('创建协作成功');
					}
					
					$state.go('cooperation',{'deptId':$scope.data.deptId, 'ppid':$scope.data.ppid},{ location: 'replace'});
					// $state.go('cooperation',{'transignal':$scope.data.deptId},{ location: 'replace'});
					//上传之后将coid传给客户端
					if($scope.data.bindType == 2){
						//debugger
						BimCo.UpLoadComponent(coid);
					}
					//创建成功一条协作，通知客户端
					BimCo.CreateCoSucceed();
				},function(data) {
					layer.close(createindex);
					$scope.flag.beginCreate = false;
					obj =  JSON.parse(data);
					//if(status==1) {
					//	alert(obj.message)
					//}
				});
	        }
	
		}
	    // var currentEditOfficeUuid = '8C08CC5F55F74A9CB04261750BC60EF6';
	    var currentDocSource = '';
	    var currentDocIndex = 0;
	    var currentEditOfficeUuid = '';
	    var currentSuffix = '';
	    var currentDocname = '';
	    var currentReact = '60,80,1200,720';
	    var backJson = '';
	    var handle = '';
	    var coid = "";
		$scope.isTypePdf = false;;//判断是不是PDF格式的文件
		$scope.preView = function (uuid,docName,fileType,index,docSource) {
				//可编辑表单当前index & uuid
				currentEditOfficeUuid = uuid;
				currentDocname = docName;
				currentDocSource = docSource;
				currentDocIndex = index;
	            if(fileType=='pdf'){
	            	//pdf签署（客户端）
	        		$scope.flag.isPreview = true;
	            	$scope.flag.isPdfsign = true;
	            	$scope.flag.isGeneral = false;
					$scope.isTypePdf = true;
	            	var editResult = BimCo.PdfSign(currentEditOfficeUuid,currentSuffix,currentReact,coid);
			        //编辑失败返回预览界面
			        if(!editResult){
			        	alert('下载文档失败');
			        	$scope.flag.isPreview = true;
			        }
	            } else {
	            	//普通预览（除去pdf以外的文件）
					$scope.isTypePdf = false;
	            	var data ={fileName:docName,uuid:uuid};
		        	Manage.getTrendsFileViewUrl(data).then(function (result) {
		        		console.log(typeof result)
		        		$scope.flag.isPreview = true;
		        		$scope.flag.isGeneral = true;
		        		$scope.flag.isPdfsign = false;
		        		$scope.previewUrl = $sce.trustAsResourceUrl(result);
		            },function (data) {
		            	$scope.flag.isPreview = false;
						if($scope.flag.isPreview == false){
							alert('该文件暂不支持预览');
							return;
						}else{
							$scope.previewUrl ='';
							var obj = JSON.parse(data);
							console.log(obj);
							alert(obj.message);
						}
		            });
	            }
	    }
	
	    //启用编辑
	    $scope.CommentSign = function () {
			if($scope.isClick){
				$('.edit-material').css('color','#c5c5c5');
				$scope.isClick = false;
				BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
			}
	    }
	    //保存编辑
	    $scope.saveOffice = function () {
			// layer.confirm('是否保存当前文档？', {
			// 	shadeClose: true,
			// 	zIndex: layer.zIndex, //重点1
			// 	btn: ['是','否'] //按钮
			// }, function(layero){
			// 	//layer.zIndex();
			// 	layer.setTop(layero);
			// 	var isSuccess =  BimCo.SignSubmit(coid);
			// 	if(isSuccess){
			// 		$scope.flag.isPreview = false;
			// 	} else {
			// 		$scope.flag.isPreview = false;
			// 		alert('保存失败！');
			// 	}
			// 	//layer.closeAll();
			// })
			
			
	     //    var re = confirm('是否保存当前文档？');
	    	// if(re){
	    	// 	var isSuccess =  BimCo.SignSubmit(coid);
		    //    	if(isSuccess){
		    //    		$scope.flag.isPreview = false;
		    //    	} else {
		    //    		$scope.flag.isPreview = false;
		    //    		alert('保存失败！');
		    //    	}
	    	// }
	
	    	var rtn = BimCo.MessageBox("提示" ,"是否保存当前文档？", 0x31);
	    	//确定1取消2
	    	if(rtn==1){
	    		var isSuccess =  BimCo.SignSubmit(coid);
		       	if(isSuccess){
		       		$scope.flag.isPreview = false;
		       	} else {
		       		$scope.flag.isPreview = false;
		       		alert('保存失败！');
		       	}
	    	}
	
	    }
	
	    $scope.cancelEditOffice = function () {
			// layer.confirm('是否取消编辑当前文档？', {
			// 	btn: ['是','否'] //按钮
			// }, function(){
			// 	layer.closeAll();
			// 	BimCo.SignCancel(currentEditOfficeUuid,currentSuffix);
			// },function(){
			// 	return;
			// });
			// 
			
			// var re = confirm('是否取消编辑当前文档？');
	  //   	if(re){
	  //   		$scope.flag.isPreview = false;
	  //   		BimCo.SignCancel();
		 //    }
	
		    var rtn = BimCo.MessageBox("提示" ,"是否取消编辑当前文档", 0x31);
		    //确定1取消2
		    if(rtn==1){
	    		$scope.flag.isPreview = false;
	    		BimCo.SignCancel();
		    }
	    	
	    }
	
	    $scope.backDetail = function () {
	    	$scope.flag.isPreview = false;
	    	BimCo.SignCancel();
	    	BimCo.CancelSubmitAll();
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
	
	    //取消创建
	    $scope.cancelCreate = function () {
			//询问框
			 layer.confirm('是否取消？', {
			   btn: ['是','否'] //按钮
			 }, function(){
				layer.closeAll();
				BimCo.CancelSubmitAll();
				$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid},{ location: 'replace'});
	
			  });
	    }
	
	    //详情页面跳转回homepage(cooperation)
	   	$scope.backCooperation = function (){
	   		$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid},{ location: 'replace'});
	   	}
	
	   	//反查formbe,跳转详情页面
	   	var currentPage = 'create';
	   	$scope.checkFromBe = function() {
	   		var coid = $('#checkformbe').val();
	   		if(currentPage == 'create'){
	   			var r = confirm('当前正在创建中，是否跳转？');
	   			if(r){
	   				$state.go('coopdetail',{'coid':coid})
	   			}
	   		}
	   		
	   	}
	
	}]);

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * 选择负责人/联系人
	 */
	angular.module('cooperation').controller('selectpersonCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items',
		function ($scope, $http, $uibModalInstance,Cooperation,items) {
			//选择负责人,联系人
			//设置默认值
			var flag = {
				forbidAll:false //防止多次全部选中
			};
			var defaultDeptId = 1; 	//默认第一个项目部（值）
			$scope.selectedOption = {}; //默认中第一个项目部（页面展示对象）
			$scope.deptInfo = {
				availableOptions:[]
			};
			$scope.userList = [];  //联系人列表
			$scope.responsiblePerson = ''; //当前负责人
			$scope.trans_selected = {
	        	noSign: [], //不需要签字的相关人
	        	sign: items.sign //需要签字的相关人
	        };
	//		$scope.trans_selected.sign = items.sign;
			//保存联系人的值
	//		$scope.avatar = [];
	//		$scope.downUrl = [];
			//查询值
			var queryData = {
				deptId:defaultDeptId,
				searchText:$scope.queryForm
			};
			//获取项目部
			Cooperation.getDeptList().then(function (data) {
				$scope.deptInfo.availableOptions = data;
				$scope.selectedOption = data[0].deptId + '';
				defaultDeptId = data[0].deptId;
				queryData = {
					deptId:defaultDeptId,
					searchText:$scope.queryForm
				};
				//默认联系人列表
				Cooperation.getUserList(queryData).then(function (data) {
					// var imgSrc = './imgs/icon/defalut.png';
					// console.log('start',Date.parse(new Date()));
	//				 angular.forEach(data,function(value,key){
	//					var avater = {
	//						key:key,//对应的key值
	//						avater:[]//保存的头像地址信息
	//					};
	//				 	angular.forEach(value.users,function(value1,key1) {
	//				 		var urls = {
	//				 			uuid:value1.uuid,
	//				 			url:value1.avatar
	//				 		};
	//				 		avater.avater.push(urls);
	//				 	})
	//				 	$scope.avatar.push(avater);
	//				 });
					// console.log('start',Date.parse(new Date()));
					$scope.userList = data.slice(0,8);
					//console.log(data)
				});
			});
	
			//获取指定角色目录下的所有用户的头像
	//		$scope.getUserAvaterUrl = function(index){
	//			index = parseInt(index);
	//			//获取指定的数据
	//			var avater = $scope.avatar[index];
	////			$scope.$apply(function(){
	////				$("#uib_"+index).attr("uib-collapse",false);
	////			});
	//			if(avater.key != index){
	//				return;
	//			}
	//			var urls = avater.avater;
	//			//获取所有的UUID，根据UUID区获取下载地址
	//			var uuids = [];
	//			angular.forEach(urls,function(value,key){
	//				if(value.uuid){
	//					var url = $scope.getDownUrl(value.uuid)
	//					if(url == null){
	//						uuids.push(value.uuid);
	//					}
	//				}
	//			});
	//			//获取UUID地址,
	//			var mapUrl = '';
	//			if(uuids.length > 0){
	//				uuids = JSON.stringify(uuids)
	////				Cooperation.getDownFileUrl(uuids).then(function (data) {
	////					mapUrl = data.data;
	////				});
	//				$.ajax({
	//		              type: "post",
	//		              url: basePath+'rs/co/downFileUrl',
	//		              data:uuids,
	//		              async:false,
	//		              contentType:'application/json',
	//		              success: function(data){
	//		            	  mapUrl = data;
	//		              }
	//		        });
	//			}
	//			angular.forEach(urls,function(value,key){
	//				var url = "default";
	//				var down = "./imgs/icon/defalut.png";
	//				var uuid = value.uuid;
	//				if(uuid){
	//					  angular.forEach(mapUrl,function(value,key){
	//						  if(key == uuid){
	//							  url = uuid;
	//							  down = value;
	//							  var downUrl = {
	//								  uuid:key,
	//								  url:value
	//							  };
	//							  $scope.downUrl.push(downUrl);
	//						  }
	//					  })
	//				}
	//				$("#"+index+"_"+url+"_"+key).attr("src",down);
	//			});
	//		}
			
			//获取指定的url
	//		$scope.getDownUrl =function (uuid){
	//			var url = null;
	//			 angular.forEach($scope.downUrl,function(value,key){
	//				 if(value.uuid == uuid){
	//					 url = value.url;
	//				 }
	//			 });
	//			 return url;
	//		}
			
			//切换项目部切换联系人
			$scope.switchUsers = function (params) {
				queryData = {
						deptId: params,
						searchText: $scope.queryForm
				};
				Cooperation.getUserList(queryData).then(function (data) {
					$scope.userList = data.slice(0,6);
				});
				$scope.isCollapsed = false;
			}
	
			//选择负责人--搜索功能
			$scope.responsibleSearch = function () {
				if($scope.queryForm) {
					$scope.isCollapsed = true;
					queryData = {
						deptId:$scope.selectedOption,
						searchText:$scope.queryForm
					};
					Cooperation.getUserList(queryData).then(function (data) {
						$scope.userList = data.slice(0,6);
					});
				} else if (!$scope.queryForm) {
					queryData = {
						deptId:$scope.selectedOption,
						searchText:$scope.queryForm
					};
					Cooperation.getUserList(queryData).then(function (data) {
						$scope.userList = data.slice(0,6);
					});
					$scope.isCollapsed = false;
				}
			}
			
			//负责人只能单选
			$scope.changeStaus = function (id, pid, user) {
				angular.forEach($scope.userList, function(value,key) {
						for(var i = 0; i< value.users.length;i++){
							if(key == pid && i == id){
								value.users[i].add = true;
							} else {
								value.users[i].add = false;
							}
						}
				});
				$scope.responsiblePerson = user;
	
			}
	
			//选中的相关人
			var temp = _.cloneDeep(items);
			if(temp.sign){
				var a = temp.sign.concat(temp.noSign);
			}
			$scope.relatedSelected = a ? a : [];
	
			$scope.addRelated = function (current) {
	//			var url = $scope.getDownUrl(current.uuid);
	//			if(url){
	//				current.avatar = url;
	//			}
				var currentUser = {avatar:	current.avatar,
						avatarUuid:current.uuid,
						isPassed	:false,
						isReaded:false,
						isRejected	:false,
						isSigned:false,
						needSign:false,
						username:current.username,
						mustExist:false,
						canSign:true};
				$scope.relatedSelected.push(currentUser);
				//数组去重
				var unique = _.uniqBy($scope.relatedSelected, 'username');
				$scope.relatedSelected = unique;
			}
			
			$scope.removeRelated = function (current) {
				var removeRelated = _.filter($scope.relatedSelected, function (o) {
					return o.username != current.username;
				})
				$scope.relatedSelected = removeRelated;
				var idx = signSelected.indexOf(current);
				if(idx != -1) {
					signSelected.splice(idx,1);
				}
			}
	
			//选择需要签字的相关人
			var signSelected = temp.sign ? temp.sign : [];
			
			var nosignSelected = temp.noSign ? temp.noSign :[];
	        var updateSelected = function(action,id){
	            if(action == 'add' && signSelected.indexOf(id) == -1){
	               id.needSign = true;
	               signSelected.push(id);
	               $scope.trans_selected.sign =signSelected;
	           	}
	            if(action == 'remove' && signSelected.indexOf(id)!=-1){
	            	id.needSign = false;
	               var idx = signSelected.indexOf(id);
	               signSelected.splice(idx,1);
	               $scope.trans_selected.sign =signSelected;
	            }
	         }
	 
	        $scope.updateSelection = function($event, id){
	            var checkbox = $event.target;
	            var action = (checkbox.checked?'add':'remove');
	            updateSelected(action,id);
	        }
	 
	        $scope.isSelected = function(id){
	        	//console.log('signSelected.indexOf(id)',signSelected.indexOf(id))
	            return signSelected.indexOf(id)>=0;
	        }
	
	        //选择不需要签字的相关人
	        var noSign = function () {
	        	if(signSelected.length) {
	        		nosignSelected = [];
			        nosignSelected =  _.difference($scope.relatedSelected, signSelected);
	        	} else {
	        		nosignSelected = $scope.relatedSelected;
	        	}
	        }
	
	        //选择负责人-确定按钮
			$scope.ok = function () {
	//			console.log('relatedSelected', $scope.responsiblePerson);
				if($scope.responsiblePerson != '') {
					$uibModalInstance.close($scope.responsiblePerson);
				} else {
					alert('请选择负责人');
				}
			}
	
			//选择相关人-确定按钮
			$scope.ok1 = function () {
				noSign();
				$scope.trans_selected.noSign = nosignSelected;
				$uibModalInstance.close($scope.trans_selected);	// 关闭弹框
			}
	
			//全选
			$scope.allSelected = function () {
				$scope.flag.forbidAll = true;
				angular.forEach($scope.userList,function (value, key) {
					angular.forEach(value.users, function (value1,key) {
						var currentUser = {avatar:	value1.avatar,
								avatarUuid:value1.uuid,
								isPassed	:false,
								isReaded:false,
								isRejected	:false,
								isSigned:false,
								needSign:false,
								username:value1.username,
								mustExist:false,
								canSign:true};
						$scope.relatedSelected.push(currentUser);
					})
				});
				$scope.relatedSelected = _.uniqBy($scope.relatedSelected, 'username');
				/*
				//$scope.isSelected = true;
				$scope.relatedSelected = [];	// 无论全选与否，值先清掉
				if($scope.flag.allSelected && !$scope.flag.forbidAll){
					$scope.flag.forbidAll = true;
					angular.forEach($scope.userList,function (value, key) {
						angular.forEach(value.users, function (value1,key) {
							$scope.relatedSelected.push(value1);
						})
					});
				} else {
					$scope.flag.forbidAll = false;
					$scope.trans_selected.sign = [];
					signSelected = [];
				}*/
			}
			$scope.delAll = function(){
				var noDelete = [];
				var needSign = [];
				for(var i=0; i < $scope.relatedSelected.length; i++) {
					if($scope.relatedSelected[i].mustExist) {		// 如果该相关人之前已经存在，不让删
						noDelete.push($scope.relatedSelected[i]);
						if($scope.relatedSelected[i].needSign) {	
							needSign.push($scope.relatedSelected[i]);
						}
					}
				}
				$scope.relatedSelected =noDelete;
				$scope.trans_selected.sign = needSign;
				signSelected = needSign;
	//			$scope.flag.forbidAll = false;
			}
	
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			}
	
	}]);

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * coopdetailCtrl
	 */
	angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Manage','$sce',
	    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Manage,$sce) {
			var clickSpeechMap = new jMap();
	//		console.log('detail',$stateParams);
			var currentEditOfficeUuid = '';
		    var currentSuffix = '';
		    var currentReact = '45,100,1080,720';
			var signature = '';
			$scope.link = false;
			$scope.speachShow = false;
			$scope.device = false;
			$scope.allowEdit = true;
			$scope.isPreview = false;
			$scope.flag = {};
			//页面按钮显示标志
			$scope.bjshow = true;
			$scope.tjshow = true;
			$scope.tgshow = true;
			$scope.jjueshow = true;
			$scope.jsshow = true;
			$scope.dchushow = true;
			$scope.isTypePdf = true;//判断文件类型是否是pdf格式
	
			//判断pc or bv
			if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
				$scope.device = true;
			}
	
			//bv播放按钮显示不同颜色
			if($scope.device) {
				$('.palys').addClass('play-bv');
			} else {
				$('.palys').addClass('play-pc');
			}
			//根据ui-sref路由拿到对应的coid
		   	var coid = $stateParams.coid;
		   	var ppid = 0;
		   	var coTypeVo = 0;
		   	var status = "";
		   	var currentTimestamp = Date.parse(new Date());
		   	var allRelevants = [];
		   	var sliceRlevants = [];
		   	$scope.transcoid = coid;
		   	//获取coid对应的协同详情列表
		   	Cooperation.getCollaboration(coid).then(function (data) {
		   		$scope.collaList = data;
				//console.info('需不需要签字',$scope.collaList.relevants)
				//console.info('collaList.docs',$scope.collaList.docs)
		   		if($scope.device){
		   			allRelevants = data.relevants;
			   		sliceRlevants = data.relevants.slice(0,8);
			   		if(data.relevants.length>8){
			   			$scope.collaList.relevants =sliceRlevants;
			   			$scope.isRevlentMore = true;
			   		}
		   		}
				if(data.coTypeVo) {
					coTypeVo = data.coTypeVo.type;
				}
				
				status = data.status;
				if(data.bindType !== 0 && data.binds.length) {
	//				console.info('关联模型',data.bindType)
					$scope.link = true;
					ppid = data.binds[0].ppid;
				}
				
				if(data.speach) {
					$scope.speachShow = true;
					// alert("塞值:"+data.speach.speechUrl);
					$scope.speachUrl = data.speach.speechUrl
				}
				
				if( data.deadline && data.isDeadline==3){
					$scope.deadlineStyle = 'red';
				}
				//console.info("明天的日期",(new Date().date("Y-m-d",strtotime("+1 day"))).getData())
	
				if(data.deadline == null) {
					$scope.collaList.deadline = '不限期';
				}
	
				if(data.isSign == -1){
					$scope.flag.noNeedSign = true;
				}
				//详情描述
	            if(data.desc ==null || data.desc==''){
	                $('.mobile-job-descrition,.pc-job-descrition').css("display",'none')
	            }else{
	                $('.mobile-job-descrition,.pc-job-descrition').css("display",'block')
	            }
	            //详情联系人
	            if(data.relevants.length==0){
	                $(".mobile-relate,.pc-relate").css('display','none')
	            }else{
	                $(".mobile-relate,.pc-relate").css('display','block')
	            }
	            //详情照片
	            if(data.pictures.length==0){
	                $(".mobile-photo,.pc-photo").css('display','none')
	            }else{
	                $(".mobile-photo,.pc-photo").css('display','block')
	            }
	            //详情资料
	            if(data.docs.length==0){
	                $(".mobile-means,.pc-means").css('display','none')
	            }else{
	                $(".mobile-means,.pc-means").css('display','block')
	            }
	            //详情回复
	            if(data.comments.length==0){
	                $(".mobile-reply,.pc-reply").css('display','none')
	            }else{
	                $(".mobile-reply,.pc-reply").css('display','block')
	            }
				
				//2.2.2	当当前用户为负责人但是不需要签字时
				if(data.isCollaborator && data.isSign == -1) {
					$scope.bjshow = true;
					$scope.tjshow = true;
					$scope.tgshow = false;
					$scope.jjueshow = false;
					$scope.jsshow = true;
					$scope.dchushow = true; 
				}
				//2.2.3	当当前用户不是负责人但是需要签字时
				if(!data.isCollaborator && data.isSign ==0) {
					$scope.bjshow = false;
					$scope.tjshow = true;
					$scope.tgshow = true;
					$scope.jjueshow = true;
					$scope.jsshow = false;
					$scope.dchushow = true;
				}
				//2.2.4	当当前用户既不是负责人也不需要签字时
				if(!data.isCollaborator && data.isSign == -1) {
					$scope.bjshow = false;
					$scope.tjshow = true;
					$scope.tgshow = false;
					$scope.jjueshow = false;
					$scope.jsshow = false;
					$scope.dchushow = true;
				}
	
				//是否编辑协作
				var statusReject = ['已结束','未通过','已通过','已拒绝'];
				if (statusReject.indexOf(data.status) != -1) {
					$scope.allowEdit = false;
		   			$scope.bjshow = false;
					$scope.tgshow = false;
					$scope.jjueshow = false;
					$scope.jsshow = false;
					$scope.flag.noNeedSign = true;
				}
	
				//判断当前用户已经点过通过/拒绝按钮
				if(data.isSign == 1){
					$scope.tgshow = false;
					$scope.jjueshow = false;
				}
				//当前用户是负责人
				if(data.isSign == 1 && data.isCollaborator){
					$scope.jsshow = false;
					$scope.bjshow = false;
				}
	
				var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
				angular.forEach($scope.collaList.pictures, function(value,key) {
					 var imgsrc = "imgs/pro-icon/icon-";
					//如果存在后缀名
	                if(value.name && value.name.indexOf('.') !== -1){
	                    var unit = value.name.split('.')[value.name.split('.').length - 1];
	                    unit = unit.toLowerCase();
						if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
							unit = 'other';
						}else if(unit == "docx"){
							unit = 'doc'
						}
						imgsrc = imgsrc+unit+".png";
	                    //1.获取后缀 把后缀你push到数组
	                    $scope.collaList.pictures[key].imgsrc = imgsrc;
	                }else{
	                	unit = 'other';
	                	imgsrc = imgsrc+unit+".png";
	                	$scope.collaList.pictures[key].imgsrc = imgsrc;
	                }
	
				});
				angular.forEach($scope.collaList.docs, function(value, key) {
	                var imgsrc = "imgs/pro-icon/icon-";
					//如果存在后缀名
	                if(value.name && value.name.indexOf('.') !== -1){
	                    var unit = value.name.split('.')[value.name.split('.').length - 1];
	                    unit = unit.toLowerCase();
						if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
							unit = 'other';
						}else if(unit == "docx"){
							unit = 'doc'
						}
						imgsrc = imgsrc+unit+".png";
	                    //1.获取后缀 把后缀你push到数组
	                    $scope.collaList.docs[key].imgsrc = imgsrc;
	                }else{
	                	unit = 'other';
	                	imgsrc = imgsrc+unit+".png";
	                	$scope.collaList.docs[key].imgsrc = imgsrc;
	                }
	            });
	
				angular.forEach($scope.collaList.comments, function(value, key) {
					//如果存在后缀名
					if(value.docs) {
						angular.forEach(value.docs, function(value1, key1) {
							var imgsrc = "imgs/pro-icon/icon-";
							var unit = value1.suffix;
							unit = unit.toLowerCase();
							if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" ||  unit == "undefined" ) {
								$scope.collaList.comments[key].docs[key1].suffix = 'other';
								imgsrc = imgsrc+"other.png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}else if(unit == "docx"){
								imgsrc = imgsrc+"doc.png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}else{
								imgsrc = imgsrc+unit+".png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}
							 if(value1.thumbnailUrl){
	                        	$scope.collaList.comments[key].docs[key1].imgsrc = value1.thumbnailUrl;
	                        }
						})
					}
				});
	
				//判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
				if($scope.link && !$scope.speachShow){
					$(".mobile-devices .paly-model").css({"width":'100%'})
				}else if(!$scope.link && $scope.speachShow){
					$(".mobile-devices .play-audio").css({"width":'100%'})
				}
				
				//录音初始化
				// $("#jquery_jplayer_1").jPlayer({
				// 	ready: function () {
				// 	$(this).jPlayer("setMedia", {
				// 		mp3:""
				// 	});
				// 	},
				// 	solution: "html,falsh",
				// 	supplied: "mp3",
				// 	wmode: "window",
				// 	useStateClassSkin: true,
				// 	autoBlur: false,
				// 	smoothPlayBar: true,
				// 	keyEnabled: true,
				// 	remainingDuration: true,
				// 	preload:"auto",
				// });
		   	});
	
			var id = "#jquery_jplayer_1";
	
			var flashHtml = '';
			if($scope.device) {
				flashHtml = 'html,falsh'; 
			} else {
				flashHtml = 'html,falsh'; 
			}
			
			var bubble = {
					title:"Bubble",
					mp3:''
				};
				
			var options = {
				solution: flashHtml,
				swfPath: "./lib/audio1",
				supplied: "mp3",
				wmode: "window",
				useStateClassSkin: true,
				autoBlur: false,
				smoothPlayBar: true,
				keyEnabled: true,
				remainingDuration: true,
				preload:"auto",
				ended:function(){
					$(".detail-voice").hide();
				}
			};
	
			var myAndroidFix = new jPlayerAndroidFix(id, bubble, options);
	
			$scope.play = function(speechUrl){
				var datamp3url;
				$(".detail-voice").css('display','block');
				$(".detail-close").css("display",'block');
				if(clickSpeechMap.get(speechUrl) == null){
					$.ajax({
			              type: "POST",
			              url: basePath+'rs/co/getMP3URL',
			              data:speechUrl,
			              async:false,
			              contentType:'text/HTML',
			              success: function(mp3url,status,XMLHttpRequest){
			            	   if(mp3url.indexOf('<!DOCTYPE html>')!=-1){
			            	 		document.location = 'co_detail.jsp?coid='+ coid;
			            	   	}
			            	  	datamp3url = mp3url;
			              }
			        });
					clickSpeechMap.put(speechUrl, datamp3url);
				}
	
				bubble.mp3 = clickSpeechMap.get(speechUrl);
				myAndroidFix.setMedia(bubble).play();
					
				
			}
			
			function jMap(){
				//私有变量
				var arr = {};
				//增加
				this.put = function(key,value){
					arr[key] = value;
				}
				//查询
				this.get = function(key){
					if(arr[key]){
						return arr[key]
					}else{
						return null;
					}
				}
				//删除
				this.remove = function(key){
					//delete 是javascript中关键字 作用是删除类中的一些属性
					delete arr[key]
				}
				//遍历
				this.eachMap = function(fn){
					for(var key in arr){
						fn(key,arr[key])
					}
				}
			}
			
			
			
	
			//play-audio(播放声音的显示播放窗口事件)
			$scope.audioClose = function () {
				$("#jquery_jplayer_1").jPlayer("stop");
				$(".detail-voice").hide();
				$(".detail-close").hide();
			}
	
		   	//编辑协作跳转
		   	 $scope.allowEditTrans = function () {
		   	 	if($scope.allowEdit && !$scope.collaList.isLock) {
		   	 		Cooperation.checkOut(coid).then(function(data) {	
		   	 		});
		   	 		$state.go('editdetail', {coid: coid});
		   	 	} else {
		   	 		layer.alert('当前协作已被“'+$scope.collaList.operationName+'”签出，请稍后重试！', {
	        		  	title:'提示',
					  	closeBtn: 0
					});
		   	 	}
		   	 }
	
		   	//pc端交互
		   	$scope.checkModelpc = function () {
		   		BimCo.LocateComponent(ppid,coid);
		   	}
	
		   	//移动端交互
		   	$scope.checkModel = function () {
		   		sendCommand(1,coid);
		   	}
	
		   	$scope.zoom = function (uuid) {
		   		sendCommand(6,coid,uuid);
		   	}
	
		   	$scope.previewComment = function (index,uuid){
		   		sendCommand(7,index,uuid);
		   	}
		   	
		   	$scope.docsOpen = function (uuid) {
		   		sendCommand(5,coid,uuid);
		   	}
	
		   	$scope.previewDocs = function (uuid) {
		   		sendCommand(2,coid,uuid);
		   	}
	
		   	$scope.downDocs = function (uuid) {
		   		sendCommand(3,coid,uuid);
		   	}
	
		 	//     function sendCommand(optType,id){
			//     var param = "{"+ "\"optType\":"+optType+",\"id\":\""+id + "\"}";
			//     //document.location = "http://bv.local?param=" + param;
			//     var a  = "http://bv.local?param=" + param;
			//     alert(a);
			// }
	
			function sendCommand(optType,id,uuid){
	
			    var param = '{"optType":'+optType+',"coid":"'+id+'"}';
			    if(optType==2||optType==3||optType==5||optType==6){
					param = '{"optType":'+optType+',"coid":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
			    }
			    if(optType==7){
			    	param = '{"optType":'+optType+',"index":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
			    }
			    if(optType==8){
			    	param = '{"title":'+title+'}'
			    }
			    //document.location = "http://bv.local?param=" + param;
			    //var a  = "http://bv.local?param=" + param;
			    //document.location.href = a;
			    //alert(document.location.href);
			    document.location = 'http://localhost:8080/bv/?param='+param;
			}
	
			//侧边栏获取动态列表
			var trendflag = true;
			$scope.getOperationList = function() {
				if(trendflag){
					Cooperation.getOperationList(coid).then(function (data) {
	                	$scope.operationList = data;
	          		});
				}
				trendflag = false;
			}
			
			//更新评论
	
	        $scope.updateComment = function () {
	            var trans = {};
	            trans.coid = coid;
	            trans.coTypeVo = coTypeVo; 
	            trans.status = status;
	            var modalInstance = $uibModal.open({
					windowClass:'update-comment',
	            	size: 'lg',
	                backdrop : 'static',
	                templateUrl: 'template/cooperation/updatecomment.html',
	                controller:'updatecommentCtrl',
	                resolve:{
	                    items: function () {
	                        return trans;
	                    }
	                }
	            });
	            modalInstance.result.then(function (data) {
	            	Cooperation.commentToCollaboration(data).then(function (data) {
						$state.go($state.current, {}, {reload: true});
	    			},function(data) {
						alert(data.message);
					});
	
	            });
	        }
	
			//手机端页面侧边栏划出效果
			$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
				//    详情页面图片资料悬浮出现下载区域
				$(".action .picInfo .data-list .deta-down ").hover(function () {
					$(this).find(".show-icon").stop().animate({"bottom":"-1px"})
				},function(){
					$(this).find(".show-icon").stop().animate({"bottom":"-38px"})
				});
			    //	详情页面的照片悬浮出现预览功能
				$(".detail-sear").hover(function(){
					$(this).find(".detail-search").stop().animate({"bottom":"-1px"})
				},function(){
					$(this).find(".detail-search").stop().animate({"bottom":"-38px"})
				});
	
			////	手机端照片搜索按钮的显示
			//	$(".means-down").click(function(){
			//		console.info(123)
			//		//$(this).find(".means-address").slideUp()
			//	})
			//	
			//
	
	
			});
			
			//协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
			$scope.doCollaboration = function (statusCode) {
				var params = {
					coid:coid,
					docs:[],
					operationType:statusCode
				}
				if(!$scope.collaList.isLock){
					switch (statusCode) {
						case 6:
						var re = confirm('提交后您将不能再修改，若确认通过,请点击确定!');
						if(re){
							doCollaboration();
							location.reload();
						}
						break;
						case 7:
						var re = confirm('拒绝后将不能再修改，若确认拒绝,请点击确定！');
						if(re){
							doCollaboration();
							location.reload();
						}
						break;
						case 8:
						var re = confirm('结束后您将不能再修改，是否结束？');
						if(re){
							doCollaboration();
							location.reload();
						}
						break;
						default:
						doCollaboration();
						break;
					}
				} else {
					layer.alert('当前协作已被“'+$scope.collaList.operationName+'”签出，请稍后重试！', {
	        		  	title:'提示',
					  	closeBtn: 0
					});
				}
				
				function doCollaboration (){
					Cooperation.doCollaboration(params).then(function (data) {
						$state.go('cooperation');
					},function (data) {
						alert(data.data.message);
					});
				}
			}	
			//pc对接
			//进入页面
			$scope.previewSign = function (uuid,docName,isPdfsign) {
	            var suffix = '';
	            if(docName.indexOf('.')!=-1){
	            	//获取电子签名uuid
	            	suffix = docName.split('.')[docName.split('.').length-1];
	            	if(suffix=='pdf' && isPdfsign == 1){
	            		//pdf签署（客户端）
	            		$scope.flag.isPreview = true;
		            	$scope.flag.isApprove = true;
		            	$scope.flag.isGeneral = false;
		            	$scope.flag.isPdfsign = false;
		            	var pdfSign = BimCo.PdfSign(uuid,suffix,currentReact,coid);
						if(!pdfSign) {
							alert('下载文件失败！');
						}
		            } else {
		            	//普通预览（除去pdf以外的文件）
		            	var data ={fileName:docName,uuid:uuid};
			        	Manage.getTrendsFileViewUrl(data).then(function (result) {
			        		console.log(typeof result)
			        		$scope.flag.isPreview = true;
			        		$scope.flag.isGeneral = true;
			        		$scope.flag.isPdfsign = false;
			        		$scope.flag.isApprove = false;
			        		$scope.previewUrl = $sce.trustAsResourceUrl(result);
			            },function (data) {
			            	$scope.flag.isPreview = false;
			            	$scope.previewUrl ='';
			                var obj = JSON.parse(data);
			                console.log(obj);
			                alert(obj.message);
			            });
		            }
	            }
	    	}
	
	    	//添加审批意见
	    	$scope.addApprove = function() {
	    		// alert('$scope.collaList.isSign='+$scope.collaList.isSign);
	    		if($scope.collaList.isSign == 1){
	    			BimCo.MessageBox("提示" ,"您已通过（拒绝）该协作，不能进行二次审批！", 0);
	    			return;
	    		}
	    		if($scope.collaList.status=='已结束'){
	    			BimCo.MessageBox("提示" ,"当前协作已结束，不能再进行操作!", 0);
	    			return;
	    		}
	    		//添加审批意见时签出
	    		Cooperation.checkOut(coid).then(function(data){
					$scope.flag.isPdfsign = true;
	    		},function(data){
	    			//弹框提示用户当前被签出
	    			BimCo.MessageBox("提示" ,data.message, 0);
	    			return;
	    		});
	    	}
	
			//签署意见
			$scope.signComment = function () {
					$scope.isSign = true;
		        	BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
		    }
		    //电子签名
		    $scope.signElectronic = function () {
		    	//获取电子签名
		    	Cooperation.getSignature().then(function (data) {
					signature = data.uuid;
				});
		    	$scope.isEleSign = true;
		       	BimCo.ElectronicSign(signature);
	
		    }
		    //提交
		    $scope.SubmitAll = function () {
		    	var rtn = BimCo.MessageBox("提示" ,"提交后将不能再修改，若确认无无误请点击确认！", 0x31);
		    	var isSignSubmit;
		    	var backJson;
		    	// backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
		    	//backJson = "{\"6330EB632087445B98DB6D6B677B136A\":{\"PdfModify\":[{\"contents\":\"asdfasdfaf\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":477.74996948242188,\"yAxis\":786.75}]},\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"我好\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":427.49996948242188,\"yAxis\":759.4000244140625}]},\"C053AFCBAE3742E1907C711AEEE49FB1\":{\"PdfModify\":[{\"contents\":\"asfasfasfa\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":390.74996948242188,\"yAxis\":749.75}]}}"
		    	var modifyDocs=[];
		    	if(rtn==1){
		    		//客户端临时缓存
		    		BimCo.SignSubmit();
		    		//客户端正式提交
		    		backJson = BimCo.SubmitAll();
	            
		    		if(backJson){
			    		backJson = JSON.parse(backJson);
			    	}
			    	if(backJson){
						angular.forEach(backJson,function(value, key){
							if(!value){
								return;
							} else {
								var unit = {};
								unit.uuid = key;
								unit.modifys = value.PdfModify;
								modifyDocs.push(unit);
							}
		        		});
			    	}
			    	var params = {
						coid:coid,
						docs:modifyDocs,
						operationType:4
					}
			    	Cooperation.doCollaboration(params).then(function (data) {
						$scope.flag.isPreview = false;
					},function (data) {
						//提交不成功签入协作，跳转回详情界面
						Cooperation.checkIn(coid).then(function(data) {
		   	 			});
						$scope.flag.isPreview = false;
						BimCo.MessageBox("提示",data.message,0);
					});
			    	}
		    }
	
		    //取消
		    $scope.signCancel = function () {
		    	var rtn = BimCo.MessageBox("提示" ,"放弃编辑？", 0x31);
		    	if(rtn==1) {
		    		//取消调用签入
		    		Cooperation.checkIn(coid).then(function(data){
		    		});
		    		BimCo.SignCancel();
		    		BimCo.CancelSubmitAll();
		    		$scope.flag.isPreview = false;
		    	}
		    }
	
		    //清空
		    $scope.signEmpty = function () {
		    	BimCo.SignEmpty();
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
		    //显示更多相关人
		    $scope.showMore = false;
		    $scope.showMorePerson = function() {
		    	if(!$scope.showMore){
		    		$scope.collaList.relevants = allRelevants;
		    		$scope.showMore = true;
		    	} else {
		    		$scope.collaList.relevants = sliceRlevants;
		    		$scope.showMore = false;
		    	}
		    }
	
		    //预览界面跳转回详情
		    $scope.backDetail = function () {
		    	if($scope.flag.isPreview && $scope.flag.isApprove){
		    		BimCo.SignCancel();
		    		BimCo.CancelSubmitAll(); 
		    		//签署页面返回调用签入
		    		Cooperation.checkIn(coid).then(function(data){
		    		});
		    	}
		    	$scope.flag.isPreview = false;
		    	$scope.flag.isPdfsign = false;
		    }
		    
		    //详情页面跳转回homepage(cooperation)
		   	$scope.backCooperation = function (){
		   		if($scope.collaList.status=='草稿箱'){
		   			//草稿箱
		   			$scope.collaList.deptId = 0;
		   		} else if(!$scope.collaList.binds || $scope.collaList.binds.length==0){
		   			//未关联
		   			$scope.collaList.deptId = -1;
		   		}
		   		$state.go('cooperation',{'deptId':$scope.collaList.deptId, 'ppid':$scope.collaList.ppid,'status':$scope.collaList.statusId},{ location: 'replace'});
		   	}
	
		   	//反查formbe,跳转详情页面
		   	var currentPage = 'pdfSign';
		   	$scope.checkFromBe = function() {
		   		var coid = $('#checkformbe').val();
		   		//当前正在签署
		   		if(currentPage == 'pdfSign' && $scope.flag.isPdfsign){
		   			var r = confirm('当前正在签署中，是否跳转？');
		   			if(r){
		   				BimCo.SignCancel();
		    			BimCo.CancelSubmitAll(); 
		   				$state.go('coopdetail',{'coid':coid});
		   			}
		   		} else {
		   			//非签署状态
		   			$state.go('coopdetail',{'coid':coid})
		   		}
		   		
		   	}
		 
	}]);

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * updatecommentCtrl
	 */
	angular.module('cooperation').controller('updatecommentCtrl',['$rootScope','$scope', '$http', '$uibModalInstance','Cooperation','items','Common','FileUploader','$timeout',
	    function ($rootScope,$scope, $http, $uibModalInstance,Cooperation,items,Common,FileUploader,$timeout) {
	    	var onCompleteAllSignal = false;
	    	$scope.uploadBegin = false;
	    	$scope.zhenggai = false;
	    	$scope.status = items.status;
			$scope.isUpdataOK = false;
	
			switch ($scope.status) {
				case '空':
					$scope.status = '11';
					break;
				case '已整改':
					$scope.status ='1' ;
					break;
				case '整改中':
					$scope.status = '2';
					break;
				case '不整改':
					$scope.status = '3';
					break;
				case '待整改':
					$scope.status = '4';
					break;
				case '未整改':
					$scope.status = '5';
					break;
			}
			//如果是问题整改则显示状态
			var isShowArr = ["已结束","已通过","已通过","进行中"];
			//debugger
			if(isShowArr.indexOf($scope.status) == -1) {
				$scope.zhenggai = true;
				$(".detail-state").show();
			} else if( coTypeVo === 1) {
				$scope.zhenggai = true;
				$(".detail-state").show();
			}else{
				$(".detail-state").hide();
			}
			//switch($scope.status){
			//	case "已结束":
			//		$scope.zhenggai = false;
			//		break;
			//	case "已通过":
			//		$scope.zhenggai = false;
			//		break;
			//	case "已拒绝":
			//		$scope.zhenggai = false;
			//		break;
			//}
	    	//详情展示页添加更新
	    	var coTypeVo = items.coTypeVo;
	    	var date = Common.dateFormat1(new Date());
	    	var uploadList = [];
	
	
	
	    	//上传资料
		    var uploader1 = $scope.uploader1 = new FileUploader({
		    		url: '/bimco/fileupload/upload.do'
		    });
	
		    //FILTERS
		    uploader1.filters.push({
		    	name: 'customFilter',
		        fn: function(item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 31;
		        }
		    });
	
		    //点击上传资料按钮
		    $scope.docsUpload = function () {
		    	$('.upload-docs').attr('uploader', 'uploader1');
		    	$('.upload-docs').attr('nv-file-select', '');
		    	$('.upload-docs').click();
		    }
	
	       	$scope.ok = function() {
				if(!$scope.comment){
					$scope.isUpdataOK = true;
					return;
				}
	
				$scope.status = parseInt($scope.status);
	       		var data = {
	    	 	coid: items.coid,
	    	 	comment: {
	    	 		comment: $scope.comment, /*内容*/
	    	 		commentator:'', /*评论人后端接口没给*/
	    	 		commentTime:date,	/*评论时间*/
	    	 		docs: [],	/*文件列表*/
	    	 		// coSpeech:'' /*整改录音*/
		    	 	},
		    	 	status: $scope.status
		    	}
		    	//0.全部上传
		    	//1.上传回调给uploadList赋值
		    	//2.每次上传回调给赋值
		    	//点击确定保存图片和评论文字，去主页面调用更新评论reload详情页面
	
			if(uploader1.queue.length) {
				$scope.uploadBegin = true;
	   			uploader1.uploadAll();
	   		} else {
	   			$uibModalInstance.close(data);
	   		}
	   		//每个上传成功之后的回调函数
	   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
		            console.info('onSuccessItem', fileItem, response, status, headers);
		            var unit = {};
		            unit.name = response[0].result.fileName;
		            unit.md5 = response[0].result.fileMd5;
		            unit.size = response[0].result.fileSize;
		            unit.uuid = response[0].result.uuid;
		            unit.suffix = response[0].result.suffix;
		            uploadList.push(unit);
			};
					//全部成功的回调函数
					uploader1.onCompleteAll = function() {
						onCompleteAllSignal = true;
						data.comment.docs = uploadList;
						if(uploader1.progress == 100) {
							$uibModalInstance.close(data);
						}
	
					};
	
	
	
	    }
	
	    $scope.cancel = function () {
	        $uibModalInstance.dismiss('cancel');
	    }
		//$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
		//	$(".update-comment .updata-up li:odd").css({'margin-right':'0','float':'right'})
		//})
	
	}]);

/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Created by sdergt on 2016/8/16.
	 */
	angular.module('cooperation').controller('editdetailCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', 'Common','Manage','$timeout','headerService',
	
	    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, Common, Manage,$timeout,headerService) {
	        $scope.device = false;
	        //判断pc or bv
	        if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
	            $scope.device = true;
	        }
	        var coid = $stateParams.coid;
	        $scope.transcoid = $stateParams.coid;
	        $scope.zhenggai = false;
	        $scope.responsiblePerson = {}//选择相关人
	        var contracts = [];
	        //设置日期相关
	        $scope.dateOptions = {
	            formatYear: 'yy',
	            maxDate: new Date(2020, 5, 22),
	            startingDay: 1,
	            showWeeks: false,
	            minDate: new Date()
	        };
	
	        $scope.open2 = function () {
	            //console.info(123123131)
	            $scope.popup2.opened = true;
	            $scope.isDeadlineNull = false;
	
	        };
	
	        $scope.popup2 = {
	            opened: false
	        };
	
	        $scope.checksignal = false;
	        //协作详情数据
	        var coid = $stateParams.coid;
	        var allRelevants = [];
	        var sliceRlevants = [];
	        var pcAllRelevants = [];
	        $scope.related = {
	                sign:[],
	                noSign:[],
	            };
	        Cooperation.getCollaboration(coid).then(function (data) {
	        	
	        	angular.forEach(data.relevants,function(value,key){
	        		value.mustExist = true;
	        		value.canSign = false;
	        		if(value.needSign){
	        			$scope.related.sign.push(value);
	        		}else{
	        			$scope.related.noSign.push(value);
	        		}
	        	});
	        	console.log($scope.related);
	            var currentMarkInfo = data.markerInfo.id;
	//            console.info('标识Id',currentMarkInfo)
	            $scope.collaList = data;
	            $scope.priority =  data.priority;
	            if($scope.device){
	            	  allRelevants = _.cloneDeep(data.relevants);
	            	  sliceRlevants = _.cloneDeep(data.relevants.slice(0,8));
	            	 if(data.relevants.length>8){
		                $scope.collaList.relevants =sliceRlevants;
		                $scope.isRevlentMore = true;
		            }
	            	 angular.forEach(allRelevants, function (value, key) {
	                     var unit = {};
	                     unit.username = value.username;
	                     unit.needSign = value.needSign;
	                     contracts.push(unit);
	                 });
	            } else {
	            	pcAllRelevants = data.relevants;
	            	angular.forEach(pcAllRelevants, function (value, key) {
	                    var unit = {};
	                    unit.username = value.username;
	                    unit.needSign = value.needSign;
	                    contracts.push(unit);
	                });
	            }
	           
	            if(data.priority == "I") {
	                $scope.priority = "1";
	            } else if (data.priority == "II") {
	                $scope.priority = "2";
	            } else if (data.priority == "III") {
	                $scope.priority = "3";
	            }
	            $scope.dt = data.deadline;
	            $scope.desc = data.desc;
	
	            if(!data.deadline) {
	                $scope.isDeadlineNull = true;
	            }
	            if( data.deadline && data.isDeadline==3){
	                $scope.deadlineStyle = 'red';
	            }
	           
	            
	            if(data){
	                //获取标识
	                Cooperation.getMarkerList().then(function (data) {
	                    $scope.markerList1 = data;
	                    $scope.mark1 = currentMarkInfo + '';
	                     if(data[0].markerId){
	                        $timeout(function() {
	                            $('.selectpicker1').selectpicker({
	                                style: '',
	                                size: 'auto'
	                            });
	                        },0);
	                     }
	                });
	                //获取优先级
	                Cooperation.getPriorityList().then(function(data) {
	                    $scope.priorityList = data;
	                    if(data[0].code){
	                        $timeout(function() {
	                            $('.selectpicker').selectpicker({
	                                style: '',
	                                size: 'auto'
	                            });
	                        },0);
	                    }
	                   
	                });
	                //type = 0 问题整改
	                if(data.coTypeVo.type == 1) {
	                    $scope.zhenggai = true;
	                }
	            }
	            //详情联系人
	            if($scope.collaList.relevants.length==0){
	                $(".mobile-relate,.pc-relate").css('display','none')
	            }else{
	                $(".mobile-relate,.pc-relate").css('display','block')
	            }
	            //详情照片
	            if($scope.collaList.pictures.length==0){
	                $(".mobile-photo,.pc-photo").css('display','none')
	            }else{
	                $(".mobile-photo,.pc-photo").css('display','block')
	            }
	            //详情资料
	            if($scope.collaList.docs.length==0){
	                $(".mobile-means,.pc-means").css('display','none')
	            }else{
	                $(".mobile-means,.pc-means").css('display','block')
	            }
	            //详情回复
	            if($scope.collaList.comments.length==0){
	                $(".mobile-reply,.pc-reply").css('display','none')
	            }else{
	                $(".mobile-reply,.pc-reply").css('display','block')
	            }
	
	            //选择负责人
	            $scope.selectResponsible = function () {
	                var modalInstance = $uibModal.open({
	                    windowClass: 'select-person-responsible-modal',
	                    backdrop : 'static',
	                    templateUrl: 'template/cooperation/select_person_responsible.html',
	                    controller:'selectpersonCtrl',
	                    resolve:{
	                        items: function () {
	                            return [];
	                        }
	                    }
	                });
	                modalInstance.result.then(function (selectedItem) {
	                    $scope.responsiblePerson = selectedItem;
	                });
	            }
	            headerService.currentUserInfo().then(function(data){
	                $scope.responsiblePerson.username = data.userName;
	                $scope.responsiblePerson.avatar = data.avatarUrl;
	            })
	            var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3']; 
	            angular.forEach($scope.collaList.docs, function(value, key) {
	                var imgsrc = "imgs/pro-icon/icon-";
					//如果存在后缀名
	                if(value.name.indexOf('.') !== -1){
	                    var unit = value.name.split('.')[value.name.split('.').length - 1];
	                    unit = unit.toLowerCase();
						if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
							unit = 'other';
						}else if(unit == "docx"){
							unit = 'doc'
						}
						imgsrc = imgsrc+unit+".png";
	                    //1.获取后缀 把后缀你push到数组
	                    $scope.collaList.docs[key].imgsrc = imgsrc;
	                }else{
	                	unit = 'other';
	                	imgsrc = imgsrc+unit+".png";
	                	$scope.collaList.docs[key].imgsrc = imgsrc;
	                }
	            });
	
	            angular.forEach($scope.collaList.comments, function(value, key) {
	                if(value.docs) {
	                    angular.forEach(value.docs, function(value1, key1) {
	                    	var imgsrc = "imgs/pro-icon/icon-";
	                    	var unit = value1.suffix;
	                    	    unit = unit.toLowerCase();
	                        if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
	                            $scope.collaList.comments[key].docs[key1].suffix = 'other';
	                            imgsrc = imgsrc+"other.png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}else if(unit == "docx"){
								imgsrc = imgsrc+"doc.png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}else{
								imgsrc = imgsrc+unit+".png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
							}
	                        if(value1.thumbnailUrl){
	                        	$scope.collaList.comments[key].docs[key1].imgsrc = value1.thumbnailUrl;
	                        }
	                    })
	                }
	            });
	
	
	        });
	        
	        //更改标识
	        $scope.switchMark = function (mark1) {
	            $scope.mark1 = mark1;
	        }
	
	        //更改优先级
	        $scope.switchPriority = function (priority) {
	            $scope.priority = priority;
	        }
	        
	        //移动端交互
	        $scope.checkModel = function () {
	            sendCommand(1,coid);
	        }
	
	        $scope.zoom = function (uuid) {
	            sendCommand(6,coid,uuid);
	        }
	
	        $scope.docsOpen = function (uuid) {
	            sendCommand(5,coid,uuid);
	        }
	
	        $scope.previewDocs = function (uuid) {
	            sendCommand(2,coid,uuid);
	        }
	
	        $scope.downDocs = function (uuid) {
	            sendCommand(3,coid,uuid);
	        }
	
	
	        function sendCommand(optType,id,uuid){
	
	            var param = '{"optType":'+optType+',"coid":"'+id+'"}';
	            if(optType==2||optType==3||optType==5||optType==6){
	                param = '{"optType":'+optType+',"coid":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
	            }
	            //document.location = "http://bv.local?param=" + param;
	            //var a  = "http://bv.local?param=" + param;
	            //document.location.href = a;
	            //alert(document.location.href);
	            document.location = 'http://localhost:8080/bv/?param='+param;
	        }
	
	        $scope.ok = function () {
	            if(!$scope.collaList.name) {
	                var index = layer.open({
	                  type: 1,
	                  title: false,
	                  closeBtn: 0,
	                  shadeClose: true,
	                  skin: 'yourclass',
	                  content: '<div class="tips">当前协作主题不能为空</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
	                });
	            }
	
	            if($scope.device){
	                $scope.dt = $('.date-value-bv').html();
	            } else {
	                $scope.dt = $('.data-value').html();
	            }
	            
	            if($scope.dt) {
	                $scope.dt =  $scope.dt;
	            } else {
	                $scope.dt = '';
	            }
	            var data = {
	                coid: coid,
	                contracts: contracts,
	                deadline: $scope.dt,
	                desc: $scope.collaList.desc,
	                markerid: parseInt($scope.mark1),
	                name: $scope.collaList.name,
	                priority: $scope.priority,
	                status: $scope.collaList.statusId
	            };
	
	            Cooperation.updateCollaboration(data).then(function (data,status) {
	                if($scope.device) {
	                    //bv成功
	                    if(data.indexOf('<!DOCTYPE html>')!=-1){
	                        var param = '{"optType":'+9+',"isSuccess":'+false+'}';
	                    } else {
	                        var param = '{"optType":'+9+',"isSuccess":'+true+'}';
	                    }
	                    document.location = 'http://localhost:8080/bv/?param='+param;
	                } else {
	                    document.location = 'co_detail.jsp?coid='+ coid;
	                }
	               
	            },function(data){
	               if($scope.device) {
	                    //bv失败
	                    var message = data.message;
	                    var param = '{"optType":'+9+',"isSuccess":'+false+',"message":"'+message+'"}';
	                    document.location = 'http://localhost:8080/bv/?param='+param;
	                } else {
	                    console.log(message);
	                }
	            });
	          
	        }
	
	
	        //获取标识
	        // Cooperation.getMarkerList().then(function (data) {
	        //     $scope.markerList1 = data;
	        //     console.log($scope.markerList1);
	        //     console.log($scope.collaList);
	        //      debugger;
	        //     $scope.mark1 = _.filter($scope.markerList1, function(o) {
	
	        //         return o.picMarker == $scope.collaList.markerInfo.name;
	        //     });
	        //     console.log('mark1', $scope.mark1);
	        // });
	        //
	        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
	
	            //    详情页面图片资料悬浮出现下载区域
	            $(".action .picInfo .data-list .deta-down ").hover(function () {
	                $(this).find(".show-icon").stop().animate({"bottom":"-1px"})
	            },function(){
	                $(this).find(".show-icon").stop().animate({"bottom":"-38px"})
	            });
	            //	详情页面的照片悬浮出现预览功能
	            $(".detail-sear").hover(function(){
	                $(this).find(".detail-search").stop().animate({"bottom":"-1px"})
	            },function(){
	                $(this).find(".detail-search").stop().animate({"bottom":"-38px"})
	            })
	            ////	手机端照片搜索按钮的显示
	            //	$(".means-down").click(function(){
	            //		console.info(123)
	            //		//$(this).find(".means-address").slideUp()
	            })
	
	        //选择相关人
	        //选择相关人
	      
	        
	        $scope.selectRelated = function () {
	            var modalInstance = $uibModal.open({
	                windowClass:'edit-raltive-person',
	                size:'lg',
	                backdrop : 'static',
	                templateUrl: 'template/cooperation/select_person_related.html',
	                controller:'selectpersonCtrl',
	                resolve:{
	                    items: function () {
	                        return $scope.related;
	                    }
	                }
	            });
	            modalInstance.result.then(function (selectedItem) {	// 向后台发送需要保存的数据
	                $scope.related.noSign = selectedItem.noSign;
	                $scope.related.sign = selectedItem.sign;
	                if(contracts.length){
	                	contracts = [];
	                }
	                angular.forEach(selectedItem.noSign, function (value ,key) {	// 不需要签字
	                    var needSign = false;
	                    var a = {}
	                    a.needSign = needSign;
	                    a.username = value.username;
	                    contracts.push(a);
	                });
	                angular.forEach(selectedItem.sign, function (value ,key) {	// 需要签字
	                    var needSign = true;
	                    var a = {}
	                    a.needSign = needSign;
	                    a.username = value.username;
	                    contracts.push(a);
	                });
	            });
	        }
	        //点击蒙层出现关闭按钮
	        $scope.onTurn = function(){
	            //console.info("小白兔")
	        }
	
	        //预览功能
	        $scope.pcPreView = function (docName, uuid) {
	                var data = {fileName:docName,uuid:uuid};
	                Manage.getTrendsFileViewUrl(data).then(function (result) {
	                console.log(typeof result)
	                $scope.isPreview = true;
	                $scope.previewUrl =result;
	                layer.open({
	                        type: 2,
	                        //skin: 'layui-layer-lan',
	                        title: '预览',
	                        fix: false,
	                        shadeClose: true,
	                        maxmin: true,
	                        area: ['1000px', '500px'],
	                        content: $scope.previewUrl
	                    });
	            },function (data) {
	                var obj = JSON.parse(data);
	                console.log(obj);
	                alert(obj.message);
	            });
	            
	        }
	        // 返回上个页面
	        $scope.backDetail = function() {
	        	$state.go('coopdetail', {'coid':coid});
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
	
	        //显示更多相关人
	        $scope.showMore = false;
	        $scope.showMorePerson = function() {
	            if(!$scope.showMore){
	                $scope.collaList.relevants = allRelevants;
	                $scope.showMore = true;
	            } else {
	                $scope.collaList.relevants = sliceRlevants;
	                $scope.showMore = false;
	            }
	        }
	
	        //反查formbe,跳转详情页面
	        var currentPage = 'editdetail';
	        $scope.checkFromBe = function() {
	            var coid = $('#checkformbe').val();
	            if(currentPage == 'editdetail'){
	                var r = confirm('当前正在编辑协作，是否跳转？');
	                if(r){
	                    $state.go('coopdetail',{'coid':coid})
	                }
	            }
	            
	        }
	
	    
	}]);

/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * linkprojectCtrl
	 */
	var level = 1;	// 当前树状态树展开、折叠深度
	var maxLevel = -1;	
	var levelCategory = 1;	// 构建类别树状态树展开、折叠深度
	angular.module('cooperation').controller('linkprojectCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
		function ($scope, $http, $uibModalInstance,Cooperation) {
			$scope.openSignal = true;
		 	$scope.projtype = "0";
			$scope.functionOption = "0";
			var nodelist=[];//树dataArray
			var tjnodestore=[];
			var gjnodestore=[];
			var aznodestore=[];
			var revitnodestore=[];
			var teklanodestore=[];
			var pdfppidstore=[];
			var projTypeSearchPpid=[];//工程类型搜索出来的ppid
			var TextSearchPpid=[];//文本搜索出来的ppid
			var functionSearchPpid=[];//功能搜索出来的ppid
			var initPpid=[];//初始化没有任何条件的ppid
			var searchPpid=[];//最终合并ppid
			var maxlevel=0;//最大层级
			var dataList = {};
			var ppid,projType,treeObj,floor,compClass,subClass,spec;
			var selectedProject =  {};
			var selectedNodes;
			var setting = {
				view:{
					selectedMulti: false
				},
				callback:{
					onClick: zTreeOnClick,
					onCollapse: function (event, treeId, treeNode) {
					    level=treeNode.level;
					    levelCategory=treeNode.level;
					},
					onExpand: function (event, treeId, treeNode) {
					    level=treeNode.level;
					    levelCategory=treeNode.level;
					}
				}
	         };
			$scope.projectTree = [];
			$scope.openSignal = true;
			//获取工程树
			Cooperation.getProjectTree().then(function (data) {
	//			console.log(data);
				$scope.projectTree = data;
				treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
				//全部打开
				treeObj.expandAll(true);
				nodelist = treeObj.transformToArray(treeObj.getNodes());
				// 只打开一层
	//			treeObj.expandNode(nodelist[0], true, false, null, true);
				// 设置当前打开的层数
				for(var i = 0 ; i<nodelist.length;i++){
					if(nodelist[i].level >= maxLevel){
						maxLevel = nodelist[i].level;
					}
					if(nodelist[i].type==3){
						categoryprojtype(nodelist[i]);
					}
				}
				level = maxLevel;
				levelCategory = maxLevel;
			});
	
	
			//工程分类处理
			function categoryprojtype(node){
				if(maxlevel<node.level){//获取最大层级
					maxlevel = node.level;
				}
				
				var str0 = node.value.split("-")[0];
				var str1 = node.value.split("-")[1];
				var str2 = node.value.split("-")[2];
				initPpid.push(str2);
				projTypeSearchPpid.push(str2);
			    TextSearchPpid.push(str2);
				functionSearchPpid.push(str2);
				if(str1=='2'){
					pdfppidstore.push(str2);
				}else if(str0=="1"){
					tjnodestore.push(str2);
				}else if(str0=="2"){
					gjnodestore.push(str2);
				}else if(str0=="3"){
					aznodestore.push(str2);
				}else if(str0=="4"){
					revitnodestore.push(str2);
				}else if(str0=="5"){
					teklanodestore.push(str2);
				}
			}
	
	
			function zTreeOnClick (event, treeId, treeNode) {
				//点击工程
				dataList.linkProjectSelected = treeNode;
				dataList.assembleLps = treeNode;
				ppid = dataList.assembleLps.value.split('-')[2];
				projType = dataList.assembleLps.value.split('-')[0];
				console.log('treeNode',treeNode);
				if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
					$('.confirm').attr('disabled', true);
				} else {
					$('.confirm').attr('disabled', false);
				}
				treeObj = $.fn.zTree.getZTreeObj("tree");
				var sNodes = treeObj.getSelectedNodes();
				if (sNodes.length > 0) {
					var node = sNodes[0].getParentNode();
				}
				dataList.parentNode = node;
		 	}
		 	
		 	$scope.ok = function () {
		 		//debugger;
		 		switch (projType) {
		 			case "1":
		 			projType = '土建预算';
		 			break;
		 			case "2":
		 			projType = '钢筋预算';
		 			break;
		 			case "3":
		 			projType = '安装预算';
		 			break;
		 			case "4":
		 			projType = 'Revit';
		 			break;
		 			case "5":
		 			projType = 'Tekla';
		 			break;
		 		}
		 		dataList.assembleLps =[{ppid:ppid, projType:projType}];
		 		$uibModalInstance.close(dataList);
		 	}
	
		 	//点击确定按钮获取构件类别表单
		 	$scope.ok3 = function () {
		 		//点击确定按钮切换显示获取的构件类别openSignal
		 		$scope.openSignal = false;
		 		$scope.projectTree = [];
		 		var obj = {ppid:ppid, projType:projType};
		 		var params = JSON.stringify(obj);
		 		var setting1 = {  
					view:{
						selectedMulti: false
					},
					check: {
						enable: true
					}
					// callback:{
					// 	onCheck: onCheck
					// }
		         };
		         dataList.assembleLps =obj;
				//获取构件类别树
				Cooperation.getFloorCompClassList(params).then(function (data) {
					$scope.projectTree = data;
					var treeObj = $.fn.zTree.init($("#tree1"), setting1, $scope.projectTree);
					//全部打开
					treeObj.expandAll(true);
					// 设置当前打开的层数
					var treeNodes = treeObj.transformToArray(treeObj.getNodes());
					for(var i = 0 ; i<treeNodes.length;i++){
						if(treeNodes[i].level >= maxLevel){
							maxLevel = treeNodes[i].level;
						}
					}
					level = maxLevel;
					// 只打开一层
	//				treeObj.expandNode(treeNodes[0], true, false, null, true);
				});
	
				//选中节点的组合数组(checkbox选中状态)
				// var selectedNodes = [];
				// var selectedNodesList = [];
				// var pNodeList = [];
				// function onCheck (event, treeId, treeNode) {
				// 	var treeObj = $.fn.zTree.getZTreeObj("tree1");
				// 	selectedNodes = treeObj.getCheckedNodes(true);
				// 	// if(treeNode.checked){
				// 	// 	var signalSelected = getParentNodeList(treeNode).concat(treeNode);;
				// 	// }
			
				// 	var lastNodeList = _.filter(selectedNodes,function(value,key){
				// 		return value.type == 3;
				// 	});
				// 	angular.forEach(lastNodeList,function(value,key){
				// 		//遍历type=3的结合，递归获取父级的集合并且拼接上自己的集合
				// 		pNodeList = [];
				// 		var signalSelected = getParentNodeList(value,pNodeList).concat(value);
				// 		selectedNodesList.push(signalSelected);
				// 	});
				// 	console.log('selectedNodesList',selectedNodesList);
	
				// 	//递归获取父节点的集合
				//  	function getParentNodeList(treeObj){
				//  		if(treeObj==null) return;
				//  		var pNode = treeObj.getParentNode();
				//  		if(pNode!=null){
				//  			pNodeList.push(pNode);
				//  			pNode = getParentNodeList(pNode);
				//  		}
				//  		return pNodeList;
				//  	}
			 // 	}
				
			 	
	
		 	}
	
		 	$scope.ok4 = function () {
		 		//debugger
		 		//选中节点的组合数组(checkbox选中状态)
				var selectedNodes = [];
				var selectedNodesList = [];
				var pNodeList = [];
		 		var treeObj = $.fn.zTree.getZTreeObj("tree1");
		 		//当前选中的所有的节点
				selectedNodes = treeObj.getCheckedNodes(true);
				
				var lastNodeList = _.filter(selectedNodes,function(value,key){
					if(projType!=5){
						return value.type == 3;
					}
					return value.type == 2;
				});
				angular.forEach(lastNodeList,function(value,key){
					//遍历type=3的结合，递归获取父级的集合并且拼接上自己的集合
					pNodeList = [];
					var signalSelected = getParentNodeList(value,pNodeList).concat(value);
					selectedNodesList.push(signalSelected);
				});
				console.log('selectedNodesList',selectedNodesList);
	
				//递归获取父节点的集合
			 	function getParentNodeList(treeObj){
			 		if(treeObj==null) return;
			 		var pNode = treeObj.getParentNode();
			 		if(pNode!=null){
			 			pNodeList.push(pNode);
			 			pNode = getParentNodeList(pNode);
			 		}
			 		return pNodeList;
			 	}
		 		
		 		switch (projType) {
		 			case "1" :
		 			projType = '土建预算';
		 			break;
		 			case "2":
		 			projType = '钢筋预算';
		 			break;
		 			case "3":
		 			projType = '安装预算';
		 			break;
		 			case "4":
		 			projType = 'Revit';
		 			break;
		 			case "5":
		 			projType = 'Tekla';
		 			break;
		 		}
	
		 		/**
				 * 土建，钢筋，revit是楼层——大类——小类
				 * 安装是楼层——专业——大类——小类
				 * tekla是楼层——大类，tekla手机没有获取到小类
				 * public static final Integer COMP_NODE_ALL = -1;//全部
				 * public static final Integer COMP_NODE_FLOOR = 0;//楼层
				 * public static final Integer COMP_NODE_PROF = 1;//专业
				 * public static final Integer COMP_NODE_CLASS = 2;//大类
				 * public static final Integer COMP_NODE_SUBCLASS = 3;//小类
				 */ 
		 		var selectedCategory = []; //组合选中数据
				angular.forEach(selectedNodesList,function(value,key1){
					var unit={};
					angular.forEach(value,function(value1,key1){
						if(value1.type === 0){
							unit.floor = value1.value;
						} else if(value1.type === 1){
							unit.spec = value1.value;
						}else if(value1.type ===2){
							unit.compClass = value1.value;
						} else if(value1.type ===3){
							unit.subClass = value1.value;
						}
					})
					unit.ppid = ppid;
					unit.projType= projType;
					selectedCategory.push(unit);
				});
		 		dataList.assembleLps = selectedCategory;
		 		console.log('dataList',dataList);
		 		$uibModalInstance.close(dataList);
		 	}
	
		 	function projTypeSwitch (n) {
		 		switch(n)
				 	{
				 	case 0:
				 		return null;
					case 1:
					  	return tjnodestore;
					  	break;
					case 2:
					  	return gjnodestore;
					  	break;
					case 3:
					  	return aznodestore;
					  	break;
					case 4:
					  	return revitnodestore;
					  	break;
					case 5:
					  	return teklanodestore;
					  	break;
					case 6:
					  	return pdfppidstore;
					  	break;
					}
		 	}
		 	
		 	//可以查询
		 	var searchFlag;
		 	var pollingFlag = true;
		 	var checkSearchInterval;
		 	
		 	$scope.delayTreeSearch = function (type,status){
		 		setSearchFlagFalse();
		 		if(pollingFlag){
		 			pollingFlag = false;
		 			checkSearchInterval = setInterval(function() {checkCanSearch(type)},250);
		 		}
		 		setTimeout(function() {setSearchFlagTrue()},500);
		 		//全部打开
		 		if(status == 1) {	// 工程相关
			 		level = Cooperation.expandAll("tree");
		 		} else if(status == 2) {	// 构件类别
		 			levelCategory = Cooperation.expandAll("tree");
		 		}
		 	};
		 	
		 	var setSearchFlagFalse = function(){
		 		searchFlag = false;
		 	}
			var setSearchFlagTrue = function(){
				searchFlag = true;
		 	}
		 	
			var checkCanSearch = function(type){
				if(searchFlag){
					clearInterval(checkSearchInterval);
					$scope.treeSearch(type);
					pollingFlag = true;
				}
			}
		 	
		 	$scope.treeSearch = function (type,status) {
	//	 		console.log(new Date());
				treeObj.showNodes(nodelist);
				//根据专业查询对应子节点
				//debugger;
				if(type==1){
					if($scope.projtype==0){
						projTypeSearchPpid	= initPpid;
					}else{
						projTypeSearchPpid = projTypeSwitch(parseInt($scope.projtype));	
					}
				}
				//根据功能进行同步请求查询对应子节点
				if(type==2){
					if($scope.functionOption==0){
						functionSearchPpid = initPpid;
					}else{
						var projTypeTextPpid = _.intersection(projTypeSearchPpid,TextSearchPpid);
						functionSearchPpid =[];
						functionFilter(projTypeTextPpid);
					}
					
				}
				//根据条件查询对应子节点
				if(type==3){
					if($scope.formText==""||$scope.formText==null||$scope.formText=="underfined"){
						TextSearchPpid = initPpid;
					}else{
						TextSearchPpid = searchByText();
					}
				}
				searchPpid =  _.intersection(projTypeSearchPpid,functionSearchPpid,TextSearchPpid);
				var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
				var hidenodes = treeObj.getNodesByFilter(filterhidechild);
				treeObj.hideNodes(hidenodes);
				treeObj.showNodes(showchildnodes);
				hideparentnode();
				//全部打开
		 		if(status == 1) {	// 图上构件
			 		level = Cooperation.expandAll("tree");
		 		} else if(status == 2) {	// 构件类别
		 			levelCategory = Cooperation.expandAll("tree");
		 		}
			}
	
		 	function filterchild(node) {
				var searchname = $scope.formText;
				return (node.type == 3 && node.name.indexOf(searchname)>-1);
			}
	
			function searchByText(){
				 var shownodes = treeObj.getNodesByFilter(filterchild);
				 var TextSearchPpid=[];
				 for(var i=0;i<shownodes.length;i++){
				 	var str2 = shownodes[i].value.split("-")[2];
				 	TextSearchPpid.push(str2);
				 }
				 return TextSearchPpid;
			}
	
			function filterhidechild(node) {
				return (node.type == 3);
			}
	
			function filterbyppid(node) {
			    return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
			}
	
			//全部功能筛选树结构
			var functionFilter = function (projTypeTextPpid) {
				var ppids = [];
				var data = {};
				var infoType = parseInt('1200'+ $scope.functionOption);
				data.infoType = infoType;
				data.ppids = projTypeTextPpid;
				data = JSON.stringify(data);
				$.ajax({
					contentType: "application/json; charset=utf-8",
					dataType : 'json',
					type: "post",
					data:data,
					url: 'http://172.16.21.69:8080/bimco/rs/co/getProjTipInfo',
				    async : false,
				    success: function (data) {
				    	for(var i=0;i<data.length;i++){
				    		var ppid = data[i]+"";
				    		functionSearchPpid.push(ppid);
				    	}
				    },
				    error: function () {
				    }
				});
			}
			//隐藏空父节点
			var selectlevel;
			function hideparentnode(){
				for(var i=maxlevel-1;i>0;i--){
					selectlevel = i;
					var parentnodes = treeObj.getNodesByFilter(filterbylevel);
					var needhidenods = [];
					for(var j=0;j<parentnodes.length;j++){
						var childnodes = parentnodes[j].children;
						var ishide = true;
						if(childnodes!=null){
							for(var n=0;n<childnodes.length;n++){
								if(childnodes[n].isHidden){
									continue;
								}else{
									ishide=false;
								}
							}
						}else{
							ishide = true;
						}
						if(ishide){
							needhidenods.push(parentnodes[j]);
						}
					}
					treeObj.hideNodes(needhidenods);
				}
			}
	
			function filterbylevel(node) {
			    return (node.level==selectlevel&&node.type!=3);
			}
	
		 	$scope.cancel = function () {
		 		$uibModalInstance.dismiss('cancel');
		 	}
		 	
		 	// 展开树节点
		 	$scope.expand = function (status) {
		 		if(status == 1) {	// 工程相关
		 			var obj = {type:"expand",operObj:"tree", level: level};
			 		level = Cooperation.openOrClose(obj);
			 		$('#content-a11')[0].scrollTop=0;
		 		} else if(status == 2) {	// 构件类别
		 			var obj = {type:"expand",operObj:"tree", level: levelCategory};
			 		levelCategory = Cooperation.openOrClose(obj);
			 		$('#content-a13')[0].scrollTop=0;
		 		}
		 	}
		 	
		 	// 收起树节点
		 	$scope.collapse = function (status) {
		 		if(status == 1) {	// 工程相关
		 			var obj = {type:"collapse",operObj:"tree", level: level};
			 		level = Cooperation.openOrClose(obj);
			 		$('#content-a11')[0].scrollTop=0;
		 		} else if(status == 2) {	// 构件类别
		 			var obj = {type:"collapse",operObj:"tree", level: levelCategory};
			 		levelCategory = Cooperation.openOrClose(obj);
			 		$('#content-a13')[0].scrollTop=0;
		 		}
		 	}
	}]);


/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * linkcomponentCtrl
	 */
	var level = 1;	// 图上构建树状态树展开、折叠深度
	var maxLevel = -1;	
	angular.module('cooperation').controller('linkcomponentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
		 function ($scope, $http, $uibModalInstance,Cooperation) {
		 	var refreshID;
		 	$scope.projtype = "0";
			$scope.functionOption = "0";
			var nodelist=[];//树dataArray
			var tjnodestore=[];
			var gjnodestore=[];
			var aznodestore=[];
			var revitnodestore=[];
			var teklanodestore=[];
			var pdfppidstore=[];
			var projTypeSearchPpid=[];//工程类型搜索出来的ppid
			var TextSearchPpid=[];//文本搜索出来的ppid
			var functionSearchPpid=[];//功能搜索出来的ppid
			var initPpid=[];//初始化没有任何条件的ppid
			var searchPpid=[];//最终合并ppid
			var maxlevel=0;//最大层级
			var dataList = {};
			var ppid,projType,treeObj;
			var setting = {  
				view:{
					selectedMulti: false
				},
				callback:{
					onClick: zTreeOnClick,
					onCollapse: function (event, treeId, treeNode) {
					    level=treeNode.level
					},
					onExpand: function (event, treeId, treeNode) {
					    level=treeNode.level
					}
				}
	         };
			$scope.projectTree = [];
			//获取工程树
			Cooperation.getProjectTree().then(function (data) {
				console.log(data);
				$scope.projectTree = data;
				treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
				//全部打开
				treeObj.expandAll(true);
				nodelist = treeObj.transformToArray(treeObj.getNodes());
				for(var i = 0 ; i<nodelist.length;i++){
					if(nodelist[i].level >= maxLevel){	// 设置当前打开的层数
						maxLevel = nodelist[i].level;
					}
					if(nodelist[i].type==3){
						categoryprojtype(nodelist[i]);
					}
				}
				level = maxLevel;
			});
	
	
			//工程分类处理
			function categoryprojtype(node){
				//debugger;
				if(maxlevel<node.level){//获取最大层级
					maxlevel = node.level;
				}
				
				var str0 = node.value.split("-")[0];
				var str1 = node.value.split("-")[1];
				var str2 = node.value.split("-")[2];
				initPpid.push(str2);
				projTypeSearchPpid.push(str2);
			    TextSearchPpid.push(str2);
				functionSearchPpid.push(str2);
				if(str1=='2'){
					pdfppidstore.push(str2);
				}else if(str0=="1"){
					tjnodestore.push(str2);
				}else if(str0=="2"){
					gjnodestore.push(str2);
				}else if(str0=="3"){
					aznodestore.push(str2);
				}else if(str0=="4"){
					revitnodestore.push(str2);
				}else if(str0=="5"){
					teklanodestore.push(str2);
				}
			}
			function zTreeOnClick (event, treeId, treeNode) {
				//点击工程
				dataList.linkProjectSelected = treeNode;
				dataList.assembleLps = treeNode;
				ppid = dataList.assembleLps.value.split('-')[2];
				projType = dataList.assembleLps.value.split('-')[0];
				console.log('treeNode',treeNode);
				if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
					$('.confirm').attr('disabled', true);
				} else {
					$('.confirm').attr('disabled', false);
				}
				treeObj = $.fn.zTree.getZTreeObj("tree");
				var sNodes = treeObj.getSelectedNodes();
				if (sNodes.length > 0) {
					var node = sNodes[0].getParentNode();
				}
				dataList.parentNode = node;
		 	}
		 	
		 	function projTypeSwitch (n) {
		 		switch(n)
				 	{
				 	case 0:
				 		return null;
					case 1:
					  	return tjnodestore;
					  	break;
					case 2:
					  	return gjnodestore;
					  	break;
					case 3:
					  	return aznodestore;
					  	break;
					case 4:
					  	return revitnodestore;
					  	break;
					case 5:
					  	return teklanodestore;
					  	break;
					case 6:
					  	return pdfppidstore;
					  	break;
					}
		 	}
		 	
		 	function filterchild(node) {
				var searchname = $scope.formText;
				return (node.type == 3 && node.name.indexOf(searchname)>-1);
			}
	
			function searchByText(){
				 var shownodes = treeObj.getNodesByFilter(filterchild);
				 var TextSearchPpid=[];
				 for(var i=0;i<shownodes.length;i++){
				 	var str2 = shownodes[i].value.split("-")[2];
				 	TextSearchPpid.push(str2);
				 }
				 return TextSearchPpid;
			}
	
			//可以查询
		 	var searchFlag;
		 	var pollingFlag = true;
		 	var checkSearchInterval;
		 	
		 	$scope.delayTreeSearch = function (type){
		 		setSearchFlagFalse();
		 		if(pollingFlag){
		 			pollingFlag = false;
		 			checkSearchInterval = setInterval(function() {checkCanSearch(type)},250);
		 		}
		 		setTimeout(function() {setSearchFlagTrue()},500);
		 		//全部打开
		 		level = Cooperation.expandAll("tree");
		 	};
		 	
		 	var setSearchFlagFalse = function(){
		 		searchFlag = false;
		 	}
			var setSearchFlagTrue = function(){
				searchFlag = true;
		 	}
		 	
			var checkCanSearch = function(type){
				if(searchFlag){
					clearInterval(checkSearchInterval);
					$scope.treeSearch(type);
					pollingFlag = true;
				}
			}
			
			$scope.treeSearch = function (type) {
				treeObj.showNodes(nodelist);
				//根据专业查询对应子节点
				//debugger;
				if(type==1){
					if($scope.projtype==0){
						projTypeSearchPpid	= initPpid;
					}else{
						projTypeSearchPpid = projTypeSwitch(parseInt($scope.projtype));	
					}
				}
				//根据功能进行同步请求查询对应子节点
				if(type==2){
					if($scope.functionOption==0){
						functionSearchPpid = initPpid;
					}else{
						var projTypeTextPpid = _.intersection(projTypeSearchPpid,TextSearchPpid);
						functionSearchPpid =[];
						functionFilter(projTypeTextPpid);
					}
					
				}
				//根据条件查询对应子节点
				if(type==3){
					if($scope.formText==""||$scope.formText==null||$scope.formText=="underfined"){
						TextSearchPpid = initPpid;
					}else{
						TextSearchPpid = searchByText();
					}
				}
				searchPpid =  _.intersection(projTypeSearchPpid,functionSearchPpid,TextSearchPpid);
				var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
				var hidenodes = treeObj.getNodesByFilter(filterhidechild);
				treeObj.hideNodes(hidenodes);
				treeObj.showNodes(showchildnodes);
				hideparentnode();
				//全部打开
		 		level = Cooperation.expandAll("tree");
			}
	
			function filterhidechild(node) {
				return (node.type == 3);
			}
	
			function filterbyppid(node) {
			    return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
			}
	
			//全部功能筛选树结构
			var functionFilter = function (projTypeTextPpid) {
				var ppids = [];
				var data = {};
				var infoType = parseInt('1200'+ $scope.functionOption);
				data.infoType = infoType;
				data.ppids = projTypeTextPpid;
				data = JSON.stringify(data);
				// Cooperation.getProjTipInfo(data).then(function (data) {
				// 	console.log(data);
				// 	return data
				// });
	
				$.ajax({
					contentType: "application/json; charset=utf-8",
					dataType : 'json',
					type: "post",
					data:data,
					url: 'http://172.16.21.69:8080/bimco/rs/co/getProjTipInfo',
				    async : false,
				    success: function (data) {
				    	for(var i=0;i<data.length;i++){
				    		var ppid = data[i]+"";
				    		functionSearchPpid.push(ppid);
				    	}
				    },
				    error: function () {
				    }
				});
			}
	
			var selectlevel;
			function hideparentnode(){
				for(var i=maxlevel-1;i>0;i--){
					selectlevel = i;
					var parentnodes = treeObj.getNodesByFilter(filterbylevel);
					var needhidenods = [];
					for(var j=0;j<parentnodes.length;j++){
						var childnodes = parentnodes[j].children;
						var ishide = true;
						if(childnodes!=null){
							for(var n=0;n<childnodes.length;n++){
								if(childnodes[n].isHidden){
									continue;
								}else{
									ishide=false;
								}
							}
						}else{
							ishide = true;
						}
						if(ishide){
							needhidenods.push(parentnodes[j]);
						}
					}
					treeObj.hideNodes(needhidenods);
				}
			}
	
			function filterbylevel(node) {
			    return (node.level==selectlevel&&node.type!=3);
			}
	
		 	$scope.ok = function () {
		 		//console.log('dataList',dataList);
		 		//debugger;
		 		// switch (projType) {
		 		// 	case "1":
		 		// 	projType = '土建预算';
		 		// 	break;
		 		// 	case "2":
		 		// 	projType = '钢筋预算';
		 		// 	break;
		 		// 	case "3":
		 		// 	projType = '安装预算';
		 		// 	break;
		 		// 	case "4":
		 		// 	projType = 'Revit';
		 		// 	break;
		 		// 	case "5":
		 		// 	projType = 'Tekla';
		 		// 	break;
		 		// }
		 		dataList.assembleLps =[{ppid:ppid, projType:projType}];
		 		//通知pc端执行选择构件的方法
		 		BimCo.SelectComponent(ppid);
		 		//1.轮询2.获取状态
		 		// 001 - 完成
		 		// 002 - 取消选择
		 		setRefreshInterval();
	
		 		function refreshState() {
	
		 			var reCode = BimCo.GetSelectComponentStatus(ppid);
	
		 			switch (reCode) {
		 				case '001':
		 				//将当前选择的工程显示到页面
		 				$uibModalInstance.close(dataList);
		 				clearRefreshInterval();
		 				break;
		 				case '002':
		 				//用户什么操作都没做，结束轮询
		 				clearRefreshInterval();
		 				break;
		 			}
		 		}
		 		
		 		// 设置间隔获取状态
		        function setRefreshInterval() {
		            //if (refreshID) return false;
		            refreshID = setInterval(refreshState, 1000);
		            console.log('我是轮询');
		        }
	
		        // 清除间隔获取状态
		        function clearRefreshInterval() {
		            clearInterval(refreshID);
		        }
	
		 	}
	
		 	$scope.cancel = function () {
		 		//if已经选择了构件，通知pc端
		 		$uibModalInstance.dismiss('cancel');
		 	}
		 	
		 // 展开树节点
		 	$scope.expand = function () {
		 		var obj = {type:"expand",operObj:"tree", level: level};
		 		level = Cooperation.openOrClose(obj);
		 		$('#content-a12')[0].scrollTop=0;
		 	}
		 	
		 	// 收起树节点
		 	$scope.collapse = function () {
		 		var obj = {type:"collapse",operObj:"tree", level: level};
		 		level = Cooperation.openOrClose(obj);
		 		$('#content-a12')[0].scrollTop=0;
		 	}
		 	
	}]);

/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * linkbeCtrl
	 */
	var level = 0;	// 当前树状态树展开、折叠深度
	//var checkAll = 0; // 是否全选 
	angular.module('cooperation').controller('linkbeCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items','$timeout',
		 function ($scope, $http, $uibModalInstance,Cooperation,items,$timeout) {
		 	$scope.selectedOption = {};
		 	$scope.projectOption = null;
		 	$scope.projectSelected = {};
			$scope.currentPage = 1; //默认第一页
			$scope.deptInfo = {
				availableOptions:[]
			};
			$scope.projectList = {
				availableOptions:[]
			};
			$scope.totalItems = 0;
			var deptId, ppid;
			var setting = {  
				view:{
					selectedMulti: false
				},
				check: {
					enable: true
				},
				callback:{
					onCheck: onCheck,
					onCollapse: function (event, treeId, treeNode) {
					    level=treeNode.level;
					},
					onExpand: function (event, treeId, treeNode) {
					    level=treeNode.level;
					}
				}
	         };
		     var treeObj,nodes,params;
		     var selectedItem = [];
		     //组合查询条件
		     var queryData = {
		     	ppid: '',
		     	tagids:[],
		     	searchText:'',
		     	pageInfo:{}
		     };
	
	        //获取项目部
			Cooperation.getDeptList().then(function (data) {
				$scope.deptInfo.availableOptions = data;
				$scope.selectedOption = $scope.deptInfo.availableOptions[0].deptId+'';
				//默认工程列表
				deptId = $scope.selectedOption;
				if(deptId){
	                        $timeout(function() {
	                            $('.selectpicker1').selectpicker({
	                                style: '',
	                                size: 'auto'
	                            });
	                        },0);
	                     }
				Cooperation.projectList(deptId).then(function (data) {
						$scope.projectList.availableOptions = data;
						$scope.projectOption = $scope.projectList.availableOptions[0].ppid+'';
						ppid = data[0].ppid;
						if(ppid){
	                        $timeout(function() {
	                            $('.selectpicker2').selectpicker({
	                                style: '',
	                                size: 'auto'
	                            });
	                        },0);
	                     }
	                    initProjectSelected(data[0]);
						//获取BE资料树
						//getDocTagList(ppid);
				});
			});
	
	        //根据条件获取资料列表
	        var getDocList = function () {
				//组合搜索条件
				queryData.ppid = $scope.projectOption;
				queryData.tagids = selectedItem;
				queryData.searchText = $scope.searchname;
				queryData.pageInfo = {
					currentPage:$scope.currentPage?$scope.currentPage:1,
					pageSize:10
				};
				Cooperation.getDocList(queryData).then(function (data) {
					$scope.docList = data.result;
					$scope.totalItems = data.pageInfo.totalNumber;
				});
		 	}
	
		 	//分页显示
		 	$scope.pageChanged = function () {
		 		getDocList();
		 	}
	
	        function onCheck (event, treeId, treeNode) {
				treeObj = $.fn.zTree.getZTreeObj("tree");
				//选中节点(check)
				nodes = treeObj.getCheckedNodes(true);
				//type=2的节点
				var unit = _.filter(nodes, function(o){
					return o.type === 2
				});
	//			console.log(unit)
				var tempselectedItem = [];
				angular.forEach(unit, function(value,key) {
					//左侧树选中的节点
					tempselectedItem.push(value.value);
				});
				selectedItem = tempselectedItem;
				if(selectedItem.length){
					getDocList();
				} else {
					$scope.$apply(function() {
						$scope.totalItems = 0;
						$scope.docList = [];
					});
				}
				
		 	}
		 	//选中需要上传的资料
		 	var a = _.cloneDeep(items);
		 	//var docSelected = [];
		 	var docSelected = a?a:[];
	        var updateSelected = function(action,id,name){
	        	var findIndex = _.findIndex(docSelected,id);
	            if(action == 'add' && findIndex == -1){
	               docSelected.push(id);
	           	}
	            if(action == 'remove' && findIndex!=-1){
	                var idx = docSelected.indexOf(id);
	                docSelected.splice(findIndex,1);
	            }
	         }
	 
	        $scope.updateSelection = function($event, id){
	        	//debugger;
	            var checkbox = $event.target;
	            var action = (checkbox.checked?'add':'remove');
	            updateSelected(action,id,checkbox.name);
	            console.log(docSelected);
	        }
	 
	        $scope.isSelected = function(id){
	//        	console.log('id', _.findIndex(docSelected,id))
	            return _.findIndex(docSelected,id)>=0;
	        }
	
	        $scope.docSearch = function () {
	        	getDocList(queryData);
	        }
	
	        $scope.ok = function () {
			    $uibModalInstance.close(docSelected);
			};
			//根据deptId取工程列表
		 	$scope.switchDept = function (params) {
		 		deptId = params;
				Cooperation.projectList(params).then(function (data) {
					//debugger
					$scope.projectList.availableOptions = data;
					$scope.projectOption = data[0].ppid+'';
					//getDocTagList(data[0].ppid);
					initProjectSelected(data[0]);
				  	
				});
		 	}
	
		 	$scope.changeSelected = function(item) {
		 		initProjectSelected(item);
		 		$scope.isCollapsed = false;
		 	}
	
		 	function initProjectSelected(data) {
		 		$scope.projectSelected.projectName = data.projectName;
				$scope.projectOption = data.ppid;
					if(data.projectType=='土建预算'){
						$scope.projectSelected.typeImg = 'imgs/icon/1.png';
					} else if(data.projectType=='钢筋预算') {
							$scope.projectSelected.typeImg = 'imgs/icon/2.png';
					} else if(data.projectType=='安装预算') {
							$scope.projectSelected.typeImg = 'imgs/icon/3.png';
					} else if(data.projectType=='Revit') {
							$scope.projectSelected.typeImg = 'imgs/icon/4.png';
					} else if(data.projectType=='Tekla') {
							$scope.projectSelected.typeImg = 'imgs/icon/5.png';
					} 
	
		 	}
	
	
	
		 	//选择BE资料-工程所属资料标签树
		 	var getDocTagList = function (params) {
		 		Cooperation.getDocTagList(params).then(function (data) {
		 			var treeObj = $.fn.zTree.init($("#tree"), setting, data);
					//全部打开
	//				treeObj.expandAll(false);
		 			// 只打开第一层节点
		 			treeObj.expandNode(treeObj.transformToArray(treeObj.getNodes())[0],true,false,true,false)
		 		});
		 	}
		 	$scope.switchPpid = function (projectOption) {
				ppid = projectOption;
				getDocTagList(ppid);
			}
		 	
	
		 	$scope.$watch('projectOption',function(newVal,oldVal){
		 		if(newVal != null){
		 			$scope.switchPpid($scope.projectOption);
		 		}
			});
	
			$scope.cancel = function () {
				$uibModalInstance.dismiss();
			}
			$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
				 $('.check-now').click(function(){
					$(this).css('background',"#eceef0").siblings().css("background",'#fff')
				 })
	
			});
			
			// 展开树节点
		 	$scope.expand = function () {
		 		var obj = {type:"expand",operObj:"tree", level: level};
		 		level = Cooperation.openOrClose(obj);
		 		$('#content-a6')[0].scrollTop=0;
		 	}
		 	
		 	// 收起树节点
		 	$scope.collapse = function () {
		 		var obj = {type:"collapse",operObj:"tree", level: level};
		 		level = Cooperation.openOrClose(obj);
		 		$('#content-a6')[0].scrollTop=0;
		 	}
		 	
		 	//全选
		 	/*$scope.checkAllNodes = function() {
		        var treeObj = $.fn.zTree.getZTreeObj("tree");
		        if(checkAll % 2 == 0) {
		        	treeObj.checkAllNodes(true);
		        } else {
		        	treeObj.checkAllNodes(false);
		        }
		        checkAll++;
		    }*/
		 	$scope.myKeyup = function(e){
	            var keycode = window.event?e.keyCode:e.which;
	            if(keycode==13 || $('#linkbeSear').val()==''){
	            	$scope.docSearch();
	            }
	        };
	}]);


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * linkformCtrl
	 */
	angular.module('cooperation').controller('linkformCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items',
		 function ($scope, $http, $uibModalInstance,Cooperation,items) {
		 	console.log(items);
		 	//默认模版类型
		 	$scope.selectedTypeId = items.typeid;
		 	Cooperation.getTemplateNode(items.typeid).then(function (data) {
		 		$scope.templateNode = data;
		 	});
		 	Cooperation.getTypeList().then(function (data) {
		 		$scope.typeList = data;
		 	});
	
		 	$scope.switchType = function (selectedTypeId) {
		 		Cooperation.getTemplateNode(selectedTypeId).then(function (data) {
		 		$scope.templateNode = data;
		 	});
		 	}
	
		 	//选中表单中需要上传的资料
		 	var a = _.cloneDeep(items.formSelectedList);
		 	var formSelected = a?a:[];
	        var updateSelected = function(action,id,name){
	        	var findIndex = _.findIndex(formSelected,id);
	            if(action == 'add' && findIndex == -1){
	               formSelected.push(id);
	           	}
	             if(action == 'remove' && findIndex!=-1){
	                formSelected.splice(findIndex,1);
	             }
	         }
	 
	        $scope.updateSelection = function($event, id){
	        	//debugger;
	            var checkbox = $event.target;
	            var action = (checkbox.checked?'add':'remove');
	            updateSelected(action,id,checkbox.name);
	            console.log(formSelected);
	        }
	 
	        $scope.isSelected = function(id){
	        	console.log('_.findIndex(formSelected,id)',_.findIndex(formSelected,id));
	            return _.findIndex(formSelected,id)>=0;
	        }
	
	        $scope.ok = function () {
	        	$uibModalInstance.close(formSelected);
	        }
	
			$scope.cancel = function () {
				$uibModalInstance.dismiss();
			}
			$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
				$(".tab-tr").on("click",function(){
					$(this).css('background',"#eceef0").siblings().css("background",'#fff')
				})
			})
	}]);

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('cooperation').service('Cooperation', function ($http, $q) {
	    
	    var url = basePath;
	 
	    //url="http://172.16.21.69:8080/bimco";
	    /**
	     *获取项目部列表
	     */
	    this.getDeptInfo = function () {
	        var delay = $q.defer();
	        var url_join= url+"rs/co/deptInfoList";
	        $http.get('dept.json',{cache:true})
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    };
	
	    //获取新建页面项目部列表
	    this.getDeptList = function () {
	        var delay = $q.defer();
	        var url_join= url+"rs/co/deptList";
	        $http.get(url_join,{cache:true})
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    };
	
	    //获取项目部下对应的联系人列表
	    this.getUserList = function (params) {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/pcUserList';
	        var params = JSON.stringify(params);
	        $http.get(url_join,params,{cache:true,transformRequest:angular.identity})
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data) {
	                delay.reject(data);
	        });
	        return delay.promise;
	    }
	
	    //获取项目部下工程列表
	    this.projectList = function (params) {
	        var delay = $q.defer();
	        var url_join = url +'rs/co/projectList/'+ params;
	        $http.get('projectlist.json',{cache:false})
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    
	    //获取项目下工程
	    this.getProjectList = function(params){
	        var delay = $q.defer();
	        var url_join = url+'rs/co/projectInfoList/'+params;
	        $http.get('projectlist.json').success(function(data){
	            delay.resolve(data)
	        }).error(function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    //获取bv
	    this.getBVRectifyStatus = function(){
	        var delay = $q.defer();
	        var url_join = url+'rs/co/getBVRectifyStatus';
	        $http.get(url_join,{cache:true}).success(function(data){
	            delay.resolve(data)
	        }).error(function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	    //获取协同列表
	    this.getCollaborationList = function (params) {
	        var params = JSON.stringify(params);
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/collaborationList';
	        $http.get('collaboration.json',params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    //选择BE资料-工程所属资料标签树
	    this.getDocTagList = function (params) {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/docTagList/' + params;
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	    //获取工程对应资料列表
	    this.getDocList = function (params) {
	        var delay = $q.defer();
	        var params = JSON.stringify(params);
	        var url_join = url + 'rs/co/docList';
	        $http.get(url_join,params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    //获取工程树节点
	    this.getProjectTree = function () {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/projectTree';
	        $http.get('tree.json')
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	    //获取构件
	    this.getFloorCompClassList = function (params) {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/floorCompClassList';
	        $http.get(url_join,params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    //获取协作详情列表
	    this.getCollaboration = function (coid) {
	        var delay = $q.defer();
	        // var url_join= tempUrl + 'detail/' + coid;
	        var url_join= url + 'rs/co/detail/' + coid;
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    };
	
	    //获取类型列表
	    this.getTypeList = function () {
	        var delay = $q.defer();
	        var url_join= url + 'rs/co/typeList';
	        $http.get('typelist.json')
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	
	    //获取选择表单列表
	    this.getTemplateNode = function (params) {
	        var delay = $q.defer();
	        var url_join= url + 'rs/co/template/' + params + '/pdf';
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	
	
	    //创建协作
	    this.createCollaboration = function (params) {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/collaboration';
	        $http.get(url_join,params,{transformRequest: angular.identity, transformResponse: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	
	    //获取标识
	    this.getMarkerList = function (params) {
	        var delay = $q.defer();
	        var url_join= url + 'rs/co/markers';
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	
	    //获取优先级列表
	    this.getPriorityList = function () {
	        var delay = $q.defer();
	        var url_join= url + 'rs/co/priorityList';
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	    //获取有相关功能的工程列表 
	    this.getProjTipInfo = function (params) {
	        var delay = $q.defer();
	        var url_join = url + 'rs/co/getProjTipInfo';
	        $http.get(url_join,params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	
	    //获取筛选动态列表
	    this.getCoQueryFilter = function (params) {
	        var delay = $q.defer();
	        var params = JSON.stringify({queryBvToPc:true});
	        var url_join = url + 'rs/co/coQueryFilter';
	        $http.get('coquery.json',params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    
	    //编辑协作
	    this.updateCollaboration = function (params) {
	        var delay = $q.defer();
	        var params = JSON.stringify(params);
	        var url_join = url + 'rs/co/updateCollaboration';
	        $http.get(url_join,params,{transformRequest: angular.identity}).success(function (data, status) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise;
	    }
	    //协作详情右侧动态列表
	    this.getOperationList = function (coid) {
	        var delay = $q.defer();
	        var url_join= url + 'rs/co/operation/' + coid;
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	
	    
	    //更新评论
	    this.commentToCollaboration = function (params) {
	        var delay = $q.defer();
	        var params = JSON.stringify(params);
	        var url_join = url + 'rs/co/commentToCollaboration';
	        $http.get(url_join,params,{transformRequest: angular.identity}).success(function (data) {
	            delay.resolve(data);
	        }).error(function (data) {
	            delay.reject(data);
	        });
	        return delay.promise; 
	    }
	
	    //获取系统时间
	    this.getCurrentDate = function () {
	        var cDate = new Date();
	        //console.info($scope.date)
	        var cYear = cDate.getFullYear();
	        var cMouth = cDate.getMonth()+1;
	        var cDay = cDate.getDate();
	        var cWeekday=new Array(7);
	        cWeekday[0]="星期日";
	        cWeekday[1]="星期一";
	        cWeekday[2]="星期二";
	        cWeekday[3]="星期三";
	        cWeekday[4]="星期四";
	        cWeekday[5]="星期五";
	        cWeekday[6]="星期六";
	       var currentDate =  cYear+"年"+ cMouth+"月"+cDay+"日"+cWeekday[cDate.getDay()];
	       return currentDate;
	    }
	    //统计页面获取数据
	    this.getCoStatisticsInfo = function(params){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/coStatistics";
	        var params = JSON.stringify(params);
	        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	            //console.info("统计页面",data)
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    // 协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
	    this.doCollaboration = function(params){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/doCollaboration";
	        var params = JSON.stringify(params);
	        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	            //console.info("统计页面",data)
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    //获取签名uuid
	    this.getSignature = function () {
	       var delay = $q.defer();
	        var url_join= url + 'rs/co/signature';
	        $http.get(url_join)
	            .success(function (data) {
	                delay.resolve(data);
	            }).error(function (data, status) {
	                delay.reject(data);
	            });
	        return delay.promise;
	    }
	
	    // 获取服务器时间
	    this.getTrendsSystem = function(params){
	        var delay = $q.defer();
	        var url_join = url + "rs/trends/system";
	        var obj = JSON.stringify(params);
	        $http.get(url_join,obj,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    //签入
	    this.checkIn = function(coid){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/checkIn/"+coid;
	        var params = JSON.stringify(params);
	        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	            //console.info("统计页面",data)
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    //签出
	    this.checkOut = function(coid){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/checkOut/"+coid;
	        var params;
	        // var params={"coid":coid}
	        // var params = JSON.stringify(params);
	        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	            //console.info("统计页面",data)
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	//    草稿箱信息删除
	    this.removeDraft = function(coid){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/removeDraft/"+coid;
	        var params;
	        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
	            delay.resolve(data);
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	    //获取当前用户信息
	    this.getCurrentUser = function(){
	        var delay = $q.defer();
	        var url_join = url + "rs/co/currentUser";
	        $http.get(url_join,{},{transformRequest: angular.identity, transformResponse: angular.identity}).then(function(data){
	            delay.resolve(data);
	        },function(err){
	            delay.reject(err)
	        })
	        return delay.promise;
	    }
	
	    //获取指定的UUID的下载地址
	//    this.getDownFileUrl = function (uuids){
	//    	var delay = $q.defer();
	//    	var url_join = url + "rs/co/downFileUrl";
	//    	$http.get(url_join,uuids,{transformRequest: angular.identity}).then(function(data){
	//    		delay.resolve(data);
	//    	},function(err){
	//            delay.reject(err);
	//        })
	//        return delay.promise;
	//    }
	});

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	angular.module('cooperation').service('TreeSearch', function ($http, $q, Cooperation) {
	    var url = ApplicationConfiguration.urls.apiUrl;
	    var coUrl = ApplicationConfiguration.urls.coUrl;
	    var tempUrl = 'http://192.168.13.222:8080/bimco/rs/co/';
	
	    //即时搜索
	    function searchByText(){
	         var shownodes = treeObj.getNodesByFilter(filterchild);
	         var TextSearchPpid=[];
	         for(var i=0;i<shownodes.length;i++){
	            var str2 = shownodes[i].value.split("-")[2];
	            TextSearchPpid.push(str2);
	         }
	         return TextSearchPpid;
	    }
	    //筛选出type=3的所有节点
	    function filterhidechild(node) {
	        return (node.type == 3);
	    }
	
	    //根据type=3,ppid来筛选
	    function filterbyppid(node) {
	        return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
	    }
	    //根据全部专业分类ppid
	    this.projTypeSwitch = function (n) {
	        switch(n)
	            {
	            case 0:
	                return null;
	            case 1:
	                return tjnodestore;
	                break;
	            case 2:
	                return gjnodestore;
	                break;
	            case 3:
	                return aznodestore;
	                break;
	            case 4:
	                return revitnodestore;
	                break;
	            case 5:
	                return teklanodestore;
	                break;
	            case 6:
	                return pdfppidstore;
	                break;
	            }
	    }
	
	
	});

/***/ }
/******/ ]);
//# sourceMappingURL=script.js.map