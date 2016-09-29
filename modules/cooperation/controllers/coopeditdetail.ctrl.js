/**
 * Created by sdergt on 2016/8/16.
 */
angular.module('cooperation').controller('editdetailCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', 'Common','Manage','$timeout','headerService',

    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, Common, Manage,$timeout,headerService) {
        $scope.device = false;
        //判断pc or bv
        if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
            $scope.device = true;
        }
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
            minDate: new Date()
        };

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
        $scope.related = {
                sign:[],
                noSign:[],
            };
        Cooperation.getCollaboration(coid).then(function (data) {
        	
        	angular.forEach(data.relevants,function(value,key){
        		value.mustExist = true;
        		value.canSign = false;
        		if(value.needSign){
        			$scope.related.sign.push(value);
        		}else{
        			$scope.related.noSign.push(value);
        		}
        	});
        	console.log($scope.related);
            var currentMarkInfo = data.markerInfo.id;
//            console.info('标识Id',currentMarkInfo)
            $scope.collaList = data;
            $scope.priority =  data.priority;
            if($scope.device){
            	  allRelevants = _.cloneDeep(data.relevants);
            	  sliceRlevants = _.cloneDeep(data.relevants.slice(0,8));
            	 if(data.relevants.length>8){
	                $scope.collaList.relevants =sliceRlevants;
	                $scope.isRevlentMore = true;
	            }
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

            angular.forEach(allRelevants, function (value, key) {
                var unit = {};
                unit.username = value.username;
                unit.needSign = value.needSign;
                contracts.push(unit);
            });
            
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
                //type = 0 问题整改
                if(data.coTypeVo.type == 1) {
                    $scope.zhenggai = true;
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
                    windowClass: 'select-person-responsible-modal',
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
            //document.location = "http://bv.local?param=" + param;
            //var a  = "http://bv.local?param=" + param;
            //document.location.href = a;
            //alert(document.location.href);
            document.location = 'http://localhost:8080/bv/?param='+param;
        }

        $scope.ok = function () {
            if(!$scope.collaList.name) {
                var index = layer.open({
                  type: 1,
                  title: false,
                  closeBtn: 0,
                  shadeClose: true,
                  skin: 'yourclass',
                  content: '<div class="tips">当前协作主题不能为空</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
                });
            }

            if($scope.device){
                $scope.dt = $('.date-value-bv').html();
            } else {
                $scope.dt = $('.data-value').html();
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

            Cooperation.updateCollaboration(data).then(function (data,status) {
                if($scope.device) {
                    //bv成功
                    if(data.indexOf('<!DOCTYPE html>')!=-1){
                        var param = '{"optType":'+9+',"isSuccess":'+false+'}';
                    } else {
                        var param = '{"optType":'+9+',"isSuccess":'+true+'}';
                    }
                    document.location = 'http://localhost:8080/bv/?param='+param;
                } else {
                    document.location = 'co_detail.jsp?coid='+ coid;
                }
               
            },function(data){
               if($scope.device) {
                    //bv失败
                    var message = data.message;
                    var param = '{"optType":'+9+',"isSuccess":'+false+',"message":"'+message+'"}';
                    document.location = 'http://localhost:8080/bv/?param='+param;
                } else {
                    console.log(message);
                }
            });
          
        }


        //获取标识
        // Cooperation.getMarkerList().then(function (data) {
        //     $scope.markerList1 = data;
        //     console.log($scope.markerList1);
        //     console.log($scope.collaList);
        //      debugger;
        //     $scope.mark1 = _.filter($scope.markerList1, function(o) {

        //         return o.picMarker == $scope.collaList.markerInfo.name;
        //     });
        //     console.log('mark1', $scope.mark1);
        // });
        //
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
            })

        //选择相关人
        //选择相关人
      
        
        $scope.selectRelated = function () {
            var modalInstance = $uibModal.open({
                windowClass:'edit-raltive-person',
                size:'lg',
                backdrop : 'static',
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
        // 返回上个页面
        $scope.backDetail = function() {
        	$state.go('coopdetail', {'coid':coid});
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

        //反查formbe,跳转详情页面
        var currentPage = 'editdetail';
        $scope.checkFromBe = function() {
            var coid = $('#checkformbe').val();
            if(currentPage == 'editdetail'){
                var r = confirm('当前正在编辑协作，是否跳转？');
                if(r){
                    $state.go('coopdetail',{'coid':coid})
                }
            }
            
        }

    
}]);