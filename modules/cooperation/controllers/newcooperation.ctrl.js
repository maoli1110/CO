'use strict';
/**
 * 新建协作
 */
angular.module('cooperation').controller('newcoopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Common','Manage','$sce','alertService','headerService',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Common,Manage,$sce,alertService,headerService) {
    //默认值
    console.log($stateParams,'$stateParams');
	$scope.typeName = $stateParams.typename;
		//console.log($stateParams.typename,'$stateParams.typeid')
    $scope.isDoc = false; //是否是doc
    $scope.priority = '1'; //优先级
    $scope.flag = {};
    $scope.linkOpenSignal = true; 
    $scope.linkProject1 =false;
    $scope.linkComponent1 = false;
    $scope.linkCategoty1 =false;
    $scope.data = {};
    $scope.link = {};
    $scope.desc = '';
	$scope.isClick = true;//启用编辑按钮是否被按下
	$scope.responsiblePerson = {};//重组负责人
	
//    console.log($stateParams.typeid);
   	//获取当前用户信息
   	//$.ajax({
	 //   type: "get",
	 //   url: basePath+'rs/co/currentUser',
	 //   contentType:'application/json',
	 //   success: function(data){
	 //   	$scope.responsiblePerson = data;
	 //   }
    //});
    if($stateParams.deptId!=-1&&$stateParams.deptId!=0){
    	var currentdeptId = $stateParams.deptId?$stateParams.deptId:'';
    	var currentppid  = $stateParams.ppid?$stateParams.ppid:'';
    }

	headerService.currentUserInfo().then(function(data){
		$scope.responsiblePerson.username = data.userName;
		$scope.responsiblePerson.avatar = data.avatarUrl;
		var relateUser = {};
		relateUser.username = data.userName;
		relateUser.avatar = data.avatarUrl;
		relateUser.mustExist = true;
		relateUser.canSign = true;
		$scope.related.noSign[0]=relateUser;
	})
    //选择负责人
    $scope.selectResponsible = function () {
    	//alert('111');
    	var modalInstance = $uibModal.open({
			windowClass: 'select-person-responsible-modal',
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
    		if($scope.responsiblePerson.username == selectedItem.username) {
    			return;
    		}
			
			for(var i = 0;i < $scope.related.sign.length;i++) {	// TODO
				if($scope.related.sign[i].username == selectedItem.username){
					$scope.responsiblePerson = selectedItem;
					return;
				}
				
			}
			
			for(var i = 0;i < $scope.related.noSign.length;i++) {
				if($scope.related.noSign[i].username == selectedItem.username){
					$scope.responsiblePerson = selectedItem;
					return;
				}
			}
			$scope.related.noSign[$scope.related.noSign.length] = selectedItem;
			$scope.responsiblePerson = selectedItem;
    	});
    }
    //选择相关人
    $scope.related = {
    	sign:[],
		noSign:[]
    };
	var num;
    var contracts = [];
    $scope.selectRelated = function () {
    	var modalInstance = $uibModal.open({
			windowClass: 'select-person-related-modal',
    		backdrop : 'static',
			size:'lg',
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
		if(!$scope.responsiblePerson){
			$scope.responsiblePerson='创建人';
		}

 //    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
 //    	debugger;
 //    	    $('.identify').addClass('selectpicker');
	// 		$('.selectpicker').selectpicker({
	// 		  	style: 'btn-default',
	// 		  	size: 'auto'
	// 		});
	// });

    //获取标识
    Cooperation.getMarkerList().then(function (data) {
    	$scope.markerList = data;
//    	console.log($scope.markerList);
    	$scope.mark = $scope.markerList[0].markerId+'';
    });

    $scope.switchMark = function() {
    	console.log($scope.mark);
    }

    //与工程关联
    $scope.data.bindType = 0;
    var deptId;
	var modalInstance;
		function isDelete(num){
			if($scope.linkProject1 ||$scope.linkComponent1 ||$scope.linkCategoty1){
				layer.confirm('您已关联的模型,是否重新关联？', {
					btn: ['是','否'] //按钮
				}, function(){
					layer.closeAll();
					if($scope.linkProject1 ){
						modalInstance = $uibModal.open({
							windowClass: 'link-project-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_project.html',
							controller:'linkprojectCtrl'
						});
						modalInstance.result.then(function (dataList) {
							//关联工程页面显示的值
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							if($scope.link.linkProjectDptName ){
								$(".new-del").show();
								$scope.data.bindType = 1;
								$scope.linkProject1 = true;
								$scope.linkComponent1 = false;
								$scope.linkCategoty1 =false;
							}
							//传给服务器的两个值
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							$scope.data.deptId = dataList.parentNode.value;
						});
					}else if($scope.linkComponent1 ){
						modalInstance = $uibModal.open({
							windowClass:'link-component-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_component.html',
							controller:'linkcomponentCtrl'
						});
						modalInstance.result.then(function (dataList) {
							//面显示的值
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							//传给服务器的两个值
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.deptId = dataList.parentNode.value;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							if($scope.link.linkProjectDptName ){
								$(".new-del").show();
								$scope.data.bindType = 2;
								$scope.linkProject1 = false;
								$scope.linkComponent1 = true;
								$scope.linkCategoty1 =false;
							}
						});
					}else if($scope.linkCategoty1){
						modalInstance = $uibModal.open({
							windowClass:'link-categoty-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_component_category.html',
							controller:'linkprojectCtrl'
						});
						modalInstance.result.then(function (dataList) {
							//关联工程页面显示的值
							$scope.link.linkProjectName = dataList.linkProjectSelected.name;
							$scope.link.linkProjectDptName = dataList.parentNode.name;
							$scope.linkProjectSelected = dataList.selectedCategory;
							//传给服务器的两个值
							$scope.data.assembleLps = dataList.assembleLps;
							$scope.data.deptId = dataList.parentNode.value;
							$scope.data.ppid = dataList.assembleLps[0].ppid;
							console.log('ppid',dataList.assembleLps.ppid);
							if($scope.link.linkProjectDptName ){
								$scope.data.bindType = 3;
								$(".new-del").show();
								$scope.linkProject1 = false;
								$scope.linkComponent1 = false;
								$scope.linkCategoty1 =true;
							}
						});
					}
				},function(){
					return;
				});
			}else{
				if(num==1){
					layer.closeAll();
					modalInstance = $uibModal.open({
						windowClass: 'link-project-modal',
						backdrop : 'static',
						templateUrl: 'template/cooperation/link_project.html',
						controller:'linkprojectCtrl',
					});
					modalInstance.result.then(function (dataList) {
						//关联工程页面显示的值
						$scope.link.linkProjectName = dataList.linkProjectSelected.name;
						$scope.link.linkProjectDptName = dataList.parentNode.name;
						if($scope.link.linkProjectDptName ){
							$(".new-del").show();
							$scope.data.bindType = 1;
							$scope.linkProject1 = true;
							$scope.linkComponent1 = false;
							$scope.linkCategoty1 =false;
						}
						//传给服务器的两个值
						$scope.data.assembleLps = dataList.assembleLps;
						$scope.data.ppid = dataList.assembleLps[0].ppid;
						$scope.data.deptId = dataList.parentNode.value;
					});
				}else if(num ==2){
					modalInstance = $uibModal.open({
						windowClass:'link-component-modal',
						backdrop : 'static',
						templateUrl: 'template/cooperation/link_component.html',
						controller:'linkcomponentCtrl'
					});
					modalInstance.result.then(function (dataList) {
						//面显示的值
						$scope.link.linkProjectDptName = dataList.parentNode.name;
						$scope.link.linkProjectName = dataList.linkProjectSelected.name;
						//传给服务器的两个值
						$scope.data.assembleLps = dataList.assembleLps;
						$scope.data.deptId = dataList.parentNode.value;
						$scope.data.ppid = dataList.assembleLps[0].ppid;
						if($scope.link.linkProjectDptName ){
							$(".new-del").show();
							$scope.data.bindType = 2;
							$scope.linkProject1 = false;
							$scope.linkComponent1 = true;
							$scope.linkCategoty1 =false;
						}
					});
				}else if(num ==3){
					modalInstance = $uibModal.open({
						windowClass:'link-categoty-modal',
							backdrop : 'static',
							templateUrl: 'template/cooperation/link_component_category.html',
							controller:'linkprojectCtrl'
						});
					modalInstance.result.then(function (dataList) {
						//关联工程页面显示的值
						$scope.link.linkProjectName = dataList.linkProjectSelected.name;
						$scope.link.linkProjectDptName = dataList.parentNode.name;
						$scope.linkProjectSelected = dataList.selectedCategory;
						//传给服务器的两个值
						//debugger
						$scope.data.assembleLps = dataList.assembleLps;
						$scope.data.deptId = dataList.parentNode.value;
						$scope.data.ppid = dataList.assembleLps[0].ppid;
						console.log('ppid',dataList.assembleLps.ppid);
						if($scope.link.linkProjectDptName ){
							$scope.data.bindType = 3;
							$(".new-del").show();
							$scope.linkProject1 = false;
							$scope.linkComponent1 = false;
							$scope.linkCategoty1 =true;
						}
					});
				}
			}
		}
    $scope.linkProject = function () {
		isDelete(1);
    }
    //与图上构件关联
    $scope.linkComponent = function () {
		isDelete(2);
    }
    //与图上构件类别关联
    $scope.linkCategoty = function () {
		isDelete(3);
    }
    //删除关联
    $scope.removeLink = function () {
		if($scope.link.linkProjectName) {
			layer.confirm('您已关联了模型，是否删除关联？', {
				btn: ['是','否'] //按钮
			}, function(){
				$scope.linkProject1 = false;
				$scope.linkComponent1 = false;
				$scope.linkCategoty1 =false;
				$scope.data = {};
				$scope.data.bindType = 0;
				layer.closeAll();
				$scope.$apply();
			});
		}
    }

	$scope.docSelectedList =[];
	$scope.formSelectedList = [];
	var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
	//引用BE资料
	$scope.linkBe = function () {
		$scope.beSourceType = 1;
		$scope.flag.isleast = false;
		var modalInstance = $uibModal.open({
			windowClass: 'link-be-modal',
			backdrop : 'static',
    		templateUrl: 'template/cooperation/linkbe.html',
    		controller:'linkbeCtrl',
    		resolve: {
    			items: function() {
    				return $scope.docSelectedList;
    			}
    		}
		});
		modalInstance.result.then(function (selectedItem1) {
    		var imgsrc = "imgs/pro-icon/icon-";
    		var unit = '';
    		angular.forEach(selectedItem1,function(value,key){
    			if(typeArr.indexOf(value.fileType)!=-1){
    				unit = value.fileType;
    			} else {
    				unit = 'other';
    			}
    			selectedItem1[key].imgSrc= imgsrc + unit + ".png";
    		})
    		$scope.docSelectedList = selectedItem1;
			//console.info('养你一辈子你要和果汁',$scope.docSelectedList)
			console.info('$scope.docSelectedList',$scope.docSelectedList.length)
    	});
	}
	//选择表单
	$scope.linkForm = function () {
		$scope.formSourceType = 2;
		$scope.flag.isleast = false;
		var modalInstance = $uibModal.open({
			windowClass: 'link-form-modal',
			backdrop : 'static',
    		templateUrl: 'template/cooperation/linkform.html',
    		controller:'linkformCtrl',
    		resolve: {
    			items: function () {
    				var trans = {
    					typeid:$stateParams.typeid,
    					formSelectedList:$scope.formSelectedList
    				}
    				return trans;
    			}
    		}
		});
		modalInstance.result.then(function (selectedItem2) {
    		$scope.formSelectedList = selectedItem2;
    		console.log("$scope.formSelectedList",$scope.formSelectedList.length);
    	});
	}
	//选择表单勾选之后需要签字的文件
	// var formNeedSignList = [];
	// var updateSelected = function(action,id,name){
 //        if(action == 'add' && formNeedSignList.indexOf(id) == -1){
 //           formNeedSignList.push(id);
 //       	}
 //         if(action == 'remove' && formNeedSignList.indexOf(id)!=-1){
 //            var idx = formNeedSignList.indexOf(id);
 //            formNeedSignList.splice(idx,1);
 //         }
 //     }

 //    $scope.updateSelection = function($event, id){
 //        var checkbox = $event.target;
 //        var action = (checkbox.checked?'add':'remove');
 //        updateSelected(action,id,checkbox.name);
 //        angular.forEach($scope.formSelectedList, function (value, key) {
	// 		angular.forEach(formNeedSignList, function (value1, key1) {
	// 			if(value == value1) {
	// 				value.needSign = true;
	// 				$scope.formSelectedList.splice(key,1,value);
	// 			}
	// 		})
	// 	});
	// 	console.log($scope.formSelectedList);
 //    }
	//	删除be照片
		$scope.removePhoto = function(item){
			_.pull($scope.uploader.queue,item);
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
            url: '/bimco/fileupload/upload.do'
   			// queueLimit: 30
	});
    // FILTERS
    var picturesUploadList = [];
    var docsUploadList = [];
    $scope.flag.docsRepeatMind = false; //图片上传超过30个防止多次提醒
    $scope.flag.pictrueRepeatMind = false;//资料上传超过30个防止多次提醒
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            picturesUploadList.push(item);
            if(picturesUploadList.length > 30){
            	// alertService.add('time-bottom',"上传照片不能多于30个！");
            	if(!$scope.flag.pictrueRepeatMind){
            		// alert("上传资料不能多于30个！")
            		// alertService.add('time-bottom','上传照片不能多于30个！')
            		layer.alert('上传照片不能多于30个！', {
            		  	title:'提示',
					  	closeBtn: 0
					});
            	}
            	$scope.flag.pictrueRepeatMind = true;
            	return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
        }
    });
    //上传资料
    var uploader1 = $scope.uploader1 = new FileUploader({
    		url: '/bimco/fileupload/upload.do'
    		// queueLimit:30
    });
    //FILTERS
    uploader1.filters.push({
    	name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            docsUploadList.push(item);
            if(docsUploadList.length > 30){
            	if(!$scope.flag.docsRepeatMind){
            		// alert("上传资料不能多于30个！")
            		// alertService.add('time-bottom','上传资料不能多于30个！')
            		layer.alert('上传资料不能多于30个！', {
					   	closeBtn: 0
					});
            	}
            	$scope.flag.docsRepeatMind = true;
            	return this.queue.length < 30;
            }
            	return this.queue.length < 30;
        }
    });
    //点击上传照片按钮
    $scope.fileUpload = function () {
    	$scope.flag.pictrueRepeatMind = false;
    	$scope.flag.isleast = false;
    	$('.upload-img').attr('uploader', 'uploader');
    	$('.upload-img').attr('nv-file-select', '');
    	$('.upload-img').click();
    }
    //点击上传资料按钮
    $scope.docsUpload = function () {
    	$scope.uploadSourceType = 3;
    	$scope.flag.isleast = false;
    	$scope.flag.docsRepeatMind = false;
    	$('.upload-docs').attr('uploader', 'uploader1');
    	$('.upload-docs').attr('nv-file-select', '');
    	$('.upload-docs').click();
    }
    //设置日期相关
    $scope.dateOptions = {
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    startingDay: 1,
	    showWeeks: false,
		minDate: new Date()
	};
	$scope.open2 = function() {
	    $scope.popup2.opened = true;
		$scope.isDeadlineNull = false;
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
	//	监听新建文本框的状态
	$scope.changeTopic = function(){
		// 名称字符控制
		$scope.flag.nameToLong = false;
	}
	//监听描述的状态
	$scope.changeDesc = function(){
		// 描述字符控制
		$scope.flag.descToLong = false;
	}

	var docsList = []; //组合doclist
	var uploadPictureList = []; //上传照片list
	var uploadDocList = [];		//上传资料list
	var onCompleteAllSignal = false; //是否上传成功signal

	$scope.test = function() {
		backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
        backJson = JSON.parse(backJson);
        alert(backJson.length);
        var  a  ={
        	modifys:[]
        }; 
        if(backJson){
					if(backJson){
						angular.forEach(backJson,function(value1, key1){
							if(!value1){
								return;
							}

		        				a.modifys.push(value1.PdfModify);
		        		});
					}
					console.log(a);
	        		
	        	}
	}

	
	//协作保存
	/**
	 * @param  {[status]} 0-草稿箱 1 提交
	 */
	$scope.save = function (status) {
		// if($scope.flag.beginCreate){
		// 	return;
		// }
		// debugger
//		console.log('data.linkProjectDptName',$scope.link.linkProjectDptName);
		$scope.flag.beginCreate = true;
		//主题为空
		if(status==1){
			if(!$scope.coopname){
				$scope.flag.isTopicNull= true;
				return;
			}
			if($scope.coopname.length > 50){	//协作主题不能超过50个字符
				$scope.flag.nameToLong = true;
				return;
			} else {
				$scope.flag.nameToLong = false;
			}
			if($scope.desc.length > 250){	//协作描述不能超过250个字符
				$scope.flag.descToLong = true;
				return;
			} else {
				$scope.flag.descToLong = false;
			}
			//当主题不为空，资料照片为空
			if($scope.coopname && !uploader.queue.length && !uploader1.queue.length && !$scope.docSelectedList.length && !$scope.formSelectedList.length) {
				$scope.flag.isTopicNull = false;
				$scope.flag.isleast = true;
				return;
			}
		}

		var createindex = layer.load(1, {
			shade: [0.1,'#000'] //0.1透明度的黑色背景
		});
		
		if(uploader.queue.length && uploader1.queue.length) {
			//上传全部图片
   			var uploadResult = uploader.uploadAll();
	   		//每个上传成功之后的回调函数
	   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
		            console.info('onSuccessItem', fileItem, response, status, headers);
		            var unit = {};
		            unit.name = response[0].result.fileName;
		            unit.md5 = response[0].result.fileMd5;
		            unit.size = response[0].result.fileSize;
		            unit.uuid = response[0].result.uuid;
		            uploadPictureList.push(unit);
		            console.log('uploadPictureList',uploadPictureList);
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
				//上传全部
		   	 	uploader1.uploadAll();
		   		//每个上传成功之后的回调函数
		   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
			            console.info('onSuccessItem', fileItem, response, status, headers);
			            var unit = {};
			            unit.name = response[0].result.fileName;
			            unit.md5 = response[0].result.fileMd5;
			            unit.size = response[0].result.fileSize;
			            unit.uuid = response[0].result.uuid;
						unit.sourceType = 3;
			            uploadDocList.push(unit);
			            console.log('uploadDocList',uploadDocList);
				};
				//全部成功的回调函数
				uploader1.onCompleteAll = function() {
		            onCompleteAllSignal = true;
		        };
	        };
	    }

	    if( uploader.queue.length && !uploader1.queue.length) {
   			var uploadResult = uploader.uploadAll();
   		
	   		//每个上传成功之后的回调函数
	   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
//		            console.info('onSuccessItem', fileItem, response, status, headers);
		   			if(response[0].type != "error") {
		   				var unit = {};
			            unit.name = response[0].result.fileName;
			            unit.md5 = response[0].result.fileMd5;
			            unit.size = response[0].result.fileSize;
			            unit.uuid = response[0].result.uuid;
			            uploadPictureList.push(unit);
		   			} else {	// 提交失败 弹框提示
		   				layer.open({
		                    type: 1,
		                    title: false,
		                    closeBtn: 0,
		                    shadeClose: true,
		                    skin: 'yourclass',
		                    content: '<div class="tips">'+response[0].info+'</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
		                  });
		       			return;
		   			}
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
	            onCompleteAllSignal = true;
	        };

	    }

	     if( !uploader.queue.length && uploader1.queue.length) {
   			var uploadResult = uploader1.uploadAll();
   		
	   		//每个上传成功之后的回调函数
	   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
//		            console.info('onSuccessItem', fileItem, response, status, headers);
	   			if(response[0].type != "error") {
	   				var unit = {};
	   				unit.name = response[0].result.fileName;
	   				unit.md5 = response[0].result.fileMd5;
	   				unit.size = response[0].result.fileSize;
	   				unit.uuid = response[0].result.uuid;
	   				unit.sourceType = 3;
	   				uploadDocList.push(unit);
	   			} else {	// 提交失败 弹框提示
	   				// TODO 弹框提示错误信息 (上传文件size=0时会报错)
	   				condole.log(response.info);
	   				layer.open({
	                    type: 1,
	                    title: false,
	                    closeBtn: 0,
	                    shadeClose: true,
	                    skin: 'yourclass',
	                    content: '<div class="tips">'+response[0].info+'</div><div class="tips_ok"onclick="layer.closeAll();">好</div>'
	                  });
	       			return;
	   			}
			};
			//全部成功的回调函数
			uploader1.onCompleteAll = function() {
	            onCompleteAllSignal = true;
	        };
	    }
	    if( !uploader.queue.length && !uploader1.queue.length) {
   			saveCooperation();
	    }
	    //轮询是否上传成功
	    var checkUploadInterval = setInterval(function() {
	    	if(onCompleteAllSignal == true){
	    		clearUploadInterval();
	    		//alert('onCompleteAllSignal',onCompleteAllSignal);
	    		saveCooperation();
	    	}
	    },100);
	    //清除轮询
	    function clearUploadInterval() {
	    	clearInterval(checkUploadInterval);
	    }
        function saveCooperation () {
        	
        	// var backJson = BimCo.SubmitAll();
        	// backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
       	
        	if(backJson){
        		 backJson = JSON.parse(backJson);
        	}
        	if($scope.dt) {
        		// console.log($scope.dt);
				var dt = Common.dateFormat($scope.dt);
			} else {
				dt = '';
			}
			//拼接资料数组
			var docSelectedList1 = [];
			var formSelectedList1 = [];
			angular.forEach($scope.docSelectedList, function(value, key){
				var a = {};
				if(backJson){
						angular.forEach(backJson,function(value1, key1){
							if(!value1){
								return;
							}
		        			if(key == value.uuid){
		        				a.modifys.push(value1.PdfModify);
		        			}
		        		});
	        	}
				a.md5 = value.filemd5;
				a.name = value.docName;
				a.needSign = false;
				a.uuid = value.uuid;
				a.size = value.filesize;
				a.sourceType = $scope.beSourceType;
				docSelectedList1.push(a);
			});
			angular.forEach($scope.formSelectedList, function(value, key){
				var a = {};
				if(backJson){
					backJson = JSON.parse(backJson);
					if(backJson){
						angular.forEach(backJson,function(value1, key1){
							if(!value1){
								return;
							}
		        			if(key == value.uuid){
		        				a.modifys.push(value1.PdfModify);
		        			}
		        		});
					}
	        		
	        	}
				a.md5 = value.md5;
				a.name = value.name +'.'+value.suffix;
				a.needSign = true;
				a.uuid = value.uuid;
				a.size = value.size;
				a.sourceType = $scope.formSourceType;
				formSelectedList1.push(a);
			});
			docsList = docSelectedList1.concat(formSelectedList1, uploadDocList);


			var binds = [];//bind的工程
			if($scope.data.bindType == 2) {
				binds = [];
			} else {
				//debugger
				binds = $scope.data.assembleLps?$scope.data.assembleLps:[];
			}
			$scope.data = {
		    	binds:binds,
		    	bindType: $scope.data.bindType,
		    	collaborator: $scope.responsiblePerson.username,
		    	contracts: contracts,
		    	deadline: dt,
		    	deptId: $scope.data.deptId,
		    	desc: $scope.desc,
		    	docs: docsList,
		    	markerid: $scope.mark,
		    	name: $scope.coopname,
		    	pictures: uploadPictureList,
		    	ppid: $scope.data.ppid,
		    	priority: $scope.priority,
		    	status:status,
		    	typeId:$stateParams.typeid
		    };
		    console.log(JSON.stringify($scope.data));
		    console.log($scope.data);
			var obj = JSON.stringify($scope.data);

			Cooperation.createCollaboration(obj).then(function (data) {
				//debugger
				layer.close(createindex);
				var coid = data;
				if(status==0){
					$scope.data.deptId = 0;
					alert('协作存入草稿箱成功！')
				}else if(status==1){
					if(!binds.length){
						$scope.data.deptId = -1;
					}	
					alert('创建协作成功');
				}
				
				$state.go('cooperation',{'deptId':$scope.data.deptId, 'ppid':$scope.data.ppid},{ location: 'replace'});
				// $state.go('cooperation',{'transignal':$scope.data.deptId},{ location: 'replace'});
				//上传之后将coid传给客户端
				if($scope.data.bindType == 2){
					//debugger
					BimCo.UpLoadComponent(coid);
				}
				//创建成功一条协作，通知客户端
				BimCo.CreateCoSucceed();
			},function(data) {
				layer.close(createindex);
				$scope.flag.beginCreate = false;
				obj =  JSON.parse(data);
				//if(status==1) {
				//	alert(obj.message)
				//}
			});
        }

	}
    // var currentEditOfficeUuid = '8C08CC5F55F74A9CB04261750BC60EF6';
    var currentDocSource = '';
    var currentDocIndex = 0;
    var currentEditOfficeUuid = '';
    var currentSuffix = '';
    var currentDocname = '';
    var currentReact = '60,80,1200,720';
    var backJson = '';
    var handle = '';
    var coid = '';
	$scope.isTypePdf = false;;//判断是不是PDF格式的文件
	$scope.preView = function (uuid,docName,fileType,index,docSource) {
			//可编辑表单当前index & uuid
			currentEditOfficeUuid = uuid;
			currentDocname = docName;
			currentDocSource = docSource;
			currentDocIndex = index;
            if(fileType=='pdf'){
            	//pdf签署（客户端）
        		$scope.flag.isPreview = true;
            	$scope.flag.isPdfsign = true;
            	$scope.flag.isGeneral = false;
				$scope.isTypePdf = true;
            	var editResult = BimCo.PdfSign(currentEditOfficeUuid,currentSuffix,currentReact,coid);
		        //编辑失败返回预览界面
		        if(!editResult){
		        	alert('下载文档失败');
		        	$scope.flag.isPreview = true;
		        }
            } else {
            	//普通预览（除去pdf以外的文件）
				$scope.isTypePdf = false;
            	var data ={fileName:docName,uuid:uuid};
	        	Manage.getTrendsFileViewUrl(data).then(function (result) {
	        		console.log(typeof result)
	        		$scope.flag.isPreview = true;
	        		$scope.flag.isGeneral = true;
	        		$scope.flag.isPdfsign = false;
	        		$scope.previewUrl = $sce.trustAsResourceUrl(result);
	            },function (data) {
	            	$scope.flag.isPreview = false;
					if($scope.flag.isPreview == false){
						alert('该文件暂不支持预览');
						return;
					}else{
						$scope.previewUrl ='';
						var obj = JSON.parse(data);
						console.log(obj);
						alert(obj.message);
					}
	            });
            }
    }

    //启用编辑
    $scope.CommentSign = function () {
		if($scope.isClick){
			$('.edit-material').css('color','#c5c5c5');
			BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
		}
		$scope.isClick = false;
    }
    //保存编辑
    $scope.saveOffice = function () {
		// layer.confirm('是否保存当前文档？', {
		// 	shadeClose: true,
		// 	zIndex: layer.zIndex, //重点1
		// 	btn: ['是','否'] //按钮
		// }, function(layero){
		// 	//layer.zIndex();
		// 	layer.setTop(layero);
		// 	var isSuccess =  BimCo.SignSubmit(coid);
		// 	if(isSuccess){
		// 		$scope.flag.isPreview = false;
		// 	} else {
		// 		$scope.flag.isPreview = false;
		// 		alert('保存失败！');
		// 	}
		// 	//layer.closeAll();
		// })
		
		
     //    var re = confirm('是否保存当前文档？');
    	// if(re){
    	// 	var isSuccess =  BimCo.SignSubmit(coid);
	    //    	if(isSuccess){
	    //    		$scope.flag.isPreview = false;
	    //    	} else {
	    //    		$scope.flag.isPreview = false;
	    //    		alert('保存失败！');
	    //    	}
    	// }

    	var rtn = BimCo.MessageBox("提示" ,"是否保存当前文档？", 0x31);
    	//确定1取消2
    	if(rtn==1){
    		var isSuccess =  BimCo.SignSubmit(coid);
	       	if(isSuccess){
	       		$scope.flag.isPreview = false;
	       	} else {
	       		$scope.flag.isPreview = false;
	       		alert('保存失败！');
	       	}
    	}

    }

    $scope.cancelEditOffice = function () {
		// layer.confirm('是否取消编辑当前文档？', {
		// 	btn: ['是','否'] //按钮
		// }, function(){
		// 	layer.closeAll();
		// 	BimCo.SignCancel(currentEditOfficeUuid,currentSuffix);
		// },function(){
		// 	return;
		// });
		// 
		
		// var re = confirm('是否取消编辑当前文档？');
  //   	if(re){
  //   		$scope.flag.isPreview = false;
  //   		BimCo.SignCancel();
	 //    }

	    var rtn = BimCo.MessageBox("提示" ,"是否取消编辑当前文档", 0x31);
	    //确定1取消2
	    if(rtn==1){
    		$scope.flag.isPreview = false;
    		BimCo.SignCancel();
	    }
    	
    }

    $scope.backDetail = function () {
    	$scope.flag.isPreview = false;
    	BimCo.SignCancel();
    	BimCo.CancelSubmitAll();
    }

    //最大化、最小化、还原、关闭
    //SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
    //窗口缩小
    $scope.minimize = function () {
        BimCo.SysCommand('SC_MINIMIZE');
    }

    //窗口放大还原
    var num=0; 
    $scope.max = true;
    $scope.maxRestore = function ($event) {
        if(num++ %2 == 0){ 
            console.log('max');
            $scope.max = false;
            $scope.restore = true;
            //对接pc
            BimCo.SysCommand('SC_MAXIMIZE');

        } else { 
            console.log('restore');
            $scope.max = true;
            $scope.restore = false;
            //对接pc
            BimCo.SysCommand('SC_RESTORE');
        }
    }
    

    //窗口关闭
    $scope.close = function () {
        BimCo.SysCommand('SC_CLOSE');
    }

    //取消创建
    $scope.cancelCreate = function () {
		//询问框
		 layer.confirm('是否取消？', {
		   btn: ['是','否'] //按钮
		 }, function(){
			layer.closeAll();
			BimCo.CancelSubmitAll();
			$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid},{ location: 'replace'});

		  });
    }

    //详情页面跳转回homepage(cooperation)
   	$scope.backCooperation = function (){
   		$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid},{ location: 'replace'});
   	}

   	//反查formbe,跳转详情页面
   	var currentPage = 'create';
   	$scope.checkFromBe = function() {
   		var coid = $('#checkformbe').val();
   		if(currentPage == 'create'){
   			var r = confirm('当前正在创建中，是否跳转？');
   			if(r){
   				$state.go('coopdetail',{'coid':coid})
   			}
   		}
   		
   	}

}]);