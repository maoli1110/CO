'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams) {
	
    var firstflag = true; //筛选全选只加载一次标识
    var firstreackflag = true;//进入页面只加载一次定位
    $scope.scrollend = false;//停止滚动加载
    var firstdeptid; //第一个项目部id
    
    //查询列表初始值
    $scope.currentDate =  Cooperation.getCurrentDate();
    $scope.cooperationList = [];
    var tempCooperationList = [];
    var queryData = {};
  	queryData.count = 20;
  	queryData.deptId = $stateParams.deptId?$stateParams.deptId:'';
  	queryData.groups=[];
  	queryData.modifyTime = '';
    queryData.modifyTimeCount = 0;
  	queryData.ppid = $stateParams.ppid?$stateParams.ppid:'';
  	
  	queryData.queryFromBV = true;
  	queryData.searchKey = '';
  	queryData.searchType = '';
    $scope.isTypeChecked = false;
    $scope.coopattr = '0';
    $scope.openSignal = false;
    $scope.projectInfoList = [];
    $scope.deptIdToken = 0;//防止点击项目部多次提交
    $scope.ppidToken = 0;//防止点击工程部多次提交
    
    $scope.openNew = function () {
    	$scope.openSignal = true;
    	Cooperation.getTypeList().then(function (data) {
        $('.overlay').css('top','0px');
        $('.overlay').css('height','calc(100vh - 65px)');
        $('.overlay').css('display','block');
    		$scope.typeList = data;
    	});
    }
    
	$scope.link = function(id){
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
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
		$(".draft-box").hide();
	}
	
	$scope.drafts = function(id){
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
			$(".cop-filter ,.cop-list ,.btn_count").css("display",'none');
			$(".draft-box").show();
			$(".basic-project").hide();
			Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
				queryData.deptId = '';
				queryData.ppid = '';
			});
		}

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
    	window.open(url,'_self');
    }

    //获取项目部列表3434
    Cooperation.getDeptInfo().then(function (data) {
    	$scope.deptInfoList = data;
    	if(!queryData.deptId){
    		firstdeptid = data[0].deptId;//确定第一个deptid
    		$scope.deptIdToken = 0;
    	}
    });
    
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
			$("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'>"+treeItems[i].projectName+"&nbsp;("+treeItems[i].count+")</span>")
		}
		
		$("span[id^='projectbutton_']").bind("click", function(){
			  $(".draft-box").hide();
		   	  $("span[class*=ng-binding]").removeClass("menusActive");
		        //获取当前元素
		   	  $(this).addClass("menusActive").siblings().removeClass("menusActive");
		   	  $(" .data_count").hide();
			  $scope.getCollaborationList($(this).attr("id").split("_")[1]);
		});
	}
    
    //获取工程列表
   	$scope.getprojectInfoList = function (deptId, open) {
      $('.panel-collapse').find('span').removeClass('menusActive');
   		//初始化数据
   		$scope.scrollend = false;
        queryData.modifyTime = '';
        queryData.modifyTimeCount = 0;
        queryData.ppid = '';
		$scope.projectInfoList=[];
		queryData.groups=[];
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
		$(".draft-box").hide();
		if(!open){
			Cooperation.getProjectList(deptId).then(function (data) {
				getimgurl(data,deptId);
				if(queryData.ppid){
					$("span[id='projectbutton_"+queryData.ppid+"']").click();
				}
			});
		}
		if(!queryData.deptId){
			queryData.deptId  = deptId;
		}
		//如果进入的deptid不同
		if(queryData.deptId != deptId ){
			queryData.deptId  = deptId;
		}
	    $scope.cooperationList = []; 
	    Cooperation.getCollaborationList(queryData).then(function (data) {
	    	$scope.cooperationList = data;
	    	$scope.deptIdToken = 1;
	    });
		$(" .data_count").hide();

   	}
   
   	
   	/*滚动加载只防止多次提交请求问题start*/
    //可以查询
 	var searchFlag;
 	var pollingFlag = true;
 	var checkSearchInterval;
 	$scope.addMoreData = function (){

 		if($scope.deptIdToken == 0){
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
            //queryData.deptId = firstdeptid;
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
	    	$scope.allType();
	      	$scope.allPriority();
	      	$scope.allMark();
	      	firstflag = false;
		}
	})
	
	$scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){
		if(firstreackflag){
			//获取列表里面第一个项目部
			if(queryData.deptId){
				$("#deptbutton_"+queryData.deptId).click();
			}else{
				$("#deptbutton_"+firstdeptid).click();
			}
			firstreackflag = false;
		}
	})
	
	//删除草稿箱的内容
	$scope.deleteProject = function(coid){
		Cooperation.removeDraft(coid).then(function(data){
			window.location.reload();
		})
	}
	
   	//点击工程获取协同列表
   $scope.getCollaborationList = function (ppid) {
	  if(queryData.ppid==ppid && queryData.modifyTimeCount != 1){
		  return;
	  }else{
		  $scope.scrollend = false;
          queryData.modifyTime = '';
          queryData.modifyTimeCount = 0;
	  }
      $scope.initScrollend(ppid);
   	  queryData.ppid = ppid;
	  $scope.typeStatStr=[];
   	  Cooperation.getCollaborationList(queryData).then(function (data) {
   		   $scope.cooperationList = data;
   		   isSuccuess =true;
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
		if($scope.typeCheck) {
			$('.type-check').find('input').prop('checked',true);
            queryTypeSelected = _.cloneDeep($scope.coQueryType);
            for(var i=0;i<6;i++) {
                $('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
            }
		} else {
            for(var j=0;j<6;j++) {
                $('.bgs' + j).removeClass('bgs' + j).addClass('bg' + j);
            }
			$('.type-check').find('input').prop('checked',false);
			queryTypeSelected = [];
		}
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
      console.log($scope.scrollend);
        $scope.isCollapsed = false;
        $('.overlay').css('display','none');
    	var groups = [];
    	var type601Selected = [];
    	var type602Selected = [];
    	var type603Selected = [];
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
        $scope.isCollapsed = false;
        $('.overlay').css('display','none');
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
   	$scope.inputSearch = function () {
   		if(queryData.deptId==""){
   			queryData.deptId = firstdeptid;
   		}
   		queryData.searchKey = $scope.searchkey;
   		queryData.modifyTime = 0;
   		Cooperation.getCollaborationList(queryData).then(function (data) {
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
	
	//统计页面
	var comboxCount = $("#comboBox_count");
	$scope.comboxCount = function(){
		$(".table-list ").hide();
		$(" .data_count").show();
		$scope.getCoTotal();
	}

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