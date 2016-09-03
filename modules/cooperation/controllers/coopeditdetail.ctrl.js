/**
 * Created by sdergt on 2016/8/16.
 */
angular.module('cooperation').controller('editdetailCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', 'Common','Manage',
    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, Common, Manage) {
        $scope.device = false;
        //判断pc or bv
        if(client.system.winMobile||client.system.wii||client.system.ps||client.system.android || client.system.ios||client.system.iphone||client.system.ipod||client.system.ipad||client.system.nokiaN) {
            $scope.device = true;
        }
        var coid = $stateParams.coid;
        $scope.transcoid = $stateParams.coid;
        $scope.zhenggai = false;
        var contracts = [];
        console.log(coid);
        //设置日期相关
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1,
            showWeeks: false,
            minDate: new Date()
        };

         $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };

          $scope.toggleMin();

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
        Cooperation.getCollaboration(coid).then(function (data) {
            //console.log(data);
            $scope.collaList = data;
            console.info("编辑协作数据",data);
            $scope.priority =  data.priority;
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

            angular.forEach(data.relevants, function (value, key) {
                var unit = {};
                unit.username = value.username;
                unit.needSign = value.needSign;
               // debugger;
                contracts.push(unit);
            });
            //获取标识
            if(data){
                Cooperation.getMarkerList().then(function (data) {
                    $scope.markerList1 = data;
                    console.log('marklist',$scope.markerList1);
                    console.log($scope.collaList);

                     //$scope.mark1 = $scope.markerList1[0];
                    var unit = _.filter($scope.markerList1, function(o) {

                        return o.picMarker == $scope.collaList.markerInfo.name;
                    });
                    $scope.mark1 = unit[0].markerId + '';
                    console.log('mark1', $scope.mark1[0]);
                });

                //type = 0 问题整改
                if(data.coTypeVo.type == 0) {
                    $scope.zhenggai = true;
                     //根据详情返回的status来定值，这里后端有问题（）
                     $scope.status = "1";
                }
            }
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
                $(".mobile-reply,pc-reply").css('display','block')
            }

            angular.forEach($scope.collaList.docs, function(value, key) {
                //如果存在后缀名
                if(value.name.indexOf('.') !== -1){
                    var unit = value.name.split('.')[value.name.split('.').length - 1];
                    //1.获取后缀 把后缀你push到数组
                    $scope.collaList.docs[key].suffix = unit;
                    console.log($scope.collaList.docs);
                }
            });
            var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];

            angular.forEach($scope.collaList.comments, function(value, key) {
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


        });
        
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
        $scope.switchStatus = function () {
            console.log($scope.zgStatus);
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
            if($scope.dt) {
                $scope.dt = Common.dateFormat($scope.dt);
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
                status: parseInt($scope.status)
            };

            console.log(data);
            Cooperation.updateCollaboration(data).then(function (data) {
                console.log('updateCollaboration', data)
                $state.go('coopdetail', {coid:coid});
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
        $scope.related = {
            sign:[],
            noSign:[],
        };
        
        $scope.selectRelated = function () {
            var modalInstance = $uibModal.open({
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
            modalInstance.result.then(function (selectedItem) {
                $scope.related.noSign = selectedItem.noSign;
                $scope.related.sign = selectedItem.sign;
                angular.forEach(selectedItem.noSign, function (value ,key) {
                    var needSign = false;
                    var a = {}
                    a.needSign = needSign;
                    a.username = value.username;
                    contracts.push(a);
                });
                angular.forEach(selectedItem.sign, function (value ,key) {
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
            debugger
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




    
}]);