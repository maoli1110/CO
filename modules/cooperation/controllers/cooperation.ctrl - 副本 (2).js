'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','$location','$timeout','Communication',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,$location,$timeout,Communication) {
    var urlParams = $location.search(); //截取url参数
    $scope.flag = {};
    $scope.flag.isEmptyUrl = $.isEmptyObject(urlParams); //判断当前url参数否为空 false:有值 true：空
    var firstflag = true; //筛选全选只加载一次标识
    var firstreackflag = true;//进入页面只加载一次定位
    $scope.scrollend = false;//停止滚动加载
    $scope.flag.filterOk = false;//默认false，点击筛选设置为true，拿到数据设置为false（目的在于禁止没拿到数据前调用addmore）
    var firstdeptid; //第一个项目部id;
	var searId;
	$scope.branchList = false;//子公司弹窗列表初始状态
    //查询列表初始值
    $scope.currentDate =  Cooperation.getCurrentDate();
    $scope.cooperationList = [];
    var tempCooperationList = [];
    var queryData = {};
  	queryData.count = 20;
  	queryData.deptId = (!$scope.flag.isEmptyUrl && urlParams.deptId >= -1)?urlParams.deptId:'';
  	queryData.groups=[];
  	queryData.modifyTime = '';
    queryData.modifyTimeCount = 0;
  	queryData.ppid = urlParams.ppid?urlParams.ppid:'';
  	
  	queryData.queryFromBV = true;
  	queryData.searchKey = '';
  	queryData.searchType = 0;
    $scope.isTypeChecked = false;
    $scope.coopattr = '0';
    $scope.openSignal = false;
    $scope.projectInfoList = [];
    $scope.deptIdToken = 0;//防止点击项目部多次提交
    $scope.ppidToken = 0;//防止点击工程部多次提交
    $scope.deptIdOpenToken = 0;//防止点击项目部关闭多次提交;
    var oldSelsectType = [];//筛选旧值存储-协作类型
	var oldPriority = [];//筛选旧值存储-优先级
	var oldMark = [];//筛选旧值存储-标识
	$scope.checkboxSelsectType = [];//筛选实际checkbox旧值存储-协作类型
	$scope.checkboxPriority = [];//筛选实际checkbox旧值存储-优先级
	$scope.checkboxMark = [];//筛选实际checkbox旧值存储-标识

	$scope.coNoResult = false;
	$scope.deptNoCo = false;
	$scope.projNoCo = false;
	$scope.searchNoCo = false;
	$scope.noRelatedNoCo = false;
	
	var queryTypeSelected = [];
	var queryPriorityselected = [];
	var queryMarkSelected = [];
	var deptName = null;//项目名称
	var ppidName = null;//工程名称
	var sourceflag = urlParams.source?urlParams.source:''; //从哪个页面返回
	

    $scope.openNew = function () {
    	$scope.openSignal = true;
    	Cooperation.getTypeList().then(function (data) {
        $('.overlay').css('top','0px');
        $('.overlay').css('height','calc(100vh - 65px)');
        $('.overlay').css('display','block');
        angular.forEach(data,function(value,key) {
          if(value.name == '问题整改'){
            data[key].typeImg = 1;
          } else if(value.name == '阶段报告'){
            data[key].typeImg = 2;
          }else if(value.name == '方案报审'){
            data[key].typeImg = 3;
          }else if(value.name == '方案会签'){
            data[key].typeImg = 4;
          }else if(value.name == '现场签证'){
            data[key].typeImg = 5;
          } else if(value.name == '图纸变更'){
            data[key].typeImg = 6;
          }
        });
    		$scope.typeList = data;
			console.info('typeList',$scope.typeList)

    	});
    }
	//var createindex = layer.load(1, {
	//	shade: [0.5,'#000'], //0.1透明度的黑色背景
	//});
	//	setTimeout(function(){layer.close(createindex)},2000);
	$scope.link = function(id){
		$(".operation").show();
		$('.table-list')[0].scrollTop=0;
		$scope.coNoResult = false;
   		$scope.deptNoCo = false;
   		$scope.projNoCo = false;
   		$scope.searchNoCo = false;
   		$scope.noRelatedNoCo = false;
        $scope.flag.isDraft = false;
		$scope.deptIdOpenToken = 0;
		searId =id;
        //console.info('searId',searId)
        $scope.initScrollend(id);
		$scope.projectInfoList = [];
		$('.data_count').hide();
		$scope.searchkey = $("#exampleInputName1").val();
		queryData.searchKey = $scope.searchkey;
      	if(firstflag&&queryData.groups.length <= 0) {	// 条件没有被组装过 组装筛选条件
      		queryTypeSelected = _.cloneDeep($scope.coQueryType);
      		queryPriorityselected = _.cloneDeep($scope.coPriority);
      		queryMarkSelected = _.cloneDeep($scope.coMark);
    		queryData.groups = queryData.groups.concat($scope.assemblyGroups(queryTypeSelected, queryPriorityselected, queryMarkSelected));
    	}
		if(id==-1){
			queryData.deptId = '';
			queryData.ppid = '';
		}
		if(queryData.groups.length > 0){
				Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
				// 无搜索条件则显示当前无协作
				if(($scope.markCheck && $scope.priorityCheck && $scope.typeCheck) && $scope.cooperationList.length <= 0) {
					$scope.coNoResult = true;
					$scope.noRelatedNoCo = true;
				} else if (!($scope.markCheck && $scope.priorityCheck && $scope.typeCheck) && $scope.cooperationList.length <= 0) {
					// 有搜索条件则显示当前无结果
					$scope.coNoResult = true;
					$scope.searchNoCo = true;
				}
				queryData.deptId = '';
				queryData.ppid = '';
			});
		}else {
			// 有搜索条件则显示当前无结果
			$scope.coNoResult = true;
			$scope.searchNoCo = true;
		}
      $(".general").removeClass('menusActive');
      $("#draft").removeClass('menusActive');
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
		// $(".draft-box").hide();
	}
	
	$scope.drafts = function(id){
	    $scope.flag.isDraft = true;
		$scope.deptIdOpenToken = 0;
		searId = id;
		//console.info('searId',searId)
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
      $(".general").removeClass('menusActive'); 
      $("#no-relate").removeClass('menusActive');
			$(".cop-filter ,.cop-list ,.btn_count").css("display",'none');
			$(".draft-box").show();
			Cooperation.getCollaborationList(queryData).then(function (data) {
				$scope.cooperationList = data;
				queryData.deptId = '';
				queryData.ppid = '';
				//console.info('$scope.cooperationList',$scope.typeList)
				//console.info('xjmifsnfw',$scope.cooperationList)
				if($scope.cooperationList.isLock){
					$('.table  tbody .problems-rect .problems-box').css('margin-left','40px')
				}
			});
		}

     //弹出筛选框
    $scope.openfilter = function () {
      $scope.isCollapsed = true;
      $('.overlay1').css('display','block');
      $('.overlay1').css('top','59px');
      $('.overlay1').css('height','calc(100vh - 115px)');
	  $('.operation-mask').css('display','block')
    }
    //点击蒙层隐藏筛选匡
    $scope.clicklay = function () {
      $scope.isCollapsed = false;
      $scope.detailSignal = false;
      $scope.openSignal = false;
      $('.overlay').css('display','none');
	  $(".operation-mask").hide()
    }

    $scope.clicklay1 = function () {
      $scope.isCollapsed = false;
      $scope.detailSignal = false;
      $scope.openSignal = false;
      $('.overlay1').css('display','none');
	  $(".operation-mask").hide()
    }

    //点击显示列表每条协作的详情
    $scope.openDetail = function (item) {
      $scope.detailSignal = true;
      $('.overlay').css('top','0px');
       $('.overlay').css('height','calc(100vh - 65px)');
      $('.overlay').css('display','block');
      if(item.deadline != null) {
    	  item.deadline = item.deadline.substr(0,10);
      }
      $scope.everyDetail = item;
    }

    $scope.trans = function (typeId,typeName) {
    	$state.go('newcopper', {'typeid': typeId,'typename':typeName,'deptId':queryData.deptId,'ppid':queryData.ppid,'deptName':deptName,'ppidName':ppidName},{location:'replace'});
    }

    //获取项目部列表
    Cooperation.getDeptInfo().then(function (data) {
    	$scope.deptInfoList = data;
    	if(!queryData.deptId){
    		firstdeptid = data[0].deptId;//确定第一个deptid
            queryData.deptId = firstdeptid;
    		$scope.deptIdToken = 0;
    	}
	    //console.log(queryData.deptId);
    });

    //获取动态筛选列表
    Cooperation.getCoQueryFilter().then(function (data) {
    	debugger
    	$scope.coQueryFilterList = data;
    	data[0].list.shift();
    	data[1].list.shift();
    	data[2].list.shift();
    	$scope.coQueryType = data[0].list;
    	$scope.coPriority = data[2].list;
    	$scope.coMark = data[1].list;
    });
    
    function getimgurl(treeItems,deptId){
    	//清空旧数据
    	$("#dept_"+deptId).empty();
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
			}else if(treeItems[i].projectType=="PDF"){
				treeItems[i].imgsrc="imgs/icon/6.png";
			}
			if(!!treeItems[i].count){
                $("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>"+treeItems[i].projectName+"</span>&nbsp;<b class='coop-countElement'>("+treeItems[i].count+")</b></span>")
            } else {
                $("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>"+treeItems[i].projectName+"</span></span>")
            }
		}
		
		$("span[id^='projectbutton_']").bind("click", function(){
			//if(navigator.onLine){
            //
			//}else{
			//	layer.alert('没有网络啦!',function(){
			//		btn:['确定','取消']
			//	},function(){
			//		layer.closeAll()
			//	})
			//}
			var createindex = layer.load(1, {
				   shade: [0.5,'#000'], //0.1透明度的黑色背景
			});
			$scope.searchkey = $("#exampleInputName1").val();
			queryData.searchKey = $scope.searchkey;
			  // $(".draft-box").hide();
            $scope.flag.isDraft = false;
            $('.manage-menus').removeClass('menusActive');
		   	$("span[class*=ng-binding]").removeClass("menusActive");
		    //获取当前元素
		   	$(this).addClass("menusActive").siblings().removeClass("menusActive");
		   	$(" .data_count").hide();
			$(".table-list.basic-project").show();
			if(queryData.groups.length != 0){
				$scope.getCollaborationList($(this).attr("id").split("_")[1],$(this).find('.substr-sideMenus').text());
			} else {
				$scope.cooperationList = []; 
	    			$scope.coNoResult = true;
	    			$scope.searchNoCo = true;
			}
			setTimeout(function() {layer.close(createindex)},200);
		});
	}

    //获取工程列表
	var  nameCount=0;//点击项目赋值给项目名称
   	$scope.getprojectInfoList = function (deptId, open,itemDeptName) {
		//if($(".manage-menus .menus-icon".hasClass('rotate2'))){

		//}
		deptName = itemDeptName;
		$(".container-fluid .operation").show();
   		$('.table-list')[0].scrollTop=0;
   		$scope.coNoResult = false;
   		$scope.deptNoCo = false;
   		$scope.projNoCo = false;
   		$scope.searchNoCo = false;
   		$scope.noRelatedNoCo = false;
        $scope.flag.isDraft = false;
      $('#deptbutton_'+deptId).parent().addClass('menusActive');
      $(':not(#deptbutton_'+deptId+')').parent().removeClass('menusActive');
   		//初始化数据
       var createindex = layer.load(1, {
           shade: [0.5,'#000'], //0.1透明度的黑色背景,
       });
   		$scope.scrollend = false;
        queryData.modifyTime = '';
        queryData.modifyTimeCount = 0;
        queryData.ppid = '';
		$scope.projectInfoList=[];
		$scope.searchkey = $("#exampleInputName1").val();
		queryData.searchKey = $scope.searchkey;
		// queryData.groups=[];勿删
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
		// $(".draft-box").hide();
		var ppid = urlParams.ppid?urlParams.ppid:'';
		if(!open){
			Cooperation.getProjectList(deptId).then(function (data) {
				layer.close(createindex);
				getimgurl(data,deptId);

				if(ppid&&firstreackflag){
					$("span[id='projectbutton_"+ppid+"']").click();
					firstreackflag = false;
				}
			});
			$scope.deptIdOpenToken = 0;
		}else{
			$scope.deptIdOpenToken = 1;
			layer.close(createindex);
		}

		if(!queryData.deptId){
			queryData.deptId  = deptId;
		}
		//如果进入的deptid不同
		if(queryData.deptId != deptId ){
			queryData.deptId  = deptId;
		}
	    if(!queryData.ppid){
	      $scope.cooperationList = []; 
	    	if(firstflag || queryData.groups.length != 0) {
	    		
	    		Cooperation.getCollaborationList(queryData).then(function (data) {
	    			$scope.cooperationList = data;
	    			if($scope.cooperationList.length <= 0){
	    				var groupsCheckAll = false;	// 筛选框前3个是否全部选中
	    				$scope.coNoResult = true;
	    				if($scope.markCheck && $scope.priorityCheck && $scope.typeCheck){
//	    					if($("#allTypeId").is(':checked')&&$("#allPriorityId").is(':checked')&&$("#allMarkId").is(':checked')){
	    					groupsCheckAll = true;
	    				}
	    				if(groupsCheckAll&&queryData.searchKey == ''&&queryData.searchType == ''){
	    					//显示当前项目部无协作
	    					$scope.deptNoCo = true;
	    				}else{
	    					$scope.searchNoCo = true;
	    				}
	    			}
	    			$scope.deptIdToken = 1;
	    			$scope.deptIdOpenToken = 0;
	    		});
	        	if(queryData.groups.length <= 0) {	// 条件没有被组装过 组装筛选条件
	        		queryData.groups = queryData.groups.concat($scope.assemblyGroups(queryTypeSelected, queryPriorityselected, queryMarkSelected));
	        	}
	    		firstflag = false;
    	} else {
    		if($scope.cooperationList.length <= 0){
    			$scope.coNoResult = true;
    			$scope.searchNoCo = true;
    		}
	    }
	    $(" .data_count").hide();
	    }
   	}
   
   	
   	/*滚动加载只防止多次提交请求问题start*/
    //可以查询
 	var searchFlag;
 	var pollingFlag = true;
 	var checkSearchInterval;
 	$scope.addMoreData = function (){
 		if($scope.deptIdToken == 0 ||  $scope.ppidToken == 1 || $scope.deptIdOpenToken == 1) {
 			$scope.ppidToken = 0;
 			return;
 		}
 		if(token == true){
 			token = false;
 			return;
 		}
 		//是否有切换status,有切换，并且没有获取到数据，直接返回
 		//主要针对来回切换
 		if($scope.status&&!$scope.changeAttrToken){
 			$scope.status =false;
 			return;
		}
 		//主要是针对： 第一次进入滚动之后在切换其他状态（serchtype）滚动加载两次问题
 		if($scope.changeAttrToken){
 			$scope.changeAttrToken = false;
 			return;
 		}
 		if($scope.flag.filterOk){
 			return;
 		}
 		//如果第一次加载，没有20条语句，并且出现滚动条，导致srocllend不为true，可以继续滚动
 		if($scope.cooperationList.length < 20 ){
        	$scope.scrollend = true;
        	return;
        }
// 		console.log("searchTypeToken==queryData.searchType:",searchTypeToken+"=="+queryData.searchType);
// 		if(!!searchTypeToken){
// 			if (searchTypeToken != queryData.searchType) {
// 				return;
// 			}
// 		} 
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
        if(!queryData.deptId && !$scope.isLink) {
           // queryData.deptId = firstdeptid;
            //queryData.searchType = 0;
        }
        //第一次queryData.modifyTime为空
        //第二次modifyTime为最后一次的数据的时间值
//        if($scope.cooperationList.length) {
//            queryData.modifyTimeCount = 1;
//            for(var i = 0;i<$scope.cooperationList.length;i++){
//            	queryData.modifyTime = $scope.cooperationList[i].updateTime;
//            }
//            queryData.modifyTime =  $scope.cooperationList[$scope.cooperationList.length - 1].updateTime;
//        }
        if($scope.cooperationList.length) {
        	var count = 0;
        	var size = $scope.cooperationList.length;
        	queryData.modifyTime =  $scope.cooperationList[size - 1].updateTime;
            for(var i = 0;i<size;i++){
            	if(queryData.modifyTime == $scope.cooperationList[i].updateTime){
            		count++;
            	}
//            	queryData.modifyTime = $scope.cooperationList[i].updateTime;
            }
            queryData.modifyTimeCount = count;
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
		debugger
		if(sourceflag === 'detail'){
			
			//读取sessionstorage的值
			oldSelsectType = JSON.parse(sessionStorage.queryTypeSelected);
			oldPriority = JSON.parse(sessionStorage.queryPriorityselected);
			oldMark = JSON.parse(sessionStorage.queryMarkSelected);
			console.log(oldSelsectType)
			console.log(oldPriority)
			console.log(oldMark)
			// queryTypeSelected = oldSelsectType;
			// queryPriorityselected = oldPriority;
			// queryMarkSelected = oldMark;

			// $scope.filterOk();
			
			$scope.filterCancel();


		}

		if(firstflag && sourceflag !== "detail"){

			//第一次设置默认全选
	        $scope.typeCheck = true;
	        $scope.priorityCheck = true;
	    	$scope.markCheck = true;
			$scope.allType(firstflag);
      		$scope.allPriority(firstflag);
      		$scope.allMark(firstflag);
			
	    	
//	      	firstflag = false;
		}
		//协作筛选状态被改变时触发
		if(!$scope.typeCheck ||!$scope.priorityCheck||!$scope.markCheck){
			$('.cop-filter').addClass('filter-active');
		}else{
			$('.cop-filter').removeClass('filter-active');
		}


	})
		//选择子公司关闭子公司列表弹框
		//$('.trent-branch ul li').click(function(){
		//	$scope.branchList = false;
		//})
		//console.info($('.trent-branch ul li'))

	$scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){

		if(firstreackflag){
			//获取列表里面第一个项目部
			if(queryData.deptId && queryData.deptId!=0 && queryData.deptId!=-1){
				$("#deptbutton_"+queryData.deptId).click();
				$("#deptbutton_"+queryData.deptId).parent().addClass('menusActive');
			}else if(queryData.deptId==-1){
				$scope.deptIdToken = 1;
				$('#no-relate').click();
				$("#no-relate").addClass('menusActive');
			}else if(queryData.deptId==0){
				$scope.deptIdToken = 1;
				$('#draft').click();
				$("#draft").addClass('menusActive');
			}else{
				$("#deptbutton_"+firstdeptid).click();
				$("#deptbutton_"+firstdeptid).parent().addClass('menusActive');
			}
		}

 		$(".manage-menus").bind("click", function(){
            $("manage-menus").removeClass("menusActive");
            //获取当前元素
            $(this).addClass("menusActive").siblings().removeClass("menusActive");
        });

		$scope.flag.isVisible = true;

		// 页面渲染完成后 设置左侧sidebar的高度
		$(".sidebar").css("height", document.documentElement.clientHeight-$("header").height()-2);
		$(".manage-menus").click(function(){
			$(this).find('.menus-icon').toggleClass('rotate2');
		});

	})

	
	//删除草稿箱的内容
	$scope.deleteProject = function(coid){
		layer.confirm('是否删除该协作？', {
			btn: ['是','否'], //按钮
			move: false
		}, function(){
			layer.closeAll();
			Cooperation.removeDraft(coid).then(function(data){
			})
			$scope.drafts(0);
		});

	}
	var token = false;
   	//点击工程获取协同列表
   $scope.getCollaborationList = function (ppid,projectName) {
	   $(".container-fluid .operation").show();
   		$('.table-list')[0].scrollTop=0;
	   $scope.coNoResult = false;
	   $scope.deptNoCo = false;
	   $scope.projNoCo = false;
	   $scope.searchNoCo = false;
	   $scope.noRelatedNoCo = false;
	   
	   var createindex = layer.load(1, {
		   shade: [0.5,'#000'], //0.1透明度的黑色背景
	   });
//	   console.log("创建："+createindex);
	  if(queryData.ppid==ppid && queryData.modifyTimeCount != 1){
		  layer.close(createindex);
		  return;
	  }else{
		  if($scope.scrollend == true && queryData.ppid != ppid){
        	  token = true;
          }
		  $scope.ppidToken = 0;
		  $scope.scrollend = false;
          queryData.modifyTime = '';
          queryData.modifyTimeCount = 0;
	  }

      $scope.initScrollend(ppid);
   	  queryData.ppid = ppid;
	  $scope.typeStatStr=[];
	  if(queryData.searchType == 0) {
		  queryData.searchType = '';
	  }
	   ppidName = projectName;
	  Cooperation.getCollaborationList(queryData).then(function (data) {
   		   $scope.cooperationList = data;
		   if($scope.cooperationList.length <= 0){
				var groupsCheckAll = false;
				$scope.coNoResult = true;
				if($scope.markCheck && $scope.priorityCheck && $scope.typeCheck) {
//				if($("#allTypeId").is(':checked')&&$("#allPriorityId").is(':checked')&&$("#allMarkId").is(':checked')){
					groupsCheckAll = true;
				}
				if(groupsCheckAll&&queryData.searchKey == ''&&(queryData.searchType == '' || queryData.searchType == 0)){
					//显示当前工程无协作
					$scope.projNoCo = true;
				}else{
					$scope.searchNoCo = true;
				}
		   }
   		   $scope.ppidToken = 1;
//   		   console.log("消除："+createindex);
		   layer.close(createindex)
   	  });   	  
   }
    


	// action值为add或remove
    var updateSelected = function(action,id,type,index,signal){
        var findIndex = _.findIndex(type, id);
        var signalIs1 = signal == 1 ? true : false;
        var signalIs2 = signal == 2 ? true : false;
        var signalIs3 = signal == 3 ? true : false;
        if(action == 'add' && findIndex == -1){
            type.push(id);
       	}
         if(action == 'remove' && findIndex !=-1){
            type.splice(findIndex,1);
        }
        if(action == 'add') {
            if(signalIs1) {
                $('.bg' + index).removeClass('bg' + index).addClass('bgs' + index);
            }
        }
        if(action == 'remove'){
            if(signalIs1) {
                $('.bgs' + index).removeClass('bgs' + index).addClass('bg' + index);
                $('#allTypeId').prop('checked',false);
            }else if(signalIs2 ){
            	$('#allPriorityId').prop('checked',false); 
            }else if(signalIs3){
            	$('#allMarkId').prop('checked',false);
            }
        }else{
        	 if(signalIs1) {
        		 if($scope.coQueryType.length == type.length){
        			 $('#allTypeId').prop('checked',true);
        		 }
             }else if(signalIs2 ){
            	 if($scope.coPriority.length == type.length){
            		 $('#allPriorityId').prop('checked',true); 
            	 }
             }else if(signalIs3){
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
		var obj = {index:index, flag:checkbox.checked};
        switch (signal) {
        	case 1:
        		type = queryTypeSelected;
        		$scope.checkboxSelsectType[index] = {index:index, checkbox:checkbox};
        		break;
        	case 2:
        		type = queryPriorityselected;
        		$scope.checkboxPriority[index] = {index:index, checkbox:checkbox};
        		break;
        	case 3:
        		type = queryMarkSelected;
        		$scope.checkboxMark[index] = {index:index, checkbox:checkbox};
        		break;
        }
        updateSelected(action,id,type,index,signal);
        // 改变$scope.typeCheck  $scope.priorityCheck  $scope.markCheck的值如果在掉updateSelected方法之前
        // queryTypeSelected  queryPriorityselected  queryMarkSelected的length还是旧值 起不到作用
        switch (signal) {
	    	case 1:
	    		if(queryTypeSelected.length == $scope.coQueryType.length) {
	    			$scope.typeCheck = true;
	    		} else {
	    			$scope.typeCheck = false;
	    		}
	    		break;
	    	case 2:
	    		if(queryPriorityselected.length == $scope.coPriority.length) {
	    			$scope.priorityCheck = true;
	    		} else {
	    			$scope.priorityCheck = false;
	    		}
	    		break;
	    	case 3:
	    		if(queryMarkSelected.length == $scope.coMark.length) {
	    			$scope.markCheck = true;
	    		} else {
	    			$scope.markCheck = false;
	    		}
	    		break;
        }
    }
    
    $scope.isSelected = function(id){
//    	console.log(queryTypeSelected.indexOf(id));
        return queryTypeSelected.indexOf(id)>=0;
    }
    //选中
	function isCheck(){
		$(".icon-sub").attr("src",'imgs/icon/funnel.png');
	}
	//非选中
	function isNotCheck(){
		$(".icon-sub").attr("src",'imgs/icon/funnel-1.png');
	}
    //alltype全选
	$scope.allType = function (firstflag) {
	
		$scope.checkboxSelsectType = new Array($scope.coQueryType.length);
		debugger
		if(firstflag) {
			oldSelsectType = new Array($scope.coQueryType.length);
		} else {
			debugger
			for(var i = 0; i<$scope.checkboxSelsectType.length;i++) {
				$scope.checkboxSelsectType[i] = $('.checkbox_type_' + i );
			}
		}
		if($scope.typeCheck) {
			$('.type-check').find('input').prop('checked',true);
            queryTypeSelected = _.cloneDeep($scope.coQueryType);
            for(var i=0;i<$scope.coQueryType.length;i++) {
                $('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
                if(firstflag) {
                	var type = {name:$scope.coQueryType[i].name,flag:true};
					oldSelsectType[i] = type;
				}
            }
		} else {
            for(var i=0;i<$scope.coQueryType.length;i++) {
                $('.bgs' + i).removeClass('bgs' + i).addClass('bg' + i);
                if(firstflag) {
                	var type = {name:$scope.coQueryType[i].name,flag:false};
					oldSelsectType[i] = type;
				}
            }
			$('.type-check').find('input').prop('checked',false);
			queryTypeSelected = [];
		}
	}

	//allPriority全选-优先级
    $scope.allPriority = function (firstflag) {
    	$scope.checkboxPriority = new Array($scope.coPriority.length);
    	if(firstflag) {
    		oldPriority = new Array($scope.coPriority.length);
		} else {
			for(var i = 0; i<$scope.checkboxPriority.length;i++) {
				$scope.checkboxPriority[i] = $('.checkbox_priority_' + i );
			}
		}
        $('.priority-check label').addClass('input-check');
    	if($scope.priorityCheck) {
    		$('.priority-check').find('input').prop('checked',true);
    		queryPriorityselected = _.cloneDeep($scope.coPriority);
    		if(firstflag) {
    			for(var i = 0;i<$scope.coPriority.length;i++){
    				var type = {name:$scope.coPriority[i].name,flag:true};
    				oldPriority[i] = type;
    			}
    		}

    	} else {
    		$('.priority-check').find('input').prop('checked',false);
    		queryPriorityselected = [];
    		if(firstflag) {
    			for(var i = 0;i<$scope.coPriority.length;i++){
    				var type = {name:$scope.coPriority[i].name,flag:false};
    				oldPriority[i] = type;
    			}
    		}
    	}
    }

    //marking标识全选
    $scope.allMark = function (firstflag) {
    	$scope.checkboxMark = new Array($scope.coMark.length);
    	if(firstflag) {
    		oldMark = new Array($scope.coMark.length);
		} else {
			for(var i = 0; i<$scope.checkboxMark.length;i++) {
				$scope.checkboxMark[i] = $('.checkbox_mark_' + i );
			}
		}
    	if($scope.markCheck) {
    		$('.mark-check').find('input').prop('checked',true);
    		queryMarkSelected = _.cloneDeep($scope.coMark);
    		if(firstflag) {
    			for(var i=0;i<$scope.coMark.length;i++){
    				var type = {name:$scope.coMark[i].name,flag:true};
    				oldMark[i] = type;
    			}
    		}
    	} else {
    		$('.mark-check').find('input').prop('checked',false);
    		queryMarkSelected = [];
    		if(firstflag) {
    			for(var i=0;i<$scope.coMark.length;i++){
    				var type = {name:$scope.coMark[i].name,flag:false};
    				oldMark[i] = type;
    			}
    		}
    	}
    }

    //动态筛选-确定-按钮-搜索
    $scope.filterOk = function () {
    	$scope.flag.filterOk = true;
        $scope.coNoResult = false;
  	    $scope.deptNoCo = false;
  	    $scope.projNoCo = false;
  	    $scope.searchNoCo = false;
  	    $scope.noRelatedNoCo = false;

        $scope.scrollend = false;
        queryData.modifyTime = '';
        queryData.modifyTimeCount = 0;

		$('.operation-mask').css('display','none');
		if($scope.markCheck && $scope.priorityCheck &&$scope.typeCheck){
			isCheck()
		}else{
			isNotCheck()
		}
        $scope.isCollapsed = false;
        $('.overlay1').css('display','none');
    	var groups = [];
    	if(queryTypeSelected.length == 0) {
    		for(var i=0;i<oldSelsectType.length;i++) {	// 确定时 新值覆盖旧值-协作类型
    			oldSelsectType[i].flag = false;
    		}
    	} else {
    		for(var i=0;i<oldSelsectType.length;i++) {	// 确定时 新值覆盖旧值-协作类型
    			var oldName = oldSelsectType[i].name;
    			for(var j=0;j<queryTypeSelected.length;j++) {
    				var newName = queryTypeSelected[j].name;
    				if(oldName == newName) {
    					oldSelsectType[i].flag = true;
    					break;
    				} else {
    					oldSelsectType[i].flag = false;
    				}
    			}
    		}
    	}
    	if(queryPriorityselected.length == 0) {
    		for(var i=0;i<oldPriority.length;i++) {	// 确定时 新值覆盖旧值-优先级
    			oldPriority[i].flag = false;
    		}
    	} else {
    		for(var i=0;i<oldPriority.length;i++) {	// 确定时 新值覆盖旧值-优先级
    			var oldName = oldPriority[i].name;
    			for(var j=0;j<queryPriorityselected.length;j++) {
    				var newName = queryPriorityselected[j].name;
    				if(oldName == newName) {
    					oldPriority[i].flag = true;
    					break;
    				} else {
    					oldPriority[i].flag = false;
    				}
    			}
    		}
    	}
		
    	if(queryMarkSelected.length == 0) {
    		for(var i=0;i<oldMark.length;i++) {	// 确定时 新值覆盖旧值-标识
    			oldMark[i].flag = false;
    		}
    	} else {
    		for(var i=0;i<oldMark.length;i++) {	// 确定时 新值覆盖旧值-标识
    			var oldName = oldMark[i].name;
    			for(var j=0;j<queryMarkSelected.length;j++) {
    				var newName = queryMarkSelected[j].name;
    				if(oldName == newName) {
    					oldMark[i].flag = true;
    					break;
    				} else {
    					oldMark[i].flag = false;
    				}
    			}
    		}
    	}
    	// 根据筛选 选中的条件组装需要向后台发送的数据
    	groups = groups.concat($scope.assemblyGroups(queryTypeSelected, queryPriorityselected, queryMarkSelected));
    	queryData.groups = groups;
    	$scope.getCooperation(groups);
    }
    
    /**
     * 根据传入的筛选条件组装条件
     * type: 协作类型
     * priority: 优先级
     * mark: 标识
     */
    $scope.assemblyGroups = function(type, priority, mark) {
		var result = [];
		angular.forEach(type,function (value, key) {
			var unit = {};
			unit.type= 601;
			unit.value = {key:value.key};
			result.push(unit);
		});
		angular.forEach(priority,function (value, key) {
			var unit = {};
			unit.type= 602;
			unit.value = {key:value.key};
			result.push(unit);
		});
		angular.forEach(mark,function (value, key) {
			var unit = {};
			unit.type= 603;
			unit.value = {key:value.key};
			result.push(unit);
		});
		return result;
    }
    
    $scope.getCooperation = function(groups) {
    	if(groups!=null&&groups.length>0){
    		queryData.groups = groups;
    		queryData.modifyTime = 0;
    		Cooperation.getCollaborationList(queryData).then(function (data) {
    			$scope.cooperationList = data;
    			$scope.flag.filterOk = false;
    			if(data.length < 20){
    				$scope.scrollend = true;
    			}
    			if($scope.cooperationList.length <= 0){
    				$scope.coNoResult = true;
    				$scope.searchNoCo = true;
    			}
    		});
    	}else{
    		$scope.cooperationList = [];
    		if($scope.cooperationList.length <= 0){
    			$scope.coNoResult = true;
    			$scope.searchNoCo = true;
    		}
    	}
    }
   
    

	// if(是哪边返回的){oldSelsectType = 带过来newSe；
	// 	$scope.filterCancel()
	// }


    $scope.filterCancel = function () {
		$('.operation-mask').css('display','none')
        $scope.isCollapsed = false;
        $('.overlay1').css('display','none');
        
		var typeLength = 0;
		for(var i=0;i<oldSelsectType.length;i++) {	// 取消时 旧值覆盖新值-协作类型(背景图片调整)
			if(oldSelsectType[i].flag){	// 选中
				$('.bg' + i).removeClass('bg' + i).addClass('bgs' + i);
				// $('.bg' + i  +' input, .bgs' + i  +' input' ).prop("checked",true);
				typeLength++;
			} else {	// 没选中
				$('.bgs' + i).removeClass('bgs' + i).addClass('bg' + i);
			}
			for(var j=0; j < $scope.checkboxSelsectType.length; j++) {
				if($scope.checkboxSelsectType[j] != undefined && i == j) {
					//实际的checkbox选中状态
					$('.bg' + i  +' input, .bgs' + i  +' input' ).prop("checked",oldSelsectType[i].flag);
					break;
				}
			}
		}
		
		
		var priorityLength = 0;
		debugger
		for(var i=0;i<oldPriority.length;i++) {	// 取消时 旧值覆盖新值-优先级(背景调整)
			if(oldPriority[i].flag){	// 选中
				$('.priority_' + i).attr("background", "#979ba8");
				priorityLength++;
			} else {	// 没选中
				$('.priority_' + i).attr("background", "#979ba8");
			}
			for(var j=0; j < $scope.checkboxPriority.length; j++) {
				if($scope.checkboxPriority[j] != undefined && i == j) {
					// 实际的checkbox选中状态
					$('.checkbox_priority_' + i ).prop("checked",oldPriority[i].flag);
					break;
				}
			}
		}

		
		var markLength = 0;
		for(var i=0;i<oldMark.length;i++) {	// 取消时 旧值覆盖新值-标识(背景调整)
			if(oldMark[i].flag){	// 选中
				$('.mark_' + i).attr("background", "#979ba8");
				markLength++;
			} else {	// 没选中
				$('.mark_' + i).attr("background", "#979ba8");
			}
			for(var j=0; j < $scope.checkboxMark.length; j++) {
				if($scope.checkboxMark[j] != undefined && i == j) {
					// 实际的checkbox选中状态
					$('.checkbox_mark_' + i ).prop("checked",oldMark[i].flag);
					break;
				}
			}
		}
		// 全选按钮样式
		if(oldSelsectType.length == typeLength){
			$('#allTypeId').prop('checked',true);
		} else {
			$('#allTypeId').prop('checked',false);
		}
		// 全选按钮样式
		if(oldPriority.length == priorityLength){
			$('#allPriorityId').prop('checked',true);
		} else {
			$('#allPriorityId').prop('checked',false);
		}
		// 全选按钮样式
		if(oldMark.length == markLength){
			$('#allMarkId').prop('checked',true);
		} else {
			$('#allMarkId').prop('checked',false);
		}

		
		
		
		// 筛选图标变化
    	if($scope.markCheck && $scope.priorityCheck &&$scope.typeCheck){
			isCheck();
		}else{
			isNotCheck();
		}
    }

    /*if(sourceflag === 'detail'){
		//读取sessionstorage的值
		alert('detail')
		// firstflag = false;
		// console.log($scope.coQueryType);
  //   	console.log($scope.coPriority);
  //   	console.log($scope.coMark);
		// queryTypeSelected = JSON.parse(sessionStorage.queryTypeSelected);
		// queryPriorityselected = JSON.parse(sessionStorage.queryPriorityselected);
		// queryMarkSelected = JSON.parse(sessionStorage.queryMarkSelected);
		oldSelsectType = JSON.parse(sessionStorage.queryTypeSelected);
		oldPriority = JSON.parse(sessionStorage.queryPriorityselected);
		oldMark = JSON.parse(sessionStorage.queryMarkSelected);
		// oldSelsectType = JSON.parse(sessionStorage.oldSelsectType);
		// oldPriority = JSON.parse(sessionStorage.oldPriority);
		// oldMark = JSON.parse(sessionStorage.oldMark);
		// $scope.filterOk();
		$scope.filterCancel();
	}*/


    $scope.changeAttrToken = false;
    $scope.status = false;
//    var searchTypeToken;
   	//根据属性筛选
   	$scope.changeAttr = function () {
   		$('.table-list')[0].scrollTop=0;
   		//初始化参数
   		$scope.scrollend = false;
        queryData.modifyTime = '';
        queryData.modifyTimeCount = 0;
        $scope.changeAttrs = false;
        $scope.status = true;
        
   		$scope.coNoResult = false;
  	    $scope.deptNoCo = false;
  	    $scope.projNoCo = false;
  	    $scope.searchNoCo = false;
  	    $scope.noRelatedNoCo = false;
   		queryData.searchType = parseInt($scope.coopattr);
//   		searchTypeToken = queryData.searchType;
   		queryData.modifyTime = 0;
		if(queryData.groups.length == 0){
			$scope.coNoResult = true;
  	    	$scope.searchNoCo = true;
  	    	return;
		}
   		Cooperation.getCollaborationList(queryData).then(function (data) {
   			$scope.cooperationList = data;
   			$scope.changeAttrToken = true;
   			$scope.changeAttrs = true;
   			if($scope.cooperationList.length <= 0){
	  	    	$scope.coNoResult = true;
	  	    	$scope.searchNoCo = true;
	  	   	}
   		});
   	}

   	//根据搜索框搜索
	$scope.getCollaborationListFun = function(){
   		$scope.coNoResult = false;
  	    $scope.deptNoCo = false;
  	    $scope.projNoCo = false;
  	    $scope.searchNoCo = false;
  	    $scope.noRelatedNoCo = false;
		queryData.searchKey = $scope.searchkey;
		queryData.modifyTime = 0;
		if(queryData.groups.length == 0){
			$scope.coNoResult = true;
  	    	$scope.searchNoCo = true;
  	    	return;
		}
		Cooperation.getCollaborationList(queryData).then(function (data) {
			$scope.cooperationList = data;
			if($scope.cooperationList.length <= 0){
	  	    	$scope.coNoResult = true;
	  	    	$scope.searchNoCo = true;
	  	   	}
		});
	}
   	$scope.inputSearch = function () {
		if(searId ==0){
			queryData.deptId=0;
			$scope.getCollaborationListFun();
		}else if(searId ==-1){
			queryData.deptId=-1;
			$scope.getCollaborationListFun();
		}else{
			if(queryData.deptId==""){
				queryData.deptId = firstdeptid;
			}
			$scope.getCollaborationListFun();
		}
   	}
	//	按enter键进行筛选
		$scope.searchEnter = function(e){
			var keyCode = e.keyCode|| e.which;
			if($('#exampleInputName1').val()!='' && keyCode==13){
				$scope.inputSearch();
			}else if($('#exampleInputName1').val()==''){
				$scope.cooperationList=[];
				if(searId==0){
					queryData.deptId=searId;
					$scope.getCollaborationListFun()
				}else{
					if(queryData.deptId==""){
						queryData.deptId = firstdeptid;
					}
					$scope.getCollaborationListFun();
				}


			}
		}

	$scope.getCoCountInfo=[];
	var arr = [];
	$scope.arrString=[];
	var priorityArr = [];
	var arrCount =0;

	var deadline = [];
	$scope.deadlineStr = [];
	var timeLim =[];
	var timeName = [];
	var deadlineCount = 0;

	var maker =[];
	$scope.makerStatStr = [];
	var blankId = [];
	var blankName = [];
	var makerCount =0;

	var typeStatNub = [];
	$scope.typeStatStr=[];
	var coTypeObj = [];
	var coTypeName = [];
	var typeCount =0;
		$('.draft-box').css('display','none');
	//统计页面
	var comboxCount = $("#comboBox_count");
	$scope.comboxCount = function(){
		$(".basic-project").hide();
		$('.draft-box').hide();
		$(" .operation").hide();
		$(" .data_count").show();
		$('body').css('overflowX','hidden');
		$scope.getCoTotal();
	}
	$(".data_back").click(function(){
	//	alert(123)
		$('.data_count').hide();
		$('.draft-box').css('display','none');
		$(".container-fluid .operation").show();
		$('body').css('overflowX','auto');
	})
	//	装饰线
	//	$('body').css('overflow','hidden');
	$scope.getCoTotal = function(){
		//图标内容大小自适应
		priorityArr = [];
		timeLim =[];
		timeName = [];
		blankId = [];
		blankName = [];
		coTypeObj = [];
		coTypeName = [];
		$scope.arrString =[];
		$scope.deadlineStr =[];
		$scope.makerStatStr=[];
		$scope.typeStatStr=[];
		//$(".data_count").children().hide();
		if(!queryData.ppid){
			queryData.ppid ='';
		}
		$('.data_count').height($(window).height()-62);
		Cooperation.getCoStatisticsInfo({deptId :queryData.deptId,ppid:queryData.ppid}).then(function(data){
			$scope.getCoCountInfo =data.data;
			//优先级
			$scope.priorityStat = data.data.priorityStat;
			//期限
			$scope.deadLineStat = data.data.deadLineStat;
			//标识
			$scope.makerStat = data.data.makerStat;
			//协作类型
			//console.info('$scope.getCoCountInfo',isEmpty($scope.deadLineStat));
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
			if(isEmpty($scope.priorityStat)){
				$('.data_every.first').hide();
			}else{

				$('.data_every.first').show();
			}
			if(isEmpty($scope.deadLineStat)){
				$('.data_every.second').hide();
			}else{
				$('.data_every.second').show();
			}
			if(isEmpty($scope.makerStat)){
				$('.data_every.third').hide();
			}else{
				$('.data_every.third').show();
			}
			if(isEmpty($scope.typeStat)){
				$('.data_every.forth').hide();
			}else{
				$('.data_every.forth').show();
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
				// 颜色与cooperation.css中 .data_count .data_every .data_titleInfo.first ul li:nth-of-type(1) span 的顺序对上即可
				var colorStyle1= ["#5887FD","#E6D055","#73CC6C"];
				// 数据清零
				arr = [];
				
				var hasI = false;
				var hasII = false;
				var hasIII = false;
				var priorityLength = 0;
				for(var x in $scope.priorityStat){
					if(x == "I") {
						hasI = true;
					}
					if(x == "II") {
						hasII = true;
					}
					if(x == "III") {
						hasIII = true;
					}
					priorityLength ++;
				}
				//优先级别
				var value = 0;
				if(hasI) {
					value = $scope.priorityStat.I;
					$scope.arrString.push({name:"I", amount: value});
					arr.push(value);
					priorityArr.push({value:value,name:"I",itemStyle:{normal:{color:''}}});
				}
				if(hasII) {
					value = $scope.priorityStat.II;
					$scope.arrString.push({name:"II", amount: value});
					arr.push(value);
					priorityArr.push({value:value,name:"II",itemStyle:{normal:{color:''}}});
				}
				if(hasIII) {
					value = $scope.priorityStat.III;
					$scope.arrString.push({name:"III", amount: value});
					arr.push(value);
					priorityArr.push({value:value,name:"III",itemStyle:{normal:{color:''}}});
				}

				arrCount = 0;
				for(var n in arr){
					arrCount += arr[n];
				}
				
				angular.forEach( $scope.priorityStat, function (value, key) {
					if(isEmptyArr(arr)==0){
						$("#data_graph").parent().hide();
					}else{
						$("#data_graph").parent().show();
					}
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
					$scope.deadlineStr.push({name:key, amount: val});
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
//						dataTime.name = key+", "+val;
						dataTime.name = key;
					}
					timeLim.push(dataTime);
					timeName.push(key);
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
					$scope.makerStatStr.push({name:key,color:obj.color, amount: obj.count});
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
						$("#data_graph3").parent().hide();
					}else{
						$("#data_graph3").parent().show();
//						blank.name = key+", "+obj.count;
						blank.name = key;
					}

					blankId.push(blank);
					blankName.push(key);
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
					$scope.typeStatStr.push({name:key,color:obj.color, amount: obj.count});
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
						$("#data_graph4").parent().hide()
					}else{
						$("#data_graph4").parent().show();
						coType.name = key;

					}
					coTypeObj.push(coType);
					coTypeName.push(key);
				});
				/*for(var c= 0;c<coTypeObj.length;c++){
					coTypeObj[c].itemStyle.normal.color = colorStyle2[c];
				}*/
			var myChart1 = echarts.init(document.getElementById('data_graph'));
			//优先级统计饼图
			var arrPriorityName = [];
			for(var i = 0; i < priorityArr.length; i++) {
				arrPriorityName.push(priorityArr[i].name);
			}
			var option1 = { 
					tooltip: {	// 鼠标移上去显示的黑框
				        trigger: 'item',
				        //formatter: "{b}, {c} ({d}%)"
						formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
						transitionDuration:0,
				    },

				    title : {
				        text: '优先级',
				        x:'left',
						left:15,
				        y:'10',
						//borderWidth:1,
						padding: [10,67,10,0],
						//backgroundColor:'#F9F9F9',
						//borderColor:'#F0F0F2',
						textStyle:{
							fontSize: 18,
							fontWeight: 'normal',
							color: '#333',
							fontFamily:'Microsoft yahei'
						}
					},
				    legend: {	// 列表
				    	orient: 'vertical',
						x: 'left',
						left:15,
				        padding: [10,78,10,0],
				        itemGap: 15,
						//backgroundColor:'#F9F9F9',
						//borderColor:'#F0F0F2',
				        data:arrPriorityName,
						itemWidth:20,
						itemHeight:12,
				        formatter: function (name) {
							if (name.length == 1) {
								name = name + "  ";
							} else if (name.length == 2) {
								name = name + " ";
							}
							return echarts.format.truncateText("  "+name, 70, '14px Microsoft Yahei', '…');
				        },
				        tooltip: {
				            show: true
				        },
				        //borderWidth:1,
				        top: '47',
				        right: '50',
				        align : 'left',
						width: '500'
				    },
					series: [
			         {
			             type:'pie',
			             radius: ['40%', '60%'],
			             avoidLabelOverlap: false,
			             center: ['60%', '50%'],
			             label: {
			                 normal: {  show: false, position: 'center' },
			                 emphasis: {	// 鼠标移上去显示在中间的字
			                     show: true,
								 textStyle: {
									 fontSize: '20',
									 fontWeight: 'bold',
									 fontFamily:'Microsoft yahei',
								 },
								 formatter: "数量 : {c}\n\n比例 : {d}%",
			                 }
			             },
			             labelLine: { normal: { show: true } },
			             data : priorityArr
			         }
			     ]};
			/*var option1 = { 
					tooltip: {	// 鼠标移上去显示的黑框
				        trigger: 'item',
				        formatter: "{b} ({d}%)"
				    },
				    legend: {	// 列表
				        orient: 'vertical',
				        x: 'right',
				        data:arrPriorityName
				    },
					series: [
			         {
			             type:'pie',
//			             radius: ['40%', '60%'],
			             avoidLabelOverlap: false,
			             label: {
			                 normal: {  show: false, position: 'center' },
			                 
			                 emphasis: {	// 鼠标移上去显示在中间的字
			                     show: true,
			                     textStyle: {
			                         fontSize: '20',
			                         fontWeight: 'bold'
			                     }
			                 }
			             },
			             labelLine: { normal: { show: false } },
			         },
			         {
							type:'pie',
							labelLine: {
								normal: {
									show: true
								}
							},
				//标识统计
			var option1 = {
				series: [
					{
						type:'pie',
						labelLine: {
							normal: {
								show: false
							}
						},
						{
							type:'pie',
							radius: ['40%', '60%'],
							data:priorityArr
						}
			     ]};*/
				myChart1.setOption(option1);

				//	第二部分
			var myChart2 = echarts.init(document.getElementById('data_graph2'));
			var option2 = { 
					tooltip: {	// 鼠标移上去显示的黑框
				        trigger: 'item',
				        //formatter: "{b}, {c} ({d}%)"
						formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
						transitionDuration:0,
				    },
				    title : {
				        text: '期限',
				        x:'left',
				        y:'10',
						left:15,
						padding: [10,84,10,0],
						//borderWidth:1,
						//backgroundColor:'#F9F9F9',
						//borderColor:'#F0F0F2',
						textStyle:{
							fontSize: 18,
							fontWeight: 'normal',
							color: '#333',
							fontFamily:'Microsoft yahei'
						}
				    },
				    legend: {	// 列表
				    	 orient: 'vertical',
				         x: 'left',
				         itemGap: 15,
						left:15,
						padding: [10,52,10,0],
						itemWidth:20,
						itemHeight:12,
						//backgroundColor:'#F9F9F9',
						//borderColor:'#F0F0F2',
				        data:timeName,
				        formatter: function (name) {
				            return echarts.format.truncateText("  "+name, 70, '14px Microsoft Yahei', '…');
				        },
				        tooltip: {
				            show: true
				        },
				        height:300,
				        //borderWidth:1,
				        top: '47',
				        right: '50',
				        align : 'left'
				    },
					series: [
			         {
			             type:'pie',
			             radius: ['40%', '60%'],
			             avoidLabelOverlap: false,
						 center: ['60%', '50%'],
			             label: {
			                 normal: {  show: false, position: 'center' },
			                 emphasis: {	// 鼠标移上去显示在中间的字
			                     show: true,
								 textStyle: {
									 fontSize: '20',
									 fontWeight: 'bold',
									 fontFamily:'Microsoft yahei',
								 },
								 formatter: "数量 : {c}\n\n比例 : {d}%",
			                 }
			             },
			             labelLine: { normal: { show: true } },
			             data : timeLim
			         }
			     ]};
				// 使用刚指定的配置项和数据显示图表。
				myChart2.setOption(option2);
			//图标内容大小自适应
			//window.onresize = myChart2.resize;
				//图形绘制
			var myChart3 = echarts.init(document.getElementById('data_graph3'));
				// 指定图表的配置项和数据
				//			app.title = '环形图';

			var isNull = false;

			var tempName = '';
			for(var i = 0; i < blankName.length; i ++){
				var name = blankName[i];
				if (tempName.length < name.length) {
					tempName = name;
				}
			}

			function Compute(v) {
				var d = document.getElementById('dvCompute');
				//d.innerHTML = '&nbsp;';
				d.innerHTML = v;
				return { w: d.offsetWidth, h: d.offsetHeight };
			}

			//console.info(((140 - d.w) * 4.2));

			var option3 = {
					tooltip: {	// 鼠标移上去显示的黑框
				        trigger: 'item',
				        formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
						transitionDuration:0,
				    },
				    title : {
				        text: '标识',
				        x:'left',
				        y:'10',
						left:15,
						textStyle:{
							fontSize: 18,
							fontWeight: 'normal',
							color: '#333',
							fontFamily:'Microsoft yahei'
						}
				    },
				    legend: {	// 列表
						width:100,
						orient: 'vertical',
						x: 'left',
						itemGap: 15,
						itemWidth:20,
						itemHeight:12,
						left:15,
				        data:blankName,
						formatter: function (name) {
							return echarts.format.truncateText(" " + name, 70, '14px Microsoft Yahei', '...');
						},
				        tooltip: {
				            show: true
				        },
				        height:300,
				        top: '47',
				        align : 'left'
				    },
					series: [
			         {
			             type:'pie',
			             radius: ['40%', '60%'],
			             avoidLabelOverlap: false,
						 center: ['60%', '50%'],
			             label: {
			                 normal: {  show: false, position: 'center' },
			                 emphasis: {	// 鼠标移上去显示在中间的字
			                     show: true,
			                     textStyle: {
			                         fontSize: '20',
			                         fontWeight: 'bold',
									 fontFamily:'Microsoft yahei',
									 align : 'left',
			                     },
			                     //formatter: " {c} ({d}%)",
								 formatter: "数量 : {c}\n\n比例 : {d}%",
                                 //x:left,


                                 //formatter: function (name) {
									// return echarts.format.truncateText(name, 40, '14px Microsoft Yahei', '…');
                                 //},
			                 }
			             },
			             labelLine: { normal: { show: true } },
			             data : blankId
                         //data : [{value:'222', name:'11a'}]
			         }
			     ]};
			// 使用刚指定的配置项和数据显示图表。
			myChart3.setOption(option3);
			//图标内容大小自适应
			//	window.onresize = myChart3.resize;
				//图形绘制
				var myChart4 = echarts.init(document.getElementById('data_graph4'));
				var option4 = {
						tooltip: {	// 鼠标移上去显示的黑框
					        trigger: 'item',
					        //formatter: "{b}, {c} ({d}%)"
							formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
							transitionDuration:0,
					    },
					    title : {
					        text: '协作类型',
					        x:'left',
					        y:'10',
							left:15,
							//borderWidth:1,
							//padding: [10,48,10,10],
							//backgroundColor:'#F9F9F9',
							//borderColor:'#F0F0F2',
							textStyle:{
								fontSize: 18,
								fontWeight: 'normal',
								color: '#333',
								fontFamily:'Microsoft yahei'
							}
					    },
					    legend: {	// 列表
					    	 orient: 'vertical',
					         x: 'left',
					         itemGap: 15,
							left:15,
							//padding: [10,40,10,0],
							itemWidth:20,
							itemHeight:12,
					        data:coTypeName,
					        formatter: function (name) {
					            return echarts.format.truncateText("  "+name, 70, '14px Microsoft Yahei', '…');
					        },
					        tooltip: {
					            show: true
					        },
					        height:300,
					        top: '47',
					        align : 'left'
					    },
						series: [
				         {
				             type:'pie',
				             radius: ['40%', '60%'],
				             avoidLabelOverlap: false,
							 center: ['60%', '50%'],
				             label: {
				                 normal: {  show: false, position: 'center' },
				                 emphasis: {	// 鼠标移上去显示在中间的字
				                     show: true,
									 textStyle: {
										 fontSize: '20',
										 fontWeight: 'bold',
										 fontFamily:'Microsoft yahei',
									 },
									 formatter: "数量 : {c}\n\n比例 : {d}%",
				                 }
				             },
				             labelLine: { normal: { show: true } },
				             data : coTypeObj

				         }

				     ]};
				/*var option4 = {
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
				};*/
				// 使用刚指定的配置项和数据显示图表。
				myChart4.setOption(option4);
			//图标内容大小自适应
			//window.onresize = myChart4.resize;
			window.onresize = function(){
				//alert(1)
				myChart1.resize();
				myChart2.resize();
				myChart3.resize();
				myChart4.resize();
				$('.data_count').height($(window).height()-62);
			}

			})

		}
   
    //跳转详情传filter值
    $scope.transCoDetail = function(currentItem) {
    	debugger
    		// queryTypeSelected = _.cloneDeep($scope.coQueryType);
      // 		queryPriorityselected = _.cloneDeep($scope.coPriority);
      // 		queryMarkSelected = _.cloneDeep($scope.coMark);
    	//存入sessionStrorage,如果筛选条件无变化则不存sessionStorage
    	if(!_.isEqual(queryTypeSelected,$scope.coQueryType) || !_.isEqual(queryPriorityselected,$scope.coPriority) || !_.isEqual(queryMarkSelected,$scope.coMark)) {
    		debugger
    		oldSelsectType = new Array($scope.coQueryType.length);
    		oldPriority = new Array($scope.coPriority.length);
    		oldMark = new Array($scope.coMark.length);

			for(var i = 0; i < $scope.coQueryType.length; i++) {
			debugger	// 原始值
				var originName = $scope.coQueryType[i].name;
				for(var j = 0; j < queryTypeSelected.length; j++) {	//选中的值
					if(originName === queryTypeSelected[j].name){
						oldSelsectType[i] = {name:originName,flag:true};
					} else {
						oldSelsectType[i] = {name:originName,flag:false};
					}
				}
			}

			for(var i = 0; i < $scope.coPriority.length; i++) {	// 原始值
				var originName1 = $scope.coPriority[i].name;
				for(var j = 0; j < queryPriorityselected.length; j++) {	//选中的值
					if(originName1 === queryPriorityselected[j].name){
						oldPriority[i] = {name:originName1,flag:true};
					} else {
						oldPriority[i] = {name:originName1,flag:false};
					}
				}
			}

    		for(var i = 0; i < $scope.coMark.length; i++) {	// 原始值
				var originName2 = $scope.coMark[i].name;
				for(var j = 0; j < queryMarkSelected.length; j++) {	//选中的值
					if(originName2 === queryMarkSelected[j].name){
						oldMark[i] = {name:originName2,flag:true};
					} else {
						oldMark[i] = {name:originName2,flag:false};
					}
				}
			}
    		console.log(oldSelsectType);
    		console.log(oldPriority);
    		console.log(oldMark);
    		sessionStorage.oldSelsectType = JSON.stringify($scope.coQueryType);
    		sessionStorage.oldPriority = JSON.stringify($scope.coPriority);
    		sessionStorage.oldMark = JSON.stringify($scope.coMark);


    		sessionStorage.queryTypeSelected = JSON.stringify(oldSelsectType);
			sessionStorage.queryPriorityselected = JSON.stringify(oldPriority);
			sessionStorage.queryMarkSelected = JSON.stringify(oldMark);
    	}
        $state.go('coopdetail',{'coid':currentItem.coid},{ location:'replace' });
    }

    //判断是否是从be过来的发起协作
    if(urlParams.newcoop == 'frombe'){
      $timeout(function() {
                    $('.new_cooper').click();
                });
      
    }
		//服务器时间
		//$scope.currentTime= function(){
		//	Cooperation.getTrendsSystem({sysTime:"",sysWeek:""}).then(function(data){
		//		$scope.serviceTime = data.data;
		//	})
		//}
		//$scope.currentTime();
		if($stateParams.transignal == 'be') {
	    	$scope.openNew();
		}

		//分公司列表
		$scope.branchType = function(){
			$scope.branchList = false;
		}
}]);

$(window).resize(function () {          //当浏览器大小变化时
	var headerHeight = $("header").height();
	var allHeight = document.documentElement.clientHeight;
	// 设置左侧sidebar的高度
	$(".sidebar").css("height", allHeight-headerHeight-2);
	$("#content-b1").css("height", allHeight-headerHeight-2);
	$("#content-a3").css("height", allHeight-headerHeight-2);
	// 设置统计页面四个饼图外层的div高度
	$(".data_list").css("height", allHeight-headerHeight-$(".data_Totle").height()-2);
	$(".data_count").css("height", allHeight-headerHeight-$(".data_Totle").height()-2);
});
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
