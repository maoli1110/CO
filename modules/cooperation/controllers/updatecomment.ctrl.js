'use strict';
/**
 * updatecommentCtrl
 */
angular.module('cooperation').controller('updatecommentCtrl',['$rootScope','$scope', '$http', '$state','$uibModalInstance','Cooperation','items','Common','FileUploader','$timeout',
    function ($rootScope,$scope, $http, $state,$uibModalInstance,Cooperation,items,Common,FileUploader,$timeout) {
    	var onCompleteAllSignal = false;
    	$scope.uploadBegin = false;
    	$scope.zhenggai = false;
    	$scope.status = items.status;
		$scope.isUpdataOK = false;

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
		var coTypeVo = items.coTypeVo;	// coTypeVo === 1 问题整改
		var isShowArr = ["已结束","已通过","已拒绝"];
		// 只有状态是问题整改且不是已结束、已通过、已拒绝状态 才显示状态
		if(coTypeVo === 1 && isShowArr.indexOf($scope.status) == -1) {	// isShowArr中不包括$scope.status
			$scope.zhenggai = true;
			$(".detail-state").show();
		}
    	//详情展示页添加更新
    	var date = Common.dateFormat1(new Date());
    	var uploadList = [];
    	var	uploadResult = true;
    	var errorUpload = "";



    	//上传资料
	    var uploader1 = $scope.uploader1 = new FileUploader({
	    		url: basePath + 'fileupload/upload.do'
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
					closeBtn: 0
				});
			}
   		}
	    
       	$scope.ok = function() {
			// if(!$scope.comment){
			// 	$scope.isUpdataOK = true;
			// 	return;
			// }
			//调用layer加载层
       		var createindex = layer.load(1, {
                    shade: [0.5,'#000'] //0.1透明度的黑色背景
            });

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

   		/*uploader1.onBeforeUploadItem = function(item) {
   			if(!uploadResult){
   				item.cancel();
   			}
   		}*/
   		//每个上传成功之后的回调函数
   		uploader1.onSuccessItem = function(fileItem, response, status, headers) {
//   			console.info('onSuccessItem', fileItem, response, status, headers);
   			if(response[0].type == 'success'){
   				var unit = {};
   				unit.name = response[0].result.fileName;
   				unit.md5 = response[0].result.fileMd5;
   				unit.size = response[0].result.fileSize;
   				unit.uuid = response[0].result.uuid;
   				unit.suffix = response[0].result.suffix;
   				uploadList.push(unit);
   			}else if(response[0].type == 'error'){
   				//上传失败,记录失败的记录，提示用户
   				uploadResult = false;
   				errorUpload+="<br/>";
   				errorUpload+=fileItem.file.name;
   			}
   			
   		};
   		
   		uploader1.onErrorItem = function(item, response, status, headers){
   			if(status == 404){
   				errorUpload = "文件大小超过50M限制！";
   			}
   			uploadResult = false;
   		}
   		
   		//全部成功的回调函数
   		uploader1.onCompleteAll = function() {
   			onCompleteAllSignal = true;
   			data.comment.docs = uploadList;
   			if(!uploadResult){
                layer.close(createindex);
   				layer.alert("以下文件上传失败：" + errorUpload, {
   					title:'提示',
   					closeBtn: 0
   				},function(index){
   				  //do something
   					$uibModalInstance.dismiss();
   				});
   			}else{
   				Cooperation.commentToCollaboration(data).then(function (data) {
   					$state.go($state.current, {}, {reload: true});
   				},function(data) {
   					//提示错误信息
   					layer.alert(data.message, {
   		    		  	title:'提示',
   					  	closeBtn: 0,
						move:false
   					},function(index){
   	   				  //do something
   	   					$uibModalInstance.dismiss();
   	   					layer.closeAll();
   	   				});
   				});
   			}
   			layer.close(createindex);
   			
   		};
		if(uploader1.queue.length) {
			$scope.uploadBegin = true;
   			uploader1.uploadAll();
   		} else {
   			layer.close(createindex);
   			$uibModalInstance.close(data);
   		}
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
	$scope.isNotPreview = function(){
		layer.msg('文件暂时不支持预览！',{time:2000});
	}
    
}]);