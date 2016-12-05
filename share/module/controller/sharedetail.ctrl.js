'use strict';
/**
 * coopdetailCtrl
 */
bvShare.controller('sharedetailCtrl', ['$scope','$stateParams','$state','Share','$timeout','$sce',
    function ($scope,$stateParams,$state,Share,$timeout,$sce) {
		$scope.link = false;
		$scope.speachShow = false;
		$scope.flag = {};
		$scope.isTypePdf = true;//判断文件类型是否是pdf格式
		$scope.showMore = false;
		$scope.collapse = false;
		var picTypeArr = ['jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg'];
		//判断pc or bv
		if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
			$scope.device = true;
		}

		if(client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad) {
			$scope.ios = true;
		}
		
	   	var coid = ''; //coid
	   	var ename = '';	//企业名称
	   	var eid = ''; //企业id
	   	var urlParams = window.location.search.substr(1); //截取url参数
	   	var urlParamsTemp = urlParams.split('&');
	   	coid = urlParamsTemp[0].substr(5); //url传递的coid
	   	// alert('coid'+coid);
	   	var ppid = 0;
	   	var coTypeVo = 0;
	   	var status = "";
	   	var allRelevants = [];
	   	var sliceRlevants = [];
	   	var totalPage = 0;
	   	var pageSize = 8;
		var pageSizePc = 16;
	   	var currentShowPage = 1;
	   	$scope.transcoid = coid;
	   	var  previewCount = 1;
		var fileUrlImg;
		var arrType=['jpg','png','bmp','tif','tiff','gif','jpeg','PNG','GIF','JPG'];

        //判断是否是三星机型
		function isSM(){
			var D = navigator.userAgent;
			var e = (D.match(/Chrome\/([\d.]+)/) || D.match(/CriOS\/([\d.]+)/)) ? true: false;
			var G = (D.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true: false;
			var p = (D.match(/(iPad).*OS\s([\d_]+)/)) ? true: false;
			var S = navigator.userAgent.indexOf("SM-") >= 0;
			if (G & S) {
				return true;
			}
			return false;
		}

       	//bv播放按钮显示不同颜色
		$timeout(function(){
			if($scope.device) {
				$('.palys').addClass('play-bv');
			} else {
				$('.palys').addClass('play-pc');
			}
			$scope.$apply();
		},0);
		
	   	Share.shareDetail(coid).then(function (data) {
	   		eid = data.epid?data.epid:'';
	   		ename = data.enterpriseName?data.enterpriseName:'';
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
			$timeout(function(){
				if(data.desc ==null || data.desc==''){
	            	$('.mobile-job-descrition,.pc-job-descrition').css("display",'none');
	            }else{
	                $('.mobile-job-descrition,.pc-job-descrition').css("display",'block');
	            }
	            //详情联系人
	            if(data.relevants.length==0){
	                $(".mobile-relate,.pc-relate").css('display','none');
	            }else{
	                $(".mobile-relate,.pc-relate").css('display','block');
	            }
	            //详情照片
	            if(data.pictures.length==0){
	                $(".mobile-photo,.pc-photo").css('display','none');
	            }else{
	                $(".mobile-photo,.pc-photo").css('display','block');
	            }
	            //详情资料
	            if(data.docs.length==0){
	                $(".mobile-means,.pc-means").css('display','none');
	            }else{
	                $(".mobile-means,.pc-means").css('display','block');
	            }
	            //详情回复
	            if(data.comments.length==0){
	                $(".mobile-reply,.pc-reply").css('display','none');
	            }else{
	                $(".mobile-reply,.pc-reply").css('display','block');
	            }
	            $scope.$apply();
        	},200);
            

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

			//判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
			$timeout(function(){
				if($scope.link && !$scope.speachShow){
					$(".mobile-devices .paly-model").css({"width":'100%'});
				}else if(!$scope.link && $scope.speachShow){
					$(".mobile-devices .first.play-audio").css({"width":'100%'});
				}
				$scope.$apply();
			},100);
			
			
			if(isSM()){
				$scope.smUrl = "bv4phone://lubanmobile.share?opt=1&eid="+eid+"&ename="+encodeURIComponent(ename)+"&coid="+coid;
			}

	   	},function(error){
	   		$scope.flag.error = true;
	   		$('body').css('overflow','hidden');
	   		$('body').css('position','fixed');
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
		              url: basePath+'rs/co/shareMP3URL',
		              data:speechUrl,
		              async:false,
		              contentType:'text/HTML',
		              success: function(mp3url,status,XMLHttpRequest){
		            	   if(mp3url.indexOf('<!DOCTYPE html>')!=-1){
		            	 		document.location = 'co_detail.jsp?coid='+ coid;
		            	   	}
		            	   	// debugger
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

		//play-audio(播放声音的显示播放窗口事件)
		$scope.audioClose = function () {
			$("#jquery_jplayer_1").jPlayer("stop");
			$(".detail-voice").hide();
			$(".detail-close").hide();
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
				Share.shareOperation(coid).then(function (data) {
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

			//防止出现同步加载错误
            // if($scope.device){
                $timeout(function(){
                    $(".scrollLoading").scrollLoading();
                },0);
            // }
            // 
		});

		$scope.$on('ngRepeatFinished1', function (ngRepeatFinishedEvent) {
 			$(function(){
			    $('#thumbs dl img').touchTouch();
			});
			$timeout(function(){
                $(".scrollLoading").scrollLoading();
            },0);
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
	    //bv 分享页面图片预览功能start
		$scope.previewSignEle = function(obj,fileUrl,source){
			if(source === 1){
				 return; 
			}

			if(source === 2){
				if(arrType.indexOf(obj.suffix)===-1){
					$scope.transToBv()
					return;
				}
			}
			if(source === 3){
				if(obj.name && obj.name.indexOf('.') !== -1){
                    var unit = obj.name.split('.')[obj.name.split('.').length - 1];
					if(picTypeArr.indexOf(unit) === -1) {
						$scope.transToBv()
						return ;
					}
                }
			}
			fileUrlImg = fileUrl;
			var showImgMSG = '<div class="preview-tools"><div class="show-pictures animated fadeIn"><img src='+fileUrlImg+'></div></div>';
			$('body').append(showImgMSG);
			$('body').css('overflow-y','hidden');
			$('body').css('position','fixed');
			$('.preview-tools').css('display','block');
			$('.showMsg-mask').css('display','block');
		}

		$scope.removeImg = function () {
			$('.preview-tools').css('display','none');
			$('.preview-tools').remove();
			$('.showMsg-mask').css('display','none');
			$('body').css('overflow-y','');
			$('body').css('position','');
			// $("body").unbind("touchmove");
		}

		
	/**
	 * [判断是否在微信中打开]
	 * @return {Boolean} [description]
	 */
	function isWeiXin() {
		var D = navigator.userAgent;
		var e = (D.match(/Chrome\/([\d.]+)/) || D.match(/CriOS\/([\d.]+)/)) ? true: false;
		var G = (D.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true: false;
		var p = (D.match(/(iPad).*OS\s([\d_]+)/)) ? true: false;
		var x = (!p && D.match(/(iPhone\sOS)\s([\d_]+)/)) ? true: false;
		var f = navigator.userAgent.indexOf("MicroMessenger") >= 0;
		if (f) {
			return true;
		}
		return false;
	}
	/**
	 * [判断ios]
	 * @return {Boolean} [description]
	 */
	function isIOS() {
		var D = navigator.userAgent;
		var e = (D.match(/Chrome\/([\d.]+)/) || D.match(/CriOS\/([\d.]+)/)) ? true: false;
		var G = (D.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true: false;
		var p = (D.match(/(iPad).*OS\s([\d_]+)/)) ? true: false;
		var x = (!p && D.match(/(iPhone\sOS)\s([\d_]+)/)) ? true: false;
		if (x) {
			return true;
		}
		return false;
	}
	/**
	 * [判断andriod]
	 * @return {Boolean} [description]
	 */
	function isAndroid() {
		var D = navigator.userAgent;
		var e = (D.match(/Chrome\/([\d.]+)/) || D.match(/CriOS\/([\d.]+)/)) ? true: false;
		var G = (D.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true: false;
		var p = (D.match(/(iPad).*OS\s([\d_]+)/)) ? true: false;
		var x = (!p && D.match(/(iPhone\sOS)\s([\d_]+)/)) ? true: false;
		if (G) {
			return true;
		}
		return false;
	}

	
	/**
	 * (1)本地已安装,直接跳转app (2)本地未安装,点击不做处理 
	 *  winXinUrl 微信下载地址
	 */
	
 	var weiXinUrl = "http://fusion.qq.com/cgi-bin/qzapps/unified_jump?appid=12154464&isTimeline=false&actionFlag=0&params=pname%3Dcom.lubansoft.bimview4phone%26versioncode%3D1%26channelid%3D%26actionflag%3D0&coid=8989898998";
 	var newWeiXinUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.lubansoft.bimview4phone";
 	var ifr; //创建iframe,用于唤起本地app
 	function openApp(url,source) {
 		//如果iframe存在则移除
 	  	if($("iframe").length){
 	  	   document.body.removeChild(ifr);
 	  	}
	  ifr = document.createElement("iframe"); 
	  ifr.setAttribute('src', url); 
	  ifr.setAttribute('style', 'display:none');
	  document.body.appendChild(ifr);
    }

	var el;
    function openAppBySx() {
    	el = document.createElement("a");
		document.body.appendChild(el);
		// $(el).addClass("open-by-sx");
		// alert($scope.smUrl);
		el.href = $scope.smUrl; //url 是你得到的连接
		el.target = '_new'; //指定打开
		el.click();
		// document.body.removeChild(el);
    }
	  
 	$scope.transToBv = function(){
		transToBv();
	}
 	
 	//判断是否打开及跳转
	function transToBv(){
		if(!$scope.device){
			alert('请在手机端打开BimView软件！');
			return;
		}
		var url = "bv4phone://lubanmobile.share?opt=1&eid="+eid+"&ename="+encodeURIComponent(ename)+"&coid="+coid;
		// alert(url)
		if(isWeiXin()){
			if(isIOS()){
				alert("请点击右上角，选择 '在 Safari 中打开'。"); 
			} else if(isAndroid()) {
				alert("请点击右上角，选择 '在浏览器中打开'（非QQ浏览器）。");
			}
		} else {
			if(isIOS()){
				if(navigator.userAgent.indexOf("Safari") > -1){
					// openApp(url,'ios');  //1.0.0版本的打开方式（适用于ios9.0以下）
					location.href = url;
				    // setTimeout(function() {
				    //     window.location = newWeiXinUrl;
				    // }, 500);
				    // setTimeout(function() {
				    //     location.reload();
				    // }, 1000);
				}else{
					//alert("请点击右上角，选择 '在浏览器中打开'（非QQ浏览器）。")
					alert("请点击右上角，选择 '在 Safari 中打开'。");
				}
			}
			else if(isAndroid()) {
				if(isSM()){
					openAppBySx();
				} else {
					openApp(url,'android');
				}
			}
		}
	}
	$scope.downloadBv = function (){
		location.href = newWeiXinUrl;
	}
 			
}]);