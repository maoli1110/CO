'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('newcoopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Common',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Common) {
    //优先级默认值 
    $scope.priority = 1;
    $scope.linkOpenSignal = true;
    $scope.linkProject1 =false;
    $scope.linkComponent1 = false;
    $scope.linkCategoty1 =false;
    console.log($stateParams.typeid);
   
    //选择负责人
    $scope.selectResponsible = function () {
    	//alert('111');
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_responsible.html',
    		controller:'selectpersonCtrl',
    		resolve:{
    			items: function () {
    				return [];
    			}
    		}
    	});
    	modalInstance.result.then(function (selectedItem) {
    		$scope.responsiblePerson = selectedItem;
    	});
    }
    //选择相关人
    $scope.related = {
    	sign:[],
    	noSign:[]
    };
    var contracts = [];
    $scope.selectRelated = function () {
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_related.html',
    		controller:'selectpersonCtrl',
    		resolve:{
    			items: function () {
    				return $scope.related;
    			}
    		}
    	});
    	modalInstance.result.then(function (selectedItem) {
    		$scope.related.noSign = selectedItem.noSign;
    		$scope.related.sign = selectedItem.sign;
    		angular.forEach(selectedItem.noSign, function (value ,key) {
    			var needSign = false;
    			var a = {}
    			a.needSign = needSign;
    			a.username = value.username;
    			contracts.push(a);
    		});
    		angular.forEach(selectedItem.sign, function (value ,key) {
    			var needSign = true;
    			var a = {}
    			a.needSign = needSign;
    			a.username = value.username;
    			contracts.push(a);
    		});
    	});
    }
    //获取标识
    Cooperation.getMarkerList().then(function (data) {
    	$scope.markerList = data;
    	console.log($scope.markerList);
    	$scope.mark = $scope.markerList[0];
    });

    $scope.switchMark = function() {
    	console.log($scope.mark);
    }
    //与工程关联
    $scope.bindType = 0;
    var deptId;
    $scope.linkProject = function () {
    	$scope.bindType = 1;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_project.html',
    		controller:'linkprojectCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		$scope.linkProjectSelected = dataList.linkProjectSelected;
    		$scope.assembleLps = dataList.assembleLps;
    		//赋值项目id
    		deptId = dataList.parentNode.value;
    		debugger;
    		console.log($scope.linkProjectSelected);

    		if(dataList.assembleLps.length){
    			$scope.linkOpenSignal = false;
    			$scope.linkProject1 = true;
    			$scope.linkComponent1 = false;
    			$scope.linkCategoty1 =false;
    		}
    	});
    }

    //与图上构件关联
    $scope.linkComponent = function () {
    	$scope.bindType = 2;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_component.html',
    		controller:'linkcomponentCtrl'
    	});

    }
    //与图上构件类别关联
    $scope.linkCategoty = function () {
    	$scope.bindType = 3;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_component_category.html',
    		controller:'linkcategoryCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		$scope.linkProjectSelected = dataList.selectedCategory;
    		$scope.assembleLps = dataList.assembleLps;
    		deptId = dataList.parentNode.value;
    		if(dataList.selectedCategory.length){
    			$scope.linkOpenSignal = false;
    			$scope.linkProject1 = false;
    			$scope.linkComponent1 = false;
    			$scope.linkCategoty1 =true;
    		}
    	});
    }
    //删除关联
    $scope.removeLink = function () {
    	$scope.linkOpenSignal = true;
    	$scope.linkProject1 = false;
    	$scope.linkComponent1 = false;
    	$scope.linkCategoty1 = false;
    }
    //上传照片
    var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php',
   			queueLimit: 5
        });
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    //上传资料
    var uploader1 = $scope.uploader1 = new FileUploader({
    		url: 'upload.php',
    		queueLimit:5
    });

    //FILTERS
    uploader1.filters.push({
    	name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 3;
        }
    });
    
    //点击上传照片按钮
    $scope.fileUpload = function () {
    	$('.upload-img').attr('uploader', 'uploader');
    	$('.upload-img').attr('nv-file-select', '');
    	$('.upload-img').click();
    }
    //点击上传资料按钮
    $scope.docsUpload = function () {
    	$('.upload-docs').attr('uploader', 'uploader1');
    	$('.upload-docs').attr('nv-file-select', '');
    	$('.upload-docs').click();
    }

    //设置日期相关
    $scope.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    startingDay: 1,
	};

	$scope.open2 = function() {
	    $scope.popup2.opened = true;
	};

	$scope.popup2 = {
	    opened: false
	};
	$scope.checksignal = false;

	//根据复选框来判断是否显示日期控件
	$scope.isChecked = function () {
		$scope.checksignal = !$scope.checksignal;
		if(!$scope.checksignal){
			$scope.dt = null;
		}
	}
	$scope.docSelectedList =[];
	$scope.formSelectedList = [];
	//引用BE资料
	$scope.linkBe = function () {
		$scope.sourceType = 1;
		var modalInstance = $uibModal.open({
			backdrop : 'static',
    		templateUrl: 'template/cooperation/linkbe.html',
    		controller:'linkbeCtrl'
		});

		modalInstance.result.then(function (selectedItem1) {
    		$scope.docSelectedList = selectedItem1;
    	});

	}

	//选择表单
	$scope.linkForm = function () {
		$scope.sourceType = 2;
		var modalInstance = $uibModal.open({
			backdrop : 'static',
    		templateUrl: 'template/cooperation/linkform.html',
    		controller:'linkformCtrl',
    		resolve: {
    			items: function () {
    				return $stateParams.typeid;
    			}
    		}
		});

		modalInstance.result.then(function (selectedItem2) {
    		$scope.formSelectedList = selectedItem2;
    		console.log($scope.formSelectedList);
    	});
		
	}

	//保存
	$scope.save = function () {
		if($scope.dt) {
			var dt = Common.dateFormat($scope.dt);
		} else {
			dt = '';
		}
		//拼接资料数组
		var docSelectedList1 = [];
		var formSelectedList1 = [];
		angular.forEach($scope.docSelectedList, function(value, key){
			var a = {};
			a.md5 = value.filemd5;
			a.name = value.docName;
			a.needSign = false;
			a.originalUuid = value.uuid;
			a.size = value.filesize;
			a.sourceType = $scope.sourceType;
			docSelectedList1.push(a);
		});
		angular.forEach($scope.formSelectedList, function(value, key){
			var a = {};
			a.md5 = value.md5;
			a.name = value.name;
			a.needSign = true;
			a.originalUuid = value.uuid;
			a.size = value.size;
			formSelectedList1.push(a);
		});
		console.log('1111333',docSelectedList1, formSelectedList1);
		var docsList = docSelectedList1.concat(formSelectedList1);
		//debugger;
		console.log(docsList);
		$scope.data = {
	    	binds:$scope.assembleLps,
	    	bindType: $scope.bindType,
	    	collaborator: $scope.responsiblePerson,
	    	contracts: contracts,
	    	deadline: dt,
	    	deptId: deptId,
	    	desc: $scope.desc,
	    	docs: docsList,
	    	markerid: $scope.mark.markerId,
	    	name: $scope.coopname,
	    	pictures:[{
	    		name:'test'
	    	}],
	    	ppid:0,
	    	priority: $scope.priority,
	    	typeId:$stateParams.typeid
	    };
	    console.log(JSON.stringify($scope.data));
	    return;
		var obj = JSON.stringify($scope.data);
		Cooperation.createCollaboration(obj).then(function (data) {
			console.log(data);
		});
	}

	//弹出框
	$scope.dynamicPopover = {
		templateUrl: 'template/cooperation/mypopovertemplate.html'
	}
	
       
}]).controller('selectpersonCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items',
	function ($scope, $http, $uibModalInstance,Cooperation,items) {
		//选择负责人,联系人
		//设置默认值
		$scope.selectedOption = {};
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.userList = [];

		$scope.responsiblePerson = '';

		//获取项目部
		Cooperation.getDeptInfo().then(function (data) {
			//console.log(data);
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
		});

		//默认联系人列表 deptId = 1
		Cooperation.getUserList(1).then(function (data) {
			$scope.userList = data;
		});

		//切换项目部切换联系人
		$scope.switchUsers = function (params) {
			var deptId = params.deptId;
			Cooperation.getUserList(deptId).then(function (data) {
				$scope.userList = data;
			});
		}

		//选择负责人--搜索功能
		$scope.responsibleSearch = function (e) {
			if(e.keyCode === 13 &&　$scope.queryForm) {
				var deptId = $scope.selectedOption.deptId;
				Cooperation.getUserList(deptId).then(function (data) {
					$scope.userList = data;

					angular.forEach($scope.userList, function (value, key) {
					//console.log(value);
						var unit = _.filter(value.users, function (o) {
							return o.username.indexOf($scope.queryForm) != -1;
						});
						$scope.userList[key].users = unit;
					});
					$scope.isCollapsed = true;
				});
			} else if (!$scope.queryForm) {
				var deptId = $scope.selectedOption.deptId;
				Cooperation.getUserList(deptId).then(function (data) {
					$scope.userList = data;
				});
			}
		}
		
		//负责人只能单选
		$scope.changeStaus = function (id, pid, user) {
			angular.forEach($scope.userList, function(value,key) {
					for(var i = 0; i< value.users.length;i++){
						if(key == pid && i == id){
							value.users[i].add = true;
						} else {
							value.users[i].add = false;
						}
					}
			});
			$scope.responsiblePerson = user;
		}

		//联系人可以多选
		$scope.changeStaus = function (id, pid, user) {
			angular.forEach($scope.userList, function(value,key) {
					for(var i = 0; i< value.users.length;i++){
						if(key == pid && i == id){
							value.users[i].add = true;
						} else {
							value.users[i].add = false;
						}
					}
			});
			$scope.responsiblePerson = user;
			//console.log();
		}

		//选中的相关人
		console.log(items);
		if(items.sign){
			var a = items.sign.concat(items.noSign);
			console.log('a',a);
		}
		
		$scope.relatedSelected = a;
		$scope.addRelated = function (id, pid, current) {
			$scope.relatedSelected.push(current);
			//数组去重
			var unique = _.uniqBy($scope.relatedSelected, 'username');
			$scope.relatedSelected = unique;
		}
		
		$scope.removeRelated = function (current) {
			var removeRelated = _.filter($scope.relatedSelected, function (o) {
				return o.username != current.username;
			})
			$scope.relatedSelected = removeRelated;
		}

		//选择需要签字的相关人
		var signSelected = [];
		var nosignSelected = [];
        var updateSelected = function(action,id,name){
            if(action == 'add' && signSelected.indexOf(id) == -1){
               signSelected.push(id);
           	}
             if(action == 'remove' && signSelected.indexOf(id)!=-1){
                var idx = signSelected.indexOf(id);
                signSelected.splice(idx,1);
             }
         }
 
        $scope.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
        }
 
        $scope.isSelected = function(id){
        	//console.log(signSelected.indexOf(id));
            return signSelected.indexOf(id)>=0;
        }

        //选择不需要签字的相关人
        var noSign = function () {
        	if(signSelected.length) {
        		angular.forEach(signSelected, function (value, key) {
		        		nosignSelected = _.filter($scope.relatedSelected, function (o) {
		        			return o.username != value.username
		        		});
		        });
        	} else {
        		nosignSelected = $scope.relatedSelected;
        	}
        }

        //选择相关人点击确定按钮
        var trans_selected = {
        	noSign: '',
        	sign: signSelected
        };

        //选择负责人-确定按钮
		$scope.ok = function () {
			console.log('relatedSelected', $scope.responsiblePerson);
			if($scope.responsiblePerson != '') {
				$uibModalInstance.close($scope.responsiblePerson);
			} else {
				alert('请选择负责人');
			}
			
		}
		//选择相关人-确定按钮
		$scope.ok1 = function () {
			noSign();
			trans_selected.noSign = nosignSelected;
			$uibModalInstance.close(trans_selected);
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
		
}]).controller('linkprojectCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	function ($scope, $http, $uibModalInstance,Cooperation) {
		var dataList = {};
		var ppid,projType;
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
			var treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
		});

		function zTreeOnClick (event, treeId, treeNode) {
			//点击工程
			dataList.linkProjectSelected = treeNode;
			dataList.assembleLps = treeNode;
			console.log('treeNode',treeNode);
			if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
				$('.confirm').attr('disabled', true);
			} else {
				$('.confirm').attr('disabled', false);
			}
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var sNodes = treeObj.getSelectedNodes();
			if (sNodes.length > 0) {
				var node = sNodes[0].getParentNode();
			}
			dataList.parentNode = node;
	 	}

	 	$scope.ok = function () {
	 		ppid = dataList.assembleLps.value.split('-')[1];
	 		var unit = dataList.assembleLps.value.split('-')[0];
	 		var name = dataList.assembleLps.name;
	 		//debugger;
	 		switch (unit) {
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

	 	$scope.cancel = function () {
	 		$uibModalInstance.dismiss('cancel');
	 	}

}]).controller('linkcomponentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	 function ($scope, $http, $uibModalInstance,Cooperation) {
	 	var dataList = {};
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
			var treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);
		});

		function zTreeOnClick (event, treeId, treeNode) {
			//点击工程
			console.log('treeNode',treeNode);
			if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
				$('.confirm').attr('disabled', true);
			} else {
				$('.confirm').attr('disabled', false);
			}
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var sNodes = treeObj.getSelectedNodes();
			if (sNodes.length > 0) {
				var node = sNodes[0].getParentNode();
			}
			dataList.parentNode = node;
	 	}

	 	$scope.cancel = function () {
	 		$uibModalInstance.dismiss('cancel');
	 	}

}]).controller('linkcategoryCtrl',['$scope', '$http', '$uibModal', '$uibModalInstance','Cooperation',
	 function ($scope, $http, $uibModal, $uibModalInstance, Cooperation) {
	 	$scope.openSignal = true;
	 	var dataList = [];
 		var setting = { 
			view:{
				selectedMulti: false
			},
			callback:{
				onClick: zTreeOnClick
			}
    	};
		$scope.projectTree = [];
		var selectedProject =  {};
		var ppid,projType,floor,compClass,subClass,spec;
		var selectedNodes;
		//获取工程树
		Cooperation.getProjectTree().then(function (data) {
			console.log(data);
			$scope.projectTree = data;
			var treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);

		});

		function zTreeOnClick (event, treeId, treeNode) {
			//点击工程
			console.log('treeNode',treeNode);
			selectedProject =  treeNode;
			if((treeNode.name === 'PDS内网测试') || (treeNode.name === '临时')) {
				$('.confirm').attr('disabled', true);
			} else {
				$('.confirm').attr('disabled', false);
			}
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var sNodes = treeObj.getSelectedNodes();
			if (sNodes.length > 0) {
				var node = sNodes[0].getParentNode();
			}
			dataList.parentNode = node;
	 	}
	 	//点击确定按钮获取构件类别表单
	 	$scope.ok = function () {
	 		//点击确定按钮切换显示获取的构件类别openSignal
	 		$scope.openSignal = false;
	 		$scope.projectTree = [];
	 		ppid = selectedProject.value.split('-')[1];
	 		projType = selectedProject.value.split('-')[0];
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

	 	$scope.ok1 = function () {
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
	 				a.name = value.name;
	 				dataList.selectedCategory.push(a);
	 			})
	 		dataList.assembleLps = dataList.selectedCategory;
	 		//console.log(selectedCategory);
	 		$uibModalInstance.close(dataList);
	 	}

	 	$scope.cancel = function () {
	 		$uibModalInstance.dismiss('cancel');
	 	}

}]).controller('openedProjectCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items',
	 function ($scope, $http, $uibModalInstance,Cooperation,items) {
	 	var params =  JSON.stringify(items);
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
		$scope.projectTree = [];
		var selectedProject =  {};
		var ppid,projType;
		//获取工程树
		Cooperation.getFloorCompClassList(params).then(function (data) {
			console.log(data);
			$scope.projectTree = data;
			var treeObj = $.fn.zTree.init($("#tree"), setting, $scope.projectTree);
			//全部打开
			treeObj.expandAll(true);

		});

		function onCheck (event, treeId, treeNode) {
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var nodes = treeObj.getCheckedNodes(true);
			console.log(nodes);
	 	}
	 	
		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}

}]).controller('linkbeCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation',
	 function ($scope, $http, $uibModalInstance,Cooperation) {
	 	$scope.selectedOption = {};
	 	$scope.projectOption = {};
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
        function onCheck (event, treeId, treeNode) {
			var treeObj = $.fn.zTree.getZTreeObj("tree");
			var nodes = treeObj.getCheckedNodes(true);
			console.log(nodes);
			//获取工程对应的资料列表
			var data = {};
			data.tagids=[];
			var unit = _.filter(nodes, function(o){
				return o.type === 2
			});
			console.log(unit);
			var selectedItem = [];
			angular.forEach(unit, function(value,key) {
				var selectList = [];
				selectedItem.push(value.value);
			})
			console.log(selectedItem);
			//组合条件
			var data = {};
			data.ppid = $scope.projectOption.ppid;
			data.tagids = selectedItem;
			data.searchText = '';
			data.pageInfo = {};
			//debugger;
			var params = JSON.stringify(data);
			console.log(params);
			Cooperation.getDocList(params).then(function (data) {
				console.log(data);
				$scope.docList = data.result;
			});
	 	}

	 	//选中需要上传的资料
	 	var docSelected = [];
        var updateSelected = function(action,id,name){
            if(action == 'add' && docSelected.indexOf(id) == -1){
               docSelected.push(id);
           	}
             if(action == 'remove' && docSelected.indexOf(id)!=-1){
                var idx = docSelected.indexOf(id);
                docSelected.splice(idx,1);
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
        	//console.log(docSelected.indexOf(id));
            return docSelected.indexOf(id)>=0;
        }

        $scope.ok = function () {
		    $uibModalInstance.close(docSelected);
		};

		//获取项目部
		Cooperation.getDeptInfo().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
			//默认工程列表
			deptId = $scope.selectedOption.deptId;
			Cooperation.getProjectList(deptId).then(function (data) {
					$scope.projectList.availableOptions = data;
					$scope.projectOption = $scope.projectList.availableOptions[0];
					ppid = $scope.projectOption.ppid;
					//获取BE资料树
					getDocTagList(ppid);
			});
			
		});

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
				treeObj.expandAll(true);
	 		});
	 	}

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}

}]).controller('linkformCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items',
	 function ($scope, $http, $uibModalInstance,Cooperation,items) {
	 	
	 	Cooperation.getTemplateNode(items).then(function (data) {
	 		$scope.templateNode = data;
	 	});

	 	//选中表单中需要上传的资料
	 	var docSelected = [];
        var updateSelected = function(action,id,name){
            if(action == 'add' && docSelected.indexOf(id) == -1){
               docSelected.push(id);
           	}
             if(action == 'remove' && docSelected.indexOf(id)!=-1){
                var idx = docSelected.indexOf(id);
                docSelected.splice(idx,1);
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
        	//console.log(docSelected.indexOf(id));
            return docSelected.indexOf(id)>=0;
        }

        $scope.ok = function () {
        	$uibModalInstance.close(docSelected);
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}

}]).controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$stateParams',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$stateParams) {
  		//根据ui-sref路由拿到对应的coid
	   	var coid = $stateParams.coid;
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		//console.log(data);
	   		$scope.collaList = data;
	   	});

	   	//移动端交互
	   	$scope.checkModel = function () {
	   		sendCommand(1,coid);
	   	}

	   	$scope.zoom = function (uuid) {
	   		sendCommand(6,coid,uuid);
	   	}

	   	$scope.previewDocs = function (uuid) {
	   		sendCommand(2,coid,uuid);
	   	}

	   	$scope.downDocs = function (uuid) {
	   		sendCommand(3,coid,uuid);
	   	}

	 	//     function sendCommand(optType,id){
		//     var param = "{"+ "\"optType\":"+optType+",\"id\":\""+id + "\"}";
		//     //document.location = "http://bv.local?param=" + param;
		//     var a  = "http://bv.local?param=" + param;
		//     alert(a);
		// }

		function sendCommand(optType,id,uuid){

		    var param = '{"optType":'+optType+',"coid":"'+id+'"}';
		    if(optType==2||optType==3||optType==5||optType==6){
				param = '{"optType":'+optType+',"coid":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
		    }
		    //document.location = "http://bv.local?param=" + param;
		    //var a  = "http://bv.local?param=" + param;
		    //document.location.href = a;
		    //alert(document.location.href);
		    document.location = 'http://localhost:8080/bv/?param='+param;
		}

		//详情展示页添加更新
		$scope.addUpdate = function () {
			var modalInstance = $uibModal.open({
				backdrop : 'static',
	    		templateUrl: 'template/cooperation/addupdate.html',
	    		controller:'addUpdateCtrl'
			});
		}

		//侧边栏划出效果
	  	$(".btn_box").css("right","0");
	  	$(".content_right").css("right","-260px");
	 
	  	$(".btn_box").click(function(){
		  	$(".show_btn").toggleClass("glyphicon-menu-left")
		  	//toggleClass增加一个class
			//通过判断这个class的状态来决定是开操作还是关操作
	    	$(".content_right").toggleClass("menus");
	    	if($(".content_right").hasClass("menus")){
	    		$(this).animate({right:"260px"})
	    		$(".content_right").animate({right:"0"})
	    		
	    	}else{
	    		 $(".btn_box").animate({"right":"0"});
		         $(".content_right").animate({"right":"-260px"});
	    	}

		  });
	 
}]).controller('addUpdateCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','FileUploader',
	function ($scope, $http, $uibModalInstance, Cooperation, FileUploader){
	    //详情展示页添加更新
	    $scope.data = {};
	    	
	    //上传资料
	    var uploader1 = $scope.uploader1 = new FileUploader({
	    		url: 'upload.php',
	    		queueLimit:5
	    });

	    //FILTERS
	    uploader1.filters.push({
	    	name: 'customFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	            return this.queue.length < 3;
	        }
	    });
	    
	    //点击上传资料按钮
	    $scope.docsUpload = function () {
	    	$('.upload-docs').attr('uploader', 'uploader1');
	    	$('.upload-docs').attr('nv-file-select', '');
	    	$('.upload-docs').click();
	    }

	    $scope.data.comment = '';

	    $scope.ok = function() {

	    }

    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	}

}]);