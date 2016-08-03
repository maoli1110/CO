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

});