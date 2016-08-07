'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state) {

    $scope.openSignal = false;

        $scope.sou = function () {
    	console.log('1111');
    }
    
    $scope.openNew = function () {
    	//$scope.openSignal = true;
    	// Cooperation.getTypeList().then(function (data) {
    	// 	console.log(data);
    	// 	$scope.typeList = data;
    	// });
    }

    $scope.closeNew = function () {
    	$scope.openSignal = false;
    }

    $scope.trans = function (typeId) {

    	var url = $state.href('newcopper', {typeid: typeId});
		window.open(url,'_blank');
        //window.open(url, "", "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    //获取类型列表
    
	//统计页面
	var comboxCount = $("#comboBox_count");
	comboxCount.on("click",function(){
		$(".table-list ").hide();
		$(" .data_count").show();
	})
	//图形绘制
	var myChart = echarts.init(document.getElementById('data_graph'));

	// 指定图表的配置项和数据
	//			app.title = '环形图';

	var option = {
		series: [{
			name: '访问来源',
			type: 'pie',
			//饼型图的宽度
			radius: ['50%', '80%'],
			//中间文字位置和动画效果
			avoidLabelOverlap: false,
			label: {
				normal: {
					position: 'inner'
				}
			},
			//是否显示线
			//饼型图的显示比例
			data: [{
				value: 332,
				name: '15%'
			}, {
				value: 310,
				name: '12%'
			}, {
				value: 234,
				name: '10%'
			}, {
				value: 135,
				name: '3%'
			}, {
				value: 1548,
				name: '65%'
			}]

		}]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	//图形绘制
	var myChart = echarts.init(document.getElementById('data_graph2'));

	// 指定图表的配置项和数据
	//			app.title = '环形图';

	var option = {
		series: [{
			name: '访问来源',
			type: 'pie',
			//饼型图的宽度
			radius: ['50%', '80%'],
			//中间文字位置和动画效果
			avoidLabelOverlap: false,
			label: {
				normal: {
					position: 'inner'
				}
			},
			//是否显示线
			//饼型图的显示比例
			data: [{
				value: 332,
				name: '15%'
			}, {
				value: 310,
				name: '12%'
			}, {
				value: 234,
				name: '10%'
			}, {
				value: 135,
				name: '3%'
			}, {
				value: 1548,
				name: '65%'
			}]

		}]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
		//图形绘制
		var myChart = echarts.init(document.getElementById('data_graph3'));

		// 指定图表的配置项和数据
		//			app.title = '环形图';

		var option = {
			series: [{
				name: '访问来源',
				type: 'pie',
				//饼型图的宽度
				radius: ['50%', '80%'],
				//中间文字位置和动画效果
				avoidLabelOverlap: false,
				label: {
					normal: {
						position: 'inner'
					}
				},
				//是否显示线
				//饼型图的显示比例
				data: [{
					value: 332,
					name: '15%'
				}, {
					value: 310,
					name: '12%'
				}, {
					value: 234,
					name: '10%'
				}, {
					value: 135,
					name: '3%'
				}, {
					value: 1548,
					name: '65%'
				}]

			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		//图形绘制
		var myChart = echarts.init(document.getElementById('data_graph4'));

		// 指定图表的配置项和数据
		//			app.title = '环形图';

		var option = {
			series: [{
				name: '访问来源',
				type: 'pie',
				//饼型图的宽度
				radius: ['50%', '80%'],
				//中间文字位置和动画效果
				avoidLabelOverlap: false,
				label: {
					normal: {
						position: 'inner'
					}
				},
				//是否显示线
				//饼型图的显示比例
				data: [{
					value: 332,
					name: '15%'
				}, {
					value: 310,
					name: '12%'
				}, {
					value: 234,
					name: '10%'
				}, {
					value: 135,
					name: '3%'
				}, {
					value: 1548,
					name: '65%'
				}]

			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
}]);