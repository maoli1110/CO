'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','$location','$timeout',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,$location,$timeout) {
   	var urlParams = $location.search(); //截取url参数
    var firstflag = true; //筛选全选只加载一次标识
    var firstreackflag = true;//进入页面只加载一次定位
    var firstdeptid; //第一个项目部id;
	var searId; //deptId
	var tempCooperationList = [];
    var queryData = {};
	var sourceflag = urlParams.source?urlParams.source:'';
	var countArray  = [];
	var filterTableHeight = 0;//筛选项的高度
	var currentTaleHeight;//当前协同列表的高度
	var delItems = [];//批量删除选项
	var compareData = [];
	var firstTypeId;
	var defultTypeId;
	var changeFilterItem;
	var changeFilterSignal;
	var fromMange = false;
	var detailDeptId = '';
	var detailPpid = '';
	$scope.flag = {};
    $scope.flag.homeLoading = false;
    $scope.flag.isEmptyUrl = $.isEmptyObject(urlParams); //判断当前url参数否为空 false:有值 true：空

	$scope.scrollend = false;//停止滚动加载
    $scope.flag.filterOk = false;//默认false，点击筛选设置为true，拿到数据设置为false（目的在于禁止没拿到数据前调用addmore）
	$scope.flag.searchkey = sessionStorage.searchkey?sessionStorage.searchkey:'';
    $scope.currentDate =  Cooperation.getCurrentDate();
    $scope.cooperationList = [];
    $scope.projectInfoList = [];
	$scope.typeId = null;
	$scope.typeStatus = {};
	$scope.closeStatus = true;//搜索条件默认关闭
    //查询列表初始值
  	queryData.count = 20;

  	// queryData.deptId = (!$scope.flag.isEmptyUrl && urlParams.deptId >= -1)?urlParams.deptId:'';
  	// queryData.ppid = urlParams.ppid?urlParams.ppid:'';

  	queryData.modifyTime = '';
    queryData.modifyTimeCount = 0;
  	queryData.queryFromBV = true;
  	queryData.searchType = sessionStorage.coopattr?parseInt(sessionStorage.coopattr):0;

    $scope.openSignal = false;
    $scope.deptIdToken = 0;//防止点击项目部多次提交
    $scope.ppidToken = 0;//防止点击工程部多次提交
    $scope.deptIdOpenToken = 0;//防止点击项目部关闭多次提交;

	$scope.coNoResult = false;
	$scope.deptNoCo = false;
	$scope.projNoCo = false;
	$scope.searchNoCo = false;
	$scope.noRelatedNoCo = false;
	$scope.compareData = [];

	// sessionStorage.clear();
	var filterSessionOptions = sessionStorage.filterSessionOptions?JSON.parse(sessionStorage.filterSessionOptions):[]
	queryData.groups = sessionStorage.groups?JSON.parse(sessionStorage.groups):[]; //获取sessionstorage的值,反序列化
	
	if(queryData.groups.length){
		$scope.flag.filterExist = true;
		createFilterTemplate(filterSessionOptions,'rember');
	}

	//点击已选中的筛选项的click事件
	function filterTemplateEvent(){
		$('.filterOptions span').bind("click", function(){
			// $timeout(function(){
				$scope.scrollend = false;
			// });
			queryData.modifyTime = '';
			queryData.modifyTimeCount = 0;
			var type = $(this).attr('type');
			if(type == 601) {
				$scope.flag.coTypeFilter = false;
			} else if (type == 606){
				$scope.flag.coAffiliation = false;
			} else if (type == 603){
				$scope.flag.coMarkFilter = false;
			}else if (type == 605){
				$scope.flag.coStatus = false;
			}else if (type == 607){
				$scope.flag.coCreateTime = false;
			}

			//移除当前节点
			$(this).remove();
			// if(!$scope.flag.coTypeFilter && !$scope.flag.coAffiliation &&　!$scope.flag.coMarkFilter && !$scope.flag.coStatus && !$scope.flag.coCreateTime){
			// 	$scope.flag.filterExist = true;
			// }
			var removeFilter = _.remove(queryData.groups,function(n){
				return n.type == type;
			});
			var removeFilter1 = _.remove(filterSessionOptions,function(n){
				return n.type == type;
			});
			if(!queryData.groups.length){
				$scope.flag.filterExist = false;
				filterTableHeight = 0;
			} else {
				filterTableHeight = $('.filter-tab').outerHeight();
			}
			// $scope.$apply();
			//当前协同列表的高度
			$timeout(function(){
				getCoListHeight();
			},20)
			$scope.getCooperation(queryData.groups);
			//将筛选条件放入session
			addSessionValue('filter');

		});
	}
	filterTemplateEvent();
	$scope.clearAllFiltertemplate = function(){

		$('.filterOptions span').remove();
		queryData.groups = [];
		filterSessionOptions = [];
		$scope.getCooperation(queryData.groups);
		$scope.flag.filterExist = false;
		$scope.flag.coTypeFilter = false;
		$scope.flag.coAffiliation = false;
		$scope.flag.coMarkFilter = false;
		$scope.flag.coStatus = false;
		$scope.flag.coCreateTime = false;
		sessionStorage.removeItem("groups");
		sessionStorage.removeItem("filterSessionOptions");
	}
	//动态获取协作列表的高度
	function getCoListHeight (){
		currentTaleHeight = document.documentElement.clientHeight - 110 - $('.comboBox').outerHeight() - 48;
		$('.content-container').height(currentTaleHeight);
	}
	//组合删除项
	function ComDelItem() {
		delItems = [];//初始刷delItem
		angular.forEach($scope.cooperationList,function(value,key){
			delItems.push(value.coid);
		});
	}
	//根据筛选生成选项template
	function createFilterTemplate(item,signal){
		var items = []; 
		var unit = {};
		//根据item的不同来源分别处理
		if(signal != 'rember'){
			unit.type = signal;
			unit.name = item.name;
			items.push(unit);
		} else {
			items = item;
		}
		var unique = _.uniqBy(items, 'type');
		angular.forEach(unique,function(value,key){
			if(value.type == 601) {
	    		$scope.flag.coTypeFilter = true;
	    	} else if (value.type == 606){
	    		$scope.flag.coAffiliation = true;
	    	} else if (value.type == 603){
	    		$scope.flag.coMarkFilter = true;
	    	}else if (value.type == 605){
	    		$scope.flag.coStatus = true;
	    	}else if (value.type == 607){
	    		$scope.flag.coCreateTime = true;
	    	}
	    	var filterOptionsTemp = '<span class="filter-criteria" style="clear:both" type="'+value.type+'" title="'+value.name+'"><b class="substr" style="width:60px;display:inline-block;font-weight:normal;float:left">'+value.name+'</b><a style="float:right;color:#fff;">x</a></span>';
			if($('.filterOptions').find('span').length){
				$('.filterOptions span:last').after(filterOptionsTemp);
			} else {
				$('.filterOptions').append(filterOptionsTemp);
			}
		});
	}
	//获取动态筛选列表
    Cooperation.getCoQueryFilter().then(function (data) {
    	data[0].list.shift();
    	data[1].list.shift();
    	data[2].list.shift();
    	data[3].list.shift();
    	$scope.coQueryType = data[0].list;//协作类型
    	$scope.coAffiliation = data[1].list;//协作归属
    	$scope.coMark = data[2].list;//协作标识
    	$scope.coStatus= data[3].list;//协作状态
    	$scope.coCreateTime = data[4].list;//协作发起时间
    });

	var deptName = null;//项目名称
	var ppidName = null;//工程名称
    $scope.openNew = function () {
    	//勿删
    	if(!accessCode && accessCode.indexOf(accessCodeConfig.createCode)==-1){
    		layer.alert('没有当前功能使用权限，请联系企业管理员', {
				title:'提示',
				closeBtn: 0,
				move:false
			});
			return;
    	}
		$scope.openSignal = true;
		Cooperation.getTypeList().then(function (data) {
			 countArray  = data;
			$('.overlay').css('top', '0px');
			$('.overlay').css('height', 'calc(100vh - 65px)');
			$('.overlay').css('display', 'block');
			angular.forEach(data, function (value, key) {
				if (value.name == '问题整改') {
					data[key].typeImg = 1;
				} else if (value.name == '阶段报告') {
					data[key].typeImg = 2;
				} else if (value.name == '方案报审') {
					data[key].typeImg = 3;
				} else if (value.name == '方案会签') {
					data[key].typeImg = 4;
				} else if (value.name == '现场签证') {
					data[key].typeImg = 5;
				} else if (value.name == '图纸变更') {
					data[key].typeImg = 6;
				}
			});
			$scope.typeList = data;
		});
	}

	var time = 0;
	$scope.isShowComboBox = function(){
		$scope.closeStause  = !$scope.closeStause;
		if($scope.closeStause ){
			$('.double-arrow').css('transform','rotate(-180deg)');
		}else{
			$('.double-arrow').css('transform','rotate(0deg)');
		}
		$timeout(function(){
			getCoListHeight();
		},20)
	}

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
        $scope.initScrollend(id);
		$scope.projectInfoList = [];
		// $('.data_count').hide();
		queryData.searchKey = $scope.flag.searchkey;
		if(id==-1){
			queryData.deptId = -1;
			queryData.ppid = '';
		}
		
		Cooperation.getCollaborationList(queryData).then(function (data) {
			$scope.cooperationList = data.list;
			$scope.coItemsTotals = data.count;
			if(!$scope.cooperationList.length && queryData.groups.length){
				$scope.coNoResult = true;
				//显示当前搜索无结果
				$scope.searchNoCo = true;
			} else if(!$scope.cooperationList.length && !queryData.groups.length){
				$scope.coNoResult = true;
				//当前无协作
				$scope.noRelatedNoCo = true;
			}
			queryData.deptId = -1;
			queryData.ppid = '';
		});

		if($(".data_count").css('display') !== 'none'){
			$scope.comboxCount();
		}

      	$(".general").removeClass('menusActive');
      	$("#draft").removeClass('menusActive');
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
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
		$('.coo-detail').show();
      	$('.overlay').css('top','0px');
       	$('.overlay').css('height','calc(100vh - 65px)');
      	$('.overlay').css('display','block');
      	if(item.deadline != null) {
	    	item.deadline = item.deadline.substr(0,10);
	    }
      	$scope.everyDetail = item;
		detailDeptId = item.deptId;
		detailPpid = item.ppid;
    }


    $scope.trans = function (typeId,typeName) {
    	if(queryData.ppid){
    		Cooperation.getProductId(queryData.ppid).then(function(data){
    			var productId  = data;
    			$state.go('newcopper', {'typeid': typeId,'typename':typeName,'deptId':queryData.deptId,'ppid':queryData.ppid,'deptName':deptName,'ppidName':ppidName,'productId':productId},{location:'replace'});
    		});
    	} else {
    			$state.go('newcopper', {'typeid': typeId,'typename':typeName,'deptId':queryData.deptId,'ppid':queryData.ppid,'deptName':deptName,'ppidName':ppidName},{location:'replace'});
    	}
    	
    }

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

		$("span[id^='projectbutton_']").bind("click", function(event){
			$scope.allSelected = false;//初始化全选按钮
			delItems = []; //初始化批量删除
			var createindex = layer.load(1, {
				   shade: [0.5,'#000'], //0.1透明度的黑色背景
			});			
			queryData.searchKey = $scope.flag.searchkey;
            $scope.flag.isDraft = false;
            $('.manage-menus').removeClass('menusActive');
		   	$("span[class*=ng-binding]").removeClass("menusActive");
		    //获取当前元素
		   	$(this).addClass("menusActive").siblings().removeClass("menusActive");
			$(".table-list.basic-project").show();
			$scope.getCollaborationList($(this).attr("id").split("_")[1],$(this).find('.substr-sideMenus').text());
			setTimeout(function() {layer.close(createindex)},200);

			if($(".data_count").css('display') !== 'none'){
				$scope.comboxCount();
			}
		});
	}

    //获取工程列表
	var  nameCount=0;//点击项目赋值给项目名称
   	$scope.getprojectInfoList = function (deptId, open,itemDeptName) {
   		$scope.allSelected = false;//初始化全选按钮
   		delItems = []; //初始化批量删除
   		ppidName= '';
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
      	// $('#deptbutton_'+deptId).parent().siblings().removeClass('menusActive');
      	$(':not(#deptbutton_'+deptId+')').parent().removeClass('menusActive');
   		//初始化数据
       	var createindex = layer.load(1, {
           shade: [0.5,'#000'], //0.1透明度的黑色背景
       	});
   		$scope.scrollend = false;
        queryData.modifyTime = '';
        queryData.modifyTimeCount = 0;
        queryData.ppid = '';
		$scope.projectInfoList=[];
		queryData.searchKey = $scope.flag.searchkey;
		// queryData.groups=[];勿删
		$(".cop-filter, .cop-list, .btn_count").css("display",'inline-block');
		$(".basic-project").show();
		// $(".draft-box").hide();
		// var ppid = urlParams.ppid?urlParams.ppid:'';
		var ppid;
		if(urlParams.ppid && sessionStorage.ppid) {
	  		ppid = urlParams.ppid;
	  	} else if (sessionStorage.ppid || urlParams.ppid){
			if(sessionStorage.ppid && !urlParams.ppid){
				ppid = sessionStorage.ppid;
			}else if(urlParams.ppid && !sessionStorage.ppid){
				ppid = urlParams.ppid;
			}
	  	} else {
	  		ppid = '';
	  	}
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
    		Cooperation.getCollaborationList(queryData).then(function (data) {
    			$scope.cooperationList = data.list;
    			//计算当前协作总条数
				$scope.coItemsTotals = data.count;	    
    			if(!$scope.cooperationList.length && queryData.groups.length){
					$scope.coNoResult = true;
					//显示当前搜索无结果
					$scope.searchNoCo = true;
    			} else if(!$scope.cooperationList.length && !queryData.groups.length){
    				$scope.coNoResult = true;
    				//当前无协作
					$scope.noRelatedNoCo = true;
    			}
    			$scope.deptIdToken = 1;
    			$scope.deptIdOpenToken = 0;
    		});
    		if(!firstreackflag){
    			$(".data_count").hide();
    		}
    		firstflag = false;
	    }
		if($(".data_count").css('display') !== 'none'){
			$scope.comboxCount();
		}
   	}
   
   	/*滚动加载防止多次提交请求问题start*/
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
        //第一次queryData.modifyTime为空
        //第二次modifyTime为最后一次的数据的时间值
        if($scope.cooperationList.length) {
        	var count = 0;
        	var size = $scope.cooperationList.length;
        	queryData.modifyTime =  $scope.cooperationList[size - 1].updateTime;
            for(var i = 0;i<size;i++){
            	if(queryData.modifyTime == $scope.cooperationList[i].updateTime){
            		count++;
            	}
            }
            queryData.modifyTimeCount = count;
        }
        Cooperation.getCollaborationList(queryData).then(function (data) {
        	var data = data.list;
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
    
	$scope.$on('colistRepeatFinished',function(ngRepeatFinishedEvent){
		//如果在下拉工程中,当前全选是选中状态
		if($scope.allSelected){
			//1.界面全部选中
			$('.remove-signal').prop('checked',true);
			//2.组合删除项
			ComDelItem();
		}
	});

	$scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){
		if(firstreackflag){
			//获取列表里面第一个项目部
			if(queryData.deptId && queryData.deptId!=0 && queryData.deptId!=-1){
				if($("#deptbutton_"+queryData.deptId).length>0){
					$("#deptbutton_"+queryData.deptId).click();
					$("#deptbutton_"+queryData.deptId).parent().addClass('menusActive');
				} else {
					//返回找不到项目部,就定位到第一个项目部(项目部下只有一个工程,且只有一条协作)
					$("#deptbutton_"+firstdeptid).click();
					$("#deptbutton_"+firstdeptid).parent().addClass('menusActive');
				}
			}else if(queryData.deptId==-1){
				$scope.deptIdToken = 1;
				$('#no-relate').click();
				$("#no-relate").addClass('menusActive');
			}else if(queryData.deptId==0){
				$scope.deptIdToken = 1;
				$('#draft').click();
				$("#draft").addClass('menusActive');
			}
		}
	    $(".manage-menus").bind("click", function(){
	        $("manage-menus").removeClass("menusActive");
	        //获取当前元素
	        $(this).addClass("menusActive").siblings().removeClass("menusActive");
	    });

	    //历史遗留问题，用来显示主界面

		$scope.flag.isVisible = true;
	});

	//判断路由跳转
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    	// 从mangage跳转到首页面
    	//获取项目部列表3434
	    Cooperation.getDeptInfo().then(function (data) {
	    	$scope.deptInfoList = data;
	    	firstdeptid = data[0].deptId;//确定第一个deptid
	    	if(!queryData.deptId){
	            queryData.deptId = firstdeptid;
	    		$scope.deptIdToken = 0;
	    	}
	    });
		if(fromState.name == 'manage'){
			queryData.deptId = sessionStorage.deptId?sessionStorage.deptId:'';
	  		queryData.ppid = sessionStorage.ppid?sessionStorage.ppid:'';
	  	} else {
	  		queryData.deptId = (!$scope.flag.isEmptyUrl && urlParams.deptId >= -1)?urlParams.deptId:'';
	  		queryData.ppid = urlParams.ppid?urlParams.ppid:'';
	  	}
    });

    //判断路由跳转
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {  
    	//从首页面跳转到manage
    	if(toState.name == 'manage'){
	    	sessionStorage.deptId = queryData.deptId;
	    	sessionStorage.ppid = queryData.ppid;
	    }
    }); 

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
	   var createindex = layer.load(1, {
		   shade: [0.5,'#000'], //0.1透明度的黑色背景
	   });
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

          $scope.coNoResult = false;
		  $scope.deptNoCo = false;
		  $scope.projNoCo = false;
		  $scope.searchNoCo = false;
		  $scope.noRelatedNoCo = false;
	  }

      $scope.initScrollend(ppid);
   	  queryData.ppid = ppid;
	  $scope.typeStatStr=[];
	  if(queryData.searchType == 0) {
		  queryData.searchType = '';
	  }
	  ppidName = projectName;
	  Cooperation.getCollaborationList(queryData).then(function (data) {
   		   $scope.cooperationList = data.list;
   		   //计算当前协作总条数
			$scope.coItemsTotals = data.count;	
		   if($scope.cooperationList.length <= 0){
				$scope.coNoResult = true;
				if(!$scope.cooperationList.length && queryData.groups.length){
					//显示当前无结果
					$timeout(function(){
						$scope.searchNoCo = true;
					});
				}else if (!$scope.cooperationList.length && !queryData.groups.length) {
					//显示当前工程无协作
					$timeout(function(){
						$scope.projNoCo = true;
					});
				}
		   }
   		   $scope.ppidToken = 1;
		   layer.close(createindex);
   	  });
   	}
	$('.table-list').css('position','relative');
	$('.table-list .noSearch  .noProject').css({left: '50%',
		top: '50%',
		'margin-left': '-110px',
		'margin-top':' -135px'});
   	//协作类型601 协作归属606 标识603 状态605 发起时间607
    $scope.changeFilter = function(item,signal){
		changeFilterItem = item;
		changeFilterSignal = signal;
    	//组合筛选项 用于存储session
    	var unit1 = {};
    	unit1.type = signal;
    	unit1.name = item.name;
    	filterSessionOptions.push(unit1)
    	//显示筛选tab
    	$scope.flag.filterExist = true;
    	//1.根据signal确定隐藏的栏目2.根据item append template3.根据item组合group条件同时搜索
    	createFilterTemplate(item,signal);
    	
		//group组合的值
		var unit = {};
		unit.type= signal;
		unit.value = {key:item.key};
		queryData.groups.push(unit);

		$scope.scrollend = false;
     	queryData.modifyTime = '';
     	queryData.modifyTimeCount = 0;

		//延迟20ms执行,解决高度不生效的问题
		$timeout(function(){
			getCoListHeight();
		},20)
		if(queryData.groups){
			$scope.flag.filterExist = true
		}
    	$scope.getCooperation(queryData.groups);
    	//将筛选条件放入session
    	addSessionValue('filter');
		filterTemplateEvent();//生成筛选绑定时间
		// clearAllFiltertemplate($('.noFilter'));

		$('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+160));
		$('.table-list .noSearch  .noProject').css({left: '50%',top: '50%','margin-left': '-110px','margin-top':' -135px'});
	}
    
    $scope.getCooperation = function(groups) {
    	$scope.scrollend = false;
     	queryData.modifyTime = '';
     	queryData.modifyTimeCount = 0;

    	$scope.coNoResult = false;
		$scope.deptNoCo = false;
		$scope.projNoCo = false;
		$scope.searchNoCo = false;
		$scope.noRelatedNoCo = false;
		queryData.groups = groups;
		Cooperation.getCollaborationList(queryData).then(function (data) {
			//初始化scrollend值
			$scope.coItemsTotals = data.count;	
			$scope.cooperationList = data.list;
			if($scope.cooperationList.length <= 0){
				$scope.coNoResult = true;
				$scope.searchNoCo = true;
			}else{
				$scope.scrollend = false;
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
		queryData.searchKey = $scope.flag.searchkey;
		Cooperation.getCollaborationList(queryData).then(function (data) {
			$scope.coItemsTotals = data.count;	
			$scope.scrollend = false;
	     	queryData.modifyTime = '';
	     	queryData.modifyTimeCount = 0;
			$scope.cooperationList = data.list;
			if($scope.cooperationList.length <= 0){
	  	    	$scope.coNoResult = true;
	  	    	$scope.searchNoCo = true;
	  	   	}
		});
		//将搜索框的内容存session
		addSessionValue('searchkey');
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
	};

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
		windowWidth();
		$(".first-screen").hide();
		$(".data_count").show();
		// $('body').css('overflowX','hidden');
		//初始状态给的值
		compareTypeId(queryData.deptId,firstdeptid,queryData.ppid);
	}
	$(".data_back").click(function(){
		$('.data_count').hide();
		$(".first-screen").show();
		$('body').css('overflowX','auto');
		// $timeout(function(){
		// 	$('.content-container').height($(window).height()-$('.comboBox').height()-160);
		// },50);
		
		// $('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
		// $('.table-list .noSearch').css('position','relative')
	})
	function compareTypeId(deptId,firstdeptid,ppid){
		compareData = [];
		countArray = {};
		deptId?firstdeptid:deptId;
		Cooperation.typeForCoStatistics({'deptId':deptId,'ppid':ppid}).then(function(data){
			compareData = data;
			if(data.length>0){
				$('.data_list').show();
				$('.noStatistics').hide();
				Cooperation.getTypeList().then(function (data) {
					countArray = data;
					countArr(countArray,compareData);
				});
			}else if(data.length==0){
				$('.data_list').hide();
				$('.noStatistics').show();
				return;
			}

		});
	}

	function countArr(obj,compareData){//统计列表处理
		$('.statistics-menus #count-menus').empty('.liList');
		var li = '';
		angular.forEach(obj,function(val,key){
			if(compareData.indexOf(val.typeId)!=-1){
				li += '<li class="liList" typeId="'+val.typeId+'">'+val.name+'</li>';
			}

		});

		$('.statistics-menus #count-menus').height($(window).height()-112);
		$('.statistics-menus #count-menus').css({'background':'#f5f5f5','border-right':'solid 1px #ddd'});
		$('.statistics-menus #count-menus').append(li);
		$('.statistics-menus #count-menus li').eq(0).css({'background':'#fff','color':'#69c080','width':'100.5%','border-bottom':'solid 1px #ddd'})

		$scope.typeId = $('.statistics-menus #count-menus li').eq(0).attr('typeid');
		$scope.typeId?$('.statistics-menus #count-menus li').eq(0).attr('typeid'):$scope.typeId;
		$scope.getCoTotal(queryData.deptId,queryData.ppid,$scope.typeId);
	}
	$('.statistics-menus #count-menus').on('click','li',function(){
		$(this).css({'background':'#fff','color':'#69c080','width':'100.5%','border-bottom':'solid 1px #ddd','border-top':'solid 1px #ddd'}).stop().siblings().css({'background':'','color':'','cursor':'pointer','width':'100%','border-bottom':'#f5f5f5','border-top':'#f5f5f5'})
		$(this).parent().find('li:first').css('border-top','#f5f5f5');
	});

	//判断窗口大小
	function windowWidth(){
		if($(window).width()<=1380){//根据屏幕大小显示分割线
			$('.data_every ').height(($(window).height()-124)/2);
			$('.data_list .echart-shape .data_every').map(function(i,val){
				$('.data_list .echart-shape .data_every').css('border-right','none');
				$('.data_list .echart-shape .data_every:last').css('border-bottom','none');
				$('.data_list .echart-shape .data_every').eq(0).css({'border-bottom':'solid 1px #ddd'});
				$(this).height(300);
				$(this).find('[id ^="data_graph"]').height(300);
				$("#data_graph3").css('margin-left','0px');
			})

		}else if($(window).width()>1380 ){
			$("#data_graph3").css('margin-left','10px');
			$('.data_every ').height($(window).height()-124);
			$('.data_list .echart-shape .data_every').map(function(i,val){
				$(this).height($(window).height()-112);
				$(this).find('[id ^="data_graph"]').height(550);
				//if(i==3 || i==4){
				//	$('.data_list .echart-shape .data_every').eq(2).css({'border-bottom':'none'});
				//	$('.data_list .echart-shape .data_every').eq(3).css({'border-bottom':'none'});
				//}
				if(i % 2 ==0){
					$('.data_list .echart-shape .data_every:even').css({'border-right':'1px solid #ddd','border-bottom':'none'});
					$('.data_list .echart-shape .data_every:odd').css({'border-right':'none','border-bottom':'none'});
				}
			})


		}
	}

	$('#count-menus').on('click','li',function(){
		$scope.typeId = $(this).attr('typeid');
		$scope.getCoTotal(queryData.deptId,queryData.ppid,$scope.typeId);
	});
	$scope.getCoTotal = function(deptId,ppid,typeId){
		//图标内容大小自适应
		priorityArr = [];
		timeLim =[];
		timeName = [];
		blankId = [];
		blankName = [];
		coTypeObj = [];
		coTypeName = [];
		$scope.makerStatStr=[];
		$scope.typeStatStr=[];
		//$(".data_count").children().hide();
		if(!queryData.ppid){
			queryData.ppid ='';
		}
		$('.data_count').height($(window).height()-62);
			Cooperation.getCoStatisticsInfo({'deptId' :deptId,'ppid':ppid,'typeId':typeId}).then(function(data){
				$scope.makerStat = data.data.makerStat;

				//协作类型
				//console.info('$scope.getCoCountInfo',isEmpty($scope.deadLineStat));
				$scope.typeStat = data.data.statusStat;
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
				var isMakerStat = isEmpty($scope.makerStat);
				var istypeStat = isEmpty($scope.typeStat);
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
				var typeColor = {已拒绝:'#f4474d',已结束:'#6d7072',进行中:'#988be8',已整改:'#82d782',空:'#fae5c6',整改中:"#709ff4",未整改:'#fcc15b',"不整改":'#f98171',已通过:'#f3de7c',待整改:'#81D4FC',待确认:'#A9B8BE'}
				// 数据清零
				arr = [];
				arrCount = 0;
				for(var n in arr){
					arrCount += arr[n];
				}

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
						blank.name = key;
					}

					blankId.push(blank);
					blankName.push(key);
				});
				//解决双击协作类型，统计结果会显示两遍bug
				blankId = _.uniqBy(blankId,'name');
				blankName = _.uniq(blankName);
				// 数据清零
				typeStatNub = [];
				typeCount = 0;
				//协作类型
				function typeStatus(data){
					var typeKey = {}
					for(var key in data){
						 typeKey[key]= {count:$scope.typeStat[key],color:typeColor[key]};
					}
					return typeKey;
				}
				$scope.typeStat = typeStatus($scope.typeStat);

				angular.forEach($scope.typeStat,function(obj,key){
					$scope.typeStatus = key;
					typeStatNub.push(obj.count);
					$scope.typeStatStr.push({name:key,color:obj.color, amount: obj.count});
				});
				$scope.typeStatus = arr;
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
				//解决双击协作类型，统计结果会显示两遍bug
				coTypeObj = _.uniqBy(coTypeObj,'name');
				coTypeName = _.uniq(coTypeName)
				//优先级统计饼图
				var arrPriorityName = [];
				for(var i = 0; i < priorityArr.length; i++) {
					arrPriorityName.push(priorityArr[i].name);
				}
				//echart 数据重新
				function setOption(mychart,obj){
					mychart.setOption(obj);
				};
				//循环数据调用setOption
				function optinForEach(myChart,min){
					function optionMap(){
						for(var i=0;i<myChart[0].length;i++){
							setOption(myChart[0][i],myChart[1][i]);
						}
					}
					if(min>299 &&min<=300){
						optionMap();
					}else if(min>=301 &&min<=550){
						optionMap();
					}
				}
				//窗口改变的时候动态的给option对象改变半径和中心
				function setParams(myChart,fRadus,fCenter){
					for(var i=0;i<myChart[0].length;i++){
						myChart[1][i].series[0].radius = fRadus;
						myChart[1][i].series[0].center = fCenter;
					}
				}
				//echart 图形重新绘制
				function setResize(myChart){
					for(var i=0;i<myChart[0].length;i++){
						myChart[0][i].resize();
					}
				}
				//设置饼型图的半径
				function echartRadiu(){
					return [document.body.offsetWidth>1380?'35%':'45%',document.body.offsetWidth>1380?'56%':'70%'];
				}
				//设置饼型的位置
				function echartCenter(){
					return ['58%',document.body.offsetWidth>1380?'66.5%':'50%'];
				}

				// 指定图表的配置项和数据
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
					var myChart3 = echarts.init(document.getElementById('data_graph3'));
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
							padding:[11,0,0],
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
							itemGap: 10,
							itemWidth:20,
							itemHeight:12,
							left:0,
							data:blankName,
							formatter: function (name) {
								return echarts.format.truncateText(" " + name, 70, '14px Microsoft Yahei', '...');
							},
							tooltip: {
								show: true
							},
							//height:240,
							height:function(){
								document.body.offsetWidth>1380?document.body.offsetHeight:240;
							},
							top: '47',
							align : 'left',

						},
						series: [
							{
								type:'pie',

								radius: echartRadiu(),
								avoidLabelOverlap: false,
								center: echartCenter(),
								label: {
									normal: {  show: false, position: 'center' },
									emphasis: {	// 鼠标移上去显示在中间的字
										show: true,
										textStyle: {
											fontSize: '16',
											fontWeight: 'bold',
											fontFamily:'Microsoft yahei',
											align : 'left',
										},
										//formatter: " {c} ({d}%)",
										formatter: "数量 : {c}\n\n比例 : {d}%",

									}
								},
								labelLine: { normal: { show: true } },
								data : blankId
							}
						]};
					myChart3.setOption(option3);

				// 使用刚指定的配置项和数据显示图表。
					var myChart4 = echarts.init(document.getElementById('data_graph4'));
					var option4 = {

						tooltip: {	// 鼠标移上去显示的黑框
							trigger: 'item',
							//formatter: "{b}, {c} ({d}%)"
							formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
							transitionDuration:0,
						},
						title : {
							text: '状态',
							x:'left',
							y:'10',
							left:14,
							padding:[11,0,0],
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
							itemGap: 10,
							left:0,
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
							height:function(){
								document.body.offsetWidth>1380?document.body.offsetHeight:30;
							},
							top: '47',
							align : 'left'
						},
						series: [
							{
								type:'pie',
								radius:echartRadiu() ,
								center:echartCenter(),
								avoidLabelOverlap: false,
								label: {
									normal: {  show: false, position: 'center' },
									emphasis: {	// 鼠标移上去显示在中间的字
										show: true,
										textStyle: {
											fontSize: '16',
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
					// 使用刚指定的配置项和数据显示图表。
					myChart4.setOption(option4);
				function defultWindowWidth(){//窗口默认宽度
					if($(window).width()<=1380){
						$('.data_every ').height(($(window).height()-124)/2);
						if($('.data_every ').height()>300){
							$(' div[id^=data_graph]').css({'margin-top':'40px'});
						}else{
							$(' div[id^=data_graph]').css({'margin-top':'0'});
						}
					}else{
						$(' div[id^=data_graph]').css({'margin-top':'0'});
						$('.data_every ').height($(window).height()-124);
					}
				}
				defultWindowWidth();
				var myChart= [[myChart3,myChart4],[option3,option4]];//将echart  生成的对象塞进数组
				window.onresize = function(){
					var min = $('div[id ^=data_graph]').height();//窗口改变的时候动态获取画布的高度
					var  status = BimCo.GetWindowStatus();
					if(status){
						$timeout(function(){
							windowWidth();
							optinForEach(myChart,min);//根据canvas（画布）的高度判断是否重绘图形
							setParams(myChart,echartRadiu(),echartCenter());//echart  图形重绘时候设置的参数
							setResize(myChart);//改变窗口的时候resize
							option3.legend.height();
							option4.legend.height();
							defultWindowWidth();
							$('.statistics-menus #count-menus').height($(window).height()-112);
						},100)
					}else{
						$timeout(function(){
							windowWidth();
							optinForEach(myChart,min);//根据canvas（画布）的高度判断是否重绘图形
							setParams(myChart,echartRadiu(),echartCenter());//echart  图形重绘时候设置的参数
							setResize(myChart);//改变窗口的时候resize
							option3.legend.height();
							option4.legend.height();
							defultWindowWidth();
							$('.statistics-menus #count-menus').height($(window).height()-112);
						},100)
					}

					optinForEach(myChart,min);//根据canvas（画布）的高度判断是否重绘图形
					setParams(myChart,echartRadiu(),echartCenter());//echart  图形重绘时候设置的参数
					setResize(myChart);//改变窗口的时候resize
					windowWidth();
					option3.legend.height();
					option4.legend.height();
					$('.data_count').height($(window).height()-62);
					$('.statistics-menus #count-menus').height($(window).height()-112);
					defultWindowWidth();
				}

			})
		}
    //跳转详情传filter值
    $scope.transCoDetail = function(currentItem) {
		if( queryData.deptId=='' || queryData.deptId==null){
			queryData.deptId = searId;
		}
       	$state.go('coopdetail',{'coid':currentItem.coid,'deptId':queryData.deptId,'ppid':queryData.ppid},{ location:'replace' });
    }

    /**
     * 向sessionStorage存值
     */
    function addSessionValue (source) {
		//当前筛选条件，存入sessionStorage,[]需要序列化
		if(source == 'filter'){
			sessionStorage.groups = JSON.stringify(queryData.groups);
			var unique = _.uniqBy(filterSessionOptions, 'type');
			sessionStorage.filterSessionOptions = JSON.stringify(unique);
		} else {
		//当前coopattr,当前搜索主题
			sessionStorage.searchkey = $scope.flag.searchkey;
		}
    }

    //判断是否是从be过来的发起协作
    if(urlParams.newcoop == 'frombe'){
	    $timeout(function() {
	       $('.new_cooper').click();
	    });
      
    }
	if($stateParams.transignal == 'be') {
    	$scope.openNew();
	}
	
	$scope.$on("ngRepeatFinished",function(ngRepeatFinishedEvent){
		// 页面渲染完成后 设置左侧sidebar的高度
		$(".sidebar").css("height", document.documentElement.clientHeight-$("header").height()-2);
		$(".manage-menus").click(function(){
			$(this).find('.menus-icon').toggleClass('rotate2');
		})
		if ($("#siderbar:has('#siderControl')" ).length==0){
			$('#siderbar').append('<div id="siderControl"></div>');
		}
    });

	var filterRepeatEnd = 0;
	$scope.$on("ngProfit",function(ngRepeatFinishedEvent){
		filterRepeatEnd ++;
		if(filterRepeatEnd >=5){
			$timeout(function(){
				$('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
				if($scope.flag.filterExist){
					$('.content-container').height($(window).height()-$('.comboBox').height()-160);
				}else{
					$('.content-container ').height($(window).height()-160);
				}
			},1000);
		}

	})

    $scope.$on('$viewContentLoaded', function(event){
    	$scope.flag.homeLoading = true;
    });
	//删除协作
	function deleteDetail(items,source){
			//区分是批量删除or单个删除，区别处理
			if(source === 'single'){
				var item = [];
				item.push(items);
			} else {
				var item = _.cloneDeep(items);
			}
			//删除后更新总数
			if($scope.coItemsTotals){
				$scope.coItemsTotals = $scope.coItemsTotals - item.length;
			}
			if(!item.length) return;
			var ReadedSignal = 0;			//未读个数
			detailDeptId = item[0].deptId;	//当前项目部
			detailPpid = item[0].ppid;		//当前ppid
			angular.forEach(item,function(val,key){
				$('tr[coid="'+val.coid+'"]').remove();//删除元素
				if(!val.isRead){ ReadedSignal++ }
			});
			//window.location.reload();
			var deptUpdataCount = $('.manage-menus span[id=deptbutton_'+detailDeptId+'] +i').text();//项目更新数
			var noRelateCount =  $('#no-relate>i').text();
			var ppidUpdataCount = $('span[id=projectbutton_'+detailPpid+'] >b').text();//工程更新数

			if((deptUpdataCount.length>0 || ppidUpdataCount.length>0) && ReadedSignal>0){//判断更新数石村存不存在

				deptUpdataCount  = Number(deptUpdataCount .substr(1,deptUpdataCount .length-2));//截取项目更新数据的数量转换成数字类型进行加减运算
				deptUpdataCount -=item.length;
				
				ppidUpdataCount = Number(ppidUpdataCount .substr(1,ppidUpdataCount .length-2))
				ppidUpdataCount -=item.length;
				if(deptUpdataCount==0 || deptUpdataCount<0){
					$('.manage-menus span[id=deptbutton_'+detailDeptId+'] +i').text('');//如果更新数的值为0内容填充为空
				}else{
					$('.manage-menus span[id=deptbutton_'+detailDeptId+'] +i').text('('+deptUpdataCount+')');//将参与运算的更新数的新值复制给对象
				}
				if(ppidUpdataCount==0 || ppidUpdataCount<0){
					$('span[id=projectbutton_'+detailPpid+'] >b').text('');
				}else{
					$('span[id=projectbutton_'+detailPpid+'] >b').text('('+ppidUpdataCount+')')//将参与运算的更新数的新值复制给对象
				}
			}else if(noRelateCount.length>0 && ReadedSignal>0){
				noRelateCount  = Number(noRelateCount .substr(1,noRelateCount .length-2));//截取项目更新数据的数量转换成数字类型进行加减运算
				console.info('noRelateCount',noRelateCount)
				noRelateCount -= item.length;
				$('#no-relate>i').text('('+noRelateCount+')');//将参与运算的更新数的新值复制给对象
				if(noRelateCount==0 || noRelateCount<0){
					$('#no-relate>i').text('');
				}
			}
	}

	$scope.deleteCoop = function(item){
		//判断是否有删除权限
	if(!accessCode && accessCode.indexOf(accessCodeConfig.deleteCode)==-1){
			layer.alert('没有当前功能使用权限，请联系企业管理员', {
				title:'提示',
				closeBtn: 0,
				move:false
			});
			return;
		}
		var coid = item.coid
		var checkCoLocked = false;
		$.ajax({
			type: "POST",
			url: basePath+'rs/co/checkCoLocked/'+coid,
			async:false,
			contentType:'text/HTML',
			success: function(data,status,XMLHttpRequest){
				if(data){
					checkCoLocked = true;
					layer.alert('当前协作已被“'+data+'”签出，请稍后重试！', {
						title:'提示',
						closeBtn: 0,
						move:false
					},function(index){
						layer.close(index);
					});
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				layer.alert(textStatus, {
					title:'提示',
					closeBtn: 0,
					move:false
				},function(index){
					layer.close(index);
				});
			}

		});
		if(checkCoLocked){
			return ;
		}
		layer.confirm('确认要删除该协作吗？',{
			btn:['确认','取消'],
			move:false
		},function(){
			$('.coo-detail,.overlay').hide();
			layer.closeAll();
			Cooperation.removeCoopertion(coid).then(function(data){
				deleteDetail(item,'single');
				$scope.getCooperation(queryData.groups);
				layer.msg("删除成功");
			},function(error){
				layer.alert(error.message, {
					title:'提示',
					closeBtn: 0,
					move:false
				}, function(){
					layer.closeAll();
					if(error.infoCode == '1005'){
						//当前被删除的情况,走一遍删除
						deleteDetail(item);
					}
				});
			});
		});
	}

	//批量删除
	$scope.updateSelection = function($event,item){
		var checkbox = $event.target;
		var action = (checkbox.checked?'add':'remove');
		updateSelected(action,item);
		$scope.delItemsTotals = delItems.length;
	}

	function updateSelected(action,item){
		var findIndex = delItems.indexOf(item);
		if(action == 'add' && findIndex == -1){
            delItems.push(item);
       	}
         if(action == 'remove' && findIndex !=-1){
            delItems.splice(findIndex,1);
        }
	}
	//批量删除功能
	$scope.removeAll = function(){
		//判断是否有删除权限
		if(!accessCode && accessCode.indexOf(accessCodeConfig.deleteCode)==-1){
			layer.alert('没有当前功能使用权限，请联系企业管理员', {
				title:'提示',
				closeBtn: 0,
				move:false
			});
			return;
		}
		if(!delItems.length){
			layer.msg('未选中任何协作！',{time:1000});
			return;
		}
		layer.confirm('确认删除这'+delItems.length+'条协作吗？', {
			btn: ['确认','取消'], 
			move: false
		}, function(){
			layer.closeAll();
			//进行删除操作
			//组合coids
			var transCoids = [];
			angular.forEach(delItems,function(val,key){
				transCoids.push(val.coid);
			});
			//批量删除调用后端接口
			//防止批量过慢增加loading加载层
			var currentTime = Date.parse(new Date());
			var createindexRemove = layer.load(1, {
				shade: [0.5,'#000'], //0.1透明度的黑色背景
			});
			Cooperation.removeAll(transCoids).then(function(data){
				layer.closeAll();
				var newcurrentTime = Date.parse(new Date());
				
				//返回的coids跟delItems比较,去除返回coid
				var realDelItems = _.filter(delItems,function(n){
					return data.indexOf(n.coid) == -1;
				});
				var checkOutItems = _.filter(delItems,function(n){
					return data.indexOf(n.coid) != -1;
				})
				//当前有返回,表示有签出的协作
				if(data.length){
					layer.alert('部分协作因签出,未删除', {
						title:'提示',
						closeBtn: 0,
						move:false
					},function(){
						layer.closeAll();
					});
				}
				
				deleteDetail(realDelItems);
				if(!data.length){
					layer.msg("删除成功");
				}
				if(data.length){
					delItems = checkOutItems;
				} else {
					delItems = [];
				}
				var getCooperation = function() {
					$scope.scrollend = false;
		        	queryData.modifyTime = '';
		        	queryData.modifyTimeCount = 0;

			    	$scope.coNoResult = false;
					$scope.deptNoCo = false;
					$scope.projNoCo = false;
					$scope.searchNoCo = false;
					$scope.noRelatedNoCo = false;
					Cooperation.getCollaborationList(queryData).then(function (data) {
						//初始化scrollend值
						$scope.coItemsTotals = data.count;
						$scope.cooperationList = data.list;
						$scope.coItemsTotals = data.count;
						if($scope.cooperationList.length <= 0){
							$scope.coNoResult = true;
							$scope.searchNoCo = true;
						}
						angular.forEach(checkOutItems,function(value,key){
							if(data.list.indexOf(value) != -1){
								$('tr[coid="'+val.coid+'"]').find('td:first input').prop('checked',true);//勾选签出的元素
							}
						})
						$scope.allSelected = false;
						delItems=[];
					});
			    }
				getCooperation();
				
			},function(error){
				layer.alert(error.message, {
					title:'提示',
					closeBtn: 0,
					move:false
				});
			});
		});
		
	}
	//批量删除全选按钮
	$scope.allSelect = function (){
		if($scope.allSelected){
			delItems = [];
			//1.当前界面上所有的协作状态选中2.遍历当前协同列表，组合delItems
			$('.remove-signal').prop('checked',true);
			angular.forEach($scope.cooperationList,function(value,key){
				delItems.push(value);
			})
		} else {
			//1.选中状态清空2.delItems []
			$('.remove-signal').prop('checked',false);
			delItems = [];
		}
	}
}]);

$(window).resize(function () {        //当浏览器大小变化时
	var headerHeight = $("header").height();
	var allHeight = document.documentElement.clientHeight;
	// 设置左侧sidebar的高度
	$(".sidebar").css("height", allHeight-headerHeight-2);
	$("#content-b1").css("height", allHeight-headerHeight-2);
	$("#content-a3").css("height", allHeight-headerHeight-2);
	// 设置统计页面四个饼图外层的div高度
	// setTimeout(function(){
		$('.first-screen .content-container').height($(window).height()-$('.comboBox').height()-157);
		// $('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
	// });
	$(".data_list").css("height", allHeight-headerHeight-$(".data_Totle").height()-2);
	$(".data_count").css("height", allHeight-headerHeight-$(".data_Totle").height()-2);
	
	// $('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
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
