'use strict';
/**
 * 选择负责人/联系人
 */
angular.module('cooperation').controller('selectpersonCtrl', ['$scope', '$http', '$uibModalInstance', 'Cooperation', 'items', '$timeout',
    function ($scope, $http, $uibModalInstance, Cooperation, items, $timeout) {
        //选择负责人,联系人
        //设置默认值
        var flag = {
            forbidAll: false //防止多次全部选中
        };
        var defaultDeptId = 1; 	//默认第一个项目部（值）
        $scope.selectedOption = {}; //默认中第一个项目部（页面展示对象）
        $scope.deptInfo = {
            availableOptions: []
        };
        $scope.userList = [];  //联系人列表
        $scope.responsiblePerson = ''; //当前负责人
        $scope.trans_selected = {
            noSign: [], //不需要签字的相关人
            sign: items.sign //需要签字的相关人
        };
        //查询值
        var queryData = {
            deptId: defaultDeptId,
            searchText: $scope.queryForm
        };
        //获取项目部
        Cooperation.getDeptList().then(function (data) {
            $scope.deptInfo.availableOptions = data;
            $scope.selectedOption = data[0].deptId + '';
            defaultDeptId = data[0].deptId;
            queryData = {
                deptId: defaultDeptId,
                searchText: $scope.queryForm
            };
            $timeout(function () {
                $('.selectpicker').selectpicker({
                    style: '',
                    size: 'auto'
                });
            }, 300);
            //默认联系人列表
            Cooperation.getUserList(queryData).then(function (data) {
                $scope.userList = data;
                defaultSelectedStyle();
            });
        });

        //切换项目部切换联系人
        $scope.switchUsers = function (params) {
            queryData = {
                deptId: params,
                searchText: $scope.queryForm
            };
            Cooperation.getUserList(queryData).then(function (data) {
                $scope.userList = data;
                defaultSelectedStyle();
            });
            if ($scope.queryForm) {
                $scope.isCollapsed = true;
            } else {
                $scope.isCollapsed = false;
            }
        }

        //选择负责人联系人--搜索功能
        $scope.responsibleSearch = function () {
            queryData = {
                deptId: $scope.selectedOption,
                searchText: $scope.queryForm
            };
            Cooperation.getUserList(queryData).then(function (data) {
                $scope.userList = data;
                defaultSelectedStyle();
            });

            if ($scope.queryForm) {
                $scope.isCollapsed = true;
            } else if (!$scope.queryForm) {
                $scope.isCollapsed = false;
            }
        }

        //	按enter键进行筛选
        $scope.searchEnter = function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                $scope.responsibleSearch();
            } else if (!$scope.queryForm) {
                $scope.responsibleSearch();
                $scope.isCollapsed = false;
            }
        }

        //负责人只能单选
        $scope.changeStaus = function (id, pid, user) {
            angular.forEach($scope.userList, function (value, key) {
                for (var i = 0; i < value.users.length; i++) {
                    if (key == pid && i == id) {
                        value.users[i].add = true;
                    } else {
                        value.users[i].add = false;
                    }
                }
            });
            $scope.responsiblePerson = user;
        }

        //选中的相关人
        var temp = _.cloneDeep(items);
        if (temp.sign) {
            var a = temp.sign.concat(temp.noSign);
        }
        $scope.relatedSelected = a ? a : [];

        $scope.addRelated = function (current) {
            // console.log(current);
            var currentUser = {
                avatar: current.avatar,
                avatarUuid: current.uuid,
                isPassed: false,
                isReaded: false,
                isRejected: false,
                isSigned: false,
                needSign: false,
                username: current.username,
                mustExist: false,
                canSign: true,
                realname: current.realname
            };
            $scope.relatedSelected.push(currentUser);
            //数组去重
            var unique = _.uniqBy($scope.relatedSelected, 'username');
            $scope.relatedSelected = unique;
            defaultSelectedStyle();
        }
        
        $scope.removeRelated = function (current,event) {
            /*debugger;
           if($(event.currentTarget).css('display')=='none'){
               $(event.currentTarget).css('cursor','default');
               return false;
           }*/
            var removeRelated = _.filter($scope.relatedSelected, function (o) {
                return o.username != current.username;
            });
            //右侧已选中的联系人跟左侧联系人比较，相同则做相应操作
            angular.forEach($scope.userList, function (value, key) {
                angular.forEach(value.users, function (value1, key1) {
                    if (value1.username === current.username && value1.avatar === current.avatar) {
                        value1.select ='';
                    }
                })
            });

            $scope.relatedSelected = removeRelated;
            var idx = signSelected.indexOf(current);
            if (idx != -1) {
                signSelected.splice(idx, 1);
            }
        }

        /**
         * 已经选中的相关人的样式
         */
        function defaultSelectedStyle() {
            var selectUsernames = [];
            angular.forEach($scope.relatedSelected, function (value2, key2) {
                selectUsernames.push(value2.username);
            })
            //默认第一次点击选择联系人，右侧已选中的联系人跟左侧联系人比较，相同则做相应操作
            angular.forEach($scope.userList, function (value, key) {
                angular.forEach(value.users, function (value1, key1) {
                    // console.log(value1);
                    for (var i = 0; i < selectUsernames.length; i++) {
                        if (selectUsernames[i] == value1.username) {
                            value1.select = "block"
                            break;
                        }
                    }
                })
            });
        }

        //选择需要签字的相关人
        var signSelected = temp.sign ? temp.sign : [];
        var nosignSelected = temp.noSign ? temp.noSign : [];
        var updateSelected = function (action, id) {
            if (action == 'add' && signSelected.indexOf(id) == -1) {
                id.needSign = true;
                signSelected.push(id);
                $scope.trans_selected.sign = signSelected;
            }
            if (action == 'remove' && signSelected.indexOf(id) != -1) {
                id.needSign = false;
                var idx = signSelected.indexOf(id);
                signSelected.splice(idx, 1);
                $scope.trans_selected.sign = signSelected;
            }
        }

        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
           /* $scope.isChecked = checkbox.checked;
            console.log($scope.isChecked,'$scope.isChecked')*/
            updateSelected(action, id);
        }

        $scope.isSelected = function (id) {
            return signSelected.indexOf(id) >= 0;

        }

        //选择不需要签字的相关人
        var noSign = function () {
            if (signSelected.length) {
                nosignSelected = [];
                nosignSelected = _.difference($scope.relatedSelected, signSelected);
            } else {
                nosignSelected = $scope.relatedSelected;
            }
        }

        //选择负责人-确定按钮
        $scope.ok = function () {
            if ($scope.responsiblePerson != '') {
                $uibModalInstance.close($scope.responsiblePerson);
            } else {
                //alert('请选择负责人');
                layer.alert('请选择负责人', {
                    title: '提示',
                    closeBtn: 0,
                    move: false
                });
            }
        }

        //选择相关人-确定按钮
        $scope.ok1 = function () {
            noSign();
            $scope.trans_selected.noSign = nosignSelected;
            $uibModalInstance.close($scope.trans_selected);	// 关闭弹框
        }

        //全选
        $scope.allSelected = function () {
            $(".user-chioce").show();
            $scope.flag.forbidAll = true;
            angular.forEach($scope.userList, function (value, key) {
                angular.forEach(value.users, function (value1, key1) {
                    var currentUser = {
                        avatar: value1.avatar,
                        avatarUuid: value1.uuid,
                        isPassed: false,
                        isReaded: false,
                        isRejected: false,
                        isSigned: false,
                        needSign: false,
                        username: value1.username,
                        mustExist: false,
                        canSign: true
                    };
                    $scope.relatedSelected.push(currentUser);
                })
            });
            $scope.relatedSelected = _.uniqBy($scope.relatedSelected, 'username');
        }
        $scope.delAll = function () {
            $('.user-chioce').hide();
            var noDelete = [];
            var needSign = [];
            for (var i = 0; i < $scope.relatedSelected.length; i++) {
                if ($scope.relatedSelected[i].mustExist) {		// 如果该相关人之前已经存在，不让删
                    noDelete.push($scope.relatedSelected[i]);
                    if ($scope.relatedSelected[i].needSign) {
                        needSign.push($scope.relatedSelected[i]);
                    }
                }
            }
            $scope.relatedSelected = noDelete;
            $scope.trans_selected.sign = needSign;
            signSelected = needSign;
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

//		$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
//			defaultSelectedStyle();
//		});

    }]);