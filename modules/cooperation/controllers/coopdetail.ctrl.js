'use strict';
/**
 * coopdetailCtrl
 */
angular.module('cooperation').controller('coopdetailCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation','$state','$stateParams','Manage','$sce','$timeout','Common','headerService',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation,$state,$stateParams,Manage,$sce,$timeout,Common,headerService) {
		console.log('detail',$stateParams.coid);
		var reCode = '';//是否正在导出
		var frombeFlag = false; //是否从be跳转(非cooperation界面)
		var currentEditOfficeUuid = '';
	    var currentSuffix = '';
	    var currentReact = '45,50,1080,720';
		var currentDeptId = $stateParams.deptId;
		var currentPpid = $stateParams.ppid;
		console.log('firstcurrentdeptid'+currentDeptId)
		console.log('firstcurrentPpid'+currentPpid)
		var isLocking = false;
		var selfDeptId = null;;//详情页面自带的deptId
		var selfPpid = null;//详情页面自带的ppid
		var productId = '';
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
		function restrom(){
			$('#w-middle').css('display','inline-block');
			$('#w-max').css('display','none');
			$('#w-middle2').css('display','inline-block');
			$('#w-max2').css('display','none');
			$('#w-middle-inner').css('display','inline-block');
			$('#w-max-inner').css('display','none');
		}
		if(!$scope.device){
			var  status = BimCo.GetWindowStatus();//缩放窗口记录状态
			if(status){
				$timeout(function(){
					restrom()
				},100)
			}
		}
		//根据ui-sref路由拿到对应的coid
		var coidFrombe = '';
	   	var coid = $stateParams.coid.trim();
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
	   	//导出
	   	$scope.downloadTotal = 0;
	   	var detailExport = {
			coopExport:[],
			coid:''
		};
		var currentUser;
		//获取当前用户
	    headerService.currentUserInfo().then(function(data){
	    	currentUser = data.userName;
	    });
	   	//获取coid对应的协同详情列表
	   	Cooperation.getCollaboration(coid).then(function (data) {
	   		//房建、市政等不同段的产品id
	   		productId = data.productId + '';
	   		$scope.collaList = data;
			//console.info('详情页面的数据展示',data);
			selfDeptId = data.deptId;
			selfPpid = data.ppid;
			//console.info(selfDeptId,selfPpid)
	   		var defaultDesc = data.desc; //默认的desc
	   		var defaultComment = _.cloneDeep(data.comments);
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
			//(isSign -1不需要签字 0需要签字 1已签字)
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
			if(!data.isCollaborator && data.isSign==0) {
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

			//白名单开放所有权限,accessCode-从客户端获取的权限码 accessCodeConfig-权限码配置 (正式代码不注释)
			if(!$scope.device && accessCode && accessCode.indexOf(accessCodeConfig.coManageCode) != -1){
				$scope.bjshow = true;
				$scope.tjshow = true;
				$scope.tgshow = true;
				$scope.jjueshow = true;
				$scope.jsshow = true;
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
				//控制页面添加审批是否显示
				$scope.flag.noNeedSign = true; 
			}

			//判断当前用户已经点过通过/拒绝按钮
			if(data.isSign == 1){
				$scope.bjshow = false;
				$scope.tgshow = false;
				$scope.jjueshow = false;
				$scope.jsshow = false;
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
			var commentDocTotal = 0; //评论的文件个数
			angular.forEach($scope.collaList.comments, function(value, key) {
				//如果存在后缀名
				commentDocTotal = commentDocTotal + value.docs.length + parseInt((value.speech && value.speech.uuid)?1:0);
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
			if($scope.link && !$scope.speachShow){
				$(".mobile-devices .paly-model").css({"width":'100%'})
			}else if(!$scope.link && $scope.speachShow){
				$(".mobile-devices .play-audio").css({"width":'100%'})
			}
			//下载文件的总个数
			if(data.speach && data.speach.uuid) {
				$scope.downloadTotal = data.pictures.length + data.docs.length + commentDocTotal + 1;
			} else {
				$scope.downloadTotal = data.pictures.length + data.docs.length + commentDocTotal;
			}

			//console.log($scope.downloadTotal);

			var picTypeArr = ['jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg'];
			var vedioTypeArr = ['avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
			var docTypeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx'];
			//导出功能
			var coopExportTemp = {
				firstTitle:'',
				secondTitle:[]
			};
			var info = [];
			var defaultTitle = {firstTitle:'协作主题：',secondTitle:'1.协作信息',threeTitle:'2.更新内容及资料'};
			var secondTitleTemp = {
				title:"",
				info:[]
			};
			var infoTemp = {
				coopMsg:[],
				docs:[]
			};
			var currentDeadline;
			coopExportTemp.firstTitle = defaultTitle.firstTitle+data.name+'';
			secondTitleTemp.title = defaultTitle.secondTitle;
			if(data.deadline && data.deadline != '不限期'){
				currentDeadline = Common.dateFormat(new Date(data.deadline)).split(' ')[0];
			} else {
				currentDeadline = '不限期';
			}
			if(!data.desc){
				data.desc = '';
			}
			var msgArrTemp = [];
			var nameArrTemp = ['协作类型：','负责人：','优先级：','限期：','状态：','标识：','描述：','创建人：','创建时间：'];
			msgArrTemp.push(data.coTypeVo.name);
			msgArrTemp.push(data.collaborator);
			msgArrTemp.push(data.priority);
			msgArrTemp.push(currentDeadline);
			msgArrTemp.push(data.status); 
			msgArrTemp.push(data.markerInfo.name);
			msgArrTemp.push(defaultDesc);
			msgArrTemp.push(data.creator);
			msgArrTemp.push(data.createTime.split(' ')[0]);
			for(var i=0;i<nameArrTemp.length;i++){
				var coopMsgTemp = {};
				if(nameArrTemp[i]==='描述：' && !data.desc) {
					continue;
				}
				coopMsgTemp = {name:nameArrTemp[i],msg:msgArrTemp[i],isFirstLine:false};
				infoTemp.coopMsg.push(coopMsgTemp);
			}

			//pic type 1 pic 2 doc 3 comment
			angular.forEach(data.pictures,function(value,key){
				var temp = {};
				if(value.name && value.name.indexOf('.') !== -1){
						// temp.exSuffix = value.name.split('.')[value.name.split('.').length -1];
						temp.fileName = value.name;
				} else {
						// temp.exSuffix='png';
						temp.fileName = value.md5+'.png';
				}
				temp.uuid = value.uuid?value.uuid:'';
				temp.type = 1;
				if(temp.uuid){
					infoTemp.docs.push(temp);
				}
			});
			//doc
			//按顺序重组 pic doc other
			var docSort = [];
			angular.forEach(data.docs,function(value,key){
				if(value.name && value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
					if(picTypeArr.indexOf(unit) !== -1) {
						docSort.push(value);
					}
                }
			});

			angular.forEach(data.docs,function(value,key){
				if(value.name && value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
					if(picTypeArr.indexOf(unit) == -1) {
						docSort.push(value);
					}
                }
			});

			angular.forEach(data.docs,function(value,key){
				if(value.name && value.name.indexOf('.') == -1){
					docSort.push(value);
                }
			});

			angular.forEach(docSort,function(value,key){
				var temp = {};
				temp.uuid = value.uuid;
				temp.fileName = value.name;
				temp.type = 2;
                if(temp.uuid){
					infoTemp.docs.push(temp);
				}
			});

			if(data.speach && data.speach.uuid){
				var temp = {};
				temp.uuid = data.speach.uuid;
				temp.fileName = data.speach.md5+'.mp3';
				temp.type = 2;
				if(temp.uuid){
					infoTemp.docs.push(temp);
				}
			}
			
			secondTitleTemp.info.push(infoTemp);

			//push 1.1的info值
			coopExportTemp.secondTitle.push(secondTitleTemp);
			
			var commentMsgArr;
			
			//comment 1.2
			secondTitleTemp = {
				title:"",
				info:[]
			};
			
			angular.forEach(defaultComment, function(value, key) {
				var commentDoc = [];
				var tempTitle = '2.' + (key + 1); 
				secondTitleTemp.title = defaultTitle.threeTitle;
				infoTemp = {
					coopMsg:[],
					docs:[]
				};
				var commentNameArrTemp = ['添加人：','添加时间：','描述：'];
				var commentMsgArrTemp = [];
				if(value.status){
					commentNameArrTemp = ['状态：','添加人：','添加时间：','描述：'];
					commentMsgArrTemp.push(value.status);
				}
				commentMsgArrTemp.push(value.commentator);
				commentMsgArrTemp.push(Common.dateFormat(new Date(value.commentTime)));
				commentMsgArrTemp.push(value.comment);
				for(var i=0;i<commentNameArrTemp.length;i++){
					var coopMsgTemp = {};
					if(i===0){
						coopMsgTemp = {name:tempTitle+commentNameArrTemp[i],msg:commentMsgArrTemp[i],isFirstLine:true};
						infoTemp.coopMsg.push(coopMsgTemp);
					} else {
						coopMsgTemp = {name:commentNameArrTemp[i],msg:commentMsgArrTemp[i],isFirstLine:false};
						infoTemp.coopMsg.push(coopMsgTemp);
					}
				}
				//按顺序重组 pic doc other
				if(value.docs) {
					angular.forEach(value.docs,function(value1,key1){
						if(picTypeArr.indexOf(value1.suffix)!==-1 && value1.uuid){
							commentDoc.push(value1);
						}
					});
					angular.forEach(value.docs,function(value3,key3){
						if(picTypeArr.indexOf(value3.suffix)==-1 || !value3.suffix && value3.uuid){
							commentDoc.push(value3);
						}
					});
					angular.forEach(commentDoc, function(value2, key2) {
						var temp = {};
						if(!value2.name && picTypeArr.indexOf(value2.suffix)!==-1){
							temp.fileName = value2.md5 + '.png';
						} else {
							temp.fileName = value2.name;
						}
						temp.uuid = value2.uuid;
						temp.type = 3;
						if(temp.uuid){
							infoTemp.docs.push(temp);
						}
					});
				}
				//comment speech
				if(value.speech && value.speech.uuid){
					var temp = {};
					temp.fileName = value.speech.md5 +'.mp3';
					temp.uuid = value.speech.uuid;
					temp.type = 3;
					if(temp.uuid){
						infoTemp.docs.push(temp);
					}
				}
				secondTitleTemp.info.push(infoTemp);
				});
				//push 1.2的info值
				coopExportTemp.secondTitle.push(secondTitleTemp);
				detailExport.coopExport.push(coopExportTemp);
				detailExport.coid = coid;
				//console.log(detailExport);
				//加载数据完成显示按钮
				$scope.loadComplete = true;
			    //console.info('currentDeptId',currentDeptId)
	   	},function(error){
	   		//简单提示信息error-infoCode-1000，删除相关error-infoCode-1005
	   		if(!$scope.device){
	   			layer.alert(error.message, {
					title:'提示',
					closeBtn: 0,
					move:false
				}, function(){
					layer.closeAll();
					var rember = ($stateParams.source || frombeFlag)?'':'rember'; //cooperation & other界面标志不同
					if(!rember){
						sessionStorage.clear();
					}
					if(currentDeptId==-1){
						$state.go('cooperation',{'deptId':currentDeptId?currentDeptId:selfDeptId, 'source':rember},{ location: 'replace'});
					}
					$state.go('cooperation',{'deptId':currentDeptId, 'ppid':currentPpid,'source':rember},{ location: 'replace'});
				});
	   		} else if ($scope.device) {
	   			//error信息跳转url(bv)
	   			sendCommand(10,coid,error.message);
	   		}
	   	});

		//导出功能对接客户端
	    $scope.doExport = function () {
	    	//console.log($scope.downloadTotal+'downloadTotal')
	    	var exportRefreshID;
	    	var strExportInfo = JSON.stringify(detailExport);
	    	// return
	    	//console.log(strExportInfo);
	    	var strCoName = $scope.collaList.coTypeVo.name +' '+$scope.collaList.name;
	    	//1.对接客户端导出协作接口，传入导出信息的Json字符串和当前协作的名称
	   		BimCo.ExportCooperation(strExportInfo, strCoName);
    		
    		//执行轮询
    		setRefreshInterval();

	 		// 设置间隔获取状态
	        function setRefreshInterval() {
	            exportRefreshID = setInterval(refreshState, 1000);
	        }

	        function refreshState() {
	        	//true执行加载中 false取消加载中
	 			reCode = BimCo.IsShowProgressBar();
	 			if(reCode){
	 				//调用加载层防止调用客户端时间过长
		    		$('.downloading').css('display','block');
		    		$('.down-mark').css('display','block');
		    		$('.downloadIndex').css('display','block');
		    		$('html').css('overflow-y','hidden');
	 			} else if (!reCode){
	 				//清除轮询 不显示加载层
					clearInterval(exportRefreshID);
    				$('.downloading').css('display','none');
		    		$('.down-mark').css('display','none');
		    		$('.downloadIndex').css('display','none');
		    		$('html').css('overflow-y','');
	 			}
	 		}

	    }

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

		//点击播放按钮获取MP3地址并播放(pc)
		var currentMp3Id;
		var currentUuid;
		var refreshID;
		var isPlay = false;
		$scope.getPcMP3Url = function (uuid,source){
			var uuidList = [uuid];
			
			if(source=="comment"){
				//if(currentUuid&&uuid!=currentUuid){
				  if (isPlay) {
					console.log("当前正在播放录音,不处理")
					layer.alert('当前正在播放录音！', {
					  	title:'提示',
					  	closeBtn: 0,
					  	move:false
					});
				} else {
					isPlay = true;
					// console.log("播放录音")
					currentUuid = uuid;
					$('#open_'+uuid).hide();
					$('#close_'+uuid).show();
					Cooperation.getPcMp3Url(uuidList).then(function(data){
						angular.forEach(data,function(value,key){
							// debugger
							refreshID = setInterval(getAudioProgress,1000);

							//console.info(currentMp3Id);

							currentMp3Id = BimCo.AudioPlay(value);//调用pc播放录音返回int类型
						});
					});
				}
			}else{
				// if((currentUuid && currentUuid != uuid && $scope.flag.audioPlaying)){
				    if (isPlay) {
					layer.alert('当前正在播放录音！', {
					  	title:'提示',
					  	closeBtn: 0,
					  	move:false
					});
				} else {
					isPlay =true;
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
		}
		
		//点击取消播放
		$scope.AudioStop = function (source, uuid){
			isPlay = false;
			currentUuid = null;
			if(source == ''){
				$scope.flag.audioPlaying = false;
			} else {
				$('#open_'+uuid).show();
				$('#close_'+uuid).hide();
			}
			clearInterval(refreshID);
		}

		//轮询当前MP3是否播放完成
		function getAudioProgress() {
			//调用pc端获取进度条
			// console.info(currentMp3Id);
			var currentProgress = BimCo.AudioProgress(currentMp3Id);
			// console.info(currentProgress);
			// var currentProgress = 100;
			if(currentProgress >= 100){
				isPlay = false;
				BimCo.AudioStop(currentMp3Id);
				$scope.flag.audioPlaying = false;
				$('#open_'+currentUuid).show();
				$('#close_'+currentUuid).hide();
				
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
		//console.info(currentDeptId,currentPpid)
		//记忆跳转
		function isReadyDelete(){
			var rember = ($stateParams.source || frombeFlag)?'':'rember'; //cooperation & other界面标志不同
			if(!rember){
				sessionStorage.clear();
			}
			if(currentDeptId==-1){
				$state.go('cooperation',{'deptId':currentDeptId, 'source':rember},{ location: 'replace'});
			}
			$state.go('cooperation',{'deptId':currentDeptId, 'ppid':currentPpid,'source':rember},{ location: 'replace'});
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
	            	  if(data && (data !== currentUser)){
	            		  	checkCoLocked = true;
						    isLocking = true;
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

	   	 	if($scope.allowEdit) {
	   	 		Cooperation.checkOut(coid).then(function(data) {
	   	 			$state.go('editdetail', {coid: coid});
	   	 		},function(error){
	   	 			//1005跳转主界面 1000刷新当前页
	   	 			if(error.infoCode == '1005'){
	   	 				layer.alert(error.message, {
		        		  	title:'提示',
						  	closeBtn: 0,
						  	move:false
						},function(){
							layer.closeAll();
							isReadyDelete();
						});
	   	 			} else {
	   	 				layer.alert(error.message, {
		        		  	title:'提示',
						  	closeBtn: 0,
						  	move:false
						},function(){
							layer.closeAll();
	   	 					$state.go($state.current, {}, {reload: true});
						});
	   	 			}
	   	 		});
	   	 	} else {
	   	 		layer.alert('当前协作已被“'+$scope.collaList.operationName+'”签出，请稍后重试！', {
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
	   		//工程id 协同id 产品id
	   		var LocateComponentSignal =  BimCo.LocateComponent(ppid,coid,productId);
	   		//反查失败页面不做任何操作
	   		if(!LocateComponentSignal){
	   			return;
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
			if(optType==10){
				param = '{"optType":'+optType+',"coid":"'+id+'","message":"'+ uuid +'","isException":true}';
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
        	if(!accessCode && accessCode.indexOf(accessCodeConfig.updateCode)==-1){
	    		layer.alert('没有当前功能使用权限，请联系企业管理员', {
					title:'提示',
					closeBtn: 0,
					move:false　
				});
				return;
	    	}
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
					},function(){
						//infoCode1005代表删除协作相关操作
						if(data.infoCode=='1005'){
							layer.closeAll();
							isReadyDelete();
						} else {
							layer.closeAll();
						}
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
			});
			//防止出现同步加载错误
			if($scope.device){
				$timeout(function(){
					$(".scrollLoading").scrollLoading();
				},0);
			}
		});
		
		//协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
		$scope.doCollaboration = function (statusCode) {
			var params = {
				coid:coid,
				docs:[],
				operationType:statusCode
			}
			var checkCoLocked = false;
			$.ajax({
	              type: "POST",
	              url: basePath+'rs/co/checkCoLocked/'+coid,
	              async:false,
	              contentType:'text/HTML',
	              success: function(data,status,XMLHttpRequest){
	            	  if(data && data !== currentUser){
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
					},function(){
						//当前协作被删除1005
						if(data.infoCode === '1005'){
							layer.closeAll();
							isReadyDelete();
						} else {
							layer.closeAll();
							$state.go($state.current, {}, {reload: true});
						}
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
					//console.log(typeof result)
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
				$scope.flag.isApprove = false;
    		},function(data){
    			//弹框提示用户当前被签出
    			BimCo.MessageBox("提示" ,data.message, 0);
    			return;
    		});
    		// 通知客户端修改窗口大小(勿删)
    		// var react = "45,100,1080,720";
    		// BimCo.MovePdfWnd(react);
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
	    		//pdf是否修改标志
	    		$scope.flag.isPdfModify = false;
	    		$scope.backDetail('submit');
	    		return;
	    	} else {
	    		$scope.flag.isPdfModify = true;
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
	    	if(!BimCo.IsModify()){
	    		//pdf是否修改标志
	    		$scope.flag.isPdfModify = false;
	    		$scope.backDetail('cancel');
	    		return;
	    	} else {
	    		$scope.flag.isPdfModify = true;
	    	}
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
	    $scope.max = true;
	    $scope.maxRestore = function ($event) {
            //对接pc
            BimCo.SysCommand('SC_MAXIMIZE');
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
	    }
	    
	    //显示更多相关人
	    $scope.collapsePerson = function() {
    		$scope.collaList.relevants = sliceRlevants;
    		$scope.showMore = true;
    		$scope.collapse = false;
    		currentShowPage = 1;
	    }

	    //预览界面跳转回详情
	    $scope.backDetail = function (source) {
	    	if(source == '' ){
	    		if(!BimCo.IsModify()){
		    		//pdf是否修改标志
		    		$scope.flag.isPdfModify = false;
		    		backDetail();
		    		return;
		    	} else {
		    		$scope.flag.isPdfModify = true;
		    	}
		    	var rtn = BimCo.MessageBox("提示" ,'          '+"放弃编辑？", 0x31 );
		    	if(rtn==1) {
		    		//取消调用签入
		    		Cooperation.checkIn(coid).then(function(data){
		    		});
		    		BimCo.SignCancel();
		    		BimCo.CancelSubmitAll();
		    		$scope.flag.isPreview = false;
		    	}
	    	} else {
	    		backDetail();
	    	}
	    }

	    function backDetail () {
	    	//没有点击添加审批意见不调用签入
	    	if($scope.flag.isPreview){
	    		BimCo.SignCancel();
	    		BimCo.CancelSubmitAll(); 
	    	}
	    	if($scope.flag.isPreview && $scope.flag.isPdfsign && !$scope.flag.isPdfModify){
	    		//签署页面返回调用签入
	    		Cooperation.checkIn(coid).then(function(data){
	    		});
	    	}
	    	$scope.flag.isPreview = false;
	    	$scope.flag.isPdfsign = false;
	    	$scope.flag.isApprove = false;
	    }
	    
	    //详情页面跳转回homepage(cooperation)
	   	$scope.backCooperation = function (){
	   		if($scope.collaList.status=='草稿箱'){
	   			//草稿箱
	   			$scope.collaList.deptId = 0;
	   		} else if(!$scope.collaList.deptId && !$scope.collaList.ppid && $scope.collaList.status!='草稿箱'){
	   			//未关联
	   			$scope.collaList.deptId = -1;
	   		}
	   		var rember = (($stateParams.source == 'formbe') || frombeFlag)?'':'rember'; //cooperation & other界面标志不同
	   		if(!rember){
	   			sessionStorage.clear();
	   		}
	   		$state.go('cooperation',{'deptId':$scope.collaList.deptId, 'ppid':$scope.collaList.ppid,'status':$scope.collaList.statusId,'source':rember},{ location: 'replace'});
				$('.content-container ').height($(window).height()-($('.filter-table').height()+160));
				$('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
	   		}

	   	//反查formbe,跳转详情页面
	   	var currentPage = 'coopdetail';

	   	$scope.checkFromBe = function() {
			console.info('self',selfDeptId,selfPpid)
	   		frombeFlag = true;
	   		coidFrombe = $('#checkformbe').val();
	   		reCode = BimCo.IsShowProgressBar();
	   		if($scope.flag.isPdfsign){
	   			//当前正在签署且已经签出协作
	   			var rtn = BimCo.MessageBox("提示","当前正在签署中，是否跳转？", 0x31);
	   			//确定1取消2
	   			if(rtn==1){
	   				BimCo.SignCancel();
	    			BimCo.CancelSubmitAll();
	   				$state.go('coopdetail',{'coid':coidFrombe,'deptId':selfDeptId,"ppid":selfPpid},{reload:true});
	    			Cooperation.checkIn(coid).then(function(data) {
	   	 			});
	   			}
	   		} else if (reCode){
	   			layer.alert('当前正在导出，无法切换！', {
				  	title:'提示',
				  	closeBtn: 0,
				  	move:false
				});
	   		} else if ($scope.flag.isApprove && !$scope.flag.isPdfsign){
	   			//当前正在签署预览界面但没有签出协作
	   			var rtn = BimCo.MessageBox("提示","当前正在签署中，是否跳转？", 0x31);
	   			//确定1取消2
	   			if(rtn==1){
	   				BimCo.SignCancel();
	    			BimCo.CancelSubmitAll();
	   				$state.go('coopdetail',{'coid':coidFrombe,'deptId':selfDeptId,"ppid":selfPpid},{reload:true});
	   			}
	   		} else if (coidFrombe != coid){
	   			//非签署状态不同协作
				$state.go('coopdetail',{'coid':coidFrombe,'deptId':selfDeptId,"ppid":selfPpid})
	   		} else if (coidFrombe == coid && !$scope.flag.isApprove && !modalInstance){
	   			//非签署状态相同协作非添加更新状态
	   			$state.go('coopdetail',{'coid':coidFrombe,'deptId':selfDeptId,"ppid":selfPpid},{reload:true});

	   		}
	   	}
		
		//删除协作
		$scope.deleteCoop = function(){
			//判断是否有删除权限
			if(!accessCode && accessCode.indexOf(accessCodeConfig.deleteCode)==-1){
				layer.alert('没有当前功能使用权限，请联系企业管理员', {
					title:'提示',
					closeBtn: 0,
					move:false
				});
				return;
			}
			//确认要删除该协作吗？
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
				return ;
			}
			layer.confirm('确认要删除该协作吗？',{
				btn:['确认','取消'],
				move:false
			},function(){
				layer.closeAll();
				Cooperation.removeCoopertion(coid).then(function(data){
					$('tr[coid="'+coid+'"]').remove();
					if($scope.collaList.status=='草稿箱'){
						//草稿箱
						$scope.collaList.deptId = 0;

					} else if(!$scope.collaList.deptId && !$scope.collaList.ppid && $scope.collaList.status!='草稿箱'){
						//未关联
						$scope.collaList.deptId = -1;
					}
					var rember = ($stateParams.source || frombeFlag)?'':'rember'; //cooperation & other界面标志不同
					if(!rember){
						sessionStorage.clear();
					}

					$state.go('cooperation',{'deptId':$scope.collaList.deptId, 'ppid':$scope.collaList.ppid,'status':$scope.collaList.statusId,'source':rember},{ location: 'replace'});
				},function(error){
					//协作被删除的情况下或者被签出的情况
					layer.alert(error.message, {
						title:'提示',
						closeBtn: 0,
						move:false
					},function(){
						if(error.infoCode=='1005'){
							layer.closeAll();
							isReadyDelete();
						} else {
							layer.closeAll();
						}
					});
				});
			})
		}
	   	//调用心跳机制
	   	if(!$scope.device){
	   		Cooperation.heartBeat();
	   		console.log('coopdetail')
	   	}
        //跳转新页面去除心跳机制(同理也可以进入不同控制器清楚refreshID)
        $scope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
			//console.log(toState, toParams, fromState);
                clearInterval(ApplicationConfiguration.refreshID);
                if(!!modalInstance){
                	modalInstance.dismiss();
                }
        });
}]);