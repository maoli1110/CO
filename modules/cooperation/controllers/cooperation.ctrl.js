'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state) {
    //查询列表初始值
    $scope.currentDate =  Cooperation.getCurrentDate();
    $scope.cooperationList = [];
    var tempCooperationList = [];
    var queryData = {};
  	queryData.count = 20;
  	queryData.deptId = '';
  	queryData.groups=[];
  	queryData.modifyTime = '';
    queryData.modifyTimeCount = 0;
  	queryData.ppid = 1000;
  	queryData.queryFromBV = true;
  	queryData.searchKey = '';
  	queryData.searchType = '';

    $scope.isTypeChecked = false;
    $scope.coopattr = '1';

    $scope.openSignal = false;
    $scope.projectInfoList = [];
    $scope.openNew = function () {
    	$scope.openSignal = true;
    	Cooperation.getTypeList().then(function (data) {
        $('.overlay').css('top','0px');
        $('.overlay').css('height','calc(100vh - 65px)');
        $('.overlay').css('display','block');
    		$scope.typeList = data;
    	});
    }

    // $scope.closeNew = function () {
    // 	$scope.openSignal = false;
    // }

     //弹出筛选框
    $scope.openfilter = function () {
      $scope.isCollapsed = true;
      $('.overlay').css('display','block');
      $('.overlay').css('top','50px');
      $('.overlay').css('height','calc(100vh - 115px)');
    }
    //点击蒙层隐藏筛选匡
    $scope.clicklay = function () {
      $scope.isCollapsed = false;
      $scope.detailSignal = false;
      $scope.openSignal = false;
      $('.overlay').css('display','none');
    }

    //点击显示列表每条协作的详情
    $scope.openDetail = function (item) {
      $scope.detailSignal = true;
      $('.overlay').css('top','0px');
       $('.overlay').css('height','calc(100vh - 65px)');
      $('.overlay').css('display','block');
      $scope.everyDetail = item;
    }

    $scope.trans = function (typeId) {

    	var url = $state.href('newcopper', {typeid: typeId});
		window.open(url,'_blank');
        //window.open(url, "", "toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    }

    //获取项目部列表3434
    Cooperation.getDeptInfo().then(function (data) {
    	//debugger;
    	$scope.deptInfoList = data;
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
   		// var params= {deptId:1,ppid:1000,queryFromBV:true,count:20}
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			$scope.cooperationList = data;
   		});
   	}
   	//initCollaborationList();

    //下拉获取更多协同列表数据
    $scope.addMoreData = function () {
        //debugger;
        console.log('222scroll');
        //默认获取第一个项目部列表的工程列表
        if(!queryData.deptId) {
            queryData.deptId = 1;
            queryData.ppid = 1000;
            queryData.searchType = 1;
        }
        //第一次queryData.modifyTime为空
        //第二次modifyTime为最后一次的数据的时间值
        if($scope.cooperationList.length) {
            queryData.modifyTimeCount = 1;
            queryData.modifyTime =  $scope.cooperationList[$scope.cooperationList.length - 1].updateTime;
        }

        Cooperation.getCollaborationList(queryData).then(function (data) {
            // debugger;
            if(!$scope.cooperationList.length) {
                $scope.cooperationList = data;
            } else {
                if(data.length) {
                    $scope.cooperationList.push(data);
                }
                return;
            }
            
        });
    }

   	//点击工程获取协同列表
   	$scope.getCollaborationList = function ($event,ppid) {
   		queryData.ppid = ppid;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;
   		});
   		$("span[class*=ng-binding]").removeClass("menusActive");
            //获取当前元素
        $($event.target).children("span").hide();
        $($event.target).addClass("menusActive").parent().siblings().find("menusActive").removeClass("menusActive");

        $($event.target).children().css('opacity','1').parent().parent().siblings().find(".font_radius").css('opacity','0');

   	}

   	//获取协作类型
   	// Cooperation.getTypeList().then(function (data) {
    // 		console.log(data);
    // 		$scope.typeList = data;
    // });

    //获取优先级列表
    // Cooperation.getPriorityList().then(function (data) {
    // 	console.log(data);
    // 	$scope.priorityList = data;
    // });

    //获取标识列表
    // Cooperation.getMarkerList().then(function (data) {
    // 	console.log(data);
    // 	$scope.markerList = data;
    // });
    
    //获取动态筛选列表
    Cooperation.getCoQueryFilter().then(function (data) {
    	console.log(data);
    	$scope.coQueryFilterList = data;
    	//debugger;
    	data[1].list.shift();
    	data[0].list.shift();
    	data[2].list.shift();
    	$scope.coQueryType = data[1].list;
    	$scope.coPriority = data[0].list;
    	$scope.coMark = data[2].list;
    });

	var queryTypeSelected = [];
	var queryPriorityselected = [];
	var queryMarkSelected = [];
    var updateSelected = function(action,id,type,index,signal){
          //debugger;
        if(action == 'add' && type.indexOf(id) == -1){
          
            //$scope.isTypeChecked = true;
            type.push(id);
            //console.log(type);
            if(signal == 1) {
                $('.bg' + index).removeClass('bg' + index).addClass('bgs' + index);
            }
       	}
        if(action == 'remove' && type.indexOf(id)!=-1){
            //debugger;
            //$scope.isTypeChecked = false;
            var idx = type.indexOf(id);
            type.splice(idx,1);
            //debugger;
            if(signal == 1) {
                $('.bgs' + index).removeClass('bgs' + index).addClass('bg' + index);
            }
        }
     }

    $scope.updateSelection = function($event,id,signal,index){
        //debugger;
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        var type;
        switch (signal) {
        	case 1:
        		type = queryTypeSelected;
        		break;
        	case 2:
        		type = queryPriorityselected;
        		break;
        	case 3:
        		type = queryMarkSelected;
        		break;
        }

        updateSelected(action,id,type,index,signal);
    }

    $scope.isSelected = function(id){
    	console.log(queryTypeSelected.indexOf(id));
        return queryTypeSelected.indexOf(id)>=0;
    }

    //alltype全选
    $scope.allType = function () {
    	console.log($scope.typeCheck);
    	if($scope.typeCheck) {
    		$('.type-check').find('input').prop('checked',true);
    		queryTypeSelected = _.cloneDeep($scope.coQueryType);
    	} else {
    		$('.type-check').find('input').prop('checked',false);
    		queryTypeSelected = [];
    	}
    	console.log(queryTypeSelected);
    }

    //allPriority全选
    $scope.allPriority = function () {
    	//debugger;
        // $('.priority-check label').addClass('background','#979ba8');
        $('.priority-check label').addClass('input-check');
    	console.log($scope.typeCheck);
    	if($scope.priorityCheck) {
    		$('.priority-check').find('input').prop('checked',true);
    		queryPriorityselected = _.cloneDeep($scope.coQueryType);
    	} else {
    		$('.priority-check').find('input').prop('checked',false);
    		queryPriorityselected = [];
    	}
    	console.log(queryTypeSelected);
    }

    //marking标识全选
    $scope.allMark = function () {
    	console.log($scope.typeCheck);
    	if($scope.markCheck) {
    		$('.mark-check').find('input').prop('checked',true);
    		queryMarkSelected = _.cloneDeep($scope.coQueryType);
    	} else {
    		$('.mark-check').find('input').prop('checked',false);
    		queryMarkSelected = [];
    	}
    }


    //动态筛选-确定-按钮-搜索
    $scope.filterOk = function () {
        $scope.isCollapsed = false;
        $('.overlay').css('display','none');
    	var groups = [];
    	console.log(queryTypeSelected);
    	console.log(queryPriorityselected);
    	console.log(queryMarkSelected);
    	var type601Selected = [];
    	var type602Selected = [];
    	var type603Selected = [];
    	//var combSelected = queryTypeSelected.concat(queryPriorityselected,queryMarkSelected);
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
    	//console.log(type603Selected);
    	groups = groups.concat(type601Selected,type602Selected,type603Selected);
    	console.log('groups',groups);

    	queryData.groups = groups;
      queryData.modifyTime = 0;

    	Cooperation.getCollaborationList(queryData).then(function (data) {
   			//console.log(data);
   			$scope.cooperationList = data;

   		});
    }

    $scope.filterCancel = function () {
        $scope.isCollapsed = false;
        $('.overlay').css('display','none');
    }
   	//根据属性筛选
   	$scope.changeAttr = function () {
   		queryData.searchType = parseInt($scope.coopattr);
      queryData.modifyTime = 0;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;

   		});
   	}

   	//根据搜索框搜索
   	$scope.inputSearch = function () {
   		if(queryData.deptId==""){
   			queryData.deptId = 1;
   		}
   		queryData.searchKey = $scope.searchkey;
      queryData.modifyTime = 0;
   		//debugger;
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