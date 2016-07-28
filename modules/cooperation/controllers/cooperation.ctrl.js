'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation) {
    //选择负责人
    $scope.selectResponsible = function () {
    	//alert('111');
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_responsible.html',
    		controller:'selectpersonCtrl'
    	});
    	modalInstance.result.then(function (selectedItem) {
    		$scope.responsiblePerson = selectedItem;
    	});
    }
    //选择相关人
    $scope.selectRelated = function () {
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_related.html',
    		controller:'selectpersonCtrl'
    	});
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
       
}]).controller('selectpersonCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	function ($scope, $http, $uibModalInstance,Cooperation) {
		//选择负责人,联系人
		//设置默认值
		$scope.selectedOption = {};
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.userList = [];

		$scope.responsiblePerson = {};

		//获取项目部
		Cooperation.getDeptInfo().then(function (data) {
			console.log(data);
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
		});


		$http.get('a.json').then(function (data) {
			console.log(data.data)
			$scope.userList = data.data;
		});

		//切换项目部切换联系人
		$scope.switchUsers = function (params) {
			var deptId = params.deptId;
			Cooperation.getUserList(deptId).then(function (data) {
				$scope.userList = data;
			});
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
			//console.log();
		}

		//选择负责人点击确定按钮
		$scope.ok = function () {
			$uibModalInstance.close($scope.responsiblePerson);
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
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

		$scope.changeStaus1 = function(id, pid, user) {
			$scope.relatedSelected = [];
			$scope.relatedSelected.push(user);
		}
		console.log($scope.relatedSelected);


		
}]).controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$stateParams',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$stateParams) {
  		//根据ui-sref路由拿到对应的coid
	   	var coid = $stateParams.coid;
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		console.log(data);
	   		$scope.collaList = data;
	   	});
	   	//移动端交互
	   	$scope.downImg = function () {
	   		sendCommand(3,coid);
	   	}

	   	$scope.checkModel = function () {
	   		sendCommand(1,coid);
	   	}

	   	$scope.zoom = function () {
	   		sendCommand(2,coid);
	   	}

	 	//     function sendCommand(optType,id){
		//     var param = "{"+ "\"optType\":"+optType+",\"id\":\""+id + "\"}";
		//     //document.location = "http://bv.local?param=" + param;
		//     var a  = "http://bv.local?param=" + param;
		//     alert(a);
		// }

		function sendCommand(optType,id){

		    var param = '{"optType":'+optType+',"coid":"'+id
		    if(optType==2||optType==3||optType==5){
				param = param +'","fileUUID":"1000'
		    }
		    param = param + '"}';
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