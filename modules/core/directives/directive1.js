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