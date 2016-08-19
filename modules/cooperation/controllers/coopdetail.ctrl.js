'use strict';
/**
 * 协作详情
 */
angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams) {
		console.log(client.system.android);
		$scope.device = false;
		$scope.allowEdit = true;
		//页面按钮显示标志
		$scope.bjshow = true;
		$scope.tjshow = true;
		$scope.tgshow = true;
		$scope.jjueshow = true;
		$scope.jsshow = true;
		$scope.dchushow = true;

		//判断pc or bv
		if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
			$scope.device = true;
		}
		

		
		//根据ui-sref路由拿到对应的coid
	   	var coid = $stateParams.coid;
	   	$scope.transcoid = coid;
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		//console.log(data);
	   		$scope.collaList = data;
			//console.info(data)
			//是否编辑协作
			var statusReject = ['已结束','未通过','已通过','已拒绝'];
			if (statusReject.indexOf(data.status) != -1) {
				$scope.allowEdit = false;
				

			}
			//2.2.2	当当前用户为负责人但是不需要签字时
			if(data.isCollaborator && data.isSign == 0) {
				$scope.bjshow = true;
				$scope.tjshow = true;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = true;
				$scope.dchushow = true;
			}
			//2.2.3	当当前用户不是负责人但是需要签字时
			if(!data.isCollaborator && data.isSign == 0) {
				$scope.bjshow = false;
				$scope.tjshow = true;
				$scope.tgshow = true;
				$scope.jjueshow = true;
				$scope.jsshow = false;
				$scope.dchushow = true;
			}
			//2.2.4	当当前用户既不是负责人也不需要签字时
			if(!data.isCollaborator && data.isSign == 0) {
				$scope.bjshow = false;
				$scope.tjshow = true;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = false;
				$scope.dchushow = true;
			}
	   	});

	   	//编辑协作跳转
	   	 $scope.allowEditTrans = function () {
	   	 	if($scope.allowEdit) {
	   	 		$state.go('editDetail', {coid: coid});
	   	 	} else {
	   	 		var r=confirm("当前协作已结束，不允许再操作");
	   	 	}
	   	 }
	   	//pc端交互
	   	$scope.checkModelpc = function () {
	   		BimCo.LocateComponent('1000','57a08312807c61243202512a');
	   	}

	   	//移动端交互
	   	$scope.checkModel = function () {
	   		sendCommand(1,coid);
	   	}

	   	$scope.zoom = function (uuid) {
	   		sendCommand(6,coid,uuid);
	   	}

	   	$scope.docsOpen = function (uuid) {
	   		sendCommand(5,coid,uuid);
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

		//侧边栏获取动态列表
		var getOperationList = function () {
			Cooperation.getOperationList(coid).then(function (data) {
				console.log('right',data)
				$scope.operationList = data;
			});
		}
		getOperationList();

		//侧边栏划出效果
		//debugger;
	  	$(".btn_box").css("right","0");
	  	$(".content_right").css("right","-260px");
	  	$(".btn_box").click(function(){
		  	$(".show_btn").toggleClass("glyphicon-menu-left")
		  	//toggleClass增加一个class
			//通过判断这个class的状态来决定是开操作还是关操作
	    	$(".content_right").toggleClass("menus");
	    	if($(".content_right").hasClass("menus")){
	    		$(".btn_box").animate({right:"260px"})
	    		$(".content_right").animate({right:"0"})
				$(".glyphicon-menu-right").show();

	    	}else{
	    		 $(".btn_box").animate({"right":"0"});
		         $(".content_right").animate({"right":"-260px"});
				$(".glyphicon-menu-right").hide();
	    	}
		  });

	  	//更新评论
        $scope.updateComment = function () {
            console.log('coid', coid);
            var trans = {};
            trans.coid = coid;
            var modalInstance = $uibModal.open({
                backdrop : 'static',
                templateUrl: 'template/cooperation/updatecomment.html',
                controller:'updatecommentCtrl',
                resolve:{
                    items: function () {
                        return trans;
                    }
                }
            });
            modalInstance.result.then(function () {
                $state.reload();
            });
        }

		//手机端页面侧边栏划出效果
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			//    详情页面图片资料悬浮出现下载区域
			$(".action .picInfo .data-list .deta-down ").hover(function () {
				$(this).find(".show-icon").stop().animate({"bottom":"-1px"})
			},function(){
				$(this).find(".show-icon").stop().animate({"bottom":"-38px"})
			});
		    //	详情页面的照片悬浮出现预览功能
			$(".detail-sear").hover(function(){
				$(this).find(".detail-search").stop().animate({"bottom":"-1px"})
			},function(){
				$(this).find(".detail-search").stop().animate({"bottom":"-38px"})
			})
		////	手机端照片搜索按钮的显示
		//	$(".means-down").click(function(){
		//		console.info(123)
		//		//$(this).find(".means-address").slideUp()
		//	})
		})
			//play-audio(播放声音的显示播放窗口事件)
		$(".play-audio").click(function(){
			//console.info(123)
			$(".detail-voice").slideToggle();
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


}]).controller('updatecommentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items','Common','FileUploader',
    function ($scope, $http, $uibModalInstance,Cooperation,items,Common,FileUploader) {
    	//详情展示页添加更新
    	 var coid = items;
    	 var date = Common.dateFormat(new Date());

    	//上传资料
	    var uploader1 = $scope.uploader1 = new FileUploader({
	    		url: 'upload.php',
	    		queueLimit:5
	    });

	    //FILTERS
	    uploader1.filters.push({
	    	name: 'customFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	            return this.queue.length < 10;
	        }
	    });

	    //点击上传资料按钮
	    $scope.docsUpload = function () {
	    	$('.upload-docs').attr('uploader', 'uploader1');
	    	$('.upload-docs').attr('nv-file-select', '');
	    	$('.upload-docs').click();
	    }

       	$scope.ok = function() {
       	 	var data = {
    	 	coid: items.coid,
    	 	comment: {
    	 		comment: $scope.comment, /*内容*/
    	 		commentator:'', /*评论人后端接口没给*/
    	 		date:date,	/*评论时间*/
    	 		// docs:[],	/*文件列表*/
    	 		// coSpeech:'' /*整改录音*/
	    	 	}
	    	}
    		Cooperation.commentToCollaboration(data).then(function (data) {
    			console.log('1111');
    		});
    		$uibModalInstance.close();
    	}

    	 $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }


	    
}]);