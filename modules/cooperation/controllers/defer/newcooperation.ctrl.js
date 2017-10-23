'use strict';
/**
 * 新建协作
 */
angular.module('cooperation').controller('newCooperationCtrl', ['$scope', '$http', '$state', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', 'items', 'Common', 'Manage', '$sce', 'alertService', 'headerService', '$timeout', '$uibModalInstance',
    function ($scope, $http, $state, $uibModal, $httpParamSerializer, FileUploader, Cooperation, items, Common, Manage, $sce, alertService, headerService, $timeout, $uibModalInstance) {
        //默认值
        var contracts = [];//相关人
        var modalInstance;
        var popStateNum = 0;
        var binds = [];//bind的工程
        var productId = items.productId ? items.productId : '';
        $scope.typeName = items.typename;
        //console.log(items.typename,'items.typeid')
        $scope.isDoc = false; //是否是doc
        $scope.priority = '1'; //优先级
        $scope.flag = {}; //界面标志位 angular当中的flag
        $scope.linkOpenSignal = true;
        $scope.linkProject1 = false;
        $scope.linkComponent1 = false;
        $scope.linkCategoty1 = false;
        $scope.linkProjectClick = false;
        $scope.linkComponentClick = false;
        $scope.linkCategotyClick = false;
        $scope.data = {};
        $scope.link = {};
        $scope.desc = '';
        $scope.isClick = true;//启用编辑按钮是否被按下
        $scope.responsiblePerson = {};//重组负责人
        $scope.createUser = {};
        $scope.beStates = false;//be的选择状态
        $scope.data.bindType = 0; //默认没有选中工程
        $scope.link.linkProjectName = '';
        $scope.link.linkProjectDeptName = '';

        if (items.deptId && items.deptId != -1 && items.deptId != 0) {
            var currentdeptId = items.deptId ? items.deptId : '';
            var currentppid = items.ppid ? items.ppid : '';
            // $scope.data.deptId = items.deptId?items.deptId:'';
            // $scope.data.ppid = items.ppid?items.ppid:'';
            $scope.link.linkProjectName = items.ppidName ? items.ppidName : '';
            $scope.link.linkProjectDeptName = items.deptName ? items.deptName : '';
        }

        /**
         * 根据ppid获取proudctId
         * @param  int items.ppid 默认选择的工程id
         */
        if (items.ppid) {
            Cooperation.getProductId(items.ppid).then(function (data) {
                productId = data;
            });
        }

        headerService.currentUserInfo().then(function (data) {
            if (data.realname) {
                $scope.responsiblePerson.username = data.userName;
                $scope.responsiblePerson.realname = data.realname;
            } else {
                $scope.responsiblePerson.username = data.userName;
                $scope.responsiblePerson.realname = data.userName;
            }
            $scope.responsiblePerson.avatar = data.avatarUrl;
            $scope.createUser = $scope.responsiblePerson;
            var relateUser = {};
            relateUser.username = data.userName;
            relateUser.avatar = data.avatarUrl;
            relateUser.mustExist = true;
            relateUser.canSign = true;
            relateUser.realname = data.realname;
            $scope.related.noSign[0] = relateUser;
        })

        Array.prototype.del = function (n) {
            if (n < 0)
                return this;
            else
                return this.slice(0, n).concat(this.slice(n + 1, this.length));
        };

        function restrom() {
            $('#w-middle').css('display', 'inline-block');
            $('#w-max').css('display', 'none');
            $('#w-middle2').css('display', 'inline-block');
            $('#w-max2').css('display', 'none');
            $('#w-middle-inner').css('display', 'inline-block');
            $('#w-max-inner').css('display', 'none');
        }

        /* var status = BimCo.GetWindowStatus();
         if (status) {
         $timeout(function () {
         restrom()
         }, 100)
         }*/
        if ($scope.link.linkProjectName && currentppid) {
            $scope.data.deptId = items.deptId ? items.deptId : '';
            $scope.data.ppid = items.ppid ? items.ppid : '';
            $scope.data.bindType = 1;
            binds[0] = {ppid: currentppid, projType: currentdeptId};
        }

        //获取优先级
        Cooperation.getPriorityList().then(function (data) {
            $scope.priorityList = data;
            $scope.priority = data[0].code;
            if (data[0].code) {
                $timeout(function () {
                    $('.selectpicker').selectpicker({
                        style: '',
                        size: 'auto'
                    });
                }, 0);
            }
        });

        //选择负责人
        $scope.selectResponsible = function () {
            modalInstance = $uibModal.open({
                windowClass: 'select-person-responsible-modal',
                backdrop: 'static',
                animation: false,
                keyboard:false,
                templateUrl: 'template/cooperation/select_person_responsible.html',
                controller: 'selectpersonCtrl',
                resolve: {
                    items: function () {
                        return [];
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                Cooperation.writeLog(0, '', false, LogConfiguration.progressName.selectResponsible, 0, '');

                var responsiblePersonName = $scope.responsiblePerson.username;
                //如果选择的用户和负责人一样，什么都不做
                if (responsiblePersonName == selectedItem.username) {
                    return;
                }
                //查询原先负责人在相关人中的位置
                var signIndex = null;
                var noSignIndex = null;
                for (var i = 0; i < $scope.related.sign.length; i++) {
                    if ($scope.related.sign[i].username == responsiblePersonName) {
                        signIndex = i;
                        break;
                    }
                }
                for (var i = 0; i < $scope.related.noSign.length; i++) {
                    if ($scope.related.noSign[i].username == responsiblePersonName) {
                        noSignIndex = i;
                        break;
                    }
                }

                //如果相关人里面有选择的用户，需要把原先的负责人删除
                for (var i = 0; i < $scope.related.sign.length; i++) {	// TODO
                    if ($scope.related.sign[i].username == selectedItem.username) {
                        if ((signIndex != null) && (responsiblePersonName != $scope.createUser.username)) {
                            $scope.related.sign = $scope.related.sign.del(signIndex);
                            updateConstracts();
                        }
                        if (noSignIndex != null && (responsiblePersonName != $scope.createUser.username)) {
                            $scope.related.noSign = $scope.related.noSign.del(noSignIndex);
                            updateConstracts();
                        }
                        $scope.responsiblePerson = selectedItem;
                        return;
                    }
                }

                for (var i = 0; i < $scope.related.noSign.length; i++) {
                    if ($scope.related.noSign[i].username == selectedItem.username) {
                        if (signIndex != null) {
                            $scope.related.sign = $scope.related.sign.del(signIndex);
                            updateConstracts();
                        }
                        if (noSignIndex != null) {
                            $scope.related.noSign = $scope.related.noSign.del(noSignIndex);
                            updateConstracts();
                        }
                        $scope.responsiblePerson = selectedItem;
                        return;
                    }
                }

                for (var i = 0; i < $scope.related.sign.length; i++) {	// TODO
                    if (($scope.related.sign[i].username == responsiblePersonName) && (responsiblePersonName != $scope.createUser.username)) {
                        $scope.related.sign[i] = selectedItem;
                        $scope.responsiblePerson = selectedItem;
                        return;
                    }

                }

                for (var i = 0; i < $scope.related.noSign.length; i++) {
                    if (($scope.related.noSign[i].username == responsiblePersonName) && (responsiblePersonName != $scope.createUser.username)) {
                        $scope.related.noSign[i] = selectedItem;
                        $scope.responsiblePerson = selectedItem;
                        return;
                    }
                }
                $scope.related.noSign[$scope.related.noSign.length] = selectedItem;
                $scope.responsiblePerson = selectedItem;
                updateConstracts();
            });
        }

        function updateConstracts () {
            contracts = [];
            angular.forEach($scope.related.noSign, function (value, key) {
                var needSign = false;
                var a = {}
                a.needSign = needSign;
                a.username = value.username;
                contracts.push(a);
            });
            angular.forEach($scope.related.sign, function (value, key) {
                var needSign = true;
                var a = {}
                a.needSign = needSign;
                a.username = value.username;
                contracts.push(a);
            });
        }
        //选择相关人
        $scope.related = {
            sign: [],
            noSign: []
        };
        var num;

        $scope.selectRelated = function () {
            modalInstance = $uibModal.open({
                windowClass: 'select-person-related-modal',
                backdrop: 'static',
                keyboard:false,
                animation: false,
                size: 'lg',
                templateUrl: 'template/cooperation/select_person_related.html',
                controller: 'selectpersonCtrl',
                resolve: {
                    items: function () {
                        for (var i = 0; i < $scope.related.sign.length; i++) {
                            if ($scope.related.sign[i].username == $scope.responsiblePerson.username) {
                                $scope.related.sign[i].mustExist = true;
                            }
                            $scope.related.sign[i].canSign = true;
                        }
                        for (var i = 0; i < $scope.related.noSign.length; i++) {
                            if ($scope.related.noSign[i].username == $scope.responsiblePerson.username) {
                                $scope.related.noSign[i].mustExist = true;
                            }
                            $scope.related.noSign[i].canSign = true;
                        }
                        return $scope.related;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {

                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                Cooperation.writeLog(0, '', false, LogConfiguration.progressName.selectRelated, 0, '');

                $scope.related.noSign = selectedItem.noSign;
                $scope.related.sign = selectedItem.sign;
                contracts = [];
                angular.forEach(selectedItem.noSign, function (value, key) {
                    var needSign = false;
                    var a = {}
                    a.needSign = needSign;
                    a.username = value.username;
                    contracts.push(a);
                });
                angular.forEach(selectedItem.sign, function (value, key) {
                    var needSign = true;
                    var a = {}
                    a.needSign = needSign;
                    a.username = value.username;
                    contracts.push(a);
                });
            });
        }
        $scope.deleteRelated = function (index, type) {
            console.log(type);
            if (type == 'sign') {
                $scope.related.sign.splice(index, 1);
            } else if (type == 'noSign') {
                $scope.related.noSign.splice(index, 1);
            }
            contracts.splice(index, 1)
        }
        //获取标识
        Cooperation.getMarkerList().then(function (data) {
            $scope.markerList = data;
            $scope.mark = $scope.markerList[0].markerId + '';
            if (data[0].markerId) {
                $timeout(function () {
                    $('.selectpicker1').selectpicker({
                        style: '',
                        size: 'auto'
                    });
                }, 0);
            }
        });

        //与工程关联
        var deptId;

        function isDelete(num) {
            if ($scope.linkProject1 || $scope.linkComponent1 || $scope.linkCategoty1 || $scope.link.linkProjectName) {
                layer.confirm('您已关联的模型,是否重新关联？', {
                    btn: ['是', '否'], //按钮
                    move: false
                }, function () {
                    layer.closeAll();
                    if ($scope.linkProjectClick) {
                        modalInstance = $uibModal.open({
                            windowClass: 'link-project-modal',
                            backdrop: 'static',
                            keyboard:false,
                            animation: false,
                            templateUrl: 'template/cooperation/link_project.html',
                            controller: 'linkprojectCtrl'
                        });
                        modalInstance.result.then(function (dataList) {
                            /**
                             * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                             * 第五个参数为true的情况下需要传topicName
                             * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                             */
                            // alert(LogConfiguration.progressName.newCoop)

                            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');
                            //关联工程页面显示的值
                            $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                            $scope.link.linkProjectDptName = dataList.parentNode.name;
                            if ($scope.link.linkProjectDptName) {
                                $(".new-del").show();
                                $scope.data.bindType = 1;
                                $scope.linkProject1 = true;
                                $scope.linkComponent1 = false;
                                $scope.linkCategoty1 = false;
                            }
                            //传给服务器的两个值
                            $scope.data.assembleLps = dataList.assembleLps;
                            console.info('dataList.assembleLps', dataList.assembleLps)
                            $scope.data.ppid = dataList.assembleLps[0].ppid;
                            $scope.data.deptId = dataList.parentNode.value;
                            //获取productId
                            productId = dataList.productId;
                            // alert(productId+'productId')
                        });
                    } else if ($scope.linkComponentClick) {
                        modalInstance = $uibModal.open({
                            windowClass: 'link-component-modal',
                            backdrop: 'static',
                            keyboard:false,
                            animation: false,
                            templateUrl: 'template/cooperation/link_component.html',
                            controller: 'linkcomponentCtrl'
                        });
                        modalInstance.result.then(function (dataList) {
                            // alert(LogConfiguration.progressName.newCoop)

                            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');

                            //面显示的值
                            $scope.link.linkProjectDptName = dataList.parentNode.name;
                            $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                            //传给服务器的两个值
                            $scope.data.assembleLps = dataList.assembleLps;
                            $scope.data.deptId = dataList.parentNode.value;
                            $scope.data.ppid = dataList.assembleLps[0].ppid;
                            if ($scope.link.linkProjectDptName) {
                                $(".new-del").show();
                                $scope.data.bindType = 2;
                                $scope.linkProject1 = false;
                                $scope.linkComponent1 = true;
                                $scope.linkCategoty1 = false;
                            }
                            //获取productId
                            productId = dataList.productId;
                            // alert(productId+'productId')
                        });
                    } else if ($scope.linkCategotyClick) {
                        modalInstance = $uibModal.open({
                            windowClass: 'link-categoty-modal',
                            backdrop: 'static',
                            keyboard:false,
                            animation: false,
                            templateUrl: 'template/cooperation/link_component_category.html',
                            controller: 'linkprojectCtrl'
                        });
                        modalInstance.result.then(function (dataList) {
                            // alert(LogConfiguration.progressName.newCoop)

                            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');

                            //关联工程页面显示的值
                            $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                            $scope.link.linkProjectDptName = dataList.parentNode.name;
                            $scope.linkProjectSelected = dataList.selectedCategory;
                            //传给服务器的两个值
                            $scope.data.assembleLps = dataList.assembleLps;
                            $scope.data.deptId = dataList.parentNode.value;
                            $scope.data.ppid = dataList.assembleLps[0].ppid;
                            console.log('ppid', dataList.assembleLps.ppid);
                            if ($scope.link.linkProjectDptName) {
                                $scope.data.bindType = 3;
                                $(".new-del").show();
                                $scope.linkProject1 = false;
                                $scope.linkComponent1 = false;
                                $scope.linkCategoty1 = true;
                            }
                            //获取productId
                            productId = dataList.productId;
                            // alert(productId+'productId')
                        });
                    }
                }, function () {
                    return;
                });
            } else {
                if (num == 1) {
                    layer.closeAll();
                    modalInstance = $uibModal.open({
                        windowClass: 'link-project-modal',
                        backdrop: 'static',
                        keyboard:false,
                        animation: false,
                        templateUrl: 'template/cooperation/link_project.html',
                        controller: 'linkprojectCtrl',
                    });
                    modalInstance.result.then(function (dataList) {
                        // alert(LogConfiguration.progressName.newCoop)
                        Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');

                        //关联工程页面显示的值
                        $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                        $scope.link.linkProjectDptName = dataList.parentNode.name;
                        if ($scope.link.linkProjectDptName) {
                            $(".new-del").show();
                            $scope.data.bindType = 1;
                            $scope.linkProject1 = true;
                            $scope.linkComponent1 = false;
                            $scope.linkCategoty1 = false;
                        }
                        //传给服务器的两个值
                        $scope.data.assembleLps = dataList.assembleLps;
                        $scope.data.ppid = dataList.assembleLps[0].ppid;
                        $scope.data.deptId = dataList.parentNode.value;
                        //获取productId
                        productId = dataList.productId;
                        // alert(productId+'productId')
                    });
                } else if (num == 2) {
                    modalInstance = $uibModal.open({
                        windowClass: 'link-component-modal',
                        backdrop: 'static',
                        animation: false,
                        keyboard:false,
                        templateUrl: 'template/cooperation/link_component.html',
                        controller: 'linkcomponentCtrl'
                    });
                    modalInstance.result.then(function (dataList) {
                        // alert(LogConfiguration.progressName.newCoop)

                        Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');

                        //面显示的值
                        $scope.link.linkProjectDptName = dataList.parentNode.name;
                        $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                        //传给服务器的两个值
                        $scope.data.assembleLps = dataList.assembleLps;
                        $scope.data.deptId = dataList.parentNode.value;
                        $scope.data.ppid = dataList.assembleLps[0].ppid;
                        if ($scope.link.linkProjectDptName) {
                            $(".new-del").show();
                            $scope.data.bindType = 2;
                            $scope.linkProject1 = false;
                            $scope.linkComponent1 = true;
                            $scope.linkCategoty1 = false;
                        }
                        //获取productId
                        productId = dataList.productId;
                    });
                } else if (num == 3) {
                    modalInstance = $uibModal.open({
                        windowClass: 'link-categoty-modal',
                        backdrop: 'static',
                        keyboard:false,
                        animation: false,
                        templateUrl: 'template/cooperation/link_component_category.html',
                        controller: 'linkprojectCtrl'
                    });
                    modalInstance.result.then(function (dataList) {
                        // alert(LogConfiguration.progressName.newCoop)

                        Cooperation.writeLog(0, '', false, LogConfiguration.progressName.newCoop, 0, '');

                        //关联工程页面显示的值
                        $scope.link.linkProjectName = dataList.linkProjectSelected.name;
                        $scope.link.linkProjectDptName = dataList.parentNode.name;
                        $scope.linkProjectSelected = dataList.selectedCategory;
                        //传给服务器的两个值
                        $scope.data.assembleLps = dataList.assembleLps;
                        $scope.data.deptId = dataList.parentNode.value;
                        $scope.data.ppid = dataList.assembleLps[0].ppid;
                        console.log('ppid', dataList.assembleLps.ppid);
                        if ($scope.link.linkProjectDptName) {
                            $scope.data.bindType = 3;
                            $(".new-del").show();
                            $scope.linkProject1 = false;
                            $scope.linkComponent1 = false;
                            $scope.linkCategoty1 = true;
                        }
                        //获取productId
                        productId = dataList.productId;
                        // alert(productId+'productId')
                    });
                }
            }
        }

        $scope.linkProject = function () {
            $scope.linkProjectClick = true;
            $scope.linkComponentClick = false;
            $scope.linkCategotyClick = false;
            isDelete(1);
        }
        //与图上构件关联
        $scope.linkComponent = function () {
            $scope.linkProjectClick = false;
            $scope.linkComponentClick = true;
            $scope.linkCategotyClick = false;
            isDelete(2);
        }
        //与图上构件类别关联
        $scope.linkCategoty = function () {
            $scope.linkProjectClick = false;
            $scope.linkComponentClick = false;
            $scope.linkCategotyClick = true;
            isDelete(3);
        }
        //删除关联
        $scope.removeLink = function () {
            if ($scope.link.linkProjectName) {
                layer.confirm('您已关联了模型，是否删除关联？', {
                    btn: ['是', '否'],//按钮
                    move: false
                }, function () {
                    $scope.linkProject1 = false;
                    $scope.linkComponent1 = false;
                    $scope.linkCategoty1 = false;
                    $scope.link.linkProjectName = false;
                    $scope.data = {};
                    $scope.data.bindType = 0;
                    binds = [];
                    layer.closeAll();
                    $scope.$apply();
                });
            }
        }

        $scope.docSelectedList = []; 	//本地上传文件
        $scope.formSelectedList = [];	//表单上传
        var typeArr = ['txt', 'doc', 'pdf', 'ppt', 'docx', 'xlsx', 'xls', 'pptx', 'jpeg', 'bmp', 'PNG', 'GIF', 'JPG', 'png', 'jpg', 'gif', 'dwg', 'rar', 'zip', 'avi', 'mp4', 'mov', 'flv', 'swf', 'wmv', 'mpeg', 'mpg', 'mp3'];
        //引用BE资料

        $scope.linkBe = function () {
            //popStateNum++;
            $scope.beStates = false;
            $('.new-mask').hide();
            notScroll();
            $scope.beSourceType = 1;
            $scope.flag.isleast = false;
            modalInstance = $uibModal.open({
                windowClass: 'link-be-modal',
                backdrop: 'static',
                keyboard:false,
                animation: false,
                size: 'lg',
                templateUrl: 'template/cooperation/linkbe.html',
                controller: 'linkbeCtrl',
                resolve: {
                    items: function () {
                        return $scope.docSelectedList;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem1) {
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                Cooperation.writeLog(0, '', false, LogConfiguration.progressName.addDocs, 0, '');

                var imgsrc = "imgs/pro-icon/icon-";
                var unit = '';
                angular.forEach(selectedItem1, function (value, key) {
                    if (typeArr.indexOf(value.fileType) != -1) {
                        unit = value.fileType;
                    } else {
                        unit = 'other';
                    }
                    selectedItem1[key].imgSrc = imgsrc + unit + ".png";
                })
                $scope.docSelectedList = selectedItem1;
                //console.info('养你一辈子你要和果汁',$scope.docSelectedList)
                console.info('$scope.docSelectedList', $scope.docSelectedList.length)
            });
        }
        //选择表单
        $scope.linkForm = function () {
            //popStateNum++;
            $scope.beStates = false;
            $('.new-mask').hide();
            notScroll()
            $scope.formSourceType = 2;
            $scope.flag.isleast = false;
            modalInstance = $uibModal.open({
                windowClass: 'link-form-modal',
                backdrop: 'static',
                keyboard:false,
                animation: false,
                templateUrl: 'template/cooperation/linkform.html',
                controller: 'linkformCtrl',
                resolve: {
                    items: function () {
                        var trans = {
                            typeid: items.typeid,
                            formSelectedList: $scope.formSelectedList
                        }
                        return trans;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem2) {
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                 Cooperation.writeLog(0, '', false, LogConfiguration.progressName.addDocs, 0, '');

                $scope.formSelectedList = selectedItem2;
                console.log("$scope.formSelectedList", $scope.formSelectedList.length);
            });
        }
        //	删除be照片
        $scope.removePhoto = function (item) {
            _.pull($scope.uploader.queue, item);
        }
        //删除be资料
        $scope.removeDoc = function (items) {
            //lodash删除数组中对象
            _.pull($scope.docSelectedList, items);
        }
        //删除表单资料
        $scope.removeForm = function (items) {
            //lodash删除数组中对象
            _.pull($scope.formSelectedList, items);
        }
        //上传照片
        var uploader = $scope.uploader = new FileUploader({
            url: basePath + 'fileupload/upload.do'
            // queueLimit: 30
        });
        // FILTERS
        var picturesUploadList = [];
        var docsUploadList = [];
        $scope.flag.docsRepeatMind = false; //图片上传超过30个防止多次提醒
        $scope.flag.pictrueRepeatMind = false;//资料上传超过30个防止多次提醒
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                picturesUploadList.push(item);
                if (picturesUploadList.length > 30) {
                    if (!$scope.flag.pictrueRepeatMind) {
                        layer.alert('上传照片不能多于30个！', {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                    }
                    $scope.flag.pictrueRepeatMind = true;
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
                }
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1 && this.queue.length < 30;
            }
        });
        //上传资料
        var uploader1 = $scope.uploader1 = new FileUploader({
            url: basePath + 'fileupload/upload.do'
            // queueLimit:30
        });
        //FILTERS
        uploader1.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                docsUploadList.push(item);
                popStateNum++;
                if (docsUploadList.length > 30) {
                    if (!$scope.flag.docsRepeatMind) {
                        layer.alert('上传资料不能多于30个！', {
                            closeBtn: 0,
                            move: false
                        });
                    }
                    $scope.flag.docsRepeatMind = true;
                    return this.queue.length < 30;
                }
                return this.queue.length < 30;
            }
        });
        //点击上传照片按钮
        $scope.fileUpload = function () {
            $scope.flag.pictrueRepeatMind = false;
            $scope.flag.isleast = false;
            $('.upload-img').attr('uploader', 'uploader');
            $('.upload-img').attr('nv-file-select', '');
            $('.upload-img').click();
        }
        //点击上传资料按钮
        $scope.docsUpload = function () {
            $scope.beStates = false;
            $('.new-mask').hide();
            notScroll();
            $scope.uploadSourceType = 3;
            $scope.flag.isleast = false;
            $scope.flag.docsRepeatMind = false;
            $('.upload-docs-new').attr('uploader', 'uploader1');
            $('.upload-docs-new').attr('nv-file-select', '');
            $('.upload-docs-new').click();
            /**
             * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
             * 第五个参数为true的情况下需要传topicName
             * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
             */
            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.addDocs, 0, '');

        }
        //设置日期相关
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            startingDay: 1,
            showWeeks: false,
            minDate: new Date()
        };
        $scope.open2 = function () {
            $scope.popup2.opened = true;
            $scope.formats = ['yyyy.MM.dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.isDeadlineNull = false;
        };

        $scope.popup2 = {
            opened: false
        };
        $scope.checksignal = false;
        //根据复选框来判断是否显示日期控件
        $scope.isChecked = function () {
            $scope.checksignal = !$scope.checksignal;
            if (!$scope.checksignal) {
                $scope.dt = null;
            }
        }
        //弹出框
        $scope.dynamicPopover = {
            templateUrl: 'template/cooperation/mypopovertemplate.html'
        }
        //	监听新建文本框的状态
        $scope.changeTopic = function () {
            // 名称字符控制
            $scope.flag.nameToLong = false;
        }
        function notScroll() {
            $(".new-mask").css('display', 'none');
            $('body').css('overflow', '')
        }

        $scope.popBoxState = function () {
            $scope.beStates = true;
            $(".new-mask").css('display', 'block');
            $('body').css('overflow', 'hidden')
        }

        $scope.closePopBox = function () {
            $scope.beStates = false;
            notScroll();
            $(this).hide();
        }

        //监听描述的状态
        $scope.changeDesc = function () {
            // 描述字符控制
            $scope.flag.descToLong = false;
        }

        var docsList = []; //组合doclist
        var uploadPictureList = []; //上传照片list
        var uploadDocList = [];		//上传资料list
        var onCompleteAllSignal = false; //是否上传成功signal
        var uploadErrorSignal = false; //是否上传成功signal

        uploader.onAfterAddingFile = function (fileItem) {
            var errorMessage = '';
            if (fileItem.file.size <= 0) {
                errorMessage = "文件错误，不能上传！";
            }
            if (fileItem.file.size >= 50000000) {
                errorMessage = "文件大小超过50M限制！";
            }
            if (errorMessage) {
                fileItem.remove();
                layer.alert(errorMessage, {
                    title: '提示',
                    closeBtn: 0,
                    move: false
                });
            }
        }

        uploader1.onAfterAddingFile = function (fileItem) {
            var errorMessage = '';
            if (fileItem.file.size <= 0) {
                errorMessage = "文件错误，不能上传！";
            }
            if (fileItem.file.size >= 50000000) {
                errorMessage = "文件大小超过50M限制！";
            }
            if (errorMessage) {
                fileItem.remove();
                layer.alert(errorMessage, {
                    title: '提示',
                    closeBtn: 0,
                    move: false
                });
            }
        }

        //协作保存
        /**
         * @param  {[status]} 0-草稿箱 1 提交
         */
        $scope.save = function (status) {
            var desc = $("#desc").val();
            $scope.flag.beginCreate = true;
            //主题为空
            if (status == 1) {
                if (!$scope.coopname) {
                    $scope.flag.isTopicNull = true;
                    return;
                }
                if ($scope.coopname.length > 30) {	//协作主题不能超过30个字符
                    $scope.flag.nameToLong = true;
                    return;
                } else {
                    $scope.flag.nameToLong = false;
                }
                if ($scope.desc.length > 500) {	//协作描述不能超过500个字符
                    $scope.flag.descToLong = true;
                    return;
                } else {
                    $scope.flag.descToLong = false;
                }
                //当主题不为空，资料照片为空
                if ($scope.coopname && !uploader.queue.length && !uploader1.queue.length && !$scope.docSelectedList.length && !$scope.formSelectedList.length) {
                    $scope.flag.isTopicNull = false;
                    $scope.flag.isleast = true;
                    return;
                }
            }
            //上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    /*if(response[0].result.suffix=='pdf'){
                        unit.needSign = true;
                    }*/
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    if (uploaderSource == 'uploader1') {
                        unit.sourceType = 3;
                        uploadDocList.push(unit);
                    } else {
                        uploadPictureList.push(unit);
                    }
                } else {	// 提交失败 弹框提示
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        shadeClose: true,
                        skin: 'yourclass',
                        move: false,
                        content: '<div class="tips">' + response[0].info + '</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
                    });
                    return;
                }
            }

            var createindex = layer.load(0, {
                shade: [0.5, '#000'] //0.1透明度的黑色背景
            });
            uploader.onErrorItem = function (item, response, status, headers) {
                layer.closeAll();
                $timeout(function () {
                    if (!uploadErrorSignal) {
                        layer.alert("网络错误，上传失败，请重新上传！", {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                        uploader.cancelAll();
                        uploader.clearQueue();
                        uploader1.cancelAll();
                        uploader1.clearQueue();
                        uploadErrorSignal = true;
                    }
                }, 1000)
            }
            uploader1.onErrorItem = function (item, response, status, headers) {
                layer.closeAll();
                $timeout(function () {
                    if (!uploadErrorSignal) {
                        layer.alert("网络错误，上传失败，请重新上传！", {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                        uploader.cancelAll();
                        uploader.clearQueue();
                        uploader1.cancelAll();
                        uploader1.clearQueue();
                        uploadErrorSignal = true;
                    }
                }, 1000)
            }
            //上传分4种情况，照片和资料(2*2)
            if (uploader.queue.length && uploader1.queue.length) {
                uploader.uploadAll();
                //每个上传成功之后的回调函数
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                uploader.onCompleteAll = function () {
                    //上传全部
                    uploader1.uploadAll();
                    //每个上传成功之后的回调函数
                    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
                        updateUploadList(response, 'uploader1');
                    };
                    //全部成功的回调函数
                    uploader1.onCompleteAll = function () {
                        onCompleteAllSignal = true;
                    };
                };

            }

            if (uploader.queue.length && !uploader1.queue.length) {
                uploader.uploadAll();
                //每个上传成功之后的回调函数
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    //console.info('onSuccessItem', fileItem, response, status, headers);
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                uploader.onCompleteAll = function () {
                    onCompleteAllSignal = true;
                };
            }
            
            if (!uploader.queue.length && uploader1.queue.length) {
                uploader1.uploadAll();
                //每个上传成功之后的回调函数
                uploader1.onSuccessItem = function (fileItem, response, status, headers) {
                    //console.info('onSuccessItem', fileItem, response, status, headers);
                    updateUploadList(response, 'uploader1');
                };
                //全部成功的回调函数
                uploader1.onCompleteAll = function () {
                    onCompleteAllSignal = true;
                };
            }
            if (!uploader.queue.length && !uploader1.queue.length) {
                saveCooperation();
            }
            //轮询是否上传成功
            var checkUploadInterval = setInterval(function () {
                if (onCompleteAllSignal == true && uploadErrorSignal == false) {

                    clearUploadInterval();
                    //alert('onCompleteAllSignal',onCompleteAllSignal);
                    saveCooperation();
                } else if (uploadErrorSignal == true) {
                    clearUploadInterval();
                    uploadErrorSignal = false;
                }
            }, 100);
            //清除轮询
            function clearUploadInterval() {
                clearInterval(checkUploadInterval);
            }

            function saveCooperation() {
                var backJson = BimCo.SubmitAll();
                if (backJson) {
                    backJson = JSON.parse(backJson);
                }
                if ($scope.dt) {
                    // console.log($scope.dt);
                    var dt = Common.dateFormat($scope.dt);
                } else {
                    dt = '';
                }
                //拼接资料数组
                var docSelectedList1 = [];
                var formSelectedList1 = [];
                angular.forEach($scope.docSelectedList, function (value, key) {

                    var a = {};
                    if (backJson) {
                        var modifys = [];
                        angular.forEach(backJson, function (value1, key1) {
                            if (!value1) {
                                return;
                            }
                            if (key1 == value.uuid) {
                                var i = 0;
                                for (i = 0; i < value1.PdfModify.length; i++) {
                                    modifys.push(value1.PdfModify[i]);
                                }
                            }
                        });
                    }
                    a.modifys = modifys;
                    a.md5 = value.filemd5;
                    a.name = value.docName;
                    // a.needSign = false;
                    a.uuid = value.uuid;
                    a.size = value.filesize;
                    a.sourceType = $scope.beSourceType;
                    docSelectedList1.push(a);
                });
                angular.forEach($scope.formSelectedList, function (value, key) {
                    var a = {};
                    if (backJson) {
                        var modifys = [];
                        angular.forEach(backJson, function (value1, key1) {
                            if (!value1) {
                                return;
                            }
                            if (key1 == value.uuid) {
                                var i = 0;
                                for (i = 0; i < value1.PdfModify.length; i++) {
                                    modifys.push(value1.PdfModify[i]);
                                }
                            }
                        });
                    }
                    a.modifys = modifys;
                    a.md5 = value.md5;
                    a.name = value.name + '.' + value.suffix;
                    a.needSign = true;
                    a.uuid = value.uuid;
                    a.size = value.size;
                    a.sourceType = $scope.formSourceType;
                    formSelectedList1.push(a);
                });
                docsList = docSelectedList1.concat(formSelectedList1, uploadDocList);
                //如果bindType==2,客户端跟服务器直接交互，前端binds=[]
                if ($scope.data.bindType == 2) {
                    binds = [];
                } else {
                    binds = $scope.data.assembleLps ? $scope.data.assembleLps : binds;
                }
                $scope.data = {
                    binds: binds,
                    bindType: $scope.data.bindType,
                    collaborator: $scope.responsiblePerson.username,
                    contracts: contracts,
                    deadline: dt,
                    deptId: $scope.data.deptId,
                    desc: desc,
                    docs: docsList,
                    markerid: $scope.mark,
                    name: $scope.coopname,
                    pictures: uploadPictureList,
                    ppid: $scope.data.ppid,
                    priority: $scope.priority,
                    status: status,
                    typeId: items.typeid
                };
                // console.log(JSON.stringify($scope.data));
                console.log($scope.data);
                var obj = JSON.stringify($scope.data);
                Cooperation.createCollaboration(obj).then(function (data) {
                    layer.close(createindex);
                    var coid = data;
                    if (status == 0) {
                        $scope.data.deptId = 0;
                        layer.msg('协作存入草稿箱成功！', {skin:'common-tips'});
                    } else if (status == 1) {
                        if (!binds.length && $scope.data.bindType !== 2) {
                            $scope.data.deptId = -1;
                        }
                        layer.msg('创建协作成功', {skin:'common-tips'});
                    }

                    //新建成功关闭弹框
                    $uibModalInstance.close({
                        'deptId': $scope.data.deptId,
                        'ppid': $scope.data.ppid,
                        'status': $scope.data.status,
                        'coid': coid
                    });
                    /**
                     * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                     * 第五个参数为true的情况下需要传topicName
                     * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                     */
                    Cooperation.writeLog(0, '', false, LogConfiguration.progressName.save, 1, $scope.coopname);

                    //上传之后将coid传给客户端
                    if ($scope.data.bindType == 2) {
                        BimCo.UpLoadComponent(coid);
                    }
                    //创建成功一条协作，通知客户端
                    if (productId && (typeof(productId) == 'number')) {
                        productId = productId + '';
                    }
                    BimCo.CreateCoSucceed(productId);
                }, function (data) {
                    layer.close(createindex);
                    $scope.flag.beginCreate = false;
                    obj = JSON.parse(data);
                    layer.alert(obj.message, {
                        title: '提示',
                        closeBtn: 0,
                        move: false
                    }, function () {
                        layer.closeAll();
                    });
                });
            }
        }

        //判断是不是PDF格式的文件
        $scope.preView = function (uuid, docName, fileType, index, docSource) {
            console.log(uuid, docName, fileType, index, docSource);
            var modalInstance = $uibModal.open({
                windowClass: 'preview-cooperation-modal',
                backdrop: 'static',
                keyboard:false,
                animation: false,
                templateUrl: 'template/cooperation/cooperation_optimize/preview_cooperation.html',
                controller: 'previewCooperationCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            "uuid": uuid,
                            "docName": docName,
                            "docSource": docSource,
                            "fileType": fileType,
                            "index": index,
                            "flag": $scope.flag,
                            'isClick':$scope.isClick
                        }
                    }
                }
            });
            modalInstance.result.then(function (isClick) {
                $scope.isClick = isClick;
                console.log('success');
            }, function () {
                console.log('error');
            })
        }

        //取消创建
        $scope.cancel = function () {
            //询问框
            layer.confirm('是否取消？', {
                btn: ['是', '否'], //按钮
                move: false
            }, function () {
                layer.closeAll();
                $uibModalInstance.dismiss('cancel');
                BimCo.CancelSubmitAll();
            });

        }

        //预览提示
        $scope.isNotPreview = function () {
            layer.msg('文件暂时不支持预览！', {time: 2000});
        }
    }
])

//点击返回按钮
function backCreate($scope) {
    if (!BimCo.IsModify()) {
        $scope.isClick = true;
        BimCo.SignCancel();
    } else {
        var rtn = BimCo.MessageBox("提示", "放弃编辑？", 0x31);
        if (rtn == 1) {
            BimCo.SignCancel();
            $scope.isClick = true;
        }
    }
}

//预览文件controller
angular.module('cooperation').controller('previewCooperationCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', 'items', 'Common', 'Manage', '$sce', 'alertService', 'headerService', '$timeout', '$uibModalInstance',
    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, items, Common, Manage, $sce, alertService, headerService, $timeout, $uibModalInstance) {
        $scope.isClick = true;
        var currentDocSource = '';
        var currentDocIndex = 0;
        var currentEditOfficeUuid = '';
        var currentSuffix = '';
        var currentDocname = '';
        var currentReact = '17,496,25,896';
        var handle = '';
        var fileType = '';
        $scope.flag = items.flag;
        $scope.isTypePdf = false;
        //可编辑表单当前index & uuid
        currentEditOfficeUuid = items.uuid;
        currentDocname = items.docName;
        currentDocSource = items.docSource;
        currentDocIndex = items.index;
        fileType = items.fileType;
        if (fileType == 'pdf') {
            var createindex = layer.load(0, {
                shade: [0.5, '#000'] //0.1透明度的黑色背景
            });
            //pdf签署（客户端）
            var coid = '';
            console.log($scope.flag,'flag')
            var editResult = BimCo.PdfSign(currentEditOfficeUuid, currentSuffix, currentReact, coid,2);
            //编辑失败保持在新建页面，不做操作
            if (!editResult) {
                //调用客户端失败取消加载层
                layer.close(createindex);
                return;
            }
            //调用客户端成功则取消加载层，执行跳转
            layer.close(createindex);
            // $scope.flag.isPreview = true;
            $scope.flag.isPdfsign = true;
            $scope.flag.isGeneral = false;
            $scope.isTypePdf = true;

        } else {
            //普通预览（除去pdf以外的文件）
            $scope.isTypePdf = false;
            var data = {fileName: currentDocname, uuid: currentEditOfficeUuid};
            Manage.getTrendsFileViewUrl(data).then(function (result) {
                // console.log(typeof result)
                // $scope.flag.isPreview = true;
                $scope.flag.isGeneral = true;
                $scope.flag.isPdfsign = false;
                $scope.previewUrl = $sce.trustAsResourceUrl(result);
            }, function (data) {
                // $scope.flag.isPreview = false;
                $scope.previewUrl = '';
                var obj = JSON.parse(data);
                layer.alert(obj.message, {
                    title: '提示',
                    closeBtn: 0,
                    move: false
                });
            });
        }

        // $scope.isClick = items.isClick;
        //启用编辑
        $scope.CommentSign = function () {
            console.log($scope.isClick,'isClick')
            if ($scope.isClick) {
                $('.edit-material').css('color', '#c5c5c5');
                $scope.isClick = false;
                BimCo.CommentSign(currentEditOfficeUuid, currentSuffix);
            }
        }
        //保存编辑
        $scope.saveOffice = function () {
            var coid = "";
            if (!BimCo.IsModify()) {
                backCreate($scope);
                $uibModalInstance.dismiss('cancel');
                return;
            }
            //提示框样式是否（0x34）
            var rtn = BimCo.MessageBox("提示", "是否保存当前文档？", 0x31);
            //确定1取消2
            if (rtn == 1) {
                var isSuccess = BimCo.SignSubmit(coid);
                if (isSuccess) {
                    $uibModalInstance.close($scope.isClick);
                    // $scope.flag.isPreview = false;
                } else {
                    // $scope.flag.isPreview = false;
                    var rtn = BimCo.MessageBox("提示", "保存失败！", 0);
                }
                $scope.isClick = true;
            }

        }

        //取消预览
        $scope.cancelPreview = function (type) {
            if (!BimCo.IsModify()) {
                BimCo.SignCancel();
                $uibModalInstance.dismiss('cancel');
                return;
            }
            var rtn = BimCo.MessageBox("提示", "放弃编辑？", 0x31);
            //确定1取消2
            if (rtn == 1 || type=='close') {
                $uibModalInstance.dismiss('cancel');
                //         $scope.flag.isPreview = false;
                BimCo.SignCancel();
                $scope.isClick = true;
            }
        }
    }
])