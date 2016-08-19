/**
 * Created by sdergt on 2016/8/16.
 */
angular.module('cooperation').controller('editdetailCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', 'Common',
    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, Common) {
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
            startingDay: 1
        };

        $scope.open2 = function () {
            //console.info(123123131)
            $scope.popup2.opened = true;

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
                    console.log($scope.markerList1);
                    console.log($scope.collaList);
                     //debugger;
                     //$scope.mark1 = $scope.markerList1[0];
                    var unit = _.filter($scope.markerList1, function(o) {

                        return o.picMarker == $scope.collaList.markerInfo.name;
                    });
                    $scope.mark1 = unit[0];
                    console.log('mark1', $scope.mark1[0]);
                });

                //type = 0 问题整改
                if(data.coTypeVo.type == 0) {
                    $scope.zhenggai = true;
                     //根据详情返回的status来定值，这里后端有问题（）
                     $scope.status = "1";
                }
            }

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
                desc:'',
                markerid: parseInt($scope.mark1.markerId),
                name: $scope.collaList.coTypeVo.name,
                priority: $scope.priority,
                status: parseInt($scope.status)
            };

            console.log(data);
            Cooperation.updateCollaboration(data).then(function (data) {
                console.log('updateCollaboration', data)
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
            noSign:[]
        };
        
        $scope.selectRelated = function () {
            var modalInstance = $uibModal.open({
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



    
}]);