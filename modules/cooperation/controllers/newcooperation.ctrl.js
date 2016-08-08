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
    $scope.data = {};
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
    				return [];
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
    $scope.data.bindType = 0;
    var deptId;
    $scope.linkProject = function () {
    	$scope.data.bindType = 1;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_project.html',
    		controller:'linkprojectCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		//关联工程页面显示的值
    		$scope.data.linkProjectName = dataList.linkProjectSelected.name;
    		$scope.data.linkProjectDptName = dataList.parentNode.name;
    		//传给服务器的两个值
    		$scope.data.assembleLps = dataList.assembleLps;
    		$scope.data.deptId = dataList.parentNode.value;
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
    	$scope.data.bindType = 2;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_component.html',
    		controller:'linkcomponentCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		deptId = dataList.parentNode.value;
    		debugger;
    		console.log(deptId);
    		if(deptId){
    			$scope.linkOpenSignal = false;
    			$scope.linkProject1 = false;
    			$scope.linkComponent1 = true;
    			$scope.linkCategoty1 =false;
    		}
    	});

    }
    //与图上构件类别关联
    $scope.linkCategoty = function () {
    	$scope.data.bindType = 3;
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_component_category.html',
    		controller:'linkprojectCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		//关联工程页面显示的值
    		$scope.data.linkProjectName = dataList.linkProjectSelected.name;
    		$scope.data.linkProjectDptName = dataList.parentNode.name;
    		$scope.linkProjectSelected = dataList.selectedCategory;
    		//传给服务器的两个值
    		$scope.data.assembleLps = dataList.assembleLps;
    		$scope.data.deptId = dataList.parentNode.value;
    		console.log(deptId);
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
    	var mes = confirm("您已近关联工程，是否重新关联？");
    	if(mes) {
			$scope.linkOpenSignal = true;
			$scope.linkProject1 = false;
			$scope.linkComponent1 = false;
			$scope.linkCategoty1 =false;
			$scope.data = {};
			$scope.data.bindType = 0;
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
	//选择表单勾选之后需要签字的文件
	var formNeedSignList = [];
	var updateSelected = function(action,id,name){
        if(action == 'add' && formNeedSignList.indexOf(id) == -1){
           formNeedSignList.push(id);
       	}
         if(action == 'remove' && formNeedSignList.indexOf(id)!=-1){
            var idx = formNeedSignList.indexOf(id);
            formNeedSignList.splice(idx,1);
         }
     }

    $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
        angular.forEach($scope.formSelectedList, function (value, key) {
			angular.forEach(formNeedSignList, function (value1, key1) {
				if(value == value1) {
					value.needSign = true;
					$scope.formSelectedList.splice(key,1,value);
				}
			})
		});
		console.log($scope.formSelectedList);
    }
	
	//删除be资料
	$scope.removeDoc = function (items) {
		//lodash删除数组中对象
		_.pull($scope.docSelectedList,items);
	}
	//删除表单资料
	$scope.removeForm = function (items) {
		//lodash删除数组中对象
		_.pull($scope.formSelectedList,items);
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

	//弹出框
	$scope.dynamicPopover = {
		templateUrl: 'template/cooperation/mypopovertemplate.html'
	}
	//协作保存
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
			a.needSign = value.needSign;
			a.originalUuid = value.uuid;
			a.size = value.size;
			formSelectedList1.push(a);
		});
		console.log('1111333',docSelectedList1, formSelectedList1);
		var docsList = docSelectedList1.concat(formSelectedList1);
		//debugger;
		console.log(docsList);
		$scope.data = {
	    	binds:$scope.data.assembleLps?$scope.data.assembleLps:[],
	    	bindType: $scope.data.bindType,
	    	collaborator: $scope.responsiblePerson,
	    	contracts: contracts,
	    	deadline: dt,
	    	deptId: $scope.data.deptId,
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
			console.log('346',data);
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
			if($scope.queryForm) {
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
		// console.log(items);
		// if(items.sign){
		// 	var a = items.sign.concat(items.noSign);
		// 	console.log('a',a);
		// }
		
		$scope.relatedSelected = [];
		$scope.addRelated = function (id, pid, current) {
			$scope.relatedSelected.push(current);
			console.log($scope.relatedSelected);
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
 
        // $scope.isSelected = function(id){
        // 	//debugger;
        // 	console.log(signSelected.indexOf(id));
        //     return signSelected.indexOf(id)>=0;
        // }

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
        $scope.trans_selected = {
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
			$scope.trans_selected.noSign = nosignSelected;
			$uibModalInstance.close($scope.trans_selected);
		}
		//全选
		
		$scope.allSelected = function () {
			//$scope.isSelected = true;
			angular.forEach($scope.userList,function (value, key) {
				angular.forEach(value.users, function (value1,key) {
					$scope.relatedSelected.push(value1);
				})
			})
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}
		
}]);