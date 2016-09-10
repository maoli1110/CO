'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('newcoopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Common','Manage','$sce',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Common,Manage,$sce) {
    //优先级默认值 
    $scope.isDoc = false;
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
    	console.log($scope.markerList);
    	$scope.mark = $scope.markerList[0];
    	//debugger;
		// if(data) {
		// 	$('.identify').addClass('selectpicker');
		// 	$('.selectpicker').selectpicker({
		// 	  	style: 'btn-default',
		// 	  	size: 'auto'
		// 	});
		// }
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
			windowClass: 'link-project-modal',
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_project.html',
    		controller:'linkprojectCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		//关联工程页面显示的值
    		console.log('datalist33333333333',dataList);
    		$scope.data.linkProjectName = dataList.linkProjectSelected.name;
    		$scope.data.linkProjectDptName = dataList.parentNode.name;
			if($scope.data.linkProjectDptName ){
				$(".new-del").show();
			}
    		//传给服务器的两个值
    		$scope.data.assembleLps = dataList.assembleLps;
    		$scope.data.ppid = dataList.assembleLps[0].ppid;
    		console.log('dataList.assembleLps.ppid',dataList.assembleLps[0].ppid);
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
			windowClass:'link-component-modal',
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/link_component.html',
    		controller:'linkcomponentCtrl'
    	});
    	modalInstance.result.then(function (dataList) {
    		//deptId = dataList.parentNode.value;
    		//面显示的值
    		$scope.data.linkProjectDptName = dataList.parentNode.name;
    		$scope.data.linkProjectName = dataList.linkProjectSelected.name;
    		//传给服务器的两个值
    		$scope.data.assembleLps = dataList.assembleLps;
    		$scope.data.deptId = dataList.parentNode.value;
    		$scope.data.ppid = dataList.assembleLps[0].ppid;
			if($scope.data.linkProjectDptName ){
				$(".new-del").show();
			}
    		//console.log('$scope.data.ppid-----',$scope.data.ppid);
    		//console.log(deptId);
    		// if(deptId){
    			$scope.linkOpenSignal = false;
    			$scope.linkProject1 = false;
    			$scope.linkComponent1 = true;
    			$scope.linkCategoty1 =false;
    		// }
    	});

    }
    //与图上构件类别关联
    $scope.linkCategoty = function () {
    	$scope.data.bindType = 3;
    	var modalInstance = $uibModal.open({
			windowClass:'link-categoty-modal',
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
    		$scope.data.ppid = dataList.assembleLps.ppid;
    		console.log(deptId);
			if($scope.data.linkProjectDptName ){
				$(".new-del").show();
			}
    		if(dataList.selectedCategory.length){
    			$scope.linkOpenSignal = false;
    			$scope.linkProject1 = false;
    			$scope.linkComponent1 = false;
    			$scope.linkCategoty1 =true;
    		}
    	});
    }
		//判断新建关联工程为空删除按钮禁用
		if($scope.data.linkProjectName){

		}


    //删除关联
    $scope.removeLink = function () {
		if($scope.data.linkProjectName) {
			var mes = confirm("您已关联了模型，是否删除关联？");
			if(mes) {
				$scope.linkOpenSignal = true;
				$scope.linkProject1 = false;
				$scope.linkComponent1 = false;
				$scope.linkCategoty1 =false;
				$scope.data = {};
				$scope.data.bindType = 0;
			}
		}


    }

	$scope.docSelectedList =[];
	$scope.formSelectedList = [];
	//引用BE资料
	$scope.linkBe = function () {
		$scope.beSourceType = 1;
		var modalInstance = $uibModal.open({
			windowClass: 'link-be-modal',
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
		$scope.formSourceType = 2;
		var modalInstance = $uibModal.open({
			windowClass: 'link-form-modal',
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
            url: '/bimco/fileupload/upload.do',
   			queueLimit: 30
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
    		url: '/bimco/fileupload/upload.do'
    		// queueLimit:10
    });

    //FILTERS
    uploader1.filters.push({
    	name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 31;
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
    	$scope.uploadSourceType = 3;
    	$('.upload-docs').attr('uploader', 'uploader1');
    	$('.upload-docs').attr('nv-file-select', '');
    	$('.upload-docs').click();
    }

    if(uploader1.queue.length) {
		var uploadResult = uploader1.uploadAll();
	}

	//每个上传成功之后的回调函数
	uploader1.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        var unit = {};
        unit.name = response[0].result.fileName;
        unit.md5 = response[0].result.fileMd5;
        unit.size = response[0].result.fileSize;
        unit.uuid = response[0].result.uuid;
		unit.sourceType = 3;
        uploadList.push(unit);
        console.log(uploadList);
	};

	//全部成功的回调函数
	uploader1.onCompleteAll = function() {
        //onCompleteAllSignal = true;
        data.comment.docs = uploadList;
        if(uploader1.progress == 100) {
        	//debugger
        	$uibModalInstance.close(data);
        }
        
    };

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
		$scope.topic = $(".new-name").val();
	}
	//协作保存
	$scope.save = function (status) {

		//上传图片和资料
		//主题不能为空
		//1.上传图片
		//2.上传资料
		//3.整合数据
		//1.图片存在2.列表存在
		var uploadPictureList = [];
		var uploadDocList = [];
		var onCompleteAllSignal = false;
		//图片上传&资料上传都存在
		//$scope.topic = $(".new-name").attr('value',"xiasofjowe")



		if( $scope.topic && uploader.queue.length && uploader1.queue.length) {
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
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
	            onCompleteAllSignal = true;
	          
		   	 	uploader1.uploadAll();
		   	 	//debugger
		   	
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
		            saveCooperation();
		        };
	            
	        };

	    }

	    if( uploader.queue.length && !uploader1.queue.length) {
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
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
	            onCompleteAllSignal = true;
		            saveCooperation();
	        };

	    }

	     if( !uploader.queue.length && uploader1.queue.length) {
   			var uploadResult = uploader1.uploadAll();
   		
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
			};
			//全部成功的回调函数
			uploader1.onCompleteAll = function() {
	            onCompleteAllSignal = true;
		            saveCooperation();
	        };

	    }

	    if( !uploader.queue.length && !uploader1.queue.length) {
   			saveCooperation();
	    }

        function saveCooperation () {
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
				a.md5 = value.md5;
				a.name = value.name;
				a.needSign = true;
				a.uuid = value.uuid;
				a.size = value.size;
				a.sourceType = $scope.formSourceType;
				formSelectedList1.push(a);
			});
			console.log('1111333',docSelectedList1, formSelectedList1);
			var docsList = docSelectedList1.concat(formSelectedList1, uploadDocList);
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
		    	pictures: uploadPictureList,
		    	ppid: $scope.data.ppid,
		    	priority: $scope.priority,
		    	status:status,
		    	typeId:$stateParams.typeid
		    };
		    console.log(JSON.stringify($scope.data));
		    //return;
			var obj = JSON.stringify($scope.data);

			Cooperation.createCollaboration(obj).then(function (data) {
				var coid = data;
				alert('创建协作成功');
				// $state.go('cooperation',{'deptId':$scope.data.deptId, 'ppid':$scope.data.ppid},{ location: true});
				$state.go('cooperation',{'transignal':$scope.data.deptId},{ location: 'replace'});
				BimCo.UpLoadComponent(coid);
				console.log('lastcoid',coid);
				//上传之后将coid传给客户端
				
			},function(data) {
				obj =  JSON.parse(data);
				if(!$scope.topic &&(uploader.queue.length==0 || uploader1.queue.length==0)){
					alert('请填写主题')
				}else if(uploader.queue.length==0 && uploader1.queue.length==0){
					alert("请至少上传一张照片或者一份资料")
				}else if(!$scope.topic &&uploader.queue.length || uploader1.queue.length){
					alert("协作主题不能为空")
				}
				//alert(obj.message);
				//$state.go('cooperation')

			});
        }

	}
    // var currentEditOfficeUuid = '8C08CC5F55F74A9CB04261750BC60EF6';
    var currentDocSource = '';
    var currentDocIndex = 0;
    var currentEditOfficeUuid = '';
    var currentSuffix = '';
    var currentDocname = '';
    var currentReact = '0,60,1200,720';
    var newUuid = '';
    var handle = '';
	$scope.preView = function (uuid,docName,fileType,index,docSource) {

			//可编辑表单当前index & uuid
			currentDocSource = docSource;
			currentDocIndex = index;

			if(fileType == 'doc' || fileType == 'docx') {
				$scope.isDoc = true;
			}

            //$scope.isDoc = true;
            $scope.isEdit = false;
            currentEditOfficeUuid = uuid;
            currentSuffix = docName.split('.')[docName.split('.').length -1];
            currentDocname = docName;
            console.log('currentEditOfficeUuid',currentEditOfficeUuid,currentReact);
            
			var data ={fileName:docName,uuid:uuid};
        	Manage.getTrendsFileViewUrl(data).then(function (result) {
        		console.log(typeof result)
        		$scope.isPreview = true;
        		$scope.previewUrl = $sce.trustAsResourceUrl(result);
          //       console.log('scope.previewimg1', $scope.previewimg1);
                // layer.open({
                //         type: 2,
                //         //skin: 'layui-layer-lan',
                //         title: '预览',
                //         fix: false,
                //         shadeClose: true,
                //         maxmin: true,
                //         area: ['1000px', '500px'],
                //         content: $scope.previewimg1
                //     });
            },function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.message);
            });
    }
    //窗口发生变化传给pc对应的边距及高度
    $(window).resize(function(){
	    //alert(('.edit-office').innerWidth);
	  	var editLeft = document.getElementById("edit-office").offsetLeft;
	  	var editHeight = $(document.body).height() - 60 - 60;
	  	//分别对应edit-office div 对应的 left top width height
	  	currentReact = editLeft + ',60,1200,' + editHeight;

	    $scope.$apply(function(){
	       //do something to update current scope based on the new innerWidth and let angular update the view.
	    });
	});
  
  	//pc编辑表单对接
    $scope.editOffice = function () {
        $scope.isEdit = true;
       	console.log('currentReact',currentReact);
       	debugger
        var editResult = BimCo.EditOffice(currentEditOfficeUuid,currentSuffix,currentReact);
        //编辑失败返回预览界面
        if(!editResult){
        	alert('下载文档失败');
        	$scope.isEdit = false;
        	$scope.isPreview = true;
        }

    }

    $scope.saveOffice = function () {
        $scope.isPreview =false;
        //获取新的uuid
        //newUuid =  BimCo.SaveOffice(currentEditOfficeUuid,currentSuffix,currentDocname);
        newUuid =  'maolili'
        //判断pc时候保存成功，success -> newUuid,false -> ''

        if(!newUuid){
        	alert('编辑文件保存失败');
        	$scope.isEdit = false;
        	$scope.isPreview = true;
        } else {
        	alert('编辑文件保存成功');
        	//返回协作创建页面
        	$scope.isPreview = false;
        	if(currentDocSource == 'docSelectedList') {
        		$scope.docSelectedList[currentDocIndex].uuid = newUuid;
        	} else if (currentDocSource == 'formSelectedList') {
        		$scope.formSelectedList[currentDocIndex].uuid = newUuid;
        	}

        }

    }
    $scope.cancelEditOffice = function () {
        $scope.isEdit = false;
        BimCo.CancelEditOffice(currentEditOfficeUuid,currentSuffix);
    }

    $scope.backDetail = function () {
    	$scope.isPreview = false;
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
		Cooperation.getDeptList().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
		});

		//默认联系人列表 deptId = 1
		Cooperation.getUserList({'deptId':1,'searchText':''}).then(function (data) {
			$scope.userList = data;
			console.log('346',data);
		});

		//切换项目部切换联系人
		$scope.switchUsers = function (params) {
			var deptId = params.deptId;
			Cooperation.getUserList({'deptId':deptId,'searchText':''}).then(function (data) {
				$scope.userList = data;
			});
		}

		//选择负责人--搜索功能
		$scope.responsibleSearch = function (e) {
			if($scope.queryForm) {
				var deptId = $scope.selectedOption.deptId;
				Cooperation.getUserList({'deptId':deptId,'searchText':''}).then(function (data) {
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
				Cooperation.getUserList({'deptId':deptId,'searchText':''}).then(function (data) {
					$scope.userList = data;
				});
				$(".every-list").find(".sub-nav").css("display",'none');
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
		}

		//选中的相关人
		var temp = _.cloneDeep(items);
		if(temp.sign){
			var a = temp.sign.concat(temp.noSign);
			//a = _.uniqBy(a, 'username');
			console.log('a',a);
		}
		
		$scope.relatedSelected = a ? a : [];

		$scope.addRelated = function (id, pid, current,$event) {
			$scope.relatedSelected.push(current);

			//数组去重
			var unique = _.uniqBy($scope.relatedSelected, 'username');
			$scope.relatedSelected = unique;
			console.log($scope.relatedSelected);


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
        	//debugger;
        	//console.log(signSelected.indexOf(id));
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