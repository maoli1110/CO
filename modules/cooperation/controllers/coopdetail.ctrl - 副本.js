'use strict';
/**
 * coopdetailCtrl
 */
angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Manage','$sce',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Manage,$sce) {
		var clickSpeechMap = new jMap();
//		console.log('detail',$stateParams);
		var currentEditOfficeUuid = '';
	    var currentSuffix = '';
	    var currentReact = '45,50,1080,720';
		$scope.link = false;
		$scope.speachShow = false;
		$scope.device = false;
		$scope.allowEdit = true;
		$scope.isPreview = false;
		$scope.flag = {};
		//页面按钮显示标志
		$scope.bjshow = true;
		$scope.tjshow = true;
		$scope.tgshow = true;
		$scope.jjueshow = true;
		$scope.jsshow = true;
		$scope.dchushow = true;
		$scope.isTypePdf = true;//判断文件类型是否是pdf格式
		$scope.showMore = false;
		$scope.collapse = false;
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
	   	var totalPage = 0;
	   	var pageSize = 8;
		var pageSizePc = 16;
	   	var currentShowPage = 1;
	   	$scope.transcoid = coid;

	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {

	   		$scope.collaList = data;
	   		//详情转换“\n”
	   		if(data.desc){
				// document.getElementById("mobile-textarea").innerHTML=replaceAll(data.desc,"\n","</br>");
				$scope.collaList.desc = replaceAll(data.desc,"\n","</br>");
	   		}

	   		//遍历评论转换“\n”
	   		if(data.comments.length){
	   			angular.forEach(data.comments,function(value,key){
	   				if(value.comment){
	   					$scope.collaList.comments[key].comment = replaceAll(value.comment,"\n","</br>");
	   				}
	   			});
	   		}
	   		
	   		if($scope.device){
	   			allRelevants = data.relevants;
	   			totalPage = parseInt((allRelevants.length + pageSize -1) / pageSize);
		   		if(totalPage > 1){
		   			sliceRlevants = data.relevants.slice(0,currentShowPage*pageSize);
		   			$scope.collaList.relevants = sliceRlevants;
		   			$scope.isRevlentMore = true;
		   			$scope.showMore = true;
		   		}
	   		}else if(!$scope.device){
				allRelevants = data.relevants;
				totalPage = parseInt((allRelevants.length + pageSizePc -1) / pageSizePc);
				if(totalPage > 1){
					sliceRlevants = data.relevants.slice(0,currentShowPage*pageSizePc);
					$scope.collaList.relevants = sliceRlevants;
					$scope.isRevlentMore = true;
					$scope.showMore = true;
				}
			}
			if(data.coTypeVo) {
				coTypeVo = data.coTypeVo.type;
			}
			
			status = data.status;
			if(data.bindType !== 0 && data.binds.length) {
//				console.info('关联模型',data.bindType)
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

			if(data.isSign == -1){
				$scope.flag.noNeedSign = true;
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
			if((!data.isCollaborator && data.isSign==0) ||(!data.isCollaborator && data.isSign==1)) {
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

			//是否编辑协作
			var statusReject = ['已结束','未通过','已通过','已拒绝'];
			if (statusReject.indexOf(data.status) != -1) {
				$scope.allowEdit = false;
	   			$scope.bjshow = false;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = false;
				$scope.flag.noNeedSign = true;
			}

			//判断当前用户已经点过通过/拒绝按钮
			if(data.isSign == 1){
				$scope.tgshow = false;
				$scope.jjueshow = false;
			}
			//当前用户是负责人
			if(data.isSign == 1 && data.isCollaborator){
				$scope.jsshow = false;
				$scope.bjshow = false;
			}

			//详情描述记录换行
			function replaceAll (strM,str1,str2) {
	   			var stringList =strM.split(str1);
	   			for(var i=0;i<stringList.length-1;i++){
                  stringList[i]+=str2;
	   			}
	   			var newstr='';
	   			for(var j=0;j<stringList.length;j++)newstr+=stringList[j];
	   				return newstr;

	   		}

			var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
			angular.forEach($scope.collaList.pictures, function(value,key) {
				 var imgsrc = "imgs/pro-icon/icon-";
				//如果存在后缀名
                if(value.name && value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
                    unit = unit.toLowerCase();
					if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
						unit = 'other';
					}else if(unit == "docx"){
						unit = 'doc'
					}
					imgsrc = imgsrc+unit+".png";
                    //1.获取后缀 把后缀你push到数组
                    $scope.collaList.pictures[key].imgsrc = imgsrc;
                }else{
                	var timestamp=new Date().getTime();
                	$scope.collaList.pictures[key].name = timestamp + ".png";
                	unit = 'other';
                	imgsrc = imgsrc+unit+".png";
                	$scope.collaList.pictures[key].imgsrc = imgsrc;
                }

			});
			angular.forEach($scope.collaList.docs, function(value, key) {
                var imgsrc = "imgs/pro-icon/icon-";
				//如果存在后缀名
                if(value.name && value.name.indexOf('.') !== -1){
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
						if(value1.name == null){
							var timestamp=new Date().getTime();
							$scope.collaList.comments[key].docs[key1].name = timestamp + ".png";
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
			flashHtml = 'html,falsh'; 
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
			if(clickSpeechMap.get(speechUrl) == null){
				$.ajax({
		              type: "POST",
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
				clickSpeechMap.put(speechUrl, datamp3url);
				bubble.mp3 = clickSpeechMap.get(speechUrl);
				myAndroidFix.setMedia(bubble).play();
			}else{
				myAndroidFix.play();
			}

		}

		//点击播放按钮获取MP3地址并播放(pc)
		var currentMp3Id;
		var currentUuid;
		var refreshID;
		$scope.getPcMP3Url = function (uuid,source){
			var uuidList = [uuid];
			if((currentUuid && currentUuid != uuid && $scope.flag.audioPlaying) || (currentUuid && currentUuid != uuid && $scope.flag.commentAudioPlaying)){
				layer.alert('当前正在播放录音！', {
				  	title:'提示',
				  	closeBtn: 0,
				  	move:false
				});
			} else {
				currentUuid = uuid;
				Cooperation.getPcMp3Url(uuidList).then(function(data){
					angular.forEach(data,function(value,key){
						if(source == ''){
							$scope.flag.audioPlaying = true;
							refreshID = setInterval(getAudioProgress,1000);
						} else {
							$scope.flag.commentAudioPlaying = true;
							refreshID = setInterval(getAudioProgress,1000);
						}
						currentMp3Id = BimCo.AudioPlay(value);//调用pc播放录音返回int类型
					});
				});
			}
		}
		
		//点击取消播放
		$scope.AudioStop = function (source){
			if(source == ''){
				$scope.flag.audioPlaying = false;
			} else {
				$scope.flag.commentAudioPlaying = false;
			}
			BimCo.AudioStop(currentMp3Id);
		}

		//轮询当前MP3是否播放完成
		function getAudioProgress() {
			//调用pc端获取进度条
			var currentProgress = BimCo.AudioProgress(currentMp3Id);
			if(currentProgress >= 100){
				BimCo.AudioStop(currentMp3Id);
				$scope.flag.audioPlaying = false;
				$scope.flag.commentAudioPlaying = false;
				$scope.$apply();
				clearInterval(refreshID);
			}
		}
		

		function jMap(){
			//私有变量
			var arr = {};
			//增加
			this.put = function(key,value){
				arr[key] = value;
			}
			//查询
			this.get = function(key){
				if(arr[key]){
					return arr[key]
				}else{
					return null;
				}
			}
			//删除
			this.remove = function(key){
				//delete 是javascript中关键字 作用是删除类中的一些属性
				delete arr[key]
			}
			//遍历
			this.eachMap = function(fn){
				for(var key in arr){
					fn(key,arr[key])
				}
			}
		}

		//play-audio(播放声音的显示播放窗口事件)
		$scope.audioClose = function () {
			$("#jquery_jplayer_1").jPlayer("stop");
			$(".detail-voice").hide();
			$(".detail-close").hide();
		}

	   	//编辑协作跳转
	   	 $scope.allowEditTrans = function () {
	   		var checkCoLocked = false;
			$.ajax({
	              type: "POST",
	              url: basePath+'rs/co/checkCoLocked/'+coid,
	              async:false,
	              contentType:'text/HTML',
	              success: function(data,status,XMLHttpRequest){
	            	  if(data){
	            		  	checkCoLocked = true; 
		  					layer.alert('当前协作已被“'+data+'”签出，请稍后重试！', {
		  	        		  	title:'提示',
		  					  	closeBtn: 0,
								move:false
		  					},function(index){
		  						  layer.close(index);
		  					});
	  					}
	              },
	              error:function(XMLHttpRequest, textStatus, errorThrown){
	            	  (textStatus, {
	  	        		  	title:'提示',
	  					  	closeBtn: 0,
	  					  	move:false
	  					},function(index){
	  						  layer.close(index);
	  					});
	              }	
	        });
			if(checkCoLocked){
				return;
			}
	   	 	if($scope.allowEdit) {
	   	 		Cooperation.checkOut(coid).then(function(data) {	
	   	 		});
	   	 		$state.go('editdetail', {coid: coid});
	   	 	} else {
	   	 		('当前协作已被“'+$scope.collaList.operationName+'”签出，请稍后重试！', {
        		  	title:'提示',
				  	closeBtn: 0,
				  	move:false
				});
	   	 	}
	   	 }

	   	//pc端交互
	   	$scope.checkModelpc = function () {
	   		//判断是否在播放中
	   		if($(".detail-voice").css("display") == "block"){
	   			$scope.audioClose();
	   		}
	   		BimCo.LocateComponent(ppid,coid);
	   	}

	   	//移动端交互
	   	$scope.checkModel = function () {
	   		//判断是否在播放中
	   		if($(".detail-voice").css("display") == "block"){
	   			$scope.audioClose();
	   		}
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

		    document.location = 'http://localhost:8080/bv/?param='+param;
		}

		//侧边栏获取动态列表
		var trendflag = true;
	   	
	   	/*滚动加载只防止多次提交请求问题start*/
	    //可以查询
	 	var searchFlag;
	 	var pollingFlag = true;
	 	var checkSearchInterval;
	 	$scope.scrollend = false;
		 $scope.addMoreData = function (){
			 if(!token){
				 return;
			 }
			 setSearchFlagFalse();
			 if(pollingFlag){
		 			pollingFlag = false;
		 			checkSearchInterval = setInterval(function() {checkCanSearch()},100);
		 		}
		 	setTimeout(function() {setSearchFlagTrue()},150);
		 }
		 
		 var setSearchFlagFalse = function(){
		 		searchFlag = false;
		 	}
			var setSearchFlagTrue = function(){
				searchFlag = true;
		 	}
			var checkCanSearch = function(){
				if(searchFlag){
					clearInterval(checkSearchInterval);
					$scope.getOperation();
					pollingFlag = true;
				}
			}
			
			$scope.getOperation = function(){
				var size = $scope.operationList.length;
				if(size%dynamicPageSize!=0 || size == $scope.operationAllList.length){
					$scope.scrollend = true;
					return;
				}
				var l = size/dynamicPageSize;
				var result = $scope.operationAllList.slice(dynamicPageSize*l,(l+1)*dynamicPageSize);
				for(var i=0;i<result.length;i++){
					
					$scope.operationList.push(result[i]);
				}
				$scope.$apply();
//				console.log($scope.operationList);
				return;
			}
			
		$scope.operationAllList = [];
		var dynamicPageSize = 8;
		var dynamicCurrentShowPage = 1;
		var token = false;
		$scope.getOperationList = function() {
			if(trendflag){
				$scope.scrollend = false;
				Cooperation.getOperationList(coid).then(function (data) {
					$scope.operationAllList = data;
					$scope.operationList = data.slice(0,dynamicCurrentShowPage*dynamicPageSize);
					var size = $scope.operationList.length;
					if(size%dynamicPageSize!=0 || size == $scope.operationAllList.length){
						$scope.scrollend = true;
					}
					token = true;
          		});
			}
			trendflag = false;
		}
		
		//更新评论
		var modalInstance;
        $scope.updateComment = function () {
            var trans = {};
            trans.coid = coid;
            trans.coTypeVo = coTypeVo; 
            trans.status = status;
            	modalInstance = $uibModal.open({
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
    				//提示错误信息
					layer.alert(data.message, {
            		  	title:'提示',
					  	closeBtn: 0,
					  	move:false
					});
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
			$(".replay-down").hover(function(){
				$(this).find('.user-down').animate({"bottom":'0'})
			},function(){
				$(this).find('.user-down').animate({"bottom":'-30px'})
			})
		});
		
		//协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
		$scope.doCollaboration = function (statusCode) {
			var params = {
				coid:coid,
				docs:[],
				operationType:statusCode
			}
			/*Cooperation.checkCoLocked(coid).then(function (data) {
				if(data){
					layer.alert('当前协作已被“'+data+'”签出，请稍后重试！', {
	        		  	title:'提示',
					  	closeBtn: 0
					},function(index){
						  layer.close(index);
						  return;
					});
				}
			},function (data) {
				layer.alert(data.message, {
        		  	title:'提示',
				  	closeBtn: 0
				});
			});*/
			var checkCoLocked = false;
			$.ajax({
	              type: "POST",
	              url: basePath+'rs/co/checkCoLocked/'+coid,
	              async:false,
	              contentType:'text/HTML',
	              success: function(data,status,XMLHttpRequest){
	            	  if(data){
	            		  	checkCoLocked = true; 
		  					layer.alert('当前协作已被“'+data+'”签出，请稍后重试！', {
		  	        		  	title:'提示',
		  					  	closeBtn: 0,
		  					  	move:false
		  					},function(index){
		  						  layer.close(index);
		  					});
	  					}
	              },
	              error:function(XMLHttpRequest, textStatus, errorThrown){
	            	  layer.alert(textStatus, {
	  	        		  	title:'提示',
	  					  	closeBtn: 0,
	  					  	move:false
	  					},function(index){
	  						  layer.close(index);
	  					});
	              }	
	        });
			if(checkCoLocked){
				return;
			}
			switch (statusCode) {
				case 6:
					layer.confirm('提交后您将不能再修改，若确认通过，请点击确定!', {
						btn: ['确定','取消'] ,//按钮
						move:false
					},function(){
						doCollaboration();
						//location.reload();
					});
				break;
				case 7:
				layer.confirm('提交后您将不能再修改，若确认拒绝，请点击确定！', {
					btn: ['确定','取消'] ,//按钮
					move:false
				},function(){
					doCollaboration();
					//location.reload();
				});
				break;
				case 8:
				layer.confirm('提交后您将不能再修改，若确认结束，请点击确定！', {
					btn: ['确定','取消'], //按钮
					move:false
				},function(){
					doCollaboration();
					//location.reload();
				});
				break;
				default:
				doCollaboration();
				break;
			}
			/*} else {
				layer.alert('当前协作已被“'+$scope.collaList.operationName+'”签出，请稍后重试！', {
        		  	title:'提示',
				  	closeBtn: 0
				});
			}*/
			
			function doCollaboration (){
				Cooperation.doCollaboration(params).then(function (data) {
					layer.closeAll();
					$state.go($state.current, {}, {reload: true});
				},function (data) {
					layer.closeAll();
					layer.alert(data.message, {
	        		  	title:'提示',
					  	closeBtn: 0,
					  	move:false
					});
				});
			}
		}	
		//pc对接
		//进入页面
		$scope.previewSign = function (uuid,docName,isPdfsign) {
				var suffix = '';
				if(docName && docName.indexOf('.')!=-1){
					suffix = docName.split('.')[docName.split('.').length-1];
				} else {
					suffix = '';
				}
            	//获取电子签名uuid
            	if(suffix=='pdf' && isPdfsign == 1){
            		//调用加载层防止调用客户端时间过长
					var createindex = layer.load(1, {
						shade: [0.1,'#000'] //0.1透明度的黑色背景
					});
            		//pdf签署（客户端）调用不成功则返回详情界面
            		var promise = new Promise(function(resolve, reject) {
					  	var pdfSign = BimCo.PdfSign(uuid,suffix,currentReact,coid);
					  	if (pdfSign){
					    	resolve(true);
					  	} else {
					    	reject(error);
					  	}
					});

					promise.then(function(value){
					  	//调用客户端成功取消加载层，执行跳转
							layer.close(createindex);
		            		$scope.flag.isPreview = true;
			            	$scope.flag.isApprove = true;
			            	$scope.flag.isGeneral = false;
			            	$scope.flag.isPdfsign = false;
					},function(){
					  	//调用客户端失败取消加载层
							layer.close(createindex);
							return;
					})
					
	            } else {
	            	//普通预览（除去pdf以外的文件）
	            	var data ={fileName:docName,uuid:uuid};
		        	Manage.getTrendsFileViewUrl(data).then(function (result) {
//		        		console.log(typeof result)
		        		$scope.flag.isPreview = true;
		        		$scope.flag.isGeneral = true;
		        		$scope.flag.isPdfsign = false;
		        		$scope.flag.isApprove = false;
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

    	//添加审批意见
    	$scope.addApprove = function() {
    		// alert('$scope.collaList.isSign='+$scope.collaList.isSign);
    		if($scope.collaList.isSign == 1){
    			BimCo.MessageBox("提示" ,"您已通过（拒绝）该协作，不能进行二次审批！", 0);
    			return;
    		}
    		if($scope.collaList.status=='已结束'){
    			BimCo.MessageBox("提示" ,"当前协作已结束，不能再进行操作!", 0);
    			return;
    		}
    		//添加审批意见时签出
    		Cooperation.checkOut(coid).then(function(data){
				$scope.flag.isPdfsign = true;
    		},function(data){
    			//弹框提示用户当前被签出
    			BimCo.MessageBox("提示" ,data.message, 0);
    			return;
    		});
    		var react = "45,100,1080,720";
    		BimCo.MovePdfWnd(react);
    	}

		//签署意见
		$scope.signComment = function () {
				$scope.isSign = true;
	        	BimCo.CommentSign(currentEditOfficeUuid,currentSuffix);
	    }
	    //电子签名
	    $scope.signElectronic = function () {
	    	//获取电子签名
	    	var signature;
	    	$.ajax({
	    		contentType: "application/json; charset=utf-8",
				dataType : 'json',
				type: "get",
				url: basePath+'rs/co/signature',
			    async : false,
			    success: function (data) {
			    	signature = data.uuid;
					$scope.isEleSign = true;
			    },
			    error: function () {
			    }
	    	});
	    	BimCo.ElectronicSign(signature);
	    }
	    //提交
	    $scope.SubmitAll = function () {
	    	//当前未做修改，点击提交同返回 true代表有改动，false没改动
	    	if(!BimCo.IsModify()){
	    		$scope.flag.isPdfsign = false;
	    		$scope.backDetail();
	    		return;
	    	}
	    	var rtn = BimCo.MessageBox("提示" ,"提交后将不能再修改，若确认无误请点击确认！", 0x31);
	    	var isSignSubmit;
	    	var backJson;
	    	// backJson = "{\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"测试的字符\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":167.99998474121094,\"yAxis\":163.90008544921875},{\"contents\":\"没问题\",\"font\":\"宋体\",\"fontSize\":15,\"modifyTime\":22229721,\"page\":2,\"type\":2,\"xAxis\":377.24996948242188,\"yAxis\":234.40008544921875}]}}";
	    	//backJson = "{\"6330EB632087445B98DB6D6B677B136A\":{\"PdfModify\":[{\"contents\":\"asdfasdfaf\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":477.74996948242188,\"yAxis\":786.75}]},\"99E53F0D1ECC4CA1AEDCB64BA416D640\":{\"PdfModify\":[{\"contents\":\"我好\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":427.49996948242188,\"yAxis\":759.4000244140625}]},\"C053AFCBAE3742E1907C711AEEE49FB1\":{\"PdfModify\":[{\"contents\":\"asfasfasfa\",\"font\":\"宋体\",\"fontSize\":15,\"page\":1,\"type\":2,\"xAxis\":390.74996948242188,\"yAxis\":749.75}]}}"
	    	var modifyDocs=[];
	    	if(rtn==1){
	    		//客户端临时缓存
	    		BimCo.SignSubmit();
	    		//客户端正式提交
	    		backJson = BimCo.SubmitAll();

	    		if(backJson){
		    		backJson = JSON.parse(backJson);
		    	}
		    	if(backJson){
					angular.forEach(backJson,function(value, key){
						if(!value){
							return;
						} else {
							var unit = {};
							unit.uuid = key;
							unit.modifys = value.PdfModify;
							modifyDocs.push(unit);
						}
	        		});
		    	}
		    	var params = {
					coid:coid,
					docs:modifyDocs,
					operationType:4
				}
		    	Cooperation.doCollaboration(params).then(function (data) {
					$scope.flag.isPreview = false;
				},function (data) {
					//提交不成功签入协作，跳转回详情界面
					Cooperation.checkIn(coid).then(function(data) {
	   	 			});
					$scope.flag.isPreview = false;
					BimCo.MessageBox("提示",data.message,0);
				});
		    }
	    }

	    //取消
	    $scope.signCancel = function () {
	    	var rtn = BimCo.MessageBox("提示" ,'          '+"放弃编辑？", 0x31 );
	    	if(rtn==1) {
	    		//取消调用签入
	    		Cooperation.checkIn(coid).then(function(data){
	    		});
	    		BimCo.SignCancel();
	    		BimCo.CancelSubmitAll();
	    		$scope.flag.isPreview = false;
	    	}
	    }

	    //清空
	    $scope.signEmpty = function () {
	    	BimCo.SignEmpty();
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
//	            console.log('max');
	            $scope.max = false;
	            $scope.restore = true;
	            //对接pc
	            BimCo.SysCommand('SC_MAXIMIZE');

	        } else { 
//	            console.log('restore');
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
	    $scope.showMorePerson = function() {
	    	currentShowPage++;
	    	if(currentShowPage >=2){
	    		$scope.collapse = true;
	    	}
    		$scope.collaList.relevants = allRelevants.slice(0,currentShowPage*pageSize); 
    		if(!$scope.device){
    			$scope.collaList.relevants = allRelevants.slice(0,currentShowPage*pageSizePc); 
    		}
    		if(currentShowPage >= totalPage){
    			$scope.showMore = false;
    		}
    		
    		
	    	/*if(!$scope.showMore){
	    		
	    	} else {
	    		$scope.collaList.relevants = sliceRlevants;
	    		$scope.showMore = false;
	    		currentShowPage = 1;
	    	}*/
	    }
	    
	    //显示更多相关人
	    $scope.collapsePerson = function() {
    		$scope.collaList.relevants = sliceRlevants;
    		$scope.showMore = true;
    		$scope.collapse = false;
    		currentShowPage = 1;
	    }

	    //预览界面跳转回详情
	    $scope.backDetail = function () {
	    	//没有点击添加审批意见不调用签入
	    	if($scope.flag.isPreview){
	    		BimCo.SignCancel();
	    		BimCo.CancelSubmitAll(); 
	    	}
	    	if($scope.flag.isPreview && $scope.flag.isPdfsign){
	    		//签署页面返回调用签入
	    		Cooperation.checkIn(coid).then(function(data){
	    		});
	    	}
	    	$scope.flag.isPreview = false;
	    	$scope.flag.isPdfsign = false;
	    }
	    
	    //详情页面跳转回homepage(cooperation)
	   	$scope.backCooperation = function (){
	   		if($scope.collaList.status=='草稿箱'){
	   			//草稿箱
	   			$scope.collaList.deptId = 0;
	   		} else if(!$scope.collaList.binds || $scope.collaList.binds.length==0){
	   			//未关联
	   			$scope.collaList.deptId = -1;
	   		}
	   		$state.go('cooperation',{'deptId':$scope.collaList.deptId, 'ppid':$scope.collaList.ppid,'status':$scope.collaList.statusId},{ location: 'replace'});
	   	}

	   	//反查formbe,跳转详情页面
	   	var currentPage = 'coopdetail';
	   	$scope.checkFromBe = function() {
	   		var coidFrombe = $('#checkformbe').val();
	   		if(coidFrombe == coid) {
	   			$state.go('coopdetail',{'coid':coidFrombe},{reload:true});
	   		}
	   		//当前正在签署
	   		if(currentPage == 'coopdetail' && ($scope.flag.isPdfsign || $scope.flag.isApprove)){
	   			var rtn = BimCo.MessageBox("提示","当前正在签署中，是否跳转？", 0x31);
	   			//确定1取消2
	   			if(rtn==1){
	   				$state.go('coopdetail',{'coid':coidFrombe});
	   			}
	   		} else if (!!modalInstance){
	   			//添加更新状态
	   			layer.confirm('当前正在添加更新, 是否跳转？', {
					btn: ['确定','取消'], //按钮
					move:false
				},function(){
					layer.closeAll();
					$state.go('coopdetail',{'coid':coidFrombe})
				});
	   		} else if (coidFrombe != coid){
	   			//非签署状态
	   			layer.confirm('当前已有打开的协作, 是否跳转？', {
					btn: ['确定','取消'], //按钮
					move:false
				},function(){
					layer.closeAll();
					$state.go('coopdetail',{'coid':coidFrombe})
				});
	   		}
	   		
	   	}

	   	//调用心跳机制
	   	if(!$scope.device){
	   		Cooperation.heartBeat();
	   	}
        //跳转新页面去除心跳机制
        $scope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
//                console.log(toState, toParams, fromState);
                clearInterval(ApplicationConfiguration.refreshID);
                if(!!modalInstance){
                	modalInstance.dismiss();
                }
                
        });

}]);