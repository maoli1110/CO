
/**
 * newcooperlink
 */
angular.module('cooperation').controller('linkprojectCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	function ($scope, $http, $uibModalInstance,Cooperation) {
		$scope.openSignal = true;
	 	$scope.projtype = "0";
		$scope.functionOption = "0";
		var nodelist=[];//树dataArray
		var tjnodestore=[];
		var gjnodestore=[];
		var aznodestore=[];
		var revitnodestore=[];
		var teklanodestore=[];
		var pdfppidstore=[];
		var projTypeSearchPpid=[];//工程类型搜索出来的ppid
		var TextSearchPpid=[];//文本搜索出来的ppid
		var functionSearchPpid=[];//功能搜索出来的ppid
		var initPpid=[];//初始化没有任何条件的ppid
		var searchPpid=[];//最终合并ppid
		var maxlevel=0;//最大层级
		var dataList = {};
		var ppid,projType,treeObj,floor,compClass,subClass,spec;
		var selectedProject =  {};
		var selectedNodes;
		var setting = {
			view:{
				selectedMulti: false
			},
			callback:{
				onClick: zTreeOnClick
			}
         };
		$scope.projectTree = [];
		$scope.openSignal = true;
		//获取工程树
		Cooperation.getProjectTree().then(function (data) {
			console.log(data);
			$scope.projectTree = data;
			treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
			nodelist = treeObj.transformToArray(treeObj.getNodes());
			for(var i = 0 ; i<nodelist.length;i++){
				if(nodelist[i].type==3){
					categoryprojtype(nodelist[i]);
				}
			}
		});


		//工程分类处理
		function categoryprojtype(node){
			//debugger;
			if(maxlevel<node.level){//获取最大层级
				maxlevel = node.level;
			}
			
			var str0 = node.value.split("-")[0];
			var str1 = node.value.split("-")[1];
			var str2 = node.value.split("-")[2];
			initPpid.push(str2);
			projTypeSearchPpid.push(str2);
		    TextSearchPpid.push(str2);
			functionSearchPpid.push(str2);
			if(str1=='2'){
				pdfppidstore.push(str2);
			}else if(str0=="1"){
				tjnodestore.push(str2);
			}else if(str0=="2"){
				gjnodestore.push(str2);
			}else if(str0=="3"){
				aznodestore.push(str2);
			}else if(str0=="4"){
				revitnodestore.push(str2);
			}else if(str0=="5"){
				teklanodestore.push(str2);
			}
		}


		function zTreeOnClick (event, treeId, treeNode) {
			//点击工程
			dataList.linkProjectSelected = treeNode;
			dataList.assembleLps = treeNode;
			ppid = dataList.assembleLps.value.split('-')[2];
			projType = dataList.assembleLps.value.split('-')[0];
			console.log('treeNode',treeNode);
			if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
				$('.confirm').attr('disabled', true);
			} else {
				$('.confirm').attr('disabled', false);
			}
			treeObj = $.fn.zTree.getZTreeObj("tree");
			var sNodes = treeObj.getSelectedNodes();
			if (sNodes.length > 0) {
				var node = sNodes[0].getParentNode();
			}
			dataList.parentNode = node;
	 	}
	 	
	 	$scope.ok = function () {
	 		//debugger;
	 		switch (projType) {
	 			case "1":
	 			projType = '土建预算';
	 			break;
	 			case "2":
	 			projType = '钢筋预算';
	 			break;
	 			case "3":
	 			projType = '安装预算';
	 			break;
	 			case "4":
	 			projType = 'Revit';
	 			break;
	 			case "5":
	 			projType = 'Tekla';
	 			break;
	 		}
	 		dataList.assembleLps =[{ppid:ppid, projType:projType}];
	 		$uibModalInstance.close(dataList);
	 	}

	 	//点击确定按钮获取构件类别表单
	 	$scope.ok3 = function () {
	 		//点击确定按钮切换显示获取的构件类别openSignal
	 		$scope.openSignal = false;
	 		$scope.projectTree = [];
	 		var obj = {ppid:ppid, projType:projType};
	 		var params = JSON.stringify(obj);
	 		var setting1 = {  
				view:{
					selectedMulti: false
				},
				check: {
					enable: true
				},
				callback:{
					onCheck: onCheck
				}
	         };
	         dataList.assembleLps =obj;
			//获取构件类别树
			Cooperation.getFloorCompClassList(params).then(function (data) {
				$scope.projectTree = data;
				var treeObj = $.fn.zTree.init($("#tree1"), setting1, $scope.projectTree);
				//全部打开
				treeObj.expandAll(true);
			});
			
			function onCheck (event, treeId, treeNode) {
				var treeObj = $.fn.zTree.getZTreeObj("tree1");
				selectedNodes = treeObj.getCheckedNodes(true);
		 	}
	 	}

	 	$scope.ok4 = function () {
	 		//传递参数
	 		var  unit;
	 		var a = {}
	 		switch (projType) {
	 			case "1" :
	 			projType = '土建预算';
	 			break;
	 			case "2":
	 			projType = '钢筋预算';
	 			break;
	 			case "3":
	 			projType = '安装预算';
	 			break;
	 			case "4":
	 			projType = 'Revit';
	 			break;
	 			case "5":
	 			projType = 'Tekla';
	 			break;
	 		}
	 		angular.forEach(selectedNodes, function(value, key) {
	 			if(value.type === 0) {
	 				floor = value.value;
	 			} else if (value.type === 1) {
	 				spec = value.value;
	 			} else if (value.type === 2) {
	 				compClass = value.value;
	 			} else if (value.type === 3) {
	 				subClass = value.value;
	 			}
	 			unit = _.filter(selectedNodes,function (o) {
	 				return o.type === 3;
	 			});
	 			console.log(unit);
	 		});
	 		dataList.selectedCategory = [];
	 		angular.forEach(unit, function (value, key) {
	 				a.ppid = ppid;
	 				a.projType= projType;
	 				a.floor= floor ? floor : '';
	 				a.compClass= compClass ? compClass : '';
	 				a.spec = spec ? spec : '';
	 				a.subClass= value.value ? value.value : '';
	 				//a.name = value.name;
	 				dataList.selectedCategory.push(a);
	 			})
	 		dataList.assembleLps = dataList.selectedCategory;
	 		//console.log(selectedCategory);
	 		$uibModalInstance.close(dataList);
	 	}

	 	function projTypeSwitch (n) {
	 		switch(n)
			 	{
			 	case 0:
			 		return null;
				case 1:
				  	return tjnodestore;
				  	break;
				case 2:
				  	return gjnodestore;
				  	break;
				case 3:
				  	return aznodestore;
				  	break;
				case 4:
				  	return revitnodestore;
				  	break;
				case 5:
				  	return teklanodestore;
				  	break;
				case 6:
				  	return pdfppidstore;
				  	break;
				}
	 	}
	 	
	 	//可以查询
	 	var searchFlag;
	 	var pollingFlag = true;
	 	var checkSearchInterval;
	 	
	 	$scope.delayTreeSearch = function (type){
	 		setSearchFlagFalse();
	 		if(pollingFlag){
	 			pollingFlag = false;
	 			checkSearchInterval = setInterval(function() {checkCanSearch(type)},250);
	 		}
	 		setTimeout(function() {setSearchFlagTrue()},500);
	 	};
	 	
	 	var setSearchFlagFalse = function(){
	 		searchFlag = false;
	 	}
		var setSearchFlagTrue = function(){
			searchFlag = true;
	 	}
	 	
		var checkCanSearch = function(type){
			if(searchFlag){
				clearInterval(checkSearchInterval);
				$scope.treeSearch(type);
				pollingFlag = true;
			}
		}
	 	
	 	$scope.treeSearch = function (type) {
	 		console.log(new Date());
			treeObj.showNodes(nodelist);
			//根据专业查询对应子节点
			//debugger;
			if(type==1){
				if($scope.projtype==0){
					projTypeSearchPpid	= initPpid;
				}else{
					projTypeSearchPpid = projTypeSwitch(parseInt($scope.projtype));	
				}
			}
			//根据功能进行同步请求查询对应子节点
			if(type==2){
				if($scope.functionOption==0){
					functionSearchPpid = initPpid;
				}else{
					var projTypeTextPpid = _.intersection(projTypeSearchPpid,TextSearchPpid);
					functionSearchPpid =[];
					functionFilter(projTypeTextPpid);
				}
				
			}
			//根据条件查询对应子节点
			if(type==3){
				if($scope.formText==""||$scope.formText==null||$scope.formText=="underfined"){
					TextSearchPpid = initPpid;
				}else{
					TextSearchPpid = searchByText();
				}
			}
			searchPpid =  _.intersection(projTypeSearchPpid,functionSearchPpid,TextSearchPpid);
			var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
			var hidenodes = treeObj.getNodesByFilter(filterhidechild);
			treeObj.hideNodes(hidenodes);
			treeObj.showNodes(showchildnodes);
			hideparentnode();
		}

	 	function filterchild(node) {
			var searchname = $scope.formText;
			return (node.type == 3 && node.name.indexOf(searchname)>-1);
		}

		function searchByText(){
			 var shownodes = treeObj.getNodesByFilter(filterchild);
			 var TextSearchPpid=[];
			 for(var i=0;i<shownodes.length;i++){
			 	var str2 = shownodes[i].value.split("-")[2];
			 	TextSearchPpid.push(str2);
			 }
			 return TextSearchPpid;
		}

		function filterhidechild(node) {
			return (node.type == 3);
		}

		function filterbyppid(node) {
		    return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
		}

		//全部功能筛选树结构
		var functionFilter = function (projTypeTextPpid) {
			var ppids = [];
			var data = {};
			var infoType = parseInt('1200'+ $scope.functionOption);
			data.infoType = infoType;
			data.ppids = projTypeTextPpid;
			data = JSON.stringify(data);
			$.ajax({
				contentType: "application/json; charset=utf-8",
				dataType : 'json',
				type: "post",
				data:data,
				url: 'http://172.16.21.69:8080/bimco/rs/co/getProjTipInfo',
			    async : false,
			    success: function (data) {
			    	for(var i=0;i<data.length;i++){
			    		var ppid = data[i]+"";
			    		functionSearchPpid.push(ppid);
			    	}
			    },
			    error: function () {
			    }
			});
		}
		//隐藏空父节点
		var selectlevel;
		function hideparentnode(){
			for(var i=maxlevel-1;i>0;i--){
				selectlevel = i;
				var parentnodes = treeObj.getNodesByFilter(filterbylevel);
				var needhidenods = [];
				for(var j=0;j<parentnodes.length;j++){
					var childnodes = parentnodes[j].children;
					var ishide = true;
					if(childnodes!=null){
						for(var n=0;n<childnodes.length;n++){
							if(childnodes[n].isHidden){
								continue;
							}else{
								ishide=false;
							}
						}
					}else{
						ishide = true;
					}
					if(ishide){
						needhidenods.push(parentnodes[j]);
					}
				}
				treeObj.hideNodes(needhidenods);
			}
		}

		function filterbylevel(node) {
		    return (node.level==selectlevel&&node.type!=3);
		}

	 	$scope.cancel = function () {
	 		$uibModalInstance.dismiss('cancel');
	 	}

}]).controller('linkcomponentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	 function ($scope, $http, $uibModalInstance,Cooperation) {
	 	var refreshID;
	 	$scope.projtype = "0";
		$scope.functionOption = "0";
		var nodelist=[];//树dataArray
		var tjnodestore=[];
		var gjnodestore=[];
		var aznodestore=[];
		var revitnodestore=[];
		var teklanodestore=[];
		var pdfppidstore=[];
		var projTypeSearchPpid=[];//工程类型搜索出来的ppid
		var TextSearchPpid=[];//文本搜索出来的ppid
		var functionSearchPpid=[];//功能搜索出来的ppid
		var initPpid=[];//初始化没有任何条件的ppid
		var searchPpid=[];//最终合并ppid
		var maxlevel=0;//最大层级
		var dataList = {};
		var ppid,projType,treeObj;
		var setting = {  
			view:{
				selectedMulti: false
			},
			callback:{
				onClick: zTreeOnClick
			}
         };
		$scope.projectTree = [];
		//获取工程树
		Cooperation.getProjectTree().then(function (data) {
			console.log(data);
			$scope.projectTree = data;
			treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
			nodelist = treeObj.transformToArray(treeObj.getNodes());
			for(var i = 0 ; i<nodelist.length;i++){
				if(nodelist[i].type==3){
					categoryprojtype(nodelist[i]);
				}
			}
		});


		//工程分类处理
		function categoryprojtype(node){
			//debugger;
			if(maxlevel<node.level){//获取最大层级
				maxlevel = node.level;
			}
			
			var str0 = node.value.split("-")[0];
			var str1 = node.value.split("-")[1];
			var str2 = node.value.split("-")[2];
			initPpid.push(str2);
			projTypeSearchPpid.push(str2);
		    TextSearchPpid.push(str2);
			functionSearchPpid.push(str2);
			if(str1=='2'){
				pdfppidstore.push(str2);
			}else if(str0=="1"){
				tjnodestore.push(str2);
			}else if(str0=="2"){
				gjnodestore.push(str2);
			}else if(str0=="3"){
				aznodestore.push(str2);
			}else if(str0=="4"){
				revitnodestore.push(str2);
			}else if(str0=="5"){
				teklanodestore.push(str2);
			}
		}
		function zTreeOnClick (event, treeId, treeNode) {
			//点击工程
			dataList.linkProjectSelected = treeNode;
			dataList.assembleLps = treeNode;
			ppid = dataList.assembleLps.value.split('-')[2];
			projType = dataList.assembleLps.value.split('-')[0];
			console.log('treeNode',treeNode);
			if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
				$('.confirm').attr('disabled', true);
			} else {
				$('.confirm').attr('disabled', false);
			}
			treeObj = $.fn.zTree.getZTreeObj("tree");
			var sNodes = treeObj.getSelectedNodes();
			if (sNodes.length > 0) {
				var node = sNodes[0].getParentNode();
			}
			dataList.parentNode = node;
	 	}
	 	
	 	function projTypeSwitch (n) {
	 		switch(n)
			 	{
			 	case 0:
			 		return null;
				case 1:
				  	return tjnodestore;
				  	break;
				case 2:
				  	return gjnodestore;
				  	break;
				case 3:
				  	return aznodestore;
				  	break;
				case 4:
				  	return revitnodestore;
				  	break;
				case 5:
				  	return teklanodestore;
				  	break;
				case 6:
				  	return pdfppidstore;
				  	break;
				}
	 	}
	 	
	 	function filterchild(node) {
			var searchname = $scope.formText;
			return (node.type == 3 && node.name.indexOf(searchname)>-1);
		}

		function searchByText(){
			 var shownodes = treeObj.getNodesByFilter(filterchild);
			 var TextSearchPpid=[];
			 for(var i=0;i<shownodes.length;i++){
			 	var str2 = shownodes[i].value.split("-")[2];
			 	TextSearchPpid.push(str2);
			 }
			 return TextSearchPpid;
		}

		//可以查询
	 	var searchFlag;
	 	var pollingFlag = true;
	 	var checkSearchInterval;
	 	
	 	$scope.delayTreeSearch = function (type){
	 		setSearchFlagFalse();
	 		if(pollingFlag){
	 			pollingFlag = false;
	 			checkSearchInterval = setInterval(function() {checkCanSearch(type)},250);
	 		}
	 		setTimeout(function() {setSearchFlagTrue()},500);
	 	};
	 	
	 	var setSearchFlagFalse = function(){
	 		searchFlag = false;
	 	}
		var setSearchFlagTrue = function(){
			searchFlag = true;
	 	}
	 	
		var checkCanSearch = function(type){
			if(searchFlag){
				clearInterval(checkSearchInterval);
				$scope.treeSearch(type);
				pollingFlag = true;
			}
		}
		
		$scope.treeSearch = function (type) {
			treeObj.showNodes(nodelist);
			//根据专业查询对应子节点
			//debugger;
			if(type==1){
				if($scope.projtype==0){
					projTypeSearchPpid	= initPpid;
				}else{
					projTypeSearchPpid = projTypeSwitch(parseInt($scope.projtype));	
				}
			}
			//根据功能进行同步请求查询对应子节点
			if(type==2){
				if($scope.functionOption==0){
					functionSearchPpid = initPpid;
				}else{
					var projTypeTextPpid = _.intersection(projTypeSearchPpid,TextSearchPpid);
					functionSearchPpid =[];
					functionFilter(projTypeTextPpid);
				}
				
			}
			//根据条件查询对应子节点
			if(type==3){
				if($scope.formText==""||$scope.formText==null||$scope.formText=="underfined"){
					TextSearchPpid = initPpid;
				}else{
					TextSearchPpid = searchByText();
				}
			}
			searchPpid =  _.intersection(projTypeSearchPpid,functionSearchPpid,TextSearchPpid);
			var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
			var hidenodes = treeObj.getNodesByFilter(filterhidechild);
			treeObj.hideNodes(hidenodes);
			treeObj.showNodes(showchildnodes);
			hideparentnode();
		}

		function filterhidechild(node) {
			return (node.type == 3);
		}

		function filterbyppid(node) {
		    return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
		}

		//全部功能筛选树结构
		var functionFilter = function (projTypeTextPpid) {
			var ppids = [];
			var data = {};
			var infoType = parseInt('1200'+ $scope.functionOption);
			data.infoType = infoType;
			data.ppids = projTypeTextPpid;
			data = JSON.stringify(data);
			// Cooperation.getProjTipInfo(data).then(function (data) {
			// 	console.log(data);
			// 	return data
			// });

			$.ajax({
				contentType: "application/json; charset=utf-8",
				dataType : 'json',
				type: "post",
				data:data,
				url: 'http://172.16.21.69:8080/bimco/rs/co/getProjTipInfo',
			    async : false,
			    success: function (data) {
			    	for(var i=0;i<data.length;i++){
			    		var ppid = data[i]+"";
			    		functionSearchPpid.push(ppid);
			    	}
			    },
			    error: function () {
			    }
			});
		}

		var selectlevel;
		function hideparentnode(){
			for(var i=maxlevel-1;i>0;i--){
				selectlevel = i;
				var parentnodes = treeObj.getNodesByFilter(filterbylevel);
				var needhidenods = [];
				for(var j=0;j<parentnodes.length;j++){
					var childnodes = parentnodes[j].children;
					var ishide = true;
					if(childnodes!=null){
						for(var n=0;n<childnodes.length;n++){
							if(childnodes[n].isHidden){
								continue;
							}else{
								ishide=false;
							}
						}
					}else{
						ishide = true;
					}
					if(ishide){
						needhidenods.push(parentnodes[j]);
					}
				}
				treeObj.hideNodes(needhidenods);
			}
		}

		function filterbylevel(node) {
		    return (node.level==selectlevel&&node.type!=3);
		}

	 	$scope.ok = function () {
	 		//console.log('dataList',dataList);
	 		//debugger;
	 		// switch (projType) {
	 		// 	case "1":
	 		// 	projType = '土建预算';
	 		// 	break;
	 		// 	case "2":
	 		// 	projType = '钢筋预算';
	 		// 	break;
	 		// 	case "3":
	 		// 	projType = '安装预算';
	 		// 	break;
	 		// 	case "4":
	 		// 	projType = 'Revit';
	 		// 	break;
	 		// 	case "5":
	 		// 	projType = 'Tekla';
	 		// 	break;
	 		// }
	 		dataList.assembleLps =[{ppid:ppid, projType:projType}];
	 		//通知pc端执行选择构件的方法
	 		BimCo.SelectComponent(ppid);
	 		//1.轮询2.获取状态
	 		// 001 - 完成
	 		// 002 - 取消选择
	 		setRefreshInterval();

	 		function refreshState() {

	 			var reCode = BimCo.GetSelectComponentStatus(ppid);

	 			switch (reCode) {
	 				case '001':
	 				//将当前选择的工程显示到页面
	 				$uibModalInstance.close(dataList);
	 				clearRefreshInterval();
	 				break;
	 				case '002':
	 				//用户什么操作都没做，结束轮询
	 				clearRefreshInterval();
	 				break;
	 			}
	 		}
	 		
	 		// 设置间隔获取状态
	        function setRefreshInterval() {
	            //if (refreshID) return false;
	            refreshID = setInterval(refreshState, 1000);
	            console.log('我是轮询');
	        }

	        // 清除间隔获取状态
	        function clearRefreshInterval() {
	            clearInterval(refreshID);
	        }

	 	}

	 	$scope.cancel = function () {
	 		//if已经选择了构件，通知pc端
	 		$uibModalInstance.dismiss('cancel');
	 	}

}]).controller('linkbeCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items',
	 function ($scope, $http, $uibModalInstance,Cooperation,items) {
	 	$scope.selectedOption = {};
	 	$scope.projectOption = {};
		$scope.currentPage = 1; //默认第一页
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.projectList = {
			availableOptions:[]
		};
		var deptId, ppid;
		var setting = {  
			view:{
				selectedMulti: false
			},
			check: {
				enable: true
			},
			callback:{
				onCheck: onCheck
			}
         };
	     var treeObj,nodes,params;
	     var selectedItem = [];
	     //组合查询条件
	     var queryData = {
	     	ppid: '',
	     	tagids:[],
	     	searchText:'',
	     	pageInfo:{}
	     };

        //获取项目部
		Cooperation.getDeptList().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
			//默认工程列表
			deptId = $scope.selectedOption.deptId;
			Cooperation.projectList(deptId).then(function (data) {
					$scope.projectList.availableOptions = data;
					$scope.projectOption = $scope.projectList.availableOptions[0];
					ppid = $scope.projectOption.ppid;
					//获取BE资料树
					getDocTagList(ppid);
			});
		});

        //根据条件获取资料列表
        var getDocList = function () {
			//组合搜索条件
			queryData.ppid = $scope.projectOption.ppid;
			queryData.tagids = selectedItem;
			queryData.searchText = $scope.searchname;
			queryData.pageInfo = {
				currentPage:$scope.currentPage?$scope.currentPage:1,
				pageSize:10
			};
			Cooperation.getDocList(queryData).then(function (data) {
				$scope.docList = data.result;
				$scope.totalItems = data.pageInfo.totalNumber;
			});
	 	}

	 	//分页显示
	 	$scope.pageChanged = function () {
	 		getDocList();
	 	}

        function onCheck (event, treeId, treeNode) {
			treeObj = $.fn.zTree.getZTreeObj("tree");
			//选中节点(check)
			nodes = treeObj.getCheckedNodes(true);
			//type=2的节点
			var unit = _.filter(nodes, function(o){
				return o.type === 2
			});
			console.log(unit)
			var tempselectedItem = [];
			angular.forEach(unit, function(value,key) {
				//左侧树选中的节点
				tempselectedItem.push(value.value);
			});
			selectedItem = tempselectedItem;
			if(selectedItem.length){
				getDocList();
			} else {
				$scope.$apply(function() {
					$scope.docList = [];
				});
			}
			
	 	}
	 	//选中需要上传的资料
	 	var a = _.cloneDeep(items);
	 	//var docSelected = [];
	 	var docSelected = a?a:[];
        var updateSelected = function(action,id,name){
        	var findIndex = _.findIndex(docSelected,id);
            if(action == 'add' && findIndex == -1){
               docSelected.push(id);
           	}
            if(action == 'remove' && findIndex!=-1){
                var idx = docSelected.indexOf(id);
                docSelected.splice(findIndex,1);
            }
         }
 
        $scope.updateSelection = function($event, id){
        	//debugger;
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
            console.log(docSelected);
        }
 
        $scope.isSelected = function(id){
        	console.log('id', _.findIndex(docSelected,id))
            return _.findIndex(docSelected,id)>=0;
        }

        $scope.docSearch = function () {
        	getDocList(queryData);
        }

        $scope.ok = function () {
		    $uibModalInstance.close(docSelected);
		};

		//根据deptId取工程列表
	 	$scope.switchDept = function (params) {
	 		deptId = params.deptId;
			Cooperation.getProjectList(deptId).then(function (data) {
				$scope.projectList.availableOptions = data;
				$scope.projectOption = $scope.projectList.availableOptions[0];
				ppid = $scope.projectOption.ppid;
				getDocTagList(ppid);
			});
	 	}



	 	//选择BE资料-工程所属资料标签树
	 	var getDocTagList = function (params) {
	 		Cooperation.getDocTagList(params).then(function (data) {
	 			console.log('data',data);
	 			var treeObj = $.fn.zTree.init($("#tree"), setting, data);
				//全部打开
				treeObj.expandAll(false);
	 		});
	 	}

	 	$scope.switchPpid = function (projectOption) {
	 		ppid = projectOption.ppid;
	 		getDocTagList(ppid);

	 	}

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			 $('.check-now').click(function(){
				$(this).css('background',"#eceef0").siblings().css("background",'#fff')
			 })
		});

}]).controller('linkformCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items',
	 function ($scope, $http, $uibModalInstance,Cooperation,items) {
	 	console.log(items);
	 	//默认模版类型
	 	$scope.selectedTypeId = items.typeid;
	 	Cooperation.getTemplateNode(items.typeid).then(function (data) {
	 		$scope.templateNode = data;
	 	});
	 	Cooperation.getTypeList().then(function (data) {
	 		$scope.typeList = data;
	 	});

	 	$scope.switchType = function (selectedTypeId) {
	 		Cooperation.getTemplateNode(selectedTypeId).then(function (data) {
	 		$scope.templateNode = data;
	 	});
	 	}

	 	//选中表单中需要上传的资料
	 	var a = _.cloneDeep(items.formSelectedList);
	 	var formSelected = a?a:[];
        var updateSelected = function(action,id,name){
        	var findIndex = _.findIndex(formSelected,id);
            if(action == 'add' && findIndex == -1){
               formSelected.push(id);
           	}
             if(action == 'remove' && findIndex!=-1){
                formSelected.splice(findIndex,1);
             }
         }
 
        $scope.updateSelection = function($event, id){
        	//debugger;
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
            console.log(formSelected);
        }
 
        $scope.isSelected = function(id){
        	console.log('_.findIndex(formSelected,id)',_.findIndex(formSelected,id));
            return _.findIndex(formSelected,id)>=0;
        }

        $scope.ok = function () {
        	$uibModalInstance.close(formSelected);
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}
		$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
			$(".tab-tr").on("click",function(){
				$(this).css('background',"#eceef0").siblings().css("background",'#fff')
			})
		})
}]);