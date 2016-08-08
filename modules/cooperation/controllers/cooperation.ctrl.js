'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state) {
    //查询列表初始值
    var queryData = {};
	queryData.count = 20;
	queryData.deptId = '';
	queryData.groups=[];
	queryData.modifyTime = '';
	queryData.ppid = 1000;
	queryData.queryFromBV = true;
	queryData.searchKey = '';
	queryData.searchType = '';

    $scope.openSignal = false;
    $scope.projectInfoList = [];
    $scope.openNew = function () {
    	$scope.openSignal = true;
    	Cooperation.getTypeList().then(function (data) {
    		console.log(data);
    		$scope.typeList = data;
    	});
    }

    $scope.closeNew = function () {
    	$scope.openSignal = false;
    }

    $scope.trans = function (typeId) {

    	var url = $state.href('newcopper', {typeid: typeId});
		window.open(url,'_blank');
        //window.open(url, "", "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    //获取项目部列表
    Cooperation.getDeptInfo().then(function (data) {
    	//debugger;
    	$scope.deptInfoList = data.slice(0,10);
    });
    //获取工程列表
   	$scope.getprojectInfoList = function (deptId, open) {
   		//debugger;
   		//$scope.projectInfoList = [];
		if(deptId != queryData.deptId){
			Cooperation.getProjectList(deptId).then(function (data) {
	   			console.log(data);
	   			$scope.projectInfoList = data.slice(0,10);
	   			queryData.deptId = deptId;
	   			console.log(queryData.deptId);
   			});
   		}
   		
   		
   	}
   	//默认的协同列表
   	var initCollaborationList = function () {
   		//1.获取默认的项目部列表
   		//2.获取第一个项目部列表的工程列表
   		//3.获取工程列表的第一个工程
   		//4.以上备注后期实现
   		// queryData.deptId =1;
   		// queryData.ppid = 1000;
   		var params= {deptId:1,ppid:1000,queryFromBV:true,count:20}
   		Cooperation.getCollaborationList(params).then(function (data) {
   			$scope.cooperationList = data;
   		});
   	}
   	//initCollaborationList();

   	//点击工程获取协同列表
   	$scope.getCollaborationList = function (ppid) {
   		queryData.ppid = ppid;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;
   		});
   	}

   	//根据属性筛选
   	$scope.changeAttr = function () {
   		queryData.searchType = $scope.coopAttr;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;
   		});
   	}

   	//根据搜索框搜索
   	$scope.inputSearch = function () {
   		queryData.deptId?'':1;
   		if(queryData.deptId==""){
   			queryData.deptId = 1;
   		}
   		queryData.searchKey = $scope.searchkey;
   		debugger;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;
   		});
   	}


   	
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