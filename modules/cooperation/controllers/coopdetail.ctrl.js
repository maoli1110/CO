'use strict';
/**
 * 协作详情
 */
angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Manage','$sce',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Manage,$sce) {
		var currentEditOfficeUuid = '';
	    var currentSuffix = '';
	    var currentReact = '0,60,1200,720';
		var signature = '';
		$scope.link = false;
		$scope.speachShow = false;
		$scope.device = false;
		$scope.allowEdit = true;
		$scope.isPreview = false;
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
	   	var ppid = 0;
	   	var coTypeVo = 0;
	   	var status = "";
	   	var currentTimestamp = Date.parse(new Date());
	   	$scope.transcoid = coid;
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		//console.log(data);
	   		$scope.collaList = data;
			console.info("线是否",$scope.collaList)
			//console.info(data)
			if(data.coTypeVo) {
				coTypeVo = data.coTypeVo.type;
			}
			
			status = data.status;

			if(data.bindType !== 0) {
				$scope.link = true;
				ppid = data.binds[0].ppid;
			}

			if(data.speach) {
				$scope.speachShow = true;
				$scope.speachUrl = data.speach.speechUrl;
				//console.log('$scope.speachUrl',$scope.speachUrl);
				$('.speach-url').val(data.speach.speechUrl);

			}

			if( data.deadline && ( (currentTimestamp >data.deadline))){
				$scope.deadlineStyle = 'red';
				console.info('时间过期了?',currentTimestamp > data.deadline)
			}
			//console.info("明天的日期",(new Date().date("Y-m-d",strtotime("+1 day"))).getData())

			if(data.deadline == null) {
				$scope.collaList.deadline = '不限期';
			}

			$(document).ready(function() {
				var flashHtml = '';
				if($scope.device) {
					// flashHtml = 'html,flash'; 
					flashHtml = 'html,flash'; 
				} else {
					flashHtml = 'flash,html'; 
				}

				var id = "#jquery_jplayer_1";

				var bubble = {
					title:"Bubble",
					// mp3:$('.speach-url').val()
					mp3:'./lib/audio/yangcong.mp3'
				};

				var options = {
					solution: flashHtml,
					swfPath: "./lib/audio1",
					supplied: "mp3",
					wmode: "window",
					useStateClassSkin: true,
					autoBlur: false,
					smoothPlayBar: true,
					keyEnabled: true,
					remainingDuration: true,
					toggleDuration: true
				};

				var myAndroidFix = new jPlayerAndroidFix(id, bubble, options);

			});

			$scope.play = function(){
				$('.jp-play').click();
				$(".detail-voice").css('display','block');
				$(".detail-close").css("display",'block');
			}

			//play-audio(播放声音的显示播放窗口事件)
			$scope.audioClose = function () {
				$('.jp-play').click();
				$(".detail-voice").hide();
				$(".detail-close").hide();
			}

			console.log('$scope.collaList.docs.length',$scope.collaList.docs.length);

			//详情描述
            if($scope.collaList.desc ==null || $scope.collaList.desc==''){
                $('.mobile-job-descrition,.pc-job-descrition').css("display",'none')
            }else{
                $('.mobile-job-descrition,.pc-job-descrition').css("display",'block')
            }
            //详情联系人
            if($scope.collaList.relevants.length==0){
                $(".mobile-relate,.pc-relate").css('display','none')
            }else{
                $(".mobile-relate,.pc-relate").css('display','block')
            }
            //详情照片
            if($scope.collaList.pictures.length==0){
                $(".mobile-photo,.pc-photo").css('display','none')
            }else{
                $(".mobile-photo,.pc-photo").css('display','block')
            }
            //详情资料
            if($scope.collaList.docs.length==0){
                $(".mobile-means,.pc-means").css('display','none')
            }else{
                $(".mobile-means,.pc-means").css('display','block')
            }
            //详情回复
            if($scope.collaList.comments.length==0){
                $(".mobile-reply,.pc-reply").css('display','none')
            }else{
                $(".mobile-reply,.pc-reply").css('display','block')
            }

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
			var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
			angular.forEach($scope.collaList.docs, function(value, key) {
                //如果存在后缀名
                if(value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
					if(typeArr.indexOf(unit) == -1) {
						unit = 'other';
					}
                    //1.获取后缀 把后缀你push到数组
                    $scope.collaList.docs[key].suffix = unit;
                    console.log('887878',$scope.collaList.docs);

                }
				console.info("12313131",$scope.typeArr)
            });

			angular.forEach($scope.collaList.comments, function(value, key) {
				//如果存在后缀名
				if(value.docs) {
					angular.forEach(value.docs, function(value1, key1) {
						if(typeArr.indexOf(value1.suffix) == -1 || value1.suffix == null) {
							$scope.collaList.comments[key].docs[key1].suffix = 'other';
						}
					})
					console.log('rtrtrt',$scope.collaList.comments);
				}
				console.info("12313131",$scope.typeArr)
			});

			//判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
			if($scope.link && !$scope.speachShow){
				$(".mobile-devices .paly-model").css({"width":'100%'})
			}else if(!$scope.link && $scope.speachShow){
				$(".mobile-devices .play-audio").css({"width":'100%'})
			}else if($scope.link && $scope.speachShow){
				$(".mobile-devices .paly-model , .mobile-devices .paly-model").css("width",'143px')
			}
	   	});
	   	//获取电子签名uuid
		Cooperation.getSignature().then(function (data) {
			console.log('igfisghslighdsglh',data);
			signature = data.uuid;
		});


	   	//编辑协作跳转
	   	 $scope.allowEditTrans = function () {
	   	 	if($scope.allowEdit) {
	   	 		$state.go('editDetail', {coid: coid});
	   	 	} else {
	   	 		var r=confirm("当前协作已结束，不允许再操作");
	   	 	}
	   	 }
	   	//预览功能
	   	$scope.pcPreView = function (docName, uuid) { 
	            var data = {fileName:docName,uuid:uuid};
	            Manage.getTrendsFileViewUrl(data).then(function (result) {
        		console.log(typeof result)
        		$scope.isPreview = true;
        		$scope.previewUrl =result;
                layer.open({
                        type: 2,
                        //skin: 'layui-layer-lan',
                        title: '预览',
                        fix: false,
                        shadeClose: true,
                        maxmin: true,
                        area: ['1000px', '500px'],
                        content: $scope.previewUrl
                    });
            },function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.message);
            });
	   		
	   	}


	   	//pc端交互
	   	$scope.checkModelpc = function () {
	   		BimCo.LocateComponent(ppid,coid);
	   	}

	   	//移动端交互
	   	$scope.checkModel = function () {
	   		sendCommand(1,coid);
	   	}

	   	$scope.zoom = function (uuid) {
	   		sendCommand(6,coid,uuid);
	   	}

	   	$scope.previewComment = function (index,uuid) {
	   		sendCommand(7,index,uuid);
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
		    if(optType==7){
		    	param = '{"optType":'+optType+',"index":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
		    }
		    //document.location = "http://bv.local?param=" + param;
		    //var a  = "http://bv.local?param=" + param;
		    //document.location.href = a;
		    //alert(document.location.href);
		    document.location = 'http://localhost:8080/bv/?param='+param;
		}

		//侧边栏获取动态列表
		var getOperationList = function () {
			Cooperation.getOperationList(coid).then(function (data) {
				console.log('right222',data)
				$scope.operationList = data;
			});
		}
		getOperationList();



		//更新评论
        $scope.updateComment = function () {
            console.log('coid', coid);
            var trans = {};
            trans.coid = coid;
            trans.coTypeVo = coTypeVo; 
            trans.status = status;
            var modalInstance = $uibModal.open({
            	size: 'lg',
                backdrop : 'static',
                templateUrl: 'template/cooperation/updatecomment.html',
                controller:'updatecommentCtrl',
                resolve:{
                    items: function () {
                        return trans;
                    }
                }
            });
            modalInstance.result.then(function (data) {
            	Cooperation.commentToCollaboration(data).then(function (data) {
    				console.log('1111');
    			},function(data) {
    				console.log(data);
    			});
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
		//	
		//


		});
		
		//协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
		$scope.doCollaboration = function (statusCode) {
			var params = {
				coid:coid,
				docs:[],
				operationType:statusCode
			}
			Cooperation.doCollaboration(params).then(function (data) {
				console.log('success');
			},function (data) {
				console.log(data);
				alert(data.data.message);
			});
		}


	    $scope.backDetail = function () {
	    	$scope.isPreview = false;
	    }
		//pc对接
		//进入页面
		$scope.pdfSign = function (uuid,docName,fileType) {
			$scope.isPreview = true;
            currentEditOfficeUuid = uuid;
            currentSuffix = 'doc';
            //console.log(currentEditOfficeUuid, currentSuffix,currentReact);
			BimCo.CommentSign(currentEditOfficeUuid,currentSuffix,currentReact);

    	}

		//签署意见
		$scope.commentSign = function () {

	        BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
	      	
	    }
	    //电子签名
	    $scope.electronicSign = function () {
	    	
	       	BimCo.ElectronicSign(signature);

	    }
	    //提交
	    $scope.signSubmit = function () {
	    	var r = confirm('提交后将不能再修改，若确认无无误请点击确认！');
	    	if(r){
	    		BimCo.SignSubmit();
	    	}
	    }

	    //取消
	    $scope.signCancel = function () {
	    	var r = confirm ("放弃编辑？");
	    	if(r) {
	    		BimCo.SignCancel();
	    	} 
	    }

	    //清空
	    $scope.signEmpty = function () {
	    	BimCo.SignEmpty();
	    }

	    //侧边栏划出效果
	  	// $(".btn_box").css("right","0px");
	  	// $(".content_right").css("right","-260px");
	  	
		//if($(".means-down").length<=0){
		//	$(".mobile-main .mobile-means .means-con .means-list dd").css("margin-top",0)
		//}



	 
}]).controller('updatecommentCtrl',['$scope', '$http', '$uibModalInstance','Cooperation','items','Common','FileUploader','$timeout',
    function ($scope, $http, $uibModalInstance,Cooperation,items,Common,FileUploader,$timeout) {
    	var onCompleteAllSignal = false;
    	$scope.uploadBegin = false;
    	$scope.zhenggai = false;
    	// $scope.status = items.status;
    	$scope.status = '1';
    	//详情展示页添加更新
    	var coTypeVo = items.coTypeVo;
    	var date = Common.dateFormat1(new Date());
    	var uploadList = [];

    	//如果是问题整改则显示状态
    	if(coTypeVo === 0) {
    		$scope.zhenggai = true;
    	}
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
       		var data = {
    	 	coid: items.coid,
    	 	comment: {
    	 		comment: $scope.comment, /*内容*/
    	 		commentator:'', /*评论人后端接口没给*/
    	 		commentTime:date,	/*评论时间*/
    	 		docs: [],	/*文件列表*/
    	 		// coSpeech:'' /*整改录音*/
	    	 	},
	    	 status:parseInt($scope.status)
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
	            console.log(uploadList);
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