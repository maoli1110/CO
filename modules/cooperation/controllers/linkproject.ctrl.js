/**
 * linkprojectCtrl
 */
var level = 1;	// 当前树状态树展开、折叠深度
var maxLevel = -1;	
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
//			console.log(data);
			$scope.projectTree = data;
			treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
			nodelist = treeObj.transformToArray(treeObj.getNodes());
			// 只打开一层
//			treeObj.expandNode(nodelist[0], true, false, null, true);
			// 设置当前打开的层数
			for(var i = 0 ; i<nodelist.length;i++){
				if(nodelist[i].level >= maxLevel){
					maxLevel = nodelist[i].level;
				}
				if(nodelist[i].type==3){
					categoryprojtype(nodelist[i]);
				}
			}
			level = maxLevel;
		});


		//工程分类处理
		function categoryprojtype(node){
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
				}
				// callback:{
				// 	onCheck: onCheck
				// }
	         };
	         dataList.assembleLps =obj;
			//获取构件类别树
			Cooperation.getFloorCompClassList(params).then(function (data) {
				$scope.projectTree = data;
				var treeObj = $.fn.zTree.init($("#tree1"), setting1, $scope.projectTree);
				//全部打开
				treeObj.expandAll(true);
				// 设置当前打开的层数
				var treeNodes = treeObj.transformToArray(treeObj.getNodes());
				for(var i = 0 ; i<treeNodes.length;i++){
					if(treeNodes[i].level >= maxLevel){
						maxLevel = treeNodes[i].level;
					}
				}
				level = maxLevel;
				// 只打开一层
//				treeObj.expandNode(treeNodes[0], true, false, null, true);
			});

			//选中节点的组合数组(checkbox选中状态)
			// var selectedNodes = [];
			// var selectedNodesList = [];
			// var pNodeList = [];
			// function onCheck (event, treeId, treeNode) {
			// 	var treeObj = $.fn.zTree.getZTreeObj("tree1");
			// 	selectedNodes = treeObj.getCheckedNodes(true);
			// 	// if(treeNode.checked){
			// 	// 	var signalSelected = getParentNodeList(treeNode).concat(treeNode);;
			// 	// }
		
			// 	var lastNodeList = _.filter(selectedNodes,function(value,key){
			// 		return value.type == 3;
			// 	});
			// 	angular.forEach(lastNodeList,function(value,key){
			// 		//遍历type=3的结合，递归获取父级的集合并且拼接上自己的集合
			// 		pNodeList = [];
			// 		var signalSelected = getParentNodeList(value,pNodeList).concat(value);
			// 		selectedNodesList.push(signalSelected);
			// 	});
			// 	console.log('selectedNodesList',selectedNodesList);

			// 	//递归获取父节点的集合
			//  	function getParentNodeList(treeObj){
			//  		if(treeObj==null) return;
			//  		var pNode = treeObj.getParentNode();
			//  		if(pNode!=null){
			//  			pNodeList.push(pNode);
			//  			pNode = getParentNodeList(pNode);
			//  		}
			//  		return pNodeList;
			//  	}
		 // 	}
			
		 	

	 	}

	 	$scope.ok4 = function () {
	 		//debugger
	 		//选中节点的组合数组(checkbox选中状态)
			var selectedNodes = [];
			var selectedNodesList = [];
			var pNodeList = [];
	 		var treeObj = $.fn.zTree.getZTreeObj("tree1");
	 		//当前选中的所有的节点
			selectedNodes = treeObj.getCheckedNodes(true);
			
			var lastNodeList = _.filter(selectedNodes,function(value,key){
				if(projType!=5){
					return value.type == 3;
				}
				return value.type == 2;
			});
			angular.forEach(lastNodeList,function(value,key){
				//遍历type=3的结合，递归获取父级的集合并且拼接上自己的集合
				pNodeList = [];
				var signalSelected = getParentNodeList(value,pNodeList).concat(value);
				selectedNodesList.push(signalSelected);
			});
			console.log('selectedNodesList',selectedNodesList);

			//递归获取父节点的集合
		 	function getParentNodeList(treeObj){
		 		if(treeObj==null) return;
		 		var pNode = treeObj.getParentNode();
		 		if(pNode!=null){
		 			pNodeList.push(pNode);
		 			pNode = getParentNodeList(pNode);
		 		}
		 		return pNodeList;
		 	}
	 		
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

	 		/**
			 * 土建，钢筋，revit是楼层——大类——小类
			 * 安装是楼层——专业——大类——小类
			 * tekla是楼层——大类，tekla手机没有获取到小类
			 * public static final Integer COMP_NODE_ALL = -1;//全部
			 * public static final Integer COMP_NODE_FLOOR = 0;//楼层
			 * public static final Integer COMP_NODE_PROF = 1;//专业
			 * public static final Integer COMP_NODE_CLASS = 2;//大类
			 * public static final Integer COMP_NODE_SUBCLASS = 3;//小类
			 */ 
	 		var selectedCategory = []; //组合选中数据
			angular.forEach(selectedNodesList,function(value,key1){
				var unit={};
				angular.forEach(value,function(value1,key1){
					if(value1.type === 0){
						unit.floor = value1.value;
					} else if(value1.type === 1){
						unit.spec = value1.value;
					}else if(value1.type ===2){
						unit.compClass = value1.value;
					} else if(value1.type ===3){
						unit.subClass = value1.value;
					}
				})
				unit.ppid = ppid;
				unit.projType= projType;
				selectedCategory.push(unit);
			});
	 		dataList.assembleLps = selectedCategory;
	 		console.log('dataList',dataList);
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
			//全部打开
	 		level = Cooperation.expandAll("tree");
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
//	 		console.log(new Date());
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
			
			//全部打开
	 		level = Cooperation.expandAll("tree");
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
	 	
	 	// 展开树节点
	 	$scope.expand = function () {
	 		var obj = {type:"expand",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 		/*debugger;
	 		window.scrollTo(0,document.documentElement.scrollTop); */
	 	}
	 	
	 	// 收起树节点
	 	$scope.collapse = function () {
	 		var obj = {type:"collapse",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 	}
}]);
