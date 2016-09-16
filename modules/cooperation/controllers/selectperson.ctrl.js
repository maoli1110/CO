'use strict';
/**
 * 选择负责人/联系人
 */
angular.module('cooperation').controller('selectpersonCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items',
	function ($scope, $http, $uibModalInstance,Cooperation,items) {
		//选择负责人,联系人
		//设置默认值
		var defaultDeptId = 1; 	//默认第一个项目部（值）
		$scope.selectedOption = {}; //默认中第一个项目部（页面展示对象）
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.userList = [];  //联系人列表
		$scope.responsiblePerson = ''; //当前负责人
		//查询值
		var queryData = {
			deptId:defaultDeptId,
			searchText:$scope.queryForm
		};
		//获取项目部
		Cooperation.getDeptList().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = data[0];
			defaultDeptId = data[0].deptId;
			queryData = {
				deptId:defaultDeptId,
				searchText:$scope.queryForm
			};
		});

		//默认联系人列表
		Cooperation.getUserList(queryData).then(function (data) {
			$scope.userList = data;
		});

		//切换项目部切换联系人
		$scope.switchUsers = function (params) {
			queryData = {
					deptId: params.deptId,
					searchText: $scope.queryForm
			};
			Cooperation.getUserList(queryData).then(function (data) {
				$scope.userList = data;
			});
			$scope.isCollapsed = true;
		}

		//选择负责人--搜索功能
		$scope.responsibleSearch = function () {
			if($scope.queryForm) {
				queryData = {
					deptId:$scope.selectedOption.deptId,
					searchText:$scope.queryForm
				};
				Cooperation.getUserList(queryData).then(function (data) {
					$scope.userList = data;
					$scope.isCollapsed = true;
				});
			} else if (!$scope.queryForm) {
				queryData = {
					deptId:$scope.selectedOption.deptId,
					searchText:$scope.queryForm
				};
				Cooperation.getUserList(queryData).then(function (data) {
					$scope.userList = data;
				});
				$scope.isCollapsed = false;
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

		//选中的相关人
		var temp = _.cloneDeep(items);
		if(temp.sign){
			var a = temp.sign.concat(temp.noSign);
		}
		$scope.relatedSelected = a ? a : [];

		$scope.addRelated = function (current) {
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
			var idx = signSelected.indexOf(current);
			if(idx != -1) {
				signSelected.splice(idx,1);
			}
		}

		//选择需要签字的相关人
		var signSelected = temp.sign ? temp.sign : [];
		var nosignSelected = temp.noSign ? temp.noSign :[];
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
            return signSelected.indexOf(id)>=0;
        }

        //选择不需要签字的相关人
        var noSign = function () {
        	if(signSelected.length) {
        		nosignSelected = [];
		        nosignSelected =  _.difference($scope.relatedSelected, signSelected);
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
			var edit = document.getElementById("edit-all")
			if(edit.checked){
				$(".allChoice").show();
			}else{
				$(".allChoice").hide();
			}
			angular.forEach($scope.userList,function (value, key) {
				angular.forEach(value.users, function (value1,key) {
					$scope.relatedSelected.push(value1);
				})
			})
		}
		//$scope.del = function(){
		//	$(".remove-all").toggleClass("del");
		//	if($(".del")){
		//		$(".error-del").css("background",'url(imgs/icon/error-del.png) no-repeat 0 -18px')
		//	}else{
		//		$(".error-del").css("background",'url(imgs/icon/error-del.png) no-repeat 0 0')
        //
		//	}
		//}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}

}]);