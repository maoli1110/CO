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

		//bv播放按钮显示不同颜色
		if($scope.device) {
			$('.palys').addClass('play-bv');
		} else {
			$('.palys').addClass('play-pc');
		}
		//根据ui-sref路由拿到对应的coid
	   	var coid = $stateParams.coid;
	   	var ppid = 0;
	   	var coTypeVo = 0;
	   	var status = "";
	   	var currentTimestamp = Date.parse(new Date());
	   	var allRelevants = [];
	   	var sliceRlevants = [];
	   	$scope.transcoid = coid;
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		$scope.collaList = data;
	   		allRelevants = data.relevants;
	   		sliceRlevants = data.relevants.slice(0,8);
	   		if(data.relevants.length>8){
	   			$scope.collaList.relevants =sliceRlevants;
	   			$scope.isRevlentMore = true;
	   		}
			if(data.coTypeVo) {
				coTypeVo = data.coTypeVo.type;
			}
			
			status = data.status;
			if(data.bindType !== 0) {
				console.info('关联模型',data.bindType)
				$scope.link = true;
				ppid = data.binds[0].ppid;
			}
			
			if(data.speach) {
				$scope.speachShow = true;
				// alert("塞值:"+data.speach.speechUrl);
				$scope.speachUrl = data.speach.speechUrl
			}
			
			if( data.deadline && data.isDeadline==3){
				$scope.deadlineStyle = 'red';
			}
			//console.info("明天的日期",(new Date().date("Y-m-d",strtotime("+1 day"))).getData())

			if(data.deadline == null) {
				$scope.collaList.deadline = '不限期';
			}
			//详情描述
            if(data.desc ==null || data.desc==''){
                $('.mobile-job-descrition,.pc-job-descrition').css("display",'none')
            }else{
                $('.mobile-job-descrition,.pc-job-descrition').css("display",'block')
            }
            //详情联系人
            if(data.relevants.length==0){
                $(".mobile-relate,.pc-relate").css('display','none')
            }else{
                $(".mobile-relate,.pc-relate").css('display','block')
            }
            //详情照片
            if(data.pictures.length==0){
                $(".mobile-photo,.pc-photo").css('display','none')
            }else{
                $(".mobile-photo,.pc-photo").css('display','block')
            }
            //详情资料
            if(data.docs.length==0){
                $(".mobile-means,.pc-means").css('display','none')
            }else{
                $(".mobile-means,.pc-means").css('display','block')
            }
            //详情回复
            if(data.comments.length==0){
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
			if(data.isCollaborator && data.isSign == -1) {
				$scope.bjshow = true;
				$scope.tjshow = true;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = true;
				$scope.dchushow = true; 
			}
			//2.2.3	当当前用户不是负责人但是需要签字时
			if(!data.isCollaborator && data.isSign != -1) {
				$scope.bjshow = false;
				$scope.tjshow = true;
				$scope.tgshow = true;
				$scope.jjueshow = true;
				$scope.jsshow = false;
				$scope.dchushow = true;
			}
			//2.2.4	当当前用户既不是负责人也不需要签字时
			if(!data.isCollaborator && data.isSign == -1) {
				$scope.bjshow = false;
				$scope.tjshow = true;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = false;
				$scope.dchushow = true;
			}

			//以下三种状态
	   		if(data.status == ('已结束' || '已拒绝' || '已通过')) {
	   			$scope.bjshow = false;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = false;
	   		}
			var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
			angular.forEach($scope.collaList.docs, function(value, key) {
                var imgsrc = "imgs/pro-icon/icon-";
				//如果存在后缀名
                if(value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
                    unit = unit.toLowerCase();
					if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
						unit = 'other';
					}else if(unit == "docx"){
						unit = 'doc'
					}
					imgsrc = imgsrc+unit+".png";
                    //1.获取后缀 把后缀你push到数组
                    $scope.collaList.docs[key].imgsrc = imgsrc;
                }else{
                	unit = 'other';
                	imgsrc = imgsrc+unit+".png";
                	$scope.collaList.docs[key].imgsrc = imgsrc;
                }
            });

			angular.forEach($scope.collaList.comments, function(value, key) {
				//如果存在后缀名
				if(value.docs) {
					angular.forEach(value.docs, function(value1, key1) {
						var imgsrc = "imgs/pro-icon/icon-";
						var unit = value1.suffix;
						unit = unit.toLowerCase();
						if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" ||  unit == "undefined" ) {
							$scope.collaList.comments[key].docs[key1].suffix = 'other';
							imgsrc = imgsrc+"other.png";
							$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
						}else if(unit == "docx"){
							imgsrc = imgsrc+"doc.png";
							$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
						}else{
							imgsrc = imgsrc+unit+".png";
							$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
						}
						 if(value1.thumbnailUrl){
                        	$scope.collaList.comments[key].docs[key1].imgsrc = value1.thumbnailUrl;
                        }
					})
				}
			});

			//判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
			if($scope.link && !$scope.speachShow){
				$(".mobile-devices .paly-model").css({"width":'100%'})
			}else if(!$scope.link && $scope.speachShow){
				$(".mobile-devices .play-audio").css({"width":'100%'})
			}
			
			//录音初始化
			// $("#jquery_jplayer_1").jPlayer({
			// 	ready: function () {
			// 	$(this).jPlayer("setMedia", {
			// 		mp3:""
			// 	});
			// 	},
			// 	solution: "html,falsh",
			// 	supplied: "mp3",
			// 	wmode: "window",
			// 	useStateClassSkin: true,
			// 	autoBlur: false,
			// 	smoothPlayBar: true,
			// 	keyEnabled: true,
			// 	remainingDuration: true,
			// 	preload:"auto",
			// });

			
			
	   	});

		var id = "#jquery_jplayer_1";

		var flashHtml = '';
		if($scope.device) {
			flashHtml = 'html,falsh'; 
		} else {
			flashHtml = 'flash,html'; 
		}
		
		var bubble = {
				title:"Bubble",
				mp3:''
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
			preload:"auto",
			ended:function(){
				$(".detail-voice").hide();
			}
		};

		var myAndroidFix = new jPlayerAndroidFix(id, bubble, options);
			
		$scope.play = function(speechUrl){
			var datamp3url;
			$(".detail-voice").css('display','block');
			$(".detail-close").css("display",'block');
			$.ajax({
	              type: "post",
	              url: basePath+'rs/co/getMP3URL',
	              data:speechUrl,
	              async:false,
	              contentType:'text/HTML',
	              success: function(mp3url,status,XMLHttpRequest){
	            	   if(mp3url.indexOf('<!DOCTYPE html>')!=-1){
	            	 		document.location = 'co_detail.jsp?coid='+ coid;
	            	   	}
	            	  	datamp3url = mp3url;
	              }
	        });
			
			bubble.mp3 = datamp3url;

			myAndroidFix.setMedia(bubble).play();
			
		}

		//play-audio(播放声音的显示播放窗口事件)
		$scope.audioClose = function () {
			$("#jquery_jplayer_1").jPlayer("stop");
			$(".detail-voice").hide();
			$(".detail-close").hide();
		}

	   	//编辑协作跳转
	   	 $scope.allowEditTrans = function () {
	   	 	if($scope.allowEdit) {
	   	 		Cooperation.checkOut(coid).then(function(data) {	
	   	 		});
	   	 		//跳转主页面需要定位到当前工程（延后再说）
	   	 		$state.go('editDetail', {coid: coid});
	   	 	} else {
	   	 		var r=confirm("当前协作已结束，不允许再操作");
	   	 	}

	   	 }
	   	//预览功能
	   	$scope.pcPreView = function (docName, uuid) { 
	            var data = {fileName:docName,uuid:uuid};
	            Manage.getTrendsFileViewUrl(data).then(function (result) {
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

	   	$scope.previewComment = function (index,uuid){
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
		    if(optType==8){
		    	param = '{"title":'+title+'}'
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
				$scope.operationList = data;
			});
		}
		getOperationList();



		//更新评论

        $scope.updateComment = function () {
            var trans = {};
            trans.coid = coid;
            trans.coTypeVo = coTypeVo; 
            trans.status = status;
            var modalInstance = $uibModal.open({
				windowClass:'update-comment',
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
					$state.go($state.current, {}, {reload: true});
    			},function(data) {
					//$state.go();

				});

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
			});

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
			if(statusCode==6) {
				
			} else {

			}

			switch (statusCode) {
				case 6:
				var re = confirm('提交后您将不能再修改，若确认通过,请点击确定!');
				if(re){
//					doCollaboration();
					location.reload();
				}
				break;
				case 7:
				var re = confirm('拒绝后将不能再修改，若确认拒绝,请点击确定！');
				if(re){
//					doCollaboration();
					location.reload();
				}
				break;
				case 8:
				var re = confirm('结束后您将不能再修改，是否结束？');
				if(re){
//					doCollaboration();
					location.reload();
				}
				break;
				default:
				doCollaboration();
				break;
			}
			function doCollaboration (){
				Cooperation.doCollaboration(params).then(function (data) {
					$state.go('cooperation');
				},function (data) {
					alert(data.data.message);
				});
			}
		}

		

	    $scope.backDetail = function () {
	    	$scope.isPreview = false;
	    }
		//pc对接
		//进入页面
		//窗口发生变化传给pc对应的边距及高度
	    $(window).resize(function(){
		    //alert(('.edit-office').innerWidth);
		  	var editLeft = document.getElementById("edit-office").offsetLeft;
		  	var editHeight = $(document.body).height() - 60 - 60;
		  	//分别对应edit-office div 对应的 left top width height
		  	currentReact = editLeft + ',60,1200,' + editHeight;

		  	$scope.pdfSign();

		    $scope.$apply(function(){
		       //do something to update current scope based on the new innerWidth and let angular update the view.
		    });


		});

		$scope.pdfSign = function (uuid,docName,fileType) {
			//获取电子签名uuid
	   		Cooperation.getSignature().then(function (data) {
				signature = data.uuid;
			});

			$scope.isPreview = true;
            currentEditOfficeUuid = uuid;
            currentSuffix = 'pdf';
			var pdfSign = BimCo.PdfSign(currentEditOfficeUuid,currentSuffix,currentReact,coid);
			if(!pdfSign) {
				alert('下载文件失败！');
			}
    	}

		//签署意见
		$scope.signComment = function () {
			$scope.isSign = true;
	        BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
	    }
	    //电子签名
	    $scope.signElectronic = function () {
	    	$scope.isEleSign = true;
	       	BimCo.ElectronicSign(signature);

	    }
	    //提交
	    $scope.signSubmit = function () {
	    	var r = confirm('提交后将不能再修改，若确认无无误请点击确认！');
	    	var isSignSubmit;
	    	if(r){
	    		 isSignSubmit = BimCo.SignSubmit(currentEditOfficeUuid,currentSuffix,coid);
	    	}
	    	if(!isSignSubmit) {
	    		alert('提交电子签名失败！');
	    	} else {
	    		alert('提交电子签名成功！');
	    	}
	    }

	    //取消
	    $scope.signCancel = function () {
	    	var r = confirm ("放弃编辑？");
	    	if(r) {
	    		BimCo.SignCancel(currentEditOfficeUuid,currentSuffix);
	    	} 
	    }

	    //清空
	    $scope.signEmpty = function () {
	    	BimCo.SignEmpty(currentEditOfficeUuid,currentSuffix);
	    }

	    //侧边栏划出效果
	  	// $(".btn_box").css("right","0px");
	  	// $(".content_right").css("right","-260px");
	  	
		//if($(".means-down").length<=0){
		//	$(".mobile-main .mobile-means .means-con .means-list dd").css("margin-top",0)
		//}


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
	    //显示更多相关人
	    $scope.showMore = false;
	    $scope.showMorePerson = function() {
	    	if(!$scope.showMore){
	    		$scope.collaList.relevants = allRelevants;
	    		$scope.showMore = true;
	    	} else {
	    		$scope.collaList.relevants = sliceRlevants;
	    		$scope.showMore = false;
	    	}
	    }
	 
}]).controller('updatecommentCtrl',['$rootScope','$scope', '$http', '$uibModalInstance','Cooperation','items','Common','FileUploader','$timeout',
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