'use strict';
angular.module('core').directive('profit', function($timeout) {
    //debugger;
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }

            //save
            //保存信息

        }

    };
});

angular.module('core').directive('copyRadio', function ($timeout) {
    //debugger;
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
                alert(123)
                $(".data_count").hide();
            })
            //点击返回按钮关闭当前对话框
            $(".data_back").click(function(){
                $(".data_count").hide();
                $(".table-list").show();
            })
            //项目列表的高度等于窗口的高度
            //$(".trends").height($("body").height()-150).css({"overflow":"auto"})
            //$(".panel-group").height($("body").height()-150).css({"overflow":"auto"})
            $(".header_menus ul li").hover(function(){
                //console.info(123)
                $(this).css("background","#69C080").children().find("ol").show();
            },function(){
                $(this).css("background","#fff").children().find("ol").hide()
            })

		}
	};
});


angular.module('core').directive('showIcon', function () {
    //debugger;
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
                //$(window).load(function(){
                //    console.log('22222');


               $("#content-a2").mCustomScrollbar({
                    theme:"minimal"
                });
                $("#content-a3").mCustomScrollbar({
                    theme:"minimal"
                });
                $("#content-a4").mCustomScrollbar({
                    theme:"minimal"
                });
                $("#content-b1").mCustomScrollbar({
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
    //debugger;
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


