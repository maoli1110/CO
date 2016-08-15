'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$stateParams',
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

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			//    详情页面图片资料悬浮出现下载区域
			$(".action .picInfo .data-list .deta-down ").hover(function () {
				$(this).find(".show-icon").stop().animate({"bottom":"-1px"})
			},function(){
				$(".show-icon").stop().animate({"bottom":"-38px"})
			});
		    //	详情页面的照片悬浮出现预览功能

		})
	 
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