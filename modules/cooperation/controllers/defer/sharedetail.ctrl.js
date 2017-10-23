'use strict';
/**
 * coopdetailCtrl
 */
angular.module('cooperation').controller('sharedetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Manage','$sce','$timeout',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Manage,$sce,$timeout) {
		$scope.link = false;
		$scope.speachShow = false;
		// $scope.device = false;
		$scope.flag = {};
		$scope.isTypePdf = true;//判断文件类型是否是pdf格式
		$scope.showMore = false;
		$scope.collapse = false;
		var isPictureStatus = false;//判断能都被查看；
		//判断pc or bv
		// if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
			$scope.device = true;
		// }
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
		var  previewCount = 1;
		var fileUrlImg ;
        //coid 1wuUA4dGiDVbpsJMORDqsHmCooFGS5bul7PLOOm4d%2FM%3D%0D%0A
	   	Cooperation.shareDetail(coid).then(function (data) {

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
				$scope.link = true;
				ppid = data.binds[0].ppid;
			}

			if(data.speach) {
				$scope.speachShow = true;
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
                } else {
                	$scope.collaList.pictures[key].name = value.md5 + ".png";
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
			var arrType=['jpg','png','bmp','tif','tiff','gif','jpeg','PNG','GIF','JPG'];

			angular.forEach($scope.collaList.comments, function(value, key) {
				//如果存在后缀名
				if(value.docs) {
					angular.forEach(value.docs, function(value1, key1) {
						var imgsrc = "imgs/pro-icon/icon-";
						var unit = value1.suffix;
						if(unit != null && unit != ''){
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
							if(value1.name == null && !$scope.device){
								var timestamp=new Date().getTime();
								$scope.collaList.comments[key].docs[key1].name = value1.md5 + ".png";
							}
						} else {
								$scope.collaList.comments[key].docs[key1].suffix = 'other';
								imgsrc = imgsrc+"other.png";
								$scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
						}
					})
				}
			});
			//bv 分享页面图片预览功能start
			$scope.previewSignEle = function(obj,fileUrl,source){
				fileUrlImg = fileUrl;
				previewCount++;
				if(source === 2){
						if(arrType.indexOf(obj.suffix)===-1){
							alert('文件暂时不支持预览');
							return ;
						}
				}
				setTimeout(function(){
					var showImgMSG = '<div class="preview-tools"><div class="showMsg-mask"></div><div class="show-pictures"><div style="background:url('+fileUrlImg+');background-size:cover"></div></div></div>';
					if(previewCount%2==0){
						$('body').append(showImgMSG);
						$('.preview-tools').css('display','block');
					}
					$('.showMsg-mask').click(function(){
						previewCount +=1;
						$('.preview-tools').css('display','none');
						$('.preview-tools').remove();

					})
				},10)
			}
			//判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
			if($scope.link && !$scope.speachShow){
				$(".mobile-devices .paly-model").css({"width":'100%'})
			}else if(!$scope.link && $scope.speachShow){
				$(".mobile-devices .play-audio").css({"width":'100%'})
			}

	   	});
		var id = "#jquery_jplayer_1";

		var flashHtml = '';
		if($scope.device) {
			flashHtml = 'html,flash';
		} else {
			flashHtml = 'html,flash';
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
		var oldSpeechUrl = null;
		$scope.play = function(speechUrl){

			var datamp3url;
			$(".detail-voice").css('display','block');
			$(".detail-close").css("display",'block');
			if(oldSpeechUrl != speechUrl){
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
				bubble.mp3 = datamp3url;
				oldSpeechUrl = speechUrl;
				myAndroidFix.setMedia(bubble).play();
			}else{
				myAndroidFix.play();
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


		//bv 分享页面图片预览功能end
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
			return;
		}

		$scope.operationAllList = [];
		var dynamicPageSize = 10;
		var dynamicCurrentShowPage = 1;
		var token = false;
		$scope.getOperationList = function() {
			if(trendflag){
				$scope.scrollend = false;
				Cooperation.shareOperation(coid).then(function (data) {
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
	    }

	    //显示更多相关人
	    $scope.collapsePerson = function() {
    		$scope.collaList.relevants = sliceRlevants;
    		$scope.showMore = true;
    		$scope.collapse = false;
    		currentShowPage = 1;
	    }
		//预览界面
		$scope.previewSign = function (uuid,docName,isPdfsign) {
			$scope.flag.isGeneral = false;
			var suffix = '';
			if(docName && docName.indexOf('.')!=-1){
				suffix = docName.split('.')[docName.split('.').length-1];
			} else {
				suffix = '';
			}
			//获取电子签名uuid
			if(suffix=='pdf' && isPdfsign == 1){
				//调用加载层防止调用客户端时间过长
				var createindex;
				$timeout(function(){
					createindex = layer.load(1, {
						shade: [0.5,'#000'] //0.1透明度的黑色背景
					});
				},10);

				$timeout(function(){
					//pdf签署（客户端）调用不成功则返回详情界面
					var pdfSign = BimCo.PdfSign(uuid,suffix,currentReact,coid);
					if(!pdfSign) {
						//调用客户端失败取消加载层
						layer.close(createindex);
						return;
					} else {
						//调用客户端成功取消加载层，执行跳转
						layer.close(createindex);
						$scope.flag.isPreview = true;
						$scope.flag.isApprove = true;
						$scope.flag.isGeneral = false;
						$scope.flag.isPdfsign = false;
					}
				},500)
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
		//coid = encodeURI(coid);
		//console.info('coiddddddddddddddddddddd',coid)
//		反查模型动画
		$scope.pegRelative = function(){
        	$('.app-mask').animate({'bottom':'0px'});
//			$timeout(function(){
//				$('.app-mask').animate({'bottom':'-65px'});
//			},2000)
		}
}]);