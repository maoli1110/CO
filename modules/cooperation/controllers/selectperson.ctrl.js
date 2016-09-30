'use strict';
/**
 * 选择负责人/联系人
 */
angular.module('cooperation').controller('selectpersonCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items',
	function ($scope, $http, $uibModalInstance,Cooperation,items) {
		//选择负责人,联系人
		//设置默认值
		var flag = {
			forbidAll:false //防止多次全部选中
		};
		var defaultDeptId = 1; 	//默认第一个项目部（值）
		$scope.selectedOption = {}; //默认中第一个项目部（页面展示对象）
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.userList = [];  //联系人列表
		$scope.responsiblePerson = ''; //当前负责人
		$scope.trans_selected = {
        	noSign: [], //不需要签字的相关人
        	sign: items.sign //需要签字的相关人
        };
//		$scope.trans_selected.sign = items.sign;
		//保存联系人的值
//		$scope.avatar = [];
//		$scope.downUrl = [];
		//查询值
		var queryData = {
			deptId:defaultDeptId,
			searchText:$scope.queryForm
		};
		//获取项目部
		Cooperation.getDeptList().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = data[0].deptId + '';
			defaultDeptId = data[0].deptId;
			queryData = {
				deptId:defaultDeptId,
				searchText:$scope.queryForm
			};
			//默认联系人列表
			Cooperation.getUserList(queryData).then(function (data) {
				// var imgSrc = './imgs/icon/defalut.png';
				// console.log('start',Date.parse(new Date()));
//				 angular.forEach(data,function(value,key){
//					var avater = {
//						key:key,//对应的key值
//						avater:[]//保存的头像地址信息
//					};
//				 	angular.forEach(value.users,function(value1,key1) {
//				 		var urls = {
//				 			uuid:value1.uuid,
//				 			url:value1.avatar
//				 		};
//				 		avater.avater.push(urls);
//				 	})
//				 	$scope.avatar.push(avater);
//				 });
				// console.log('start',Date.parse(new Date()));
				$scope.userList = data.slice(0,8);
				//console.log(data)
			});
		});

		//获取指定角色目录下的所有用户的头像
//		$scope.getUserAvaterUrl = function(index){
//			index = parseInt(index);
//			//获取指定的数据
//			var avater = $scope.avatar[index];
////			$scope.$apply(function(){
////				$("#uib_"+index).attr("uib-collapse",false);
////			});
//			if(avater.key != index){
//				return;
//			}
//			var urls = avater.avater;
//			//获取所有的UUID，根据UUID区获取下载地址
//			var uuids = [];
//			angular.forEach(urls,function(value,key){
//				if(value.uuid){
//					var url = $scope.getDownUrl(value.uuid)
//					if(url == null){
//						uuids.push(value.uuid);
//					}
//				}
//			});
//			//获取UUID地址,
//			var mapUrl = '';
//			if(uuids.length > 0){
//				uuids = JSON.stringify(uuids)
////				Cooperation.getDownFileUrl(uuids).then(function (data) {
////					mapUrl = data.data;
////				});
//				$.ajax({
//		              type: "post",
//		              url: basePath+'rs/co/downFileUrl',
//		              data:uuids,
//		              async:false,
//		              contentType:'application/json',
//		              success: function(data){
//		            	  mapUrl = data;
//		              }
//		        });
//			}
//			angular.forEach(urls,function(value,key){
//				var url = "default";
//				var down = "./imgs/icon/defalut.png";
//				var uuid = value.uuid;
//				if(uuid){
//					  angular.forEach(mapUrl,function(value,key){
//						  if(key == uuid){
//							  url = uuid;
//							  down = value;
//							  var downUrl = {
//								  uuid:key,
//								  url:value
//							  };
//							  $scope.downUrl.push(downUrl);
//						  }
//					  })
//				}
//				$("#"+index+"_"+url+"_"+key).attr("src",down);
//			});
//		}
		
		//获取指定的url
//		$scope.getDownUrl =function (uuid){
//			var url = null;
//			 angular.forEach($scope.downUrl,function(value,key){
//				 if(value.uuid == uuid){
//					 url = value.url;
//				 }
//			 });
//			 return url;
//		}
		
		//切换项目部切换联系人
		$scope.switchUsers = function (params) {
			queryData = {
					deptId: params,
					searchText: $scope.queryForm
			};
			Cooperation.getUserList(queryData).then(function (data) {
				$scope.userList = data.slice(0,6);
			});
			$scope.isCollapsed = false;
		}

		//选择负责人--搜索功能
		$scope.responsibleSearch = function () {
			if($scope.queryForm) {
				$scope.isCollapsed = true;
				queryData = {
					deptId:$scope.selectedOption,
					searchText:$scope.queryForm
				};
				Cooperation.getUserList(queryData).then(function (data) {
					$scope.userList = data.slice(0,6);
				});
			} else if (!$scope.queryForm) {
				queryData = {
					deptId:$scope.selectedOption,
					searchText:$scope.queryForm
				};
				Cooperation.getUserList(queryData).then(function (data) {
					$scope.userList = data.slice(0,6);
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
//			var url = $scope.getDownUrl(current.uuid);
//			if(url){
//				current.avatar = url;
//			}
			var currentUser = {avatar:	current.avatar,
					avatarUuid:current.uuid,
					isPassed	:false,
					isReaded:false,
					isRejected	:false,
					isSigned:false,
					needSign:false,
					username:current.username,
					mustExist:false,
					canSign:true};
			$scope.relatedSelected.push(currentUser);
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
        var updateSelected = function(action,id){
            if(action == 'add' && signSelected.indexOf(id) == -1){
               id.needSign = true;
               signSelected.push(id);
               $scope.trans_selected.sign =signSelected;
           	}
            if(action == 'remove' && signSelected.indexOf(id)!=-1){
            	id.needSign = false;
               var idx = signSelected.indexOf(id);
               signSelected.splice(idx,1);
               $scope.trans_selected.sign =signSelected;
            }
         }
 
        $scope.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id);
        }
 
        $scope.isSelected = function(id){
        	//console.log('signSelected.indexOf(id)',signSelected.indexOf(id))
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

        //选择负责人-确定按钮
		$scope.ok = function () {
//			console.log('relatedSelected', $scope.responsiblePerson);
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
			$uibModalInstance.close($scope.trans_selected);	// 关闭弹框
		}

		//全选
		$scope.allSelected = function () {
			$scope.flag.forbidAll = true;
			angular.forEach($scope.userList,function (value, key) {
				angular.forEach(value.users, function (value1,key) {
					var currentUser = {avatar:	value1.avatar,
							avatarUuid:value1.uuid,
							isPassed	:false,
							isReaded:false,
							isRejected	:false,
							isSigned:false,
							needSign:false,
							username:value1.username,
							mustExist:false,
							canSign:true};
					$scope.relatedSelected.push(currentUser);
				})
			});
			$scope.relatedSelected = _.uniqBy($scope.relatedSelected, 'username');
			/*
			//$scope.isSelected = true;
			$scope.relatedSelected = [];	// 无论全选与否，值先清掉
			if($scope.flag.allSelected && !$scope.flag.forbidAll){
				$scope.flag.forbidAll = true;
				angular.forEach($scope.userList,function (value, key) {
					angular.forEach(value.users, function (value1,key) {
						$scope.relatedSelected.push(value1);
					})
				});
			} else {
				$scope.flag.forbidAll = false;
				$scope.trans_selected.sign = [];
				signSelected = [];
			}*/
		}
		$scope.delAll = function(){
			var noDelete = [];
			var needSign = [];
			for(var i=0; i < $scope.relatedSelected.length; i++) {
				if($scope.relatedSelected[i].mustExist) {		// 如果该相关人之前已经存在，不让删
					noDelete.push($scope.relatedSelected[i]);
					if($scope.relatedSelected[i].needSign) {	
						needSign.push($scope.relatedSelected[i]);
					}
				}
			}
			$scope.relatedSelected =noDelete;
			$scope.trans_selected.sign = needSign;
			signSelected = needSign;
//			$scope.flag.forbidAll = false;
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}

}]);