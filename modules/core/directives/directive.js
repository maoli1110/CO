'use strict';

angular.module('core').directive('copyRadio', function ($timeout) {
	return {
		restrict: 'AE',
		link: function (scope, ele, attr) {
           
			var checkObj= angular.element('.sub-nav li');
			//console.log(checkObj);
			checkObj.on('click', function () {
				if($(this).find(':checkbox').prop('checked')){
					$(this).siblings().find(':checkbox').prop('checked',false);
					$(this).parent().parent().siblings().find(':checkbox').prop('checked', false);
				}
			})
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
            $(".trends").height($("body").height()).css({"overflow":"auto"})
            $(".panel-group").height($("body").height()-150).css({"overflow":"auto"})
		}
	};
});


angular.module('core').directive('showIcon', function () {
    return {
        restrict: 'AE',
        link: function (scope, ele, attr) {
            var checkObj= angular.element('.sub-nav li');
            console.log(checkObj);
            checkObj.on('click', function () {
                if($(this).find(':checkbox').prop('checked')){
                    $(this).siblings().find(':checkbox').prop('checked',false);
                    $(this).parent().parent().siblings().find(':checkbox').prop('checked', false);
                }
            })

        }
    };
});

angular.module('core')
    // Angular File Upload module does not include this directive
    // Only for example


    /**
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
    .directive('ngThumb', ['$window', function($window) {
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
