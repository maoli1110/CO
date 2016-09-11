'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams) {
    //查询列表初始值
    console.log('deptId', $stateParams.deptId);
    console.log('ppid',$stateParams);
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
    $scope.coopattr = '0';

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
	$scope.draftsLink = function(id){
		if($(".panel-collapse").text==""){
			//$(".panel-body").css("padding-bottom",'0')
			alert(123)
		}
		queryData.groups = [];
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

		Cooperation.getCollaborationList(queryData).then(function (data) {
			$scope.cooperationList = data;
			console.info("$scope.cooperationList",$scope.cooperationList);
		});
	}

    // $scope.closeNew = function () {
    // 	$scope.openSignal = false;
    // }

     //弹出筛选框
    $scope.openfilter = function () {
      $scope.isCollapsed = true;
      $('.overlay').css('display','block');
      $('.overlay').css('top','59px');
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
    	$scope.deptInfoList = data.slice(0,6);
		console.info("一级菜单",$scope.deptInfoList)

		//定位到当前工程
		if($stateParams) {
			var deptId = $stateParams.deptId;
			var ppid = $stateParams.ppid;
			angular.forEach(data, function (value, key) {
				if(value === deptId) {
					$('.panel-heading').eq(0).click();
				}
			})
		}
		//debugger
		$('.panel-heading').eq(0).click();
    });
	//$scope.scrollLoad = function(){
	//	$(window).scroll(function(){
	//		var scrollTop = $(this).scrollTop();
	//		var scrollHeight = $(document).height();
	//		var windowHeight = $(this).height();
	//		if(scrollTop + windowHeight == scrollHeight){
	//			alert("you are in the bottom");
	//		}
	//	});
	//}

    function getimgurl(treeItems,deptId){
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
			$("#dept_"+deptId).append("<span title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'>"+treeItems[i].projectName+"&nbsp;("+treeItems[i].count+")</span>")
		}
	}
    
	var id=0;
    //获取工程列表
   	$scope.getprojectInfoList = function (deptId, open) {
		queryData.ppid = '';
		if(deptId != queryData.deptId || deptId == 1){
			Cooperation.getProjectList(deptId).then(function (data) {
				getimgurl(data,deptId);
				$scope.projectInfoList = data.slice(0,6);;
	   			queryData.deptId = deptId;
				//console.info("eeeeeeeeeeee")

   			});
			id=deptId;
			queryData.deptId =deptId;
			Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
				console.info("$scope.cooperationList1313131",$scope.cooperationList)
			});
   		}
		$(".table-list ").show();
		$(" .data_count").hide();

   	}
   	
   	//默认的协同列表
   	var initCollaborationList = function () {
   		//1.获取默认的项目部列表
   		//2.获取第一个项目部列表的工程列表
   		//3.获取工程列表的第一个工程
   		//4.以上备注后期实现
   		 queryData.deptId =1;
   		 queryData.ppid = 1000;
   		 var params= {deptId:1,ppid:1000,queryFromBV:true,count:20}
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			$scope.cooperationList = data;
			console.info("$scope.cooperationList",$scope.cooperationList)
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
            queryData.searchType = 0;
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
    
	$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
		$('.table-list table tbody tr').click(function(){
			$(this).find(".cop-edit").show();
			$(this).siblings().find(".cop-edit").hide();
		})
	})

   	//点击工程获取协同列表
   	$scope.getCollaborationList = function ($event,ppid) {
   		queryData.ppid = ppid;
		$scope.typeStatStr=[];
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			$scope.cooperationList = data;
   		});
   		$("span[class*=ng-binding]").removeClass("menusActive");
        //获取当前元素
//        $($event.target).children("span").hide();
        $($event.target).addClass("menusActive").siblings().removeClass("menusActive");

//        $($event.target).children().css('opacity','1').parent().parent().siblings().find(".font_radius").css('opacity','0');
//		$event.stopPropagation();
		$(".table-list ").show();
		$(" .data_count").hide();
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
    	$scope.coQueryType = data[0].list;
      console.log('$scope.coQueryType',$scope.coQueryType);
    	$scope.coPriority = data[2].list;
    	$scope.coMark = data[1].list;
      //debugger
    });

	var queryTypeSelected = [];
	var queryPriorityselected = [];
	var queryMarkSelected = [];
    var updateSelected = function(action,id,type,index,signal){
		//debugger;
        console.log(JSON.stringify(type),'type')
        console.log('testremove')

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
            console.log('removeremve');
            var idx = type.indexOf(id);
            type.splice(idx,1);
        }
        if(action == 'remove'){
            if(signal == 1) {
                $('.bgs' + index).removeClass('bgs' + index).addClass('bg' + index);
                $('.comboBox_checkType ').prop('checked',false);
              }
        }
     }

    $scope.updateSelection = function($event,id,signal,index){
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

		// if($scope.typeCheck) {
		// 	if(signal == 1) {
		// 		$('.bgs' + index).removeClass('bgs' + index).addClass('bg' + index);
		// 		$('.comboBox_checkType ').prop('checked',false);
		// 	}
		// }
        updateSelected(action,id,type,index,signal);
        // testSelected();
    }

    function testSelected() {
        console.log('222');
    }

    $scope.isSelected = function(id){
    	console.log(queryTypeSelected.indexOf(id));
        return queryTypeSelected.indexOf(id)>=0;
    }

    //alltype全选
		$scope.allType = function () {
			if($scope.typeCheck) {
    //             $scope.isTypeChecked = false;
				// $scope.isTypeChecked = true;
				$('.type-check').find('input').prop('checked',true);

                queryTypeSelected = _.cloneDeep($scope.coQueryType);

                for(var i=0;i<6;i++) {
                    $('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
                }
				// queryTypeSelected = $scope.coQueryType;

			} else {
                // $scope.isTypeChecked = true;
				// $scope.isTypeChecked = false;
                for(var j=0;j<6;j++) {
                    $('.bgs' + j).removeClass('bgs' + j).addClass('bg' + j);
                }
				$('.type-check').find('input').prop('checked',false);
				queryTypeSelected = [];
			}
			console.log(queryTypeSelected);
		}



		//allPriority全选
    $scope.allPriority = function () {
    	
        $('.priority-check label').addClass('input-check');
 
    	if($scope.priorityCheck) {
    		$('.priority-check').find('input').prop('checked',true);
    		queryPriorityselected = _.cloneDeep($scope.coPriority);
    	} else {
    		$('.priority-check').find('input').prop('checked',false);
    		queryPriorityselected = [];
    	}
    }

    //marking标识全选
    $scope.allMark = function () {
    	console.log($scope.typeCheck);
    	if($scope.markCheck) {
    		$('.mark-check').find('input').prop('checked',true);
    		queryMarkSelected = _.cloneDeep($scope.coMark);
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
			type602Selected.push(unit);
    	});
    	angular.forEach(queryPriorityselected,function (value, key) {
			var unit = {};
			unit.type= 602;
			unit.value = {key:value.key};
			type601Selected.push(unit);
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
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			console.log(data);
   			$scope.cooperationList = data;
   		});
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


	//console.info("百分比数据",$scope.arr)

	//统计页面
	var comboxCount = $("#comboBox_count");
	$scope.comboxCount = function(){

		$(".table-list ").hide();
		$(" .data_count").show();
		//if($(".data-every").length==0){
		//	$(".data_every").hide();
		//}
		$scope.getCoTotal();
	}
			//统计页面数据

		$scope.getCoTotal = function(){
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
				//console.info("1313131",queryData.deptId,queryData.ppid)
				$scope.getCoCountInfo =data.data;
				console.info("统计页面数据",$scope.getCoCountInfo)
				//console.info($scope.getCoCountInfo)
				//优先级
				$scope.priorityStat = data.data.priorityStat;

				//期限
				$scope.deadLineStat = data.data.deadLineStat;
				//标识
				$scope.makerStat = data.data.makerStat;
				//协作类型
				$scope.typeStat = data.data.typeStat;
				//	判断返回的数据类型是空或者是NaN,如果是把对应的div给移除掉
				//console.info("数据类型",$scope.priorityStat);
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



				var colorStyle1= ["#E6D055","#73CC6C","#5887FD"]
				var colorStyle2 = ["#E6D055",'#FC688A',"#73CC6C","#5887FD","#8F6DF2","#A0A8C1"];
				
				// 数据清零
				arr = [];
				arrCount = 0;
				//优先级别
				angular.forEach( $scope.priorityStat, function (value, key) {
					arr.push(value);
					//页面优先级展示数据
					$scope.arrString.push(key);

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
						unit.name = parsePercent(value/arrCount);
//						unit.name = parseInt((value/arrCount)*100)+"%";
					}

					unit.itemStyle.normal.color = '';
					priorityArr.push(unit);


				});
				//循环数组给他添加颜色属性
				for(var t= 0;t<priorityArr.length;t++){
					priorityArr[t].itemStyle.normal.color  = colorStyle1[t];
				}

				// 数据清零
				deadline = [];
				deadlineCount = 0;
				//期限
				angular.forEach($scope.deadLineStat,function(val,key){
					deadline.push(val);
					$scope.deadlineStr.push(key)
				})
				for(var m in deadline){
					deadlineCount += deadline[m]
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
						dataTime.name = parsePercent(val/deadlineCount);
//						dataTime.name=parseInt((val/deadlineCount)*100)+"%";
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
				angular.forEach($scope.makerStat,function(val,key){
					maker.push(val);
					$scope.makerStatStr.push(key);

				})
				for(var i in maker){
					makerCount += maker[i];
				}
				angular.forEach($scope.makerStat,function(val,key){
					var blank = {
						value:"",
						name:"",
						itemStyle:{
							normal:{
								color:""
							}
						}
					};
					blank.value =val;
					if(isEmptyArr(maker)==0){
						//blank.name = val.toString();
						$("#data_graph3").parent().hide();
					}else{
						$("#data_graph3").parent().show();
						blank.name = parsePercent(val/makerCount);
//						blank.name =parseInt((val/makerCount)*100)+"%";
					}

					blankId.push(blank);
				})
				for(var b = 0;b<blankId.length;b++){
					blankId[b].itemStyle.normal.color = colorStyle2[b];
				}
				// 数据清零
				typeStatNub = [];
				typeCount = 0;
				//协作类型
				angular.forEach($scope.typeStat,function(val,key){
					typeStatNub.push(val);
					$scope.typeStatStr.push(key)
				});
				for(var k in typeStatNub){
					typeCount += typeStatNub[k]
				}
				angular.forEach($scope.typeStat,function(val,key){
					var coType ={
						value:"",
						name:"",
						itemStyle:{
							normal:{
								color:""
							}
						}
					};
					coType.value = val;
					if(isEmptyArr(typeStatNub)==0){
						//coType.name =val.toString();
						$("#data_graph4").parent().hide()
					}else{
						$("#data_graph4").parent().show();
						coType.name = parsePercent(val/typeCount);
//						coType.name = parseInt((val/typeCount)*100)+"%";
					}
					coTypeObj.push(coType);

				});
				for(var c= 0;c<coTypeObj.length;c++){
					coTypeObj[c].itemStyle.normal.color = colorStyle2[c]
				}
				//console.info(typeCount)
				var myChart1 = echarts.init(document.getElementById('data_graph'));
				//标识统计
				var option1 = {
					series: [{
						name: '优先级',
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
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						//labelLine: {
						//	normal: {
						//		show: false
						//	}
						//},
						//是否显示线
						//饼型图的显示比例
						data: priorityArr

					}]
				};
				myChart1.setOption(option1);
				//	第二部分
				//图形绘制
				var myChart2 = echarts.init(document.getElementById('data_graph2'));

				// 指定图表的配置项和数据
				//			app.title = '环形图';

				var option2 = {
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
						data:timeLim

					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart2.setOption(option2);
				//图形绘制
				var myChart3 = echarts.init(document.getElementById('data_graph3'));

				// 指定图表的配置项和数据
				//			app.title = '环形图';

				var option3 = {
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
						data:blankId

					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart3.setOption(option3);

				//图形绘制
				var myChart4 = echarts.init(document.getElementById('data_graph4'));

				// 指定图表的配置项和数据
				//			app.title = '环形图';

				var option4 = {
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
						data:coTypeObj,



					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				myChart4.setOption(option4);

			})
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





	}]);

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