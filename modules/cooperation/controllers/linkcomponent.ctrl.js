/**
 * linkcomponentCtrl
 */
var level = 1;	// 图上构建树状态树展开、折叠深度
var maxLevel = -1;	
angular.module('cooperation').controller('linkcomponentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
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
		var ppid,projType,treeObj,productId;
		var setting = {  
			view:{
				selectedMulti: false
			},
			callback:{
				onClick: zTreeOnClick,
				onCollapse: function (event, treeId, treeNode) {
				    level=treeNode.level
				},
				onExpand: function (event, treeId, treeNode) {
				    level=treeNode.level
				}
			}
         };
		$scope.projectTree = [];
		$scope.flagok = true;//弹出框禁用标识
		//获取工程树
		Cooperation.getProjectTree().then(function (data) {
//			console.log(data);
			findAllChilds(data);
			$scope.projectTree = data;
			treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
			nodelist = treeObj.transformToArray(treeObj.getNodes());
			for(var i = 0 ; i<nodelist.length;i++){
				if(nodelist[i].level >= maxLevel){	// 设置当前打开的层数
					maxLevel = nodelist[i].level;
				}
				if(nodelist[i].type==3){
					categoryprojtype(nodelist[i]);
				}
			}
			level = maxLevel;
		});
		
		function findAllChilds (data)
		{
	        //递归遍历子节点
			for(var x = 0; x < data.length; x++) {
				if (data[x].type == 1) {	// 组织
					data[x].iconSkin = "org";
				} else if(data[x].type == 2) {	// 项目部
					data[x].iconSkin = "dept";
				} else if(data[x].type == 3 && data[x].value.indexOf("1-3-") == 0 ) {					// 土建预算
					data[x].iconSkin = "tj";		// imgs/icon/1.png
				} else if(data[x].type == 3 && data[x].value.indexOf("2-3-") == 0 ) {					// 钢筋预算
					data[x].iconSkin = "gj";		//imgs/icon/2.png
				} else if(data[x].type == 3 && data[x].value.indexOf("3-3-") == 0 ) {					// 安装预算
					data[x].iconSkin = "az";//"imgs/icon/3.png";
				} else if(data[x].type == 3 && data[x].value.indexOf("4-3-") == 0 ) {					// Revit
					data[x].iconSkin = "revit";//"imgs/icon/4.png";
				} else if(data[x].type == 3 && data[x].value.indexOf("5-3-") == 0 ) {					// Tekla
					data[x].iconSkin = "tekla"; //"imgs/icon/5.png";
				}//   TODO  PDF图标  目前还没遇到pdf工程 不清楚value的规律
				if (data[x].children != null && data[x].children.length>0)
				{
					findAllChilds(data[x].children);
				}
			}
		}


		//工程分类处理
		function categoryprojtype(node){
			//debugger;
			if(maxlevel<node.level){//获取最大层级
				maxlevel = node.level;
			}
			
			var str0 = node.value.split("-")[0];
			var str1 = node.value.split("-")[1];
			var str2 = node.value.split("-")[3];
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
			ppid = dataList.assembleLps.value.split('-')[3];
			projType = dataList.assembleLps.value.split('-')[0];
			productId = dataList.assembleLps.value.split('-')[2];
			console.log('treeNode',treeNode);
			if(treeNode.isParent == true) {
				// $('.confirm').attr('disabled', true);
				$scope.flagok = true;
				$scope.$apply();
			} else {
				// $('.confirm').attr('disabled', false);
				$scope.flagok = false;
				$scope.$apply();
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
			 	var str2 = shownodes[i].value.split("-")[3];
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

		function filterhidechild(node) {
			return (node.type == 3);
		}

		function filterbyppid(node) {
		    return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[3])>-1);
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
				url: basePath + 'rs/co/getProjTipInfo',
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
	 		dataList.productId = productId;
	 		// alert(dataList.productId);
	 		//通知pc端执行选择构件的方法(ppid coid productId)
	 		var SelectComponentSignal =  BimCo.SelectComponent(ppid,'',productId);
	 		//客户端选择构件失败则关闭摸态框，不做任何操作
	 		if(!SelectComponentSignal) {
				$uibModalInstance.dismiss('cancel');
				return;
	 		}
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
	 	
	 // 展开树节点
	 	$scope.expand = function () {
	 		var obj = {type:"expand",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 		$('#content-a12')[0].scrollTop=0;
	 	}
	 	
	 	// 收起树节点
	 	$scope.collapse = function () {
	 		var obj = {type:"collapse",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 		$('#content-a12')[0].scrollTop=0;
	 	}
	 	
}]);