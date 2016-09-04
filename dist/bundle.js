/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	// 注册核心模块
	ApplicationConfiguration.registerModule('core');

/***/ },
/* 3 */
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
/* 4 */
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
	                $(".table-list").show();
	            })
	                    //动态列表图片定位动画

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
	                    theme:"minimal"
	                });
	                $("#content-a3").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a4").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a5").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a6").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a7").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a8").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a9").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a10").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a11").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a12").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a13").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-a14").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                //$("#content-a3").mCustomScrollbar({
	                //    theme:"minimal"
	                //});
	                $("#content-b1").mCustomScrollbar({
	                    setHeight:sideHeight,
	                    theme:"minimal"
	                });
	                $("#content-b2").mCustomScrollbar({
	                    setHeight:sideHeight,
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



	            $('#exampleInputName2').bind('keyup change', function(ev) {
	                // pull in the new value
	                var searchTerm = $(this).val();
	                // remove any old highlighted terms
	                $('.project_name').removeHighlight();
	//            // disable highlighting if empty
	                if ( searchTerm ) {
	                    // highlight the new term
	                    $('.project_name').highlight( searchTerm );
	                }
	            });
	            $('#exampleInputName3').bind('keyup change', function(ev) {
	                // pull in the new value
	                var searchTerm = $(this).val();
	                // remove any old highlighted terms
	                $('.menName').removeHighlight();
	//            // disable highlighting if empty
	                if ( searchTerm ) {
	                    // highlight the new term
	                    $('.menName').highlight( searchTerm );
	                }
	            });
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
	                }, 800);
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
	           
	            $(".btn_box_bv").click(function(){

	            var rightDistance = document.getElementsByClassName('content_right_bv')[0].offsetWidth;
	            var rightDistance1 = document.getElementsByClassName('paly-model')[0].offsetWidth;
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
	        }
	    };
	});



/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by sdergt on 2016/8/24.
	 */
	//var app = angular.module("myApp",[]);
	angular.module("core").controller("headerCtrl",function($scope,headerService){
	    //console.info("我是头部标签")
	    //   点击工具栏三角形出现二级菜单
	    //$(".header_menus").hide()
	    $scope.menus = function(){
	        $(".header_menus").slideToggle();
	        $(".header_menus ul li").hover(function(){
	            //console.info(123)
	            $(this).css({"background":"#e6e6e6","color":"#fff"}).children().find("ol").show();
	        },function(){
	            $(this).css({"background":"#fff","color":"#000"}).children().find("ol").hide()
	        })
	    }
	    //  头部信息的数据显示
	    headerService.enterpriseInfoList({epid:0,isAll:3}).then(function(data){
	        $scope.headerMenus = data.data
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

	})
	//默认还原//点击放大

/***/ },
/* 7 */
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
	    return headerService;
	})

/***/ }
/******/ ]);