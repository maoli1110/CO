'use strict';
/**
 * 新建协作
 */
angular.module('cooperation').controller('newcoopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Common','Manage','$sce','alertService','headerService','$timeout',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Common,Manage,$sce,alertService,headerService,$timeout) {
    //默认值
    var modalInstance;
    var popStateNum=0;
    var binds = [];//bind的工程
    var productId = $stateParams.productId?$stateParams.productId:'';
	$scope.typeName = $stateParams.typename;
	//console.log($stateParams.typename,'$stateParams.typeid')
    $scope.isDoc = false; //是否是doc
    $scope.priority = '1'; //优先级
    $scope.flag = {};
    $scope.linkOpenSignal = true; 
    $scope.linkProject1 =false;
    $scope.linkComponent1 = false;
    $scope.linkCategoty1 =false;
    $scope.linkProjectClick =false;
    $scope.linkComponentClick = false;
    $scope.linkCategotyClick =false;
    $scope.data = {};
    $scope.link = {};
    $scope.desc = '';
	$scope.isClick = true;//启用编辑按钮是否被按下
	$scope.responsiblePerson = {};//重组负责人
	$scope.createUser = {};
	$scope.beStates = false ;//be的选择状态
	$scope.data.bindType = 0; //默认没有选中工程
	$scope.link.linkProjectName ='';
	$scope.link.linkProjectDeptName='';

    if($stateParams.deptId && $stateParams.deptId!=-1&&$stateParams.deptId!=0){
    	var currentdeptId = $stateParams.deptId?$stateParams.deptId:'';
    	var currentppid  = $stateParams.ppid?$stateParams.ppid:'';
		// $scope.data.deptId = $stateParams.deptId?$stateParams.deptId:'';
		// $scope.data.ppid = $stateParams.ppid?$stateParams.ppid:'';
		$scope.link.linkProjectName = $stateParams.ppidName?$stateParams.ppidName:'';
		$scope.link.linkProjectDeptName = $stateParams.deptName?$stateParams.deptName:'';
    }

	headerService.currentUserInfo().then(function(data){
		if(data.realname){
			$scope.responsiblePerson.username = data.userName;
			$scope.responsiblePerson.realname = data.realname;
		} else {
			$scope.responsiblePerson.username = data.userName;
			$scope.responsiblePerson.realname = data.userName;
		}
		$scope.responsiblePerson.avatar = data.avatarUrl;
		$scope.createUser = $scope.responsiblePerson;
		var relateUser = {};
		relateUser.username = data.userName;
		relateUser.avatar = data.avatarUrl;
		relateUser.mustExist = true;
		relateUser.canSign = true;
		relateUser.realname = data.realname;
		$scope.related.noSign[0]=relateUser;
	})
	
	Array.prototype.del=function(n) {
		if(n<0)
			return this;
		else
			return this.slice(0,n).concat(this.slice(n+1,this.length));
	};

	function restrom(){
		$('#w-middle').css('display','inline-block');
		$('#w-max').css('display','none');
		$('#w-middle2').css('display','inline-block');
		$('#w-max2').css('display','none');
		$('#w-middle-inner').css('display','inline-block');
		$('#w-max-inner').css('display','none');
	}
	var  status = BimCo.GetWindowStatus();
	if(status){
		$timeout(function(){
			restrom()
		},100)
	}
	if($scope.link.linkProjectName && currentppid){
		$scope.data.deptId = $stateParams.deptId?$stateParams.deptId:'';
		$scope.data.ppid = $stateParams.ppid?$stateParams.ppid:'';
		$scope.data.bindType = 1;
		binds[0] = {ppid:currentppid,projType:currentdeptId};
	}

    //选择负责人
    $scope.selectResponsible = function () {
    	modalInstance = $uibModal.open({
			windowClass: 'select-person-responsible-modal',
    		backdrop : 'static',
			animation:false,
    		templateUrl: 'template/cooperation/select_person_responsible.html',
    		controller:'selectpersonCtrl',
    		resolve:{
    			items: function () {
    				return [];
    			}
    		}
    	});
    	modalInstance.result.then(function (selectedItem) {
    		var responsiblePersonName = $scope.responsiblePerson.username;
    		//如果选择的用户和负责人一样，什么都不做
    		if(responsiblePersonName == selectedItem.username) {
    			return;
    		}
    		//查询原先负责人在相关人中的位置
    		var signIndex = null;
    		var noSignIndex = null;
    		for(var i = 0;i < $scope.related.sign.length;i++) {	
    			if($scope.related.sign[i].username == responsiblePersonName){
    				signIndex = i;
    				break;
    			}
    		}
    		for(var i = 0;i < $scope.related.noSign.length;i++) {	
    			if($scope.related.noSign[i].username == responsiblePersonName){
    				noSignIndex = i;
    				break;
    			}
    		}
    		
			//如果相关人里面有选择的用户，需要把原先的负责人删除
    		for(var i = 0;i < $scope.related.sign.length;i++) {	// TODO
				if($scope.related.sign[i].username == selectedItem.username){
		    		if((signIndex != null) && (responsiblePersonName != $scope.createUser.username)){
		    			$scope.related.sign = $scope.related.sign.del(signIndex);
		    		}
		    		if(noSignIndex != null && (responsiblePersonName != $scope.createUser.username)){
		    			$scope.related.noSign = $scope.related.noSign.del(noSignIndex);
		    		}
					$scope.responsiblePerson = selectedItem;
					return;
				}
			}
			
			for(var i = 0;i < $scope.related.noSign.length;i++) {
				if($scope.related.noSign[i].username == selectedItem.username){
					if(signIndex != null){
						$scope.related.sign = $scope.related.sign.del(signIndex);
		    		}
		    		if(noSignIndex != null){
		    			$scope.related.noSign = $scope.related.noSign.del(noSignIndex);
		    		}
					$scope.responsiblePerson = selectedItem;
					return;
				}
			}
    		
			for(var i = 0;i < $scope.related.sign.length;i++) {	// TODO
				if(($scope.related.sign[i].username == responsiblePersonName)&&(responsiblePersonName != $scope.createUser.username)){
					$scope.related.sign[i] = selectedItem;
					$scope.responsiblePerson = selectedItem;
					return;
				}
				
			}
			
			for(var i = 0;i < $scope.related.noSign.length;i++) {
				if(($scope.related.noSign[i].username == responsiblePersonName)&&(responsiblePersonName != $scope.createUser.username)){
					$scope.related.noSign[i] = selectedItem;
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
    	modalInstance = $uibModal.open({
			windowClass: 'select-person-related-modal',
    		backdrop : 'static',
			animation:false,
			size:'lg',
    		templateUrl: 'template/cooperation/select_person_related.html',
    		controller:'selectpersonCtrl',
    		resolve:{
    			items: function () {
    				for(var i=0;i<$scope.related.sign.length;i++){
    					if($scope.related.sign[i].username == $scope.responsiblePerson.username){
    						$scope.related.sign[i].mustExist = true;
    					}
    					$scope.related.sign[i].canSign = true;
    				}
    				for(var i=0;i<$scope.related.noSign.length;i++){
    					if($scope.related.noSign[i].username == $scope.responsiblePerson.username){
    						$scope.related.noSign[i].mustExist = true;
    					}
    					$scope.related.noSign[i].canSign = true;
    				}
    				return $scope.related;
    			}
    		}
    	});
    	modalInstance.result.then(function (selectedItem) {
    		$scope.related.noSign = selectedItem.noSign;
    		$scope.related.sign = selectedItem.sign;
    		contracts = [];
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
    	$scope.mark = $scope.markerList[0].markerId+'';
    	if(data[0].markerId){
            $timeout(function() {
                $('.selectpicker1').selectpicker({
                    style: '',
                    size: 'auto'
                });
            },0);
         }
    });

    //与工程关联
    var deptId;
	function isDelete(num){
		if($scope.linkProject1 ||$scope.linkComponent1 ||$scope.linkCategoty1||$scope.link.linkProjectName){
			layer.confirm('您已关联的模型,是否重新关联？', {
				btn: ['是','否'], //按钮
				move:false
			}, function(){
				layer.closeAll();
				if($scope.linkProjectClick ){
					modalInstance = $uibModal.open({
						windowClass: 'link-project-modal',
						backdrop : 'static',
						animation:false,
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
						console.info('dataList.assembleLps',dataList.assembleLps)
						$scope.data.ppid = dataList.assembleLps[0].ppid;
						$scope.data.deptId = dataList.parentNode.value;
						//获取productId
						productId = dataList.productId;
						// alert(productId+'productId')
					});
				}else if($scope.linkComponentClick ){
					modalInstance = $uibModal.open({
						windowClass:'link-component-modal',
						backdrop : 'static',
						animation:false,
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
						//获取productId
						productId = dataList.productId;
						// alert(productId+'productId')
					});
				}else if($scope.linkCategotyClick){
					modalInstance = $uibModal.open({
						windowClass:'link-categoty-modal',
						backdrop : 'static',
						animation:false,
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
						//获取productId
						productId = dataList.productId;
						// alert(productId+'productId')
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
					animation:false,
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
					//获取productId
					productId = dataList.productId;
					// alert(productId+'productId')
				});
			}else if(num ==2){
				modalInstance = $uibModal.open({
					windowClass:'link-component-modal',
					backdrop : 'static',
					animation:false,
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
					//获取productId
					productId = dataList.productId;
				});
			}else if(num ==3){
				modalInstance = $uibModal.open({
					windowClass:'link-categoty-modal',
						backdrop : 'static',
						animation:false,
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
					//获取productId
					productId = dataList.productId;
					// alert(productId+'productId')
				});
			}
		}
	}
    $scope.linkProject = function () {
    	$scope.linkProjectClick =true;
        $scope.linkComponentClick = false;
        $scope.linkCategotyClick =false;
		isDelete(1);
    }
    //与图上构件关联
    $scope.linkComponent = function () {
    	$scope.linkProjectClick =false;
        $scope.linkComponentClick = true;
        $scope.linkCategotyClick =false;
		isDelete(2);
    }
    //与图上构件类别关联
    $scope.linkCategoty = function () {
    	$scope.linkProjectClick =false;
        $scope.linkComponentClick = false;
        $scope.linkCategotyClick =true;
		isDelete(3);
    }
    //删除关联
    $scope.removeLink = function () {
		if($scope.link.linkProjectName) {
			layer.confirm('您已关联了模型，是否删除关联？', {
				btn: ['是','否'] ,//按钮
				move:false
			}, function(){
				$scope.linkProject1 = false;
				$scope.linkComponent1 = false;
				$scope.linkCategoty1 =false;
				$scope.link.linkProjectName = false;
				$scope.data = {};
				$scope.data.bindType = 0;
				binds = [];
				layer.closeAll();
				$scope.$apply();
			});
		}
    }

	$scope.docSelectedList =[]; 	//本地上传文件
	$scope.formSelectedList = [];	//表单上传
	var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
	//引用BE资料

	$scope.linkBe = function () {
		//popStateNum++;
		$scope.beStates = false;
		$('.new-mask').hide();
		notScroll();
		$scope.beSourceType = 1;
		$scope.flag.isleast = false;
			modalInstance = $uibModal.open({
			windowClass: 'link-be-modal',
			backdrop : 'static',
			animation:false,
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
		//popStateNum++;
		$scope.beStates = false;
		$('.new-mask').hide();
		notScroll()
		$scope.formSourceType = 2;
		$scope.flag.isleast = false;
		    modalInstance = $uibModal.open({
			windowClass: 'link-form-modal',
			backdrop : 'static',
			animation:false,
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
            url: basePath + 'fileupload/upload.do'
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
            	if(!$scope.flag.pictrueRepeatMind){
            		layer.alert('上传照片不能多于30个！', {
            		  	title:'提示',
					  	closeBtn: 0,
						move:false
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
    		 url: basePath + 'fileupload/upload.do'
    		// queueLimit:30
    });
    //FILTERS
    uploader1.filters.push({
    	name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            docsUploadList.push(item);
			popStateNum++;
            if(docsUploadList.length > 30){
            	if(!$scope.flag.docsRepeatMind){
            		layer.alert('上传资料不能多于30个！', {
					   	closeBtn: 0,
						move:false
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
		$scope.beStates = false;
		$('.new-mask').hide();
		notScroll();
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
	function notScroll(){
		$(".new-mask").css('display','none');
		$('body').css('overflow','')
	}

	$scope.popBoxState=function () {
		$scope.beStates = true;
		$(".new-mask").css('display','block');
		$('body').css('overflow','hidden')
	}

	$(".new-mask").click(function(){
		$scope.beStates = false;
		notScroll();
		$(this).hide();
		$scope.$apply();
	})

	//监听描述的状态
	$scope.changeDesc = function(){
		// 描述字符控制
		$scope.flag.descToLong = false;
	}

	var docsList = []; //组合doclist
	var uploadPictureList = []; //上传照片list
	var uploadDocList = [];		//上传资料list
	var onCompleteAllSignal = false; //是否上传成功signal
	var uploadErrorSignal = false; //是否上传成功signal
	
	uploader.onAfterAddingFile  = function(fileItem) {
		var errorMessage='';
		if(fileItem.file.size <=0){
			errorMessage = "文件错误，不能上传！";
		}
		if(fileItem.file.size >=50000000){
			errorMessage = "文件大小超过50M限制！";
		}
		if(errorMessage){
			fileItem.remove();
			layer.alert(errorMessage, {
				title:'提示',
				closeBtn: 0,
				move:false
			});
		}
	}
	
	uploader1.onAfterAddingFile  = function(fileItem) {
		var errorMessage='';
		if(fileItem.file.size <=0){
			errorMessage = "文件错误，不能上传！";
		}
		if(fileItem.file.size >=50000000){
			errorMessage = "文件大小超过50M限制！";
		}
		if(errorMessage){
			fileItem.remove();
			layer.alert(errorMessage, {
				title:'提示',
				closeBtn: 0,
				move:false
			});
		}
	}
	
	//协作保存
	/**
	 * @param  {[status]} 0-草稿箱 1 提交
	 */
	$scope.save = function (status) {
		var desc = $("#desc").val();
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
		//上传成功之后调用更新对UI
		function updateUploadList (response,uploaderSource) {
			if(response[0].type != "error") {
   				var unit = {};
	            unit.name = response[0].result.fileName;
	            unit.md5 = response[0].result.fileMd5;
	            unit.size = response[0].result.fileSize;
	            unit.uuid = response[0].result.uuid;
	            if(uploaderSource == 'uploader1'){
	            	unit.sourceType = 3;
	            	uploadDocList.push(unit);
	            } else {
	            	uploadPictureList.push(unit);
	            }
   			} else {	// 提交失败 弹框提示
   				layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: true,
                    skin: 'yourclass',
					move:false,
                    content: '<div class="tips">'+response[0].info+'</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
                  });
       			return;
   			}
		}

		var createindex = layer.load(1, {
			shade: [0.5,'#000'] //0.1透明度的黑色背景
		});
		uploader.onErrorItem = function (item, response, status, headers){
			layer.closeAll();
			$timeout(function(){
				if(!uploadErrorSignal){
					layer.alert("网络错误，上传失败，请重新上传！", {
	        		  	title:'提示',
					  	closeBtn: 0,
						move:false
					});
			        uploader.cancelAll();
			        uploader.clearQueue();
			        uploader1.cancelAll();
		        	uploader1.clearQueue();
			        uploadErrorSignal = true;
		        }
			},1000)
	    }
     	uploader1.onErrorItem = function (item, response, status, headers){
     		layer.closeAll();
     		$timeout(function(){
				if(!uploadErrorSignal){
		     		layer.alert("网络错误，上传失败，请重新上传！", {
	        		  	title:'提示',
					  	closeBtn: 0,
						move:false
					});
	     			uploader.cancelAll();
			        uploader.clearQueue();
		        	uploader1.cancelAll();
		        	uploader1.clearQueue();
		        	uploadErrorSignal = true;
	     		}
			},1000)
        }
		//上传分4种情况，照片和资料(2*2)
		if(uploader.queue.length && uploader1.queue.length) {
   			uploader.uploadAll();
	   		//每个上传成功之后的回调函数
	   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
		           updateUploadList(response,'uploader');
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
				//上传全部
		   	 	uploader1.uploadAll();
		   		//每个上传成功之后的回调函数
		   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
			            updateUploadList(response,'uploader1');
				};
				//全部成功的回调函数
				uploader1.onCompleteAll = function() {
		            onCompleteAllSignal = true;
		        };
	        };
	        
	    }

	    if( uploader.queue.length && !uploader1.queue.length) {
   			uploader.uploadAll();
	   		//每个上传成功之后的回调函数
	   		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			//console.info('onSuccessItem', fileItem, response, status, headers);
		   			updateUploadList(response,'uploader');
			};
			//全部成功的回调函数
			uploader.onCompleteAll = function() {
	            onCompleteAllSignal = true;
	        };
	       

	    }
	    if( !uploader.queue.length && uploader1.queue.length) {
   			uploader1.uploadAll();
	   		//每个上传成功之后的回调函数
	   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
			//console.info('onSuccessItem', fileItem, response, status, headers);
	   				updateUploadList(response,'uploader1');
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
	    	if(onCompleteAllSignal == true && uploadErrorSignal == false){
	    		
	    		clearUploadInterval();
	    		//alert('onCompleteAllSignal',onCompleteAllSignal);
	    		saveCooperation();
	    	} else if(uploadErrorSignal == true) {
	    		clearUploadInterval();
	    		uploadErrorSignal = false;
	    	}
	    },100);
	    //清除轮询
	    function clearUploadInterval() {
	    	clearInterval(checkUploadInterval);
	    }
        function saveCooperation () {
        	var backJson = BimCo.SubmitAll();
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
						var modifys = [];
						angular.forEach(backJson,function(value1, key1){
							if(!value1){
								return;
							}
		        			if(key1 == value.uuid){
		        				var i = 0;
		        				for(i = 0; i < value1.PdfModify.length; i++)
		        				{
		        					modifys.push(value1.PdfModify[i]);
		        				}
		        			}
		        		});
	        	}
	        	a.modifys = modifys;
				a.md5 = value.filemd5;
				a.name = value.docName;
				a.needSign = false;
				a.uuid = value.uuid;
				a.size = value.filesize;
				a.sourceType = $scope.beSourceType;
				docSelectedList1.push(a);
			});
			angular.forEach($scope.formSelectedList, function(value, key){
				var a= {};
				if(backJson){
					var modifys = [];
					angular.forEach(backJson,function(value1, key1){
						if(!value1){
							return;
						}
	        			if(key1 == value.uuid){
	        				var i = 0;
	        				for(i = 0; i < value1.PdfModify.length; i++)
	        				{
	        					modifys.push(value1.PdfModify[i]);
	        				}
	        			}
	        		});
	        	}
	        	a.modifys = modifys;
				a.md5 = value.md5;
				a.name = value.name +'.'+value.suffix;
				a.needSign = true;
				a.uuid = value.uuid;
				a.size = value.size;
				a.sourceType = $scope.formSourceType;
				formSelectedList1.push(a);
			});
			docsList = docSelectedList1.concat(formSelectedList1, uploadDocList);

			if($scope.data.bindType == 2) {
				binds = [];
			} else {
				binds = $scope.data.assembleLps?$scope.data.assembleLps:binds;
			}

			$scope.data = {
		    	binds:binds,
		    	bindType: $scope.data.bindType,
		    	collaborator: $scope.responsiblePerson.username,
		    	contracts: contracts,
		    	deadline: dt,
		    	deptId: $scope.data.deptId,
		    	desc: desc,
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
				layer.close(createindex);
				var coid = data;
				if(status==0){
					$scope.data.deptId = 0;
					layer.msg('协作存入草稿箱成功！',{time:3000});
				}else if(status==1){
					if(!binds.length && $scope.data.bindType !== 2){
						$scope.data.deptId = -1;
					}	
					layer.msg('创建协作成功',{time:3000});
				}
				sessionStorage.clear();
				$state.go('cooperation',{'deptId':$scope.data.deptId, 'ppid':$scope.data.ppid,'source':'rember'},{ location: 'replace'});
				// $state.go('cooperation',{'transignal':$scope.data.deptId},{ location: 'replace'});
				//上传之后将coid传给客户端
				if($scope.data.bindType == 2){
					BimCo.UpLoadComponent(coid);
				}
				//创建成功一条协作，通知客户端
				if(productId && (typeof(productId) == 'number')){
					productId = productId + '';
				}
				BimCo.CreateCoSucceed(productId);
			},function(data) {
				layer.close(createindex);
				$scope.flag.beginCreate = false;
				obj =  JSON.parse(data);
				layer.alert(obj.message, {
        		  	title:'提示',
				  	closeBtn: 0,
					move:false
				});
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
    var handle = '';
	$scope.isTypePdf = false;;//判断是不是PDF格式的文件
	$scope.preView = function (uuid,docName,fileType,index,docSource) {
			//可编辑表单当前index & uuid
			currentEditOfficeUuid = uuid;
			currentDocname = docName;
			currentDocSource = docSource;
			currentDocIndex = index;
            if(fileType=='pdf'){
            	var createindex = layer.load(1, {
					shade: [0.5,'#000'] //0.1透明度的黑色背景
				});
            	//pdf签署（客户端）
           		var coid = '';
           		var editResult = BimCo.PdfSign(currentEditOfficeUuid,currentSuffix,currentReact,coid);
		        //编辑失败保持在新建页面，不做操作
		        if(!editResult){
		        	//调用客户端失败取消加载层
					layer.close(createindex);
		        	return;
		        }
		        //调用客户端成功则取消加载层，执行跳转
		        layer.close(createindex);
        		$scope.flag.isPreview = true;
            	$scope.flag.isPdfsign = true;
            	$scope.flag.isGeneral = false;
				$scope.isTypePdf = true;
            	
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
					$scope.previewUrl ='';
					var obj = JSON.parse(data);
					layer.alert(obj.message, {
            		  	title:'提示',
					  	closeBtn: 0,
						move:false
					});
	            });
            }
    }

    //启用编辑
    $scope.CommentSign = function () {
		if($scope.isClick){
			$('.edit-material').css('color','#c5c5c5');
			$scope.isClick = false;
			BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
		}
    }
    //保存编辑
    $scope.saveOffice = function () {
    	var coid = "";
    	if(!BimCo.IsModify()){
	    	$scope.backCreate();
	    	return;
	    }
    	//提示框样式是否（0x34）
    	var rtn = BimCo.MessageBox("提示" ,"是否保存当前文档？", 0x31);
    	//确定1取消2
    	if(rtn==1){
    		var isSuccess =  BimCo.SignSubmit(coid);
	       	if(isSuccess){
	       		$scope.flag.isPreview = false;
	       	} else {
	       		$scope.flag.isPreview = false;
	       		var rtn = BimCo.MessageBox("提示" ,"保存失败！", 0);
	       	}
	       	$scope.isClick = true;
    	}

    }

    $scope.cancelEditOffice = function () {
    	if(!BimCo.IsModify()){
	    	$scope.backCreate();
	    	return;
	    }
	    var rtn = BimCo.MessageBox("提示" ,"放弃编辑？", 0x31);
	    //确定1取消2
	    if(rtn==1){
    		$scope.flag.isPreview = false;
    		BimCo.SignCancel();
    		$scope.isClick = true;
	    }
    }

    $scope.backCreate = function () {
    	if(!BimCo.IsModify()){
    		$scope.flag.isPreview = false;
	    	$scope.isClick = true;
	    	BimCo.SignCancel(); 
    	} else {
    		 var rtn = BimCo.MessageBox("提示" ,"放弃编辑？", 0x31);
    		 if(rtn==1){
	    		$scope.flag.isPreview = false;
	    		BimCo.SignCancel();
	    		$scope.isClick = true;
		    }
    	}
    }

    //最大化、最小化、还原、关闭
    //SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
    //窗口缩小
    $scope.minimize = function () {
        BimCo.SysCommand('SC_MINIMIZE');
    }

    //窗口放大还原
    $scope.max = true;
    $scope.maxRestore = function ($event) {
        //对接pc
        BimCo.SysCommand('SC_MAXIMIZE');
    }
	    
    //窗口关闭
    $scope.close = function () {
        BimCo.SysCommand('SC_CLOSE');
    }

    //取消创建
    $scope.cancelCreate = function () {
		//询问框
		 layer.confirm('是否取消？', {
		   btn: ['是','否'], //按钮
			 move:false
		 }, function(){
			layer.closeAll();
			BimCo.CancelSubmitAll();
			$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid,'source':'rember'},{ location: 'replace'});

		  });
    }

    //新建页面跳转回homepage(cooperation)
   	$scope.backCooperation = function (){
   		$state.go('cooperation',{'deptId':currentdeptId, 'ppid':currentppid, 'source':'rember'},{ location: 'replace'});
   	}

   	//反查formbe,跳转详情页面
   	var currentPage = 'create';
   	$scope.checkFromBe = function() {
   		var coid = $('#checkformbe').val();
   		if(currentPage == 'create'){
	    	 var rtn = BimCo.MessageBox("提示" ,"当前正在创建中，是否跳转？", 0x31);
	    	 //确定1取消2
	    	 if(rtn==1){
	    	 	if($scope.flag.isPdfsign){
	    	 		BimCo.SignCancel();
	    	 		BimCo.CancelSubmitAll();
	    	 		$state.go('coopdetail',{'coid':coid});
	    	 	} else {
	    	 		$state.go('coopdetail',{'coid':coid});
	    	 	}
	    	 	
	    	 }
   		}
   	}

   	//调用心跳机制
    Cooperation.heartBeat();
    //跳转新页面去除心跳机制
    $scope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){
			//console.log(toState, toParams, fromState);
            clearInterval(ApplicationConfiguration.refreshID);
            if(!!modalInstance){
                modalInstance.dismiss();
            }
    });

	//预览提示
	$scope.isNotPreview = function(){
		layer.msg('文件暂时不支持预览！',{time:2000});
	}


}]);