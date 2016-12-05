/**
 * Created by sdergt on 2016/8/16.
 */
angular.module('cooperation').controller('editdetailCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', 'Common','Manage','$timeout','headerService','$sce',

    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, Common, Manage,$timeout,headerService,$sce) {
        $scope.device = false;
        $scope.flag = {};
        //判断pc or bv
        if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
            $scope.device = true;
        }
        //如果当前andriod版本低于4.3则使用原生的select代替
        if(client.system.android && client.system.android < 4.3){
            $scope.flag.adroidLs4 = true;
        }
        $scope.showMore = false;
		$scope.collapse = false;
        var coid = $stateParams.coid;
        $scope.transcoid = $stateParams.coid;
        $scope.zhenggai = false;
        $scope.responsiblePerson = {}//选择相关人
        var contracts = [];
        //设置日期相关
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1,
            showWeeks: false,
            minDate: new Date(),
            yearRows  :3,
            yearColumns:3
        };
        function restrom(){
            $('#w-middle').css('display','inline-block');
            $('#w-max').css('display','none');
            $('#w-middle2').css('display','inline-block');
            $('#w-max2').css('display','none');
            $('#w-middle-inner').css('display','inline-block');
            $('#w-max-inner').css('display','none');
        }
        if(!$scope.device){
            var  status = BimCo.GetWindowStatus();
            if(status){
                $timeout(function(){
                    restrom()
                },100)
            }
        }
        //详情描述多行文本框随内容去撑开
        $scope.open2 = function () {
            //console.info(123123131)
            $scope.popup2.opened = true;
            $scope.isDeadlineNull = false;

        };

        $scope.popup2 = {
            opened: false
        };

        $scope.checksignal = false;
        //协作详情数据
        var coid = $stateParams.coid;
        var allRelevants = [];
        var sliceRlevants = [];
        var pcAllRelevants = [];
        $scope.related = {
                sign:[],
                noSign:[],
            };
     	var totalPage = 0;
	   	var pageSize = 8;
        var pageSizePc = 18;
	   	var currentShowPage = 1;
	   	var relatedNews = [];

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
        
        Cooperation.getCollaboration(coid).then(function (data) {
        	angular.forEach(data.relevants,function(value,key){
        		value.mustExist = true;	// 编辑时原有的相关人是否必须存在 true必须存在  false可以不存在
        		value.canSign = true;	// 编辑时原有的相关人是否可以修改签字 true可以  false不可以
        		if(value.needSign){
        			$scope.related.sign.push(value);
        		}else{
        			$scope.related.noSign.push(value);
        		}
        	});
        	relatedNews = $scope.related.sign.concat($scope.related.noSign);
        	$scope.relatedNew = relatedNews;
            var currentMarkInfo = data.markerInfo.id;
            $scope.collaList = data;
            $scope.priority =  data.priority;
            if($scope.device){
            	  allRelevants = _.cloneDeep(data.relevants);
            	  totalPage = parseInt((allRelevants.length + pageSize -1) / pageSize);
            	 if(totalPage > 1){
            		sliceRlevants = _.cloneDeep(data.relevants.slice(0,currentShowPage*pageSize));
	                $scope.collaList.relevants =sliceRlevants;
	                $scope.isRevlentMore = true;
	                $scope.showMore = true;
	            }
            	 angular.forEach(allRelevants, function (value, key) {
                     var unit = {};
                     unit.username = value.username;
                     unit.needSign = value.needSign;
                     contracts.push(unit);
                 });
            } else if(!$scope.device){
            	pcAllRelevants = data.relevants;
                totalPage = parseInt((relatedNews.length + pageSizePc -1) / pageSizePc);
                if(totalPage > 1){
                    sliceRlevants = relatedNews.slice(0,currentShowPage*pageSizePc);
                    $scope.relatedNew = sliceRlevants;
                    $scope.isRevlentMore = true;
                    $scope.showMore = true;
                }
                angular.forEach(pcAllRelevants, function (value, key) {
                    var unit = {};
                    unit.username = value.username;
                    unit.needSign = value.needSign;
                    contracts.push(unit);
                });
            }
           
            if(data.priority == "I") {
                $scope.priority = "1";
            } else if (data.priority == "II") {
                $scope.priority = "2";
            } else if (data.priority == "III") {
                $scope.priority = "3";
            }
            $scope.dt = data.deadline;
            $scope.desc = data.desc;

            if(!data.deadline) {
                $scope.isDeadlineNull = true;
            }
            if( data.deadline && data.isDeadline==3){
                $scope.deadlineStyle = 'red';
            }

            //遍历评论转换“\n”
            if(data.comments.length){
                angular.forEach(data.comments,function(value,key){
                    if(value.comment){
                        $scope.collaList.comments[key].comment = replaceAll(value.comment,"\n","</br>");
                    }
                });
            }
           
            if(data){
                //获取标识
                Cooperation.getMarkerList().then(function (data) {
                    $scope.markerList1 = data;
                    $scope.mark1 = currentMarkInfo + '';
                     if(data[0].markerId){
                        $timeout(function() {
                            $('.selectpicker1').selectpicker({
                                style: '',
                                size: 'auto'
                            });
                        },0);
                     }
                });
                //获取优先级
                Cooperation.getPriorityList().then(function(data) {
                    $scope.priorityList = data;
                    if(data[0].code){
                        $timeout(function() {
                            $('.selectpicker').selectpicker({
                                style: '',
                                size: 'auto'
                            });
                        },0);
                    }
                   
                });
                // data.coTypeVo.type === 1 问题整改
        		var isShowArr = ["已结束","已通过","已拒绝"];
        		// 只有状态是问题整改且不是已结束、已通过、已拒绝状态 才显示状态
        		if(data.coTypeVo.type === 1 && isShowArr.indexOf($scope.status) == -1) {	// isShowArr中不包括$scope.status
        			$scope.zhenggai = true;
        			$(".detail-state").show();
        		}
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

            //选择负责人
            $scope.selectResponsible = function () {
                var modalInstance = $uibModal.open({
                    //windowClass: 'select-person-responsible-modal',
                    backdrop : 'static',
                    templateUrl: 'template/cooperation/select_person_responsible.html',
                    controller:'selectpersonCtrl',
                    resolve:{
                        items: function () {
                            return [];
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.responsiblePerson = selectedItem;
                });
            }
            headerService.currentUserInfo().then(function(data){
                $scope.responsiblePerson.username = data.userName;
                $scope.responsiblePerson.avatar = data.avatarUrl;
            })
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
                if(value.docs) {
                    angular.forEach(value.docs, function(value1, key1) {
                    	var imgsrc = "imgs/pro-icon/icon-";
                    	var unit = value1.suffix;
                    	    unit = unit.toLowerCase();
                        if(typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
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
                    })
                }
            });


        });
        
        //更改标识
        $scope.switchMark = function (mark1) {
            $scope.mark1 = mark1;
        }

        //更改优先级
        $scope.switchPriority = function (priority) {
            $scope.priority = priority;
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


        function sendCommand(optType,id,uuid){

            var param = '{"optType":'+optType+',"coid":"'+id+'"}';
            if(optType==2||optType==3||optType==5||optType==6){
                param = '{"optType":'+optType+',"coid":"'+id+'","fileUUID":"'+ uuid +'","isPreview":true'+'}';
            }
            document.location = 'http://localhost:8080/bv/?param='+param;
        }

        $scope.ok = function () {
            //bv客户端主题为空提示
            if(!$scope.collaList.name && $scope.device) {
                var index = layer.open({
                  type: 1,
                  title: false,
                  closeBtn: 0,
                  shadeClose: true,
                  skin: 'yourclass',
                  move: false,
                  content: '<div class="tips">当前协作主题不能为空</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
                });
            }
            if(!$scope.collaList.name && !$scope.device) {
                $scope.flag.topicNull = true;
                return;
            }

            //pc调用layer加载层
            if(!$scope.device && $scope.collaList.name){
                var createindex = layer.load(1, {
                    shade: [0.5,'#000'], //0.1透明度的黑色背景
                });
            }

            if($scope.device){
                $scope.dt = $('.date-value-bv').html();
            } else {
                $scope.dt = $('.date-value').html();
            }
            
            if($scope.dt) {
                $scope.dt =  $scope.dt;
            } else {
                $scope.dt = '';
            }
            var data = {
                coid: coid,
                contracts: contracts,
                deadline: $scope.dt,
                desc: $scope.collaList.desc,
                markerid: parseInt($scope.mark1),
                name: $scope.collaList.name,
                priority: $scope.priority,
                status: $scope.collaList.statusId
            };

            /*$.ajax({
                  type: "POST",
                  url: basePath+ "rs/co/checkIn/"+coid,
                  contentType: "application/json; charset=utf-8",
                  dataType : 'json',
                  success: function(data,status,XMLHttpRequest){
                  },
                  error:function(XMLHttpRequest, textStatus, errorThrown){
                       console.log(XMLHttpRequest.readyState)
                       var data = JSON.parse(XMLHttpRequest.responseText);
                       console.log(data.message);
                  } 
            });*/

            Cooperation.updateCollaboration(data).then(function (data,status) {
                // alert("调用updateCollaboration"+data);
                if($scope.device) {
                    //bv成功
                    // alert("$scope.device"+$scope.device);
                    if(data.indexOf('<!DOCTYPE html>')!=-1){
                        // alert("返回登录页面成功"+ data.indexOf('<!DOCTYPE html>')!=-1);
                        var param = '{"optType":'+9+',"isSuccess":'+false+'}';
                    } else {
                        // alert("返回登录页面失败");
                        var param = '{"optType":'+9+',"isSuccess":'+true+'}';
                    }
                    document.location = 'http://localhost:8080/bv/?param='+param;
                } else {
                    layer.close(createindex);//关闭layer加载层
                    // document.location = 'co_detail.jsp?coid='+ coid;
                    document.location= '#/coopdetail/?coid='+coid+'+&source='+'frombe';
                }
               
            },function(data){
               if($scope.device) {
                    //bv失败
                    var param;
                    if(data && data.message){
                        //data.message存在
                        param = '{"optType":'+9+',"isSuccess":'+false+',"message":"'+data.message+'"}';
                    } else {
                        param = '{"optType":'+9+',"isSuccess":'+false+'}';
                    }
                    document.location = 'http://localhost:8080/bv/?param='+param;
                } else {
                    layer.close(createindex);//关闭layer加载层
                    layer.alert(data.message, {
                        title:'提示',
                        closeBtn: 0,
                        move: false
                    });
                }
            });
          
        }
       
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

            // 详情页面图片资料悬浮出现下载区域
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
            
            $(".replay-down").hover(function(){
                $(this).find('.user-down').animate({"bottom":'0'})
            },function(){
                $(this).find('.user-down').animate({"bottom":'-30px'})
            });

            //防止出现同步加载错误，滚动加载
            if($scope.device){
                $timeout(function(){
                    $(".scrollLoading").scrollLoading();
                },0);
            }
        });

        //选择相关人
        $scope.selectRelated = function () {
            var modalInstance = $uibModal.open({
                windowClass:'edit-related',
                size:'lg',
                backdrop : 'static',
                animation:false,
                templateUrl: 'template/cooperation/select_person_related.html',
                controller:'selectpersonCtrl',
                resolve:{
                    items: function () {
                        return $scope.related;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {	// 向后台发送需要保存的数据
                $scope.related.noSign = selectedItem.noSign;
                $scope.related.sign = selectedItem.sign;
                relatedNews = selectedItem.sign.concat(selectedItem.noSign);
                $scope.relatedNew = relatedNews;
                currentShowPage = 1;
                if(!$scope.device){
	                totalPage = parseInt((relatedNews.length + pageSizePc -1) / pageSizePc);
	                if(totalPage > 1){
	                    sliceRlevants = relatedNews.slice(0,currentShowPage*pageSizePc);
	                    $scope.relatedNew = sliceRlevants;
	                    $scope.isRevlentMore = true;
	                }
                }
                if(contracts.length){
                	contracts = [];
                }
                angular.forEach(selectedItem.noSign, function (value ,key) {	// 不需要签字
                    var needSign = false;
                    var a = {}
                    a.needSign = needSign;
                    a.username = value.username;
                    contracts.push(a);
                });
                angular.forEach(selectedItem.sign, function (value ,key) {	// 需要签字
                    var needSign = true;
                    var a = {}
                    a.needSign = needSign;
                    a.username = value.username;
                    contracts.push(a);
                });
            });
        }
        //点击蒙层出现关闭按钮
        $scope.onTurn = function(){
            //console.info("小白兔")
        }

        $scope.previewSign = function (uuid,docName) {
                var data ={fileName:docName,uuid:uuid};
                Manage.getTrendsFileViewUrl(data).then(function (result) {
                    console.log(typeof result)
                    $scope.flag.isPreview = true;
                    $scope.previewUrl = $sce.trustAsResourceUrl(result);
                },function (data) {
                    $scope.flag.isPreview = false;
                    $scope.previewUrl ='';
                    var obj = JSON.parse(data);
                    layer.alert(obj.message, {
                        title:'提示',
                        closeBtn: 0,
                        move: false
                    });
                });
        }

        // 返回上个页面
        $scope.backDetail = function() {
        	//解锁协作
        	Cooperation.checkIn(coid).then(function(data){
    		});
        	$state.go('coopdetail', {'coid':coid});
        }

      //最大化、最小化、还原、关闭
        //SC_MAXIMIZE、SC_MINIMIZE、SC_RESTORE、SC_CLOSE  
        //窗口缩小
        $scope.minimize = function () {
            BimCo.SysCommand('SC_MINIMIZE');
        }

         //窗口放大还原
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
    			$scope.relatedNew = relatedNews.slice(0,currentShowPage*pageSizePc); 
    		}
    		if(currentShowPage >= totalPage){
    			$scope.showMore = false;
    		}
    		
	    }
        $scope.collapsePerson = function() {
    		$scope.collaList.relevants = sliceRlevants;
    		if(!$scope.device){
    			$scope.relatedNew = sliceRlevants; 
    		}
    		$scope.showMore = true;
    		$scope.collapse = false;
    		currentShowPage = 1;
	    }

        //反查formbe,跳转详情页面
        var currentPage = 'editdetail';
        $scope.checkFromBe = function() {
            var coidFrombe = $('#checkformbe').val();
            if(currentPage == 'editdetail'){
                layer.confirm('当前正在编辑协作，是否跳转？', {
                    btn: ['确定','取消'], //按钮
                    move: false
                },function(){
                    layer.closeAll();
                    $state.go('coopdetail',{'coid':coidFrombe});
                    //提交不成功签入协作，跳转回详情界面
                    Cooperation.checkIn(coid).then(function(data) {
                    });
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
            //console.log(toState, toParams, fromState);
            clearInterval(ApplicationConfiguration.refreshID);
        });

}]);

