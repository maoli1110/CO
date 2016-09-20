'use strict';
/**
 * updatecommentCtrl
 */
angular.module('cooperation').controller('updatecommentCtrl',['$rootScope','$scope', '$http', '$uibModalInstance','Cooperation','items','Common','FileUploader','$timeout',
    function ($rootScope,$scope, $http, $uibModalInstance,Cooperation,items,Common,FileUploader,$timeout) {
    	var onCompleteAllSignal = false;
    	$scope.uploadBegin = false;
    	$scope.zhenggai = false;
    	$scope.status = items.status;
		switch ($scope.status) {
			case '空':
				$scope.status = '11';
				break;
			case '已整改':
				$scope.status ='1' ;
				break;
			case '整改中':
				$scope.status = '2';
				break;
			case '不整改':
				$scope.status = '3';
				break;
			case '待整改':
				$scope.status = '4';
				break;
			case '未整改':
				$scope.status = '5';
				break;
		}
		//如果是问题整改则显示状态
		var isShowArr = ["已结束","已通过","已通过","进行中"];
		//debugger
		if(isShowArr.indexOf($scope.status) == -1) {
			$scope.zhenggai = true;
			$(".detail-state").show();
		} else if( coTypeVo === 1) {
			$scope.zhenggai = true;
			$(".detail-state").show();
		}else{
			$(".detail-state").hide();
		}
		//switch($scope.status){
		//	case "已结束":
		//		$scope.zhenggai = false;
		//		break;
		//	case "已通过":
		//		$scope.zhenggai = false;
		//		break;
		//	case "已拒绝":
		//		$scope.zhenggai = false;
		//		break;
		//}
    	//详情展示页添加更新
    	var coTypeVo = items.coTypeVo;
    	var date = Common.dateFormat1(new Date());
    	var uploadList = [];



    	//上传资料
	    var uploader1 = $scope.uploader1 = new FileUploader({
	    		url: '/bimco/fileupload/upload.do'
	    });

	    //FILTERS
	    uploader1.filters.push({
	    	name: 'customFilter',
	        fn: function(item /*{File|FileLikeObject}*/, options) {
	            return this.queue.length < 31;
	        }
	    });

	    //点击上传资料按钮
	    $scope.docsUpload = function () {
	    	$('.upload-docs').attr('uploader', 'uploader1');
	    	$('.upload-docs').attr('nv-file-select', '');
	    	$('.upload-docs').click();
	    }

       	$scope.ok = function() {
			$scope.status = parseInt($scope.status);
       		var data = {
    	 	coid: items.coid,
    	 	comment: {
    	 		comment: $scope.comment, /*内容*/
    	 		commentator:'', /*评论人后端接口没给*/
    	 		commentTime:date,	/*评论时间*/
    	 		docs: [],	/*文件列表*/
    	 		// coSpeech:'' /*整改录音*/
	    	 	},
	    	 	status: $scope.status
	    	}

	    	//0.全部上传
	    	//1.上传回调给uploadList赋值
	    	//2.每次上传回调给赋值
	    	//点击确定保存图片和评论文字，去主页面调用更新评论reload详情页面
	    
		if(uploader1.queue.length) {
			$scope.uploadBegin = true;
   			uploader1.uploadAll();
   		} else {
   			$uibModalInstance.close(data);
   		}
   		//每个上传成功之后的回调函数
   		uploader1.onSuccessItem = function(fileItem, response, status, headers) { 
	            console.info('onSuccessItem', fileItem, response, status, headers);
	            var unit = {};
	            unit.name = response[0].result.fileName;
	            unit.md5 = response[0].result.fileMd5;
	            unit.size = response[0].result.fileSize;
	            unit.uuid = response[0].result.uuid;
	            unit.suffix = response[0].result.suffix;
	            uploadList.push(unit);
		};
		//全部成功的回调函数
		uploader1.onCompleteAll = function() {
            onCompleteAllSignal = true;
            data.comment.docs = uploadList;
            if(uploader1.progress == 100) {
        
            	$uibModalInstance.close(data);
            }
            
        };

    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
	    
}]);