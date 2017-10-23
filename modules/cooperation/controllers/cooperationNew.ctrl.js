'use strict';
/**
 * Created by sdergt on 2017/8/14.
 * 协作管理
 */
angular.module('cooperation').controller('coopreationNewCtrl', ['$scope', '$http', '$uibModal', '$httpParamSerializer', 'FileUploader', 'Cooperation', '$state', '$stateParams', '$location', '$timeout', 'headerService', 'Common', 'Manage', '$sce',
    function ($scope, $http, $uibModal, $httpParamSerializer, FileUploader, Cooperation, $state, $stateParams, $location, $timeout, headerService, Common, Manage, $sce) {
        BimCo.NotifyStartGetData();
        sessionStorage.clear();
        var queryData = {//获取协作列表的参数集合
            count: 20,
            modifyTime: '',
            modifyTimeCount: 0,
            queryFromBV: true,
            searchType: sessionStorage.coopattr ? parseInt(sessionStorage.coopattr) : 0,
            groups: sessionStorage.groups ? JSON.parse(sessionStorage.groups) : [] //获取sessionstorage的值,反序列化

        };
        var deptName = null;//项目名称
        var ppidName = null;//工程名称
        var reCode = '';//是否正在导出
        var modalInstance; //定义全局弹框
        var urlParams = $location.search(); //截取url参数
        var firstflag = true; //筛选全选只加载一次标识
        var firstreackflag = true; //进入页面只加载一次定位
        var firstdeptid; //第一个项目部id;
        var searId; //deptId
        var countArray = [];//统计数据存放
        var filterTableHeight = 0; //筛选项的高度
        var delItems = []; //批量删除选项
        var compareData = [];//用于控制对比统计菜单的类型显示隐藏
        var changeFilterItem; //当前点击的筛选项名称
        var changeFilterSignal; //当前点击的筛选项代码
        var Remarklist = []; //编辑状态列表
        var coid, statusId; //当前协作coid的值 statusId状态值
        var createindex1; //layer索引
        var uploadList = []; //上传资料列表
        var detailDeptId = '',//每条详情的deptId值
            detailPpid = '';//每条详情的ppId值
        var  publicDeptId = '';//公共deptId
        var loading = layer.load(0, {
            shade: [0.5, '#000'] //0.1透明度的黑色背景
        });
        var routeBeforeTransDetail;//从客户端跳转到协作详情之前的路由
        $scope.isNormalScreen = false;//判断是不是三栏正常屏幕大小
        $scope.scrollend = false;//停止滚动加载标志 true:停止
        $scope.flag = { //标志位init
            allSelected: false, //全选标志
            LgDetailMode: false, //大屏详情标志位
            isdocPreview: false, //资料预览
            filterOk: false,//默认false，点击筛选设置为true，拿到数据设置为false（目的在于禁止没拿到数据前调用addmore）
            searchkey: sessionStorage.searchkey ? sessionStorage.searchkey : '', //搜索条件
            filterExist: false//显示筛选标志
        };
        var isShowArr = ["8", "10", "12"]; //回复中的状态显示条件数组 8已通过 10已拒绝 12已结束
        var currentReact = '17,496,25,896'; //需要给客户端提供的弹框显示区域范围
        var trendflag = true;//侧边栏获取动态列表
        $scope.currentDate = Cooperation.getCurrentDate(); //当前服务器时间
        $scope.cooperationList = [];  //工程及项目部下协作列表
        $scope.projectInfoList = [];  //项目部下工程列表
        $scope.typeId = null;//统计菜单问题类型
        $scope.typeStatus = {};//

        $scope.openSignal = false; //左侧项目展示收缩标志
        $scope.deptIdToken = 0;//防止点击项目部多次提交
        $scope.ppidToken = 0;//防止点击工程部多次提交
        $scope.deptIdOpenToken = 0;//防止点击项目部关闭多次提交;
        $scope.coNoResult = false; //搜索无结果
        $scope.deptNoCo = false;  //项目部没有工程
        $scope.projNoCo = false;//工程部没有协作
        $scope.searchNoCo = false;//搜索无内容
        $scope.noRelatedNoCo = false;//当前无协作
        $scope.statusCommon;//详情回复状态
        $scope.commentModel = {};//详情双向绑定数据 用于挂载model数据
        var fromNewCooperation = false; //新建成功标志
        var fromNewCooperationPpid = ''; //新建成功过来的ppid
        var filterSessionOptions = sessionStorage.filterSessionOptions ? JSON.parse(sessionStorage.filterSessionOptions) : []

        if (queryData.groups.length) {
            $scope.flag.filterExist = true;//显示筛选tab
            createFilterTemplate(filterSessionOptions, 'rember');
        }

        //跳转至协作主界面(2栏或者3栏)
        function transToCooperation() {
            if ($state.current.name !== 'cooperationNew.secondCloumn') {//路由地址不是两栏 默认走三栏
                document.location = '#/cooperationNew/threeCloumn';
            } else {
                document.location = '#/cooperationNew/secondCloumn';
            }
        }

        //动态获取协作列表的高度
        function getCoListHeight() {
            //协同列表的高度
            var secondCurrentTaleHeight = document.documentElement.clientHeight - 150 - $('.comboBox').outerHeight() - 36;
            var threeCurrentTaleHeight = document.documentElement.clientHeight - ($('.filter-table').height() + $('.filter-tab').height() + 160);
            $('.second-columnMode .content-container').height(secondCurrentTaleHeight);
            $('.three-columnMode .content-container').height(threeCurrentTaleHeight);
        }

        /**
         *$scope.formatDate  日期格式转换
         * @param   {date}   data 格式化的日期
         * @param   {string} type null不带毫秒数 2包含毫秒数
         * @returns {string} 返回拼接样式
         */
        $scope.formatDate = function (date, type) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var hh = date.getHours();
            hh = hh < 10 ? '0' + hh : hh;
            var mm = date.getMinutes();
            mm = mm < 10 ? '0' + mm : mm;
            var ss = date.getSeconds();
            ss = ss < 10 ? '0' + ss : ss;
            if (!type) {
                return y + '.' + m + '.' + d;
            } else if (type == 2) {
                return y + '.' + m + '.' + d + " " + hh + ":" + mm;
            }
        };

        /**
         * 调用签字窗口弹窗
         * @param uuid           资料uuid
         * @param docName        资料名称
         * @param isPdfsign      是否需要对接客户端（ps 1:yes other:no ）
         * @param suffix         资料文件格式
         * @param {Boolean}      isSign       -1不需要签字 0需要签字 1已签字
         * @param {[type]}       isdocPreview [description]
         * @param btnType        区分是预览or非签字（ps 1 预览 2 非签字/已签字）
         * @param coid           协作的coid
         * @param isPriviewSign  是否是预览签字
         * @return {[type]}      [description]
         */
        function previewSignComment(uuid, docName, isPdfsign, suffix, isSign, isdocPreview, btnType, coid, isPriviewSign) {
            modalInstance = $uibModal.open({
                windowClass: 'preview_sign_comment',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: false,
                templateUrl: 'template/cooperation/cooperation_optimize/preview_sign_comment.html',
                controller: 'previewSignCommentCtrl',
                resolve: {
                    items: function () {
                        return {
                            flag: $scope.flag,
                            coid: coid,
                            isSign: isSign,
                            isdocPreview: isdocPreview,
                            name: $scope.collaList.name,
                            btnType: btnType,
                            isPriview: isPriviewSign,
                            uuid: uuid,
                            suffix: suffix
                        };
                    }
                }
            });
            modalInstance.result.then(function (params) { // 向后台发送需要保存的数据
                if (params) {
                    $timeout(function () {
                        $scope.detailPage(coid);
                    }, 300)
                }
            }, function () {

            });

            var pdfSign;
            if (isPriviewSign && !isSign) {
                pdfSign = BimCo.PdfSign(uuid, suffix, currentReact, coid, 2);
            } else {
                pdfSign = BimCo.PdfSign(uuid, suffix, currentReact, coid, Number(isSign));
            }
            if (!pdfSign) {
                //调用客户端失败取消加载层
                layer.close(createindex1);
                return;
            } else {
                //调用客户端成功取消加载层，执行跳转

                layer.close(createindex1);
                $scope.flag.isPreview = true;
                $scope.flag.isApprove = true;
                $scope.flag.isGeneral = false;
                $scope.flag.isPdfsign = false;
            }
        }

        //获取显示设置(跟随账号)
        Cooperation.getDisPlaySetting().then(function (data) {
            sessionStorage.setItem('colorMark', data.showMarker);
            sessionStorage.setItem('status', data.showStatus);
        })

        /**
         * 详情页面统一封装成一个方法 每次点击协作列表加载详情页面
         * @param  {[type]}  coid     当前协作coid
         * @param  {[type]}  statusId 当前协作状态
         * @param  {Boolean} isRead   已读未读状态
         */
        $scope.detailPage = function (coid, statusId, isRead) {
            trendflag = true;
            coid = coid; //coid全局赋值
            $scope.flag.coid = coid;//coid挂在到标志位
            $scope.commentModel.comment = "";//切换协作清空回复框内容
            //返回的coids跟delItems比较,去除返回coid
            $scope.clickRemark = [];//点击某一条协作 左侧菜单已读未读树更新
            if (!isRead) {
                BimCo.ClearMsgData();//点击未读通知客户端悬浮球对应数据更新
                angular.forEach($scope.cooperationList, function (val, key) {
                    if ($scope.cooperationList[key].coid === coid) {
                        $scope.clickRemark.push($scope.cooperationList[key])
                        deleteDetail($scope.clickRemark, null, 'isRemark');
                        $scope.cooperationList[key].isRead = true;
                    }
                })
                $('.coopers[coid=' + coid + ']').removeClass('bold');//未读状态协作改变状态
            }
            $('.coopers').removeClass('cooper-active');
            $('.coopers[coid=' + coid + ']').addClass('cooper-active');
            $('.model-comment').val('')//回复内容清空
            $scope.isVisible = false;//回复输入框的错误提示显示隐藏
            if (uploader2) {
                uploader2.queue = [];//回复上传内容清空
            }
            statusId = statusId
            var frombeFlag = false; //是否从be跳转(非cooperation界面)
            var currentEditOfficeUuid = '';//当前签字资料的uuid
            var currentSuffix = '';//当前资料的格式
            var currentDeptId = $stateParams.deptId;//携带deptId
            var currentPpid = $stateParams.ppid;//携带ppid
            var isLocking = false;
            var selfDeptId = null;//详情页面自带的deptId
            //详情页面自带的deptId
            var selfPpid = null;//详情页面自带的ppid
            var productId = '';//新建产品id

            $scope.links = false;//关联模型
            $scope.speachShow = false;//录音按钮是否显示
            $scope.allowEdit = true;//允许编辑
            $scope.isPreview = false;//是否预览
            //页面按钮显示标志
            $scope.bjshow = true;//编辑
            $scope.tjshow = true;//
            $scope.tgshow = true;//通过
            $scope.jjueshow = true;//拒绝
            $scope.jsshow = true;//结束
            $scope.dchushow = true;//导出
            $scope.isTypePdf = true;//判断文件类型是否是pdf格式
            $scope.showMore = false;//更多
            $scope.collapse = false;//关闭
            $scope.isVisible = false;//回复错误提示框
            $scope.tgDisable = false;//通过是否可用
            $scope.jjueDisable = false;//拒绝按钮是否可用

            var coidFrombe = '';
            var ppid = 0;
            var coTypeVo = 0;//问题类型图标
            var status = "";
            var currentTimestamp = Date.parse(new Date());//当前时间毫秒数
            var allRelevants = [];//全部的相关人
            var sliceRlevants = [];//删除的相关人
            var totalPage = 0;//总共多少页
            var pageSize = 8;//显示多少条
            var pageSizePc = 16;//显示多少条
            var currentShowPage = 1;//当前显示第几页
            $scope.transcoid = coid;//默认显示的coid
            //导出
            $scope.downloadTotal = 0;
            var detailExport = {
                coopExport: [],
                coid: ''
            };
            var currentUser;
            //获取当前用户
            headerService.currentUserInfo().then(function (data) {
                currentUser = data.userName;
            });
            //获取coid对应的协同详情列表
            Cooperation.getCollaboration(coid).then(function (data) {
                //房建、市政等不同段的产品id
                productId = data.productId + '';
                $scope.collaList = data;
                if (typeof($scope.collaList.deadline) != "string" && $scope.collaList.deadline) {
                    $scope.collaList.deadline = $scope.formatDate(new Date($scope.collaList.deadline));
                }

                $scope.collaList.createTime = $scope.formatDate(new Date($scope.collaList.createTime));
                $scope.collaList.updateTimeCopy = $scope.formatDate(new Date($scope.collaList.updateTime));
                angular.forEach($scope.collaList.comments, function (val, key) {
                    val.commentTime = $scope.formatDate(new Date(val.commentTime), 2);
                })
                selfDeptId = data.deptId;
                selfPpid = data.ppid;
                var defaultDesc = data.desc; //默认的desc
                var defaultComment = _.cloneDeep(data.comments);
                $scope.statusCommon = data.statusId + '';
                $scope.coTypeVo = data.coTypeVo.type;

                // 只有状态是问题整改且不是已结束、已通过、已拒绝状态 才显示状态
                if ($scope.coTypeVo === 1 && isShowArr.indexOf($scope.statusCommon) == -1) { // isShowArr中不包括$scope.status
                    $scope.zhenggai = true;
                    $(".detail-state").show();
                } else {
                    $scope.zhenggai = false;
                    $(".detail-state").hide();
                }
                if ($scope.statusCommon) {
                    $timeout(function () {
                        $('.selectpicker').selectpicker({
                            style: '',
                            size: 'auto'
                        });
                        $('.selectpicker').selectpicker('refresh');
                        $('.selectpicker').selectpicker('val', $scope.statusCommon);
                    }, 0);
                }
                //详情转换“\n”
                if (data.desc) {
                    $scope.collaList.desc = replaceAll(data.desc, "\n", "</br>");
                }

                //遍历评论转换“\n”
                if (data.comments.length) {
                    angular.forEach(data.comments, function (value, key) {
                        if (value.comment) {
                            $scope.collaList.comments[key].comment = replaceAll(value.comment, "\n", "</br>");
                        }
                    });
                }
                allRelevants = data.relevants;
                totalPage = parseInt((allRelevants.length + pageSizePc - 1) / pageSizePc);
                if (totalPage > 1) {
                    sliceRlevants = data.relevants.slice(0, currentShowPage * pageSizePc);
                    $scope.collaList.relevants = sliceRlevants;
                    $scope.isRevlentMore = true;
                    $scope.showMore = true;
                }
                if (data.coTypeVo) {
                    coTypeVo = data.coTypeVo.type;
                }

                status = data.status;
                if (data.bindType !== 0 && data.binds.length) {
                    $scope.links = true;
                    ppid = data.binds[0].ppid;
                }

                if (data.speach) {
                    $scope.speachShow = true;
                    $scope.speachUrl = data.speach.speechUrl
                }
                if (data.deadline && data.isDeadline == 3) {
                    $scope.deadlineStyle = 'red';
                }

                if (data.deadline == null) {
                    $scope.collaList.deadline = '不限期';
                }

                if (data.isSign == -1) {
                    $scope.flag.noNeedSign = true;
                }
                //详情描述
                if (data.desc == null || data.desc == '') {
                    $('.mobile-job-descrition,.pc-job-descrition').css("display", 'none')
                } else {
                    $('.mobile-job-descrition,.pc-job-descrition').css("display", 'block')
                }
                //详情联系人
                if (data.relevants.length == 0) {
                    $(".mobile-relate,.pc-relate").css('display', 'none')
                } else {
                    $(".mobile-relate,.pc-relate").css('display', 'block')
                }
                //详情照片
                if (data.pictures.length == 0) {
                    $(".mobile-photo,.pc-photo").css('display', 'none')
                } else {
                    $(".mobile-photo,.pc-photo").css('display', 'block')
                }
                //详情资料
                if (data.docs.length == 0) {
                    $(".mobile-means,.pc-means").css('display', 'none')
                } else {
                    $(".mobile-means,.pc-means").css('display', 'block')
                }
                //详情回复
                if (data.comments.length == 0) {
                    $(".mobile-reply,.pc-reply").css('display', 'none')
                } else {
                    $(".mobile-reply,.pc-reply").css('display', 'block')
                }
                //(isSign -1不需要签字 0需要签字 1已签字)
                //2.2.2 当当前用户为负责人但是不需要签字时
                if (data.isCollaborator && data.isSign == -1) {
                    $scope.bjshow = true;
                    $scope.tjshow = true;
                    $scope.tgshow = false;
                    $scope.jjueshow = false;
                    $scope.jsshow = true;
                    $scope.dchushow = true;
                }
                //2.2.3 当当前用户不是负责人但是需要签字时
                if (!data.isCollaborator && data.isSign == 0) {
                    $scope.bjshow = false;
                    $scope.tjshow = true;
                    $scope.tgshow = true;
                    $scope.jjueshow = true;
                    $scope.jsshow = false;
                    $scope.dchushow = true;
                }
                //2.2.4 当当前用户既不是负责人也不需要签字时
                if (!data.isCollaborator && data.isSign == -1) {
                    $scope.bjshow = false;
                    $scope.tjshow = true;
                    $scope.tgshow = false;
                    $scope.jjueshow = false;
                    $scope.jsshow = false;
                    $scope.dchushow = true;
                }

                //白名单开放所有权限,accessCode-从客户端获取的权限码 accessCodeConfig-权限码配置 (正式代码不注释)
                if (accessCode && accessCode.indexOf(accessCodeConfig.coManageCode) != -1) {
                    $scope.bjshow = true;
                    $scope.tjshow = true;
                    $scope.tgshow = true;
                    $scope.jjueshow = true;
                    $scope.jsshow = true;
                    $scope.dchushow = true;
                }

                //是否编辑协作
                var statusReject = ['已结束', '未通过', '已通过', '已拒绝'];
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
                if (data.isSign == 1) {
                    $scope.bjshow = false;
                    $scope.tgshow = false;
                    $scope.jjueshow = false;
                    $scope.tgDisable = true;
                    $scope.jjueDisable = true;
                    $scope.jsshow = false;
                }

                //详情描述记录换行
                function replaceAll(strM, str1, str2) {
                    var stringList = strM.split(str1);
                    for (var i = 0; i < stringList.length - 1; i++) {
                        stringList[i] += str2;
                    }
                    var newstr = '';
                    for (var j = 0; j < stringList.length; j++)newstr += stringList[j];
                    return newstr;
                }

                var typeArr = ['txt', 'doc', 'pdf', 'ppt', 'docx', 'xlsx', 'xls', 'pptx', 'jpeg', 'bmp', 'PNG', 'GIF', 'JPG', 'png', 'jpg', 'gif', 'dwg', 'rar', 'zip', 'avi', 'mp4', 'mov', 'flv', 'swf', 'wmv', 'mpeg', 'mpg', 'mp3'];
                angular.forEach($scope.collaList.pictures, function (value, key) {
                    var imgsrc = "imgs/pro-icon/icon-";
                    //如果存在后缀名
                    if (value.name && value.name.indexOf('.') !== -1) {
                        var unit = value.name.split('.')[value.name.split('.').length - 1];
                        unit = unit.toLowerCase();
                        if (typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
                            unit = 'other';
                        } else if (unit == "docx") {
                            unit = 'doc'
                        }
                        imgsrc = imgsrc + unit + ".png";
                        //1.获取后缀 把后缀你push到数组
                        $scope.collaList.pictures[key].imgsrc = imgsrc;
                    } else {
                        $scope.collaList.pictures[key].name = value.md5 + ".png";
                        unit = 'other';
                        imgsrc = imgsrc + unit + ".png";
                        $scope.collaList.pictures[key].imgsrc = imgsrc;
                    }

                });
                angular.forEach($scope.collaList.docs, function (value, key) {
                    var imgsrc = "imgs/pro-icon/icon-";
                    //如果存在后缀名
                    if (value.name && value.name.indexOf('.') !== -1) {
                        var unit = value.name.split('.')[value.name.split('.').length - 1];
                        unit = unit.toLowerCase();
                        if (typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
                            unit = 'other';
                        } else if (unit == "docx") {
                            unit = 'doc'
                        }
                        imgsrc = imgsrc + unit + ".png";
                        //1.获取后缀 把后缀你push到数组
                        $scope.collaList.docs[key].imgsrc = imgsrc;
                    } else {
                        unit = 'other';
                        imgsrc = imgsrc + unit + ".png";
                        $scope.collaList.docs[key].imgsrc = imgsrc;
                    }
                });
                var commentDocTotal = 0; //评论的文件个数
                angular.forEach($scope.collaList.comments, function (value, key) {
                    //如果存在后缀名
                    commentDocTotal = commentDocTotal + value.docs.length + parseInt((value.speech && value.speech.uuid) ? 1 : 0);
                    if (value.docs) {
                        angular.forEach(value.docs, function (value1, key1) {
                            var imgsrc = "imgs/pro-icon/icon-";
                            var unit = value1.suffix;
                            if (unit != null && unit != '') {
                                unit = unit.toLowerCase();
                                if (typeArr.indexOf(unit) == -1 || unit == null || unit == "" || unit == "undefined") {
                                    $scope.collaList.comments[key].docs[key1].suffix = 'other';
                                    imgsrc = imgsrc + "other.png";
                                    $scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
                                } else if (unit == "docx") {
                                    imgsrc = imgsrc + "doc.png";
                                    $scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
                                } else {
                                    imgsrc = imgsrc + unit + ".png";
                                    $scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
                                }
                                if (value1.thumbnailUrl) {
                                    $scope.collaList.comments[key].docs[key1].imgsrc = value1.thumbnailUrl;
                                }
                                if (value1.name == null) {
                                    var timestamp = new Date().getTime();
                                    $scope.collaList.comments[key].docs[key1].name = value1.md5 + ".png";
                                }
                            } else {
                                $scope.collaList.comments[key].docs[key1].suffix = 'other';
                                imgsrc = imgsrc + "other.png";
                                $scope.collaList.comments[key].docs[key1].imgsrc = imgsrc;
                            }
                        })
                    }
                });

                //判断两个按钮是否都存在，如果存在显示两个，否则显示全屏
                if ($scope.links && !$scope.speachShow) {
                    $(".mobile-devices .paly-model").css({"width": '100%'})
                } else if (!$scope.links && $scope.speachShow) {
                    $(".mobile-devices .play-audio").css({"width": '100%'})
                }
                //下载文件的总个数
                if (data.speach && data.speach.uuid) {
                    $scope.downloadTotal = data.pictures.length + data.docs.length + commentDocTotal + 1;
                } else {
                    $scope.downloadTotal = data.pictures.length + data.docs.length + commentDocTotal;
                }

                var picTypeArr = ['jpeg', 'bmp', 'PNG', 'GIF', 'JPG', 'png', 'jpg', 'gif', 'dwg'];
                var vedioTypeArr = ['avi', 'mp4', 'mov', 'flv', 'swf', 'wmv', 'mpeg', 'mpg', 'mp3'];
                var docTypeArr = ['txt', 'doc', 'pdf', 'ppt', 'docx', 'xlsx', 'xls', 'pptx'];
                //导出功能
                var coopExportTemp = {
                    firstTitle: '',
                    secondTitle: []
                };
                var info = [];
                var defaultTitle = {firstTitle: '协作主题：', secondTitle: '1.协作信息', threeTitle: '2.更新内容及资料'};
                var secondTitleTemp = {
                    title: "",
                    info: []
                };
                var infoTemp = {
                    coopMsg: [],
                    docs: []
                };
                var currentDeadline;
                coopExportTemp.firstTitle = defaultTitle.firstTitle + data.name + '';
                secondTitleTemp.title = defaultTitle.secondTitle;
                if (data.deadline && data.deadline != '不限期') {
                    currentDeadline = Common.dateFormat(new Date(data.deadline)).split(' ')[0];
                } else {
                    currentDeadline = '不限期';
                }
                if (!data.desc) {
                    data.desc = '';
                }
                var msgArrTemp = [];
                var nameArrTemp = ['协作类型：', '负责人：', '优先级：', '限期：', '状态：', '标识：', '描述：', '创建人：', '创建时间：'];
                msgArrTemp.push(data.coTypeVo.name);
                msgArrTemp.push(data.collaborator);
                msgArrTemp.push(data.priority);
                msgArrTemp.push(currentDeadline);
                msgArrTemp.push(data.status);
                msgArrTemp.push(data.markerInfo.name);
                msgArrTemp.push(defaultDesc);
                msgArrTemp.push(data.creator);
                msgArrTemp.push(data.createTime.split(' ')[0]);
                for (var i = 0; i < nameArrTemp.length; i++) {
                    var coopMsgTemp = {};
                    if (nameArrTemp[i] === '描述：' && !data.desc) {
                        continue;
                    }
                    coopMsgTemp = {name: nameArrTemp[i], msg: msgArrTemp[i], isFirstLine: false};
                    infoTemp.coopMsg.push(coopMsgTemp);
                }

                //pic type 1 pic 2 doc 3 comment
                angular.forEach(data.pictures, function (value, key) {
                    var temp = {};
                    if (value.name && value.name.indexOf('.') !== -1) {
                        temp.fileName = value.name;
                    } else {
                        temp.fileName = value.md5 + '.png';
                    }
                    temp.uuid = value.uuid ? value.uuid : '';
                    temp.type = 1;
                    if (temp.uuid) {
                        infoTemp.docs.push(temp);
                    }
                });
                //doc
                //按顺序重组 pic doc other
                var docSort = [];
                angular.forEach(data.docs, function (value, key) {
                    if (value.name && value.name.indexOf('.') !== -1) {
                        var unit = value.name.split('.')[value.name.split('.').length - 1];
                        if (picTypeArr.indexOf(unit) !== -1) {
                            docSort.push(value);
                        }
                    }
                });

                angular.forEach(data.docs, function (value, key) {
                    if (value.name && value.name.indexOf('.') !== -1) {
                        var unit = value.name.split('.')[value.name.split('.').length - 1];
                        if (picTypeArr.indexOf(unit) == -1) {
                            docSort.push(value);
                        }
                    }
                });

                angular.forEach(data.docs, function (value, key) {
                    if (value.name && value.name.indexOf('.') == -1) {
                        docSort.push(value);
                    }
                });

                angular.forEach(docSort, function (value, key) {
                    var temp = {};
                    temp.uuid = value.uuid;
                    temp.fileName = value.name;
                    temp.type = 2;
                    if (temp.uuid) {
                        infoTemp.docs.push(temp);
                    }
                });

                if (data.speach && data.speach.uuid) {
                    var temp = {};
                    temp.uuid = data.speach.uuid;
                    temp.fileName = data.speach.md5 + '.mp3';
                    temp.type = 2;
                    if (temp.uuid) {
                        infoTemp.docs.push(temp);
                    }
                }

                secondTitleTemp.info.push(infoTemp);

                //push 1.1的info值
                coopExportTemp.secondTitle.push(secondTitleTemp);

                var commentMsgArr;

                //comment 1.2
                secondTitleTemp = {
                    title: "",
                    info: []
                };

                angular.forEach(defaultComment, function (value, key) {
                    var commentDoc = [];
                    var tempTitle = '2.' + (key + 1);
                    secondTitleTemp.title = defaultTitle.threeTitle;
                    infoTemp = {
                        coopMsg: [],
                        docs: []
                    };
                    var commentNameArrTemp = ['添加人：', '添加时间：', '描述：'];
                    var commentMsgArrTemp = [];
                    if (value.status) {
                        commentNameArrTemp = ['状态：', '添加人：', '添加时间：', '描述：'];
                        commentMsgArrTemp.push(value.status);
                    }
                    commentMsgArrTemp.push(value.commentator);
                    commentMsgArrTemp.push(Common.dateFormat(new Date(value.commentTime)));
                    commentMsgArrTemp.push(value.comment);
                    for (var i = 0; i < commentNameArrTemp.length; i++) {
                        var coopMsgTemp = {};
                        if (i === 0) {
                            coopMsgTemp = {
                                name: tempTitle + commentNameArrTemp[i],
                                msg: commentMsgArrTemp[i],
                                isFirstLine: true
                            };
                            infoTemp.coopMsg.push(coopMsgTemp);
                        } else {
                            coopMsgTemp = {name: commentNameArrTemp[i], msg: commentMsgArrTemp[i], isFirstLine: false};
                            infoTemp.coopMsg.push(coopMsgTemp);
                        }
                    }
                    //按顺序重组 pic doc other
                    if (value.docs) {
                        angular.forEach(value.docs, function (value1, key1) {
                            if (picTypeArr.indexOf(value1.suffix) !== -1 && value1.uuid) {
                                commentDoc.push(value1);
                            }
                        });
                        angular.forEach(value.docs, function (value3, key3) {
                            if (picTypeArr.indexOf(value3.suffix) == -1 || !value3.suffix && value3.uuid) {
                                commentDoc.push(value3);
                            }
                        });
                        angular.forEach(commentDoc, function (value2, key2) {
                            var temp = {};
                            if (!value2.name && picTypeArr.indexOf(value2.suffix) !== -1) {
                                temp.fileName = value2.md5 + '.png';
                            } else {
                                temp.fileName = value2.name;
                            }
                            temp.uuid = value2.uuid;
                            temp.type = 3;
                            if (temp.uuid) {
                                infoTemp.docs.push(temp);
                            }
                        });
                    }
                    //comment speech
                    if (value.speech && value.speech.uuid) {
                        var temp = {};
                        temp.fileName = value.speech.md5 + '.mp3';
                        temp.uuid = value.speech.uuid;
                        temp.type = 3;
                        if (temp.uuid) {
                            infoTemp.docs.push(temp);
                        }
                    }
                    secondTitleTemp.info.push(infoTemp);
                });
                //push 1.2的info值
                coopExportTemp.secondTitle.push(secondTitleTemp);
                detailExport.coopExport.push(coopExportTemp);
                detailExport.coid = coid;
                //加载数据完成显示按钮
                $scope.loadComplete = true;
                layer.closeAll();
                // BimCo.NotifyEndGetData();
            }, function (error) {
                //简单提示信息error-infoCode-1000，删除相关error-infoCode-1005
                layer.alert(error.message, {
                    title: '提示',
                    closeBtn: 0,
                    move: false
                }, function () {

                    layer.closeAll();
                    $scope.getCooperation();
                    if (error.infoCode == '1005') {
                        if ($state.current.name !== 'cooperationNew.secondCloumn') {
                            $('#table1scroll >div > div[coid="' + coid + '"]').remove();
                        } else {
                            $('tr[coid="' + coid + '"]').remove();
                        }
                    } else {
                        return;
                    }
                });
            });

            //导出功能对接客户端
            $scope.doExport = function () {
                //console.log($scope.downloadTotal+'downloadTotal')
                var exportRefreshID;
                var strExportInfo = JSON.stringify(detailExport);
                // return
                //console.log(strExportInfo);
                var strCoName = $scope.collaList.coTypeVo.name + ' ' + $scope.collaList.name;
                //1.对接客户端导出协作接口，传入导出信息的Json字符串和当前协作的名称
                BimCo.ExportCooperation(strExportInfo, strCoName);

                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.doExport, 0, '');

                //执行轮询
                setRefreshInterval();

                // 设置间隔获取状态
                function setRefreshInterval() {
                    exportRefreshID = setInterval(refreshState, 1000);
                }

                function refreshState() {
                    //true执行加载中 false取消加载中
                    reCode = BimCo.IsShowProgressBar();
                    if (reCode) {
                        //调用加载层防止调用客户端时间过长
                        $('.downloading').css('display', 'block');
                        $('.down-mark').css('display', 'block');
                        $('.downloadIndex').css('display', 'block');
                        $('html').css('overflow-y', 'hidden');
                    } else if (!reCode) {
                        //清除轮询 不显示加载层
                        clearInterval(exportRefreshID);
                        $('.downloading').css('display', 'none');
                        $('.down-mark').css('display', 'none');
                        $('.downloadIndex').css('display', 'none');
                        $('html').css('overflow-y', '');
                    }
                }
            }

            //点击播放按钮获取MP3地址并播放(pc)
            var currentMp3Id;
            var currentUuid;
            var refreshID;
            var isPlay = false;
            $scope.getPcMP3Url = function (uuid, source) {
                var uuidList = [uuid];

                if (source == "comment") {
                    //if(currentUuid&&uuid!=currentUuid){
                    if (isPlay) {
                        layer.alert('当前正在播放录音！', {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                    } else {
                        isPlay = true;
                        currentUuid = uuid;
                        $('#open_' + uuid).hide();
                        $('#close_' + uuid).show();
                        $('#openDetail_' + uuid).hide();
                        $('#closeDetail_' + uuid).show();
                        Cooperation.getPcMp3Url(uuidList).then(function (data) {
                            angular.forEach(data, function (value, key) {
                                refreshID = setInterval(getAudioProgress, 1000);
                                //console.info(currentMp3Id);
                                currentMp3Id = BimCo.AudioPlay(value);//调用pc播放录音返回int类型
                            });
                        });
                    }
                } else {
                    // if((currentUuid && currentUuid != uuid && $scope.flag.audioPlaying)){
                    if (isPlay) {
                        layer.alert('当前正在播放录音！', {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                    } else {
                        isPlay = true;
                        currentUuid = uuid;
                        Cooperation.getPcMp3Url(uuidList).then(function (data) {
                            angular.forEach(data, function (value, key) {
                                if (source == '') {
                                    $scope.flag.audioPlaying = true;
                                    refreshID = setInterval(getAudioProgress, 1000);
                                } else {
                                    $scope.flag.commentAudioPlaying = true;
                                    refreshID = setInterval(getAudioProgress, 1000);
                                }
                                currentMp3Id = BimCo.AudioPlay(value);//调用pc播放录音返回int类型
                            });
                        });
                    }
                }
            }

            //点击取消播放
            $scope.AudioStop = function (source, uuid) {
                BimCo.AudioStop(currentMp3Id);
                isPlay = false;
                currentUuid = null;
                if (source == '') {
                    $scope.flag.audioPlaying = false;
                } else {
                    $('#open_' + uuid).show();
                    $('#openDetail_' + uuid).show();
                    $('#close_' + uuid).hide();
                    $('#closeDetail_' + uuid).hide();
                }
                clearInterval(refreshID);
            }

            //轮询当前MP3是否播放完成
            function getAudioProgress() {
                //调用pc端获取进度条
                // console.info(currentMp3Id);
                var currentProgress = BimCo.AudioProgress(currentMp3Id);
                if (currentProgress >= 100) {
                    isPlay = false;
                    BimCo.AudioStop(currentMp3Id);
                    $scope.flag.audioPlaying = false;
                    $('#open_' + currentUuid).show();
                    $('#openDetail_' + currentUuid).show();
                    $('#close_' + currentUuid).hide();
                    $('#closeDetail_' + currentUuid).hide();

                    $scope.$apply();
                    clearInterval(refreshID);
                }
            }

            function jMap() {
                //私有变量
                var arr = {};
                //增加
                this.put = function (key, value) {
                    arr[key] = value;
                }
                //查询
                this.get = function (key) {
                    if (arr[key]) {
                        return arr[key]
                    } else {
                        return null;
                    }
                }
                //删除
                this.remove = function (key) {
                    //delete 是javascript中关键字 作用是删除类中的一些属性
                    delete arr[key]
                }
                //遍历
                this.eachMap = function (fn) {
                    for (var key in arr) {
                        fn(key, arr[key])
                    }
                }
            }

            function isReadyDelete() {
                document.location = '#/cooperationNew/threeCloumn';
            }

            $scope.updateComment = function () {
                //判断是否有更新权限
                var authority = Cooperation.verifyAccessCode(accessCode, 'updateComment');
                if (!authority) {
                    return;
                }
                if (!$scope.commentModel.comment) {
                    $scope.isUpdataOK = true;
                    $scope.isVisible = true;
                    return;
                }
                //调用layer加载层
                var createindex = layer.load(0, {
                    shade: [0.5, '#000'] //0.1透明度的黑色背景
                });
                var data = {
                    coid: coid,
                    comment: {
                        comment: $scope.commentModel.comment, /*内容*/
                        commentator: '', /*评论人后端接口没给*/
                        commentTime: date, /*评论时间*/
                        docs: [], /*文件列表*/
                        // coSpeech:'' /*整改录音*/
                    },
                    status: $scope.statusCommon
                }

                //0.全部上传
                //1.上传回调给uploadList赋值
                //2.每次上传回调给赋值
                //每个上传成功之后的回调函数
                uploader2.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response[0].type == 'success') {
                        var unit = {};
                        unit.name = response[0].result.fileName;
                        unit.md5 = response[0].result.fileMd5;
                        unit.size = response[0].result.fileSize;
                        unit.uuid = response[0].result.uuid;
                        unit.suffix = response[0].result.suffix;
                        uploadList.push(unit);

                    } else if (response[0].type == 'error') {
                        //上传失败,记录失败的记录，提示用户
                        uploadResult = false;
                        //勿删
                        // errorUpload+="<br/>";
                        // errorUpload+=fileItem.file.name;
                        errorUpload = response[0].info;
                    }

                };

                uploader2.onErrorItem = function (item, response, status, headers) {
                    errorUpload = "网络错误，文件上传失败，请重新上传！";
                    uploadResult = false;
                }

                //全部成功的回调函数
                uploader2.onCompleteAll = function () {
                    onCompleteAllSignal = true;
                    data.comment.docs = uploadList;
                    if (!uploadResult) {
                        layer.close(createindex);
                        layer.alert(errorUpload, {
                            title: '提示',
                            closeBtn: 0
                        }, function (index) {
                            layer.closeAll();
                            // $uibModalInstance.dismiss();
                        });
                    } else {
                        Cooperation.commentToCollaboration(data).then(function (data) {
                            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.submitCommon, 0, '');
                            $scope.commentModel.comment = ""
                            uploadList = [];
                            $('.com-padding7').val('');
                            $scope.detailPage(coid);
                        }, function (data) {
                            //提示错误信息
                            layer.alert(data.message, {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function (index) {
                                layer.closeAll();
                                $scope.getCooperation(queryData.groups)
                            });

                        });
                    }
                    layer.close(createindex);
                };
                if (uploader2.queue.length) {
                    $scope.uploadBegin = true;
                    uploader2.uploadAll();
                } else {
                    layer.close(createindex);
                    // $uibModalInstance.close(data);
                    Cooperation.commentToCollaboration(data).then(function (data) {
                        Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.submitCommon, 0, '');

                        // $state.go($state.current, {}, {reload: true});
                        $scope.commentModel.comment = ""
                        uploadList = [];
                        $('.com-padding7').val('');
                        $scope.detailPage(coid)
                    }, function (data) {
                        //提示错误信息
                        layer.alert(data.message, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function (index) {
                            //do something
                            // $uibModalInstance.dismiss();
                            layer.closeAll();
                            $scope.getCooperation(queryData.groups)
                        });

                    });
                }
            }

            //主动签入接口
            $scope.accordCheckIn = function () {
                Cooperation.checkIn(coid).then(function (data) {
                });
            }
            //编辑协作跳转
            $scope.allowEditTrans = function () {
                var checkCoLocked = false;
                $.ajax({
                    type: "POST",
                    url: basePath + 'rs/co/checkCoLocked/' + coid,
                    async: false,
                    contentType: 'text/HTML',
                    success: function (data, status, XMLHttpRequest) {
                        if (data && (data !== currentUser)) {
                            checkCoLocked = true;
                            isLocking = true;
                            layer.alert('当前协作已被“' + data + '”签出，请稍候重试！', {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function (index) {
                                layer.closeAll();
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.alert(textStatus, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function (index) {
                            layer.closeAll();
                        });
                    }
                });
                if (checkCoLocked) {
                    return;
                }

                if ($scope.allowEdit) {
                    Cooperation.checkOut(coid).then(function (data) {
                        // $state.go('editdetail', {coid: coid});
                        //编辑弹框
                        Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.allowEditTrans, 0, '');

                        modalInstance = $uibModal.open({
                            windowClass: 'editcooper',
                            backdrop: 'static',
                            animation: false,
                            keyboard: false,
                            templateUrl: 'template/cooperation/cooperation_optimize/coop_editdetail_pc.html',
                            controller: 'editCooperationCtrl',
                            // size: 'lg',
                            resolve: {
                                items: function () {
                                    return {
                                        coid: coid,
                                        typeName: $scope.collaList.coTypeVo.name,
                                    };
                                }
                            }
                        });

                        modalInstance.result.then(function (param) {
                            //加条件解决co客户端过来的协作，编辑跳转回协作第一个的问题
                            if($state.current.name === 'cooperationNew.detail'){
                                $scope.detailPage(coid);
                            } else {
                                //编辑成功后刷新详情
                                $scope.getCooperation(queryData.groups);//刷新页面
                            }
                            // $scope.detailPage(param.coid, param.statusId);
                            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.editSave, 1, $scope.collaList.name);
                        }, function () {

                        })


                    }, function (error) {
                        //1005跳转主界面 1000刷新当前页
                        if (error.infoCode == '1005') {
                            layer.alert(error.message, {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function () {
                                layer.closeAll();
                                transToCooperation();//跳转至主界面
                            });
                        } else {
                            layer.alert(error.message, {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function () {
                                layer.closeAll();
                                $state.go($state.current, {}, {reload: true});
                            });
                        }
                    });
                } else {
                    layer.alert('当前协作已被“' + $scope.collaList.operationName + '”签出，请稍候重试！', {
                        title: '提示',
                        closeBtn: 0,
                        move: false
                    });
                }
            }

            //pc端交互
            $scope.checkModelpc = function () {
                //判断是否在播放中
                if ($(".detail-voice").css("display") == "block") {
                    $scope.audioClose();
                }
                //工程id 协同id 产品id
                var LocateComponentSignal = BimCo.LocateComponent(ppid, coid, productId);
                //反查失败页面不做任何操作
                if (!LocateComponentSignal) {
                    return;
                }
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.checkModel, 0, '');
            }

            //移动端交互
            $scope.checkModel = function () {
                //判断是否在播放中
                if ($(".detail-voice").css("display") == "block") {
                    $scope.audioClose();
                }
                sendCommand(1, coid);
            }

            $scope.zoom = function (uuid) {
                sendCommand(6, coid, uuid);
            }

            $scope.previewComment = function (index, uuid) {
                sendCommand(7, index, uuid);
            }

            $scope.docsOpen = function (uuid) {
                sendCommand(5, coid, uuid);
            }

            $scope.previewDocs = function (uuid) {
                sendCommand(2, coid, uuid);
            }

            $scope.downDocs = function (uuid) {
                sendCommand(3, coid, uuid);
                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.downDocs, 0, '');

            }

            function sendCommand(optType, id, uuid) {

                var param = '{"optType":' + optType + ',"coid":"' + id + '"}';
                if (optType == 2 || optType == 3 || optType == 5 || optType == 6) {
                    param = '{"optType":' + optType + ',"coid":"' + id + '","fileUUID":"' + uuid + '","isPreview":true' + '}';

                }
                if (optType == 7) {
                    param = '{"optType":' + optType + ',"index":"' + id + '","fileUUID":"' + uuid + '","isPreview":true' + '}';
                }
                if (optType == 8) {
                    param = '{"title":' + title + '}'
                }
                if (optType == 10) {
                    param = '{"optType":' + optType + ',"coid":"' + id + '","message":"' + uuid + '","isException":true}';
                }
                document.location = 'http://localhost:8080/bv/?param=' + param;
            }



            /**照片轮播图的初始化
             * @params direction           (ps 'horizontal'：水平 'vertical':垂直) 图片排列方式
             * @params updateOnImagesReady (ps true：更新 ) 图片加载完成更新
             * @params initialSlide        (ps initialSlide：0 ) 图片从第几张显示
             * @params width                                     宽度可是区域内给每一个slipe分割大小
             * @params slidesPerView                             显示区域
             * @params slidesPerGroup                            移动距离
             * @params spaceBetween                              图片和图片之间的间距
             * @params observer: true,//修改swiper自己或子元素时，自动初始化swiper
             * @params observeParents: true,//修改swiper的父元素时，自动初始化swiper
             * @params nextButton                                下一个
             * @params prevButton                                上一个
             */
            $scope.photoSwiper = function () {
                $timeout(function(){
                    var mySwiper = new Swiper('.swiper-container', {
                        direction: 'horizontal',
                        updateOnImagesReady: true,
                        initialSlide: 0,
                        width: 430,
                        // loop:true,
                        slidesPerView: 'auto',
                        slidesPerGroup: 1,
                        //每个图片的间距
                        spaceBetween: 10,
                        /* observer: true,//修改swiper自己或子元素时，自动初始化swiper
                         observeParents: true,//修改swiper的父元素时，自动初始化swiper*/
                        // 如果需要前进后退按钮
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',
                    });
                },100)
            }
            $scope.photoSwiper();
            //手机端页面侧边栏划出效果
            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                // 详情页面图片资料悬浮出现下载区域
                $(".action .picInfo .data-list .deta-down ").hover(function () {
                    $(this).find(".show-icon").stop().animate({"bottom": "-1px"})
                }, function () {
                    $(this).find(".show-icon").stop().animate({"bottom": "-38px"})
                });
            });

            /*滚动加载只防止多次提交请求问题start*/
            //可以查询
            var searchFlag1;
            var pollingFlag1 = true;
            var checkSearchInterval;
            var token1 = false;
            $scope.trendScrollEnd = false;
            $scope.addMoreDataTrend = function () {//详情动态加载
                if($scope.trendScrollEnd){
                    return;
                }
                if (!token1) {
                    return;
                }
                setSearchFlagFalse1();
                if (pollingFlag1) {
                    pollingFlag1 = false;
                    checkSearchInterval = setInterval(function () {
                        checkCanSearch1()
                    }, 100);
                }
                setTimeout(function () {
                    setSearchFlagTrue1()
                }, 150);
            }

            var setSearchFlagFalse1 = function () {
                searchFlag1 = false;
            }
            var setSearchFlagTrue1 = function () {
                searchFlag1 = true;
            }
            var checkCanSearch1 = function () {
                if (searchFlag1) {
                    clearInterval(checkSearchInterval);
                    $scope.getOperation();
                    pollingFlag1 = true;
                }
            }

            $scope.getOperation = function () {
                var size = $scope.operationList.length;
                if (size % dynamicPageSize != 0 || size == $scope.operationAllList.length) {
                    $scope.trendScrollEnd = true;
                    return;
                }
                var l = size / dynamicPageSize;
                var result = $scope.operationAllList.slice(dynamicPageSize * l, (l + 1) * dynamicPageSize);
                for (var i = 0; i < result.length; i++) {

                    $scope.operationList.push(result[i]);
                }
                angular.forEach($scope.operationList, function (val, key) {
                    $scope.operationList[key].operationTime = $scope.formatDate(new Date(val.operationTime), 2)
                })
                $scope.$apply();
                return;
            }

            $scope.operationAllList = [];
            var dynamicPageSize = 10;
            var dynamicCurrentShowPage = 1;
            //详情动态滚动加载
            $scope.getOperationList = function () {
                $scope.trendScrollEnd = false;
                if (trendflag) {
                    $scope.trendScrollEnd = false;
                    Cooperation.getOperationList($scope.flag.coid).then(function (data) {
                        $scope.operationAllList = data;
                        $scope.operationList = data.slice(0, dynamicCurrentShowPage * dynamicPageSize);
                        angular.forEach($scope.operationList, function (val, key) {
                            $scope.operationList[key].operationTime = $scope.formatDate(new Date(val.operationTime), 2)
                        })
                        var size = $scope.operationList.length;
                        if (size % dynamicPageSize != 0 || size == $scope.operationAllList.length) {
                            $scope.trendScrollEnd = true;
                        }
                        token1 = true;
                    });
                }
                trendflag = false;
            }

            //勿删-----------------------//
            /*$scope.swiper = {};
             $scope.next = function() {
             $scope.swiper.slideNext();
             };
             $scope.onReadySwiper = function(swiper) {
             console.log('onReadySwiper');
             swiper.on('slideChangeStart', function() {
             console.log('slideChangeStart');
             });
             };*/
            //协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
            $scope.doCollaboration = function (statusCode) {
                var params = {
                    coid: coid,
                    docs: [],
                    operationType: statusCode
                }
                var checkCoLocked = false;
                $.ajax({
                    type: "POST",
                    url: basePath + 'rs/co/checkCoLocked/' + coid,
                    async: false,
                    contentType: 'text/HTML',
                    success: function (data, status, XMLHttpRequest) {
                        if (data && data !== currentUser) {
                            checkCoLocked = true;
                            layer.alert('当前协作已被“' + data + '”签出，请稍候重试！', {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function (index) {
                                layer.closeAll();
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.alert(textStatus, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function (index) {
                            layer.closeAll();
                        });
                    }
                });
                if (checkCoLocked) {
                    return;
                }
                switch (statusCode) {
                    case 6:
                        layer.confirm('提交后您将不能再修改，若确认通过，请点击确定!', {
                            btn: ['确定', '取消'],//按钮
                            move: false
                        }, function () {
                            doCollaboration();
                        });
                        break;
                    case 7:
                        layer.confirm('提交后您将不能再修改，若确认拒绝，请点击确定！', {
                            btn: ['确定', '取消'],//按钮
                            move: false
                        }, function () {
                            doCollaboration();
                        });
                        break;
                    case 8:
                        layer.confirm('提交后您将不能再修改，若确认结束，请点击确定！', {
                            btn: ['确定', '取消'], //按钮
                            move: false
                        }, function () {
                            doCollaboration();
                        });
                        break;
                    default:
                        doCollaboration();
                        break;
                }

                function doCollaboration() {
                    Cooperation.doCollaboration(params).then(function (data) {
                        layer.closeAll();
                        switch (statusCode) {
                            case 6:
                                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.doCollaboration6, 1, $scope.collaList.name);

                                break;
                            case 7:
                                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.doCollaboration7, 1, $scope.collaList.name);

                                break;
                            case 8:
                                Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.doCollaboration8, 1, $scope.collaList.name);

                                break;
                        }
                        $scope.detailPage(coid)
                    }, function (data) {
                        layer.closeAll();
                        layer.alert(data.message, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function () {
                            //当前协作被删除1005
                            if (data.infoCode === '1005') {
                                layer.closeAll();
                                transToCooperation();//跳转至主界面
                            } else {
                                layer.closeAll();
                            }
                        });
                    });
                }
            }

            /**
             * 预览/签字
             * @param  {[type]}  uuid         资料uuid
             * @param  {[type]}  docName      资料名称
             * @param  {Boolean} isPdfsign    是否需要对接客户端(1:yes other：no)
             * @param  {Boolean} isSign       当前用户是否需要签字(-1不需要签字 0需要签字 1已签字)
             * @param  {[type]}  isdocPreview 日志区分标志？？-- 待补充
             * @param  {[type]}  btnType      区分是预览or非签字/已签字(1 预览 2 非签字/已签字)
             * @return {[type]}               [description]
             */
            $scope.previewSign = function (uuid, docName, isPdfsign, isSign, isdocPreview, btnType, isPriviewSign) {
                var suffix = '';
                if (docName && docName.indexOf('.') != -1) {
                    suffix = docName.split('.')[docName.split('.').length - 1];
                } else {
                    suffix = '';
                }
                //获取电子签名uuid
                if (suffix == 'pdf' && isPdfsign == 1) {
                    $scope.addApprove(uuid, docName, isPdfsign, suffix, isSign, isdocPreview, btnType, isPriviewSign);
                    /**
                     * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                     * 第五个参数为true的情况下需要传topicName
                     * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                     */
                    Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.previewSign, 0, '');
                } else {
                    //普通预览（除去pdf以外的文件）
                    var data = {fileName: docName, uuid: uuid};
                    $('.pdf-sign').show();
                    $('.dialog-mask-column').show();
                    Manage.getTrendsFileViewUrl(data).then(function (result) {
                        $scope.flag.isPreview = true;
                        $scope.flag.isGeneral = true;
                        $scope.flag.isPdfsign = false;
                        $scope.flag.isApprove = false;
                        $scope.previewUrl = $sce.trustAsResourceUrl(result);
                        /**
                         * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                         * 第五个参数为true的情况下需要传topicName
                         * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                         */
                        Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.previewSign, 0, '');
                    }, function (data) {
                        $scope.flag.isPreview = false;
                        $scope.previewUrl = '';
                        var obj = JSON.parse(data);
                        layer.alert(obj.message, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });
                        $('.dialog-mask-column ').hide();
                    });
                }
            }
            //添加审批意见
            $scope.addApprove = function (uuid, docName, isPdfsign, suffix, isSign, isdocPreview, btnType, isPriviewSign) {
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                //待签字/已签字
                if (!isdocPreview) {
                    Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.addApprove, 0, '');
                }

                var suffix = '';
                if (docName && docName.indexOf('.') != -1) {
                    suffix = docName.split('.')[docName.split('.').length - 1];
                } else {
                    suffix = '';
                }
                if (suffix != 'pdf') {
                    layer.alert('当前文件不支持预览', {
                        title: '提示',
                        closeBtn: 0,
                        move: false
                    });
                    return;
                }
                if (suffix == 'pdf' && isPdfsign == 1) {
                    //调用加载层防止调用客户端时间过长
                    createindex1 = layer.load(0, {
                        shade: [0.5, '#000'] //0.1透明度的黑色背景
                    });
                    //$scope.collaList.isSign为1,当前协作已经通过/拒绝
                    //$scope.collaList.status为'已结束',当前协作状态为已结束
                    var isVisibleDialog = BimCo.IsEncryptionDoc(uuid, suffix);
                    if (!isVisibleDialog) {
                        layer.close(createindex1);
                        return false;
                    }
                    if (($scope.collaList.isSign == 1 || $scope.collaList.status == '已结束' || $scope.collaList.status == '已通过' || $scope.collaList.status == '已拒绝' || isSign == -1) && btnType == '1') {
                        previewSignComment(uuid, docName, isPdfsign, suffix, -1, isdocPreview, btnType, coid, isPriviewSign);
                    } else {
                        if (!isPriviewSign) {
                            Cooperation.checkOut(coid).then(function (data) {
                                previewSignComment(uuid, docName, isPdfsign, suffix, isSign, isdocPreview, btnType, coid, isPriviewSign);
                            }, function (data) {
                                layer.close(createindex1)
                                return;
                            });
                        } else {
                            previewSignComment(uuid, docName, isPdfsign, suffix, isSign, isdocPreview, btnType, coid, isPriviewSign);
                        }

                    }
                }
                // 通知客户端修改窗口大小(勿删)
                // var react = "45,100,1080,720";
                // BimCo.MovePdfWnd(react);
            }

            //签署意见
            $scope.signComment = function () {
                $scope.isSign = true;
                BimCo.CommentSign(currentEditOfficeUuid, currentSuffix);
            }
            //电子签名
            $scope.signElectronic = function () {
                //获取电子签名
                var signature;
                $.ajax({
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    type: "get",
                    url: basePath + 'rs/co/signature',
                    async: false,
                    success: function (data) {
                        signature = data.uuid;
                        $scope.isEleSign = true;
                    },
                    error: function () {
                    }
                });
                BimCo.ElectronicSign(signature);
            }

            //显示更多相关人
            $scope.showMorePerson = function () {
                currentShowPage++;
                if (currentShowPage >= 2) {
                    $scope.collapse = true;
                }
                $scope.collaList.relevants = allRelevants.slice(0, currentShowPage * pageSizePc);
                if (currentShowPage >= totalPage) {
                    $scope.showMore = false;
                }
            }

            //显示更多相关人
            $scope.collapsePerson = function () {
                $scope.collaList.relevants = sliceRlevants;
                $scope.showMore = true;
                $scope.collapse = false;
                currentShowPage = 1;
            }

            //预览界面跳转回详情
            $scope.backDetail = function (source) {
                if (source == '') {
                    if (!BimCo.IsModify()) {
                        //pdf是否修改标志
                        $scope.flag.isPdfModify = false;
                        backDetail();
                        return;
                    } else {
                        $scope.flag.isPdfModify = true;
                    }
                    var rtn = BimCo.MessageBox("提示", '          ' + "放弃编辑？", 0x31);
                    if (rtn == 1) {
                        //取消调用签入
                        Cooperation.checkIn(coid).then(function (data) {
                        });
                        BimCo.SignCancel();
                        BimCo.CancelSubmitAll();
                        $scope.flag.isPreview = false;
                    }
                } else {
                    backDetail();
                }
            }

            function backDetail() {
                //没有点击添加审批意见不调用签入
                if ($scope.flag.isPreview) {
                    BimCo.SignCancel();
                    BimCo.CancelSubmitAll();
                }
                if ($scope.flag.isPreview && $scope.flag.isPdfsign && !$scope.flag.isPdfModify) {
                    //签署页面返回调用签入
                    Cooperation.checkIn(coid).then(function (data) {
                    });
                }
                $scope.flag.isPreview = false;
                $scope.flag.isPdfsign = false;
                $scope.flag.isApprove = false;
            }

            //详情页面跳转回homepage(cooperation)
            $scope.backCooperation = function () {
                firstreackflag = true;
                sessionStorage.deptId = $scope.collaList.deptId;
                sessionStorage.ppid = $scope.collaList.ppid;
                if ($state.current.name == 'cooperationNew.detail') {
                    if (routeBeforeTransDetail && routeBeforeTransDetail == 'cooperationNew.secondCloumn') { //跳转到详情之前是三栏
                        $state.go('cooperationNew.secondCloumn');
                    } else if (routeBeforeTransDetail && routeBeforeTransDetail !== 'cooperationNew.secondCloumn') {//跳转到详情之前是二栏
                        $state.go('cooperationNew.threeCloumn');
                    } else { //其他情况
                        $state.go('cooperationNew.threeCloumn');
                    }
                    if ($scope.collaList.deptId) {
                        // 1.deptid相同
                        if (sessionStorage.deptId == queryData.deptId) {
                            if (sessionStorage.deptId && sessionStorage.ppid) {
                                // queryData.deptId = sessionStorage.deptId;
                                // queryData.ppid = sessionStorage.ppid;
                                $timeout(function () {
                                    $("span[id='projectbutton_" + sessionStorage.ppid + "']").click();
                                }, 10);
                            }
                        } else {
                            // 2.deptid不同
                            // queryData.deptId = sessionStorage.deptId;
                            // queryData.ppid = sessionStorage.ppid;
                            $timeout(function () {
                                $("#deptbutton_" + sessionStorage.deptId).click();
                            }, 10)
                        }
                    } else {
                        $scope.deptIdToken = 1;
                        $timeout(function () {
                            $('#no-relate').click();
                            $("#no-relate").addClass('menusActive');
                        })
                    }
                }
                $timeout(function () {
                    $('.selectpicker').selectpicker({
                        style: '',
                        size: 'auto'
                    });
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('val', $scope.statusCommon);
                }, 100);
                $scope.flag.LgDetailMode = false; //大屏详情标志位
                $scope.isNormalScreen = true;
                if ($state.current.name == 'cooperationNew.threeCloumn') {
                    $scope.detailPage(coid);

                }
            }

            //删除协作
            $scope.deleteCoop = function (item, source) {
                //判断是否有删除权限
                var authority = Cooperation.verifyAccessCode(accessCode, 'delete');
                if (!authority) {
                    return;
                }
                coid = (item && item.coid) ? item.coid : coid;
                //确认要删除该协作吗？
                var checkCoLocked = false;
                $.ajax({
                    type: "POST",
                    url: basePath + 'rs/co/checkCoLocked/' + coid,
                    async: false,
                    contentType: 'text/HTML',
                    success: function (data, status, XMLHttpRequest) {
                        if (data) {
                            checkCoLocked = true;
                            layer.alert('当前协作已被“' + data + '”签出，请稍候重试！', {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function (index) {
                                layer.closeAll();
                            });
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        layer.alert(textStatus, {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function (index) {
                            layer.closeAll();
                        });
                    }
                });
                if (checkCoLocked) {
                    return;
                }
                layer.confirm('确认要删除该协作吗？', {
                    btn: ['确认', '取消'],
                    move: false
                }, function () {
                    $('.coo-detail,.overlay').hide();
                    layer.closeAll();
                    if (source !== 'fromThreeCloumnRight') {
                        Cooperation.removeCoopertion(coid).then(function (data) {
                            $('.three-coop[coid="' + coid + '"]').remove();
                            $('tr[coid="' + coid + '"]').remove();
                            angular.forEach($scope.cooperationList, function (val, key) {
                                if ($scope.cooperationList[key].coid == coid) {
                                    $scope.cooperationList.splice(key, 1)
                                }
                            })
                            $scope.getCooperation(queryData.groups, 'delete');
                            $scope.flag.LgDetailMode = false; //大屏详情是否显示的标志
                            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.deleteCoop, 1, $scope.collaList.name);

                            transToCooperation();//跳转至主界面
                        }, function (error) {
                            //协作被删除的情况下或者被签出的情况
                            layer.alert(error.message, {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function () {
                                if (error.infoCode == '1005') {
                                    layer.closeAll();
                                    transToCooperation();//跳转至主界面
                                } else {
                                    layer.closeAll();
                                }
                            });

                        });
                    } else {
                        Cooperation.removeCoopertion(coid).then(function (data) {
                            $('tr[coid="' + coid + '"]').remove();
                            $scope.flag.LgDetailMode = false; //大屏详情是否显示的标志
                            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.deleteCoop, 1, $scope.collaList.name);
                            $scope.getCooperation(queryData.groups, 'delete');


                        }, function (error) {
                            //协作被删除的情况下或者被签出的情况
                            layer.alert(error.message, {
                                title: '提示',
                                closeBtn: 0,
                                move: false
                            }, function () {
                                if (error.infoCode == '1005') {
                                    layer.closeAll();
                                    $scope.getCooperation();
                                    layer.closeAll();
                                }
                            });
                        });
                    }
                })
            }

            //关闭预览弹窗
            $scope.closePriview = function () {
                $scope.previewUrl = ' ';
                $('.pdf-sign').hide();
                $('.dialog-mask-column').hide();
            }
            $('.detail-icon-tool>span').map(function () {
                $(this).on('click', function (event) {
                    $('.detail-icon-tool span').removeClass('detail-actives');
                    $(this).addClass('detail-actives');
                    event.stopPropagation()
                })
            })

        }

        //客户端跳转到详情界面(ps:单独路由)
        $scope.toDetailPage = function () {
            trendflag = true;
            routeBeforeTransDetail = $state.current.name;
            coid = $("#detailFromBe").val();
            $state.go('cooperationNew.detail', {coid: coid});
            $timeout(function () {
                $scope.flag.LgDetailMode = true;
            }, 10);
            $scope.detailPage(coid);
            if (!$('#btn_box').find('.glyphicon-menu-left').length) {
                $(".glyphicon-menu-right").click();
            }
        }

        // 动态页面跳转详情之后的操作
        if ($state.current.name === 'cooperationNew.detail') {
            var coid = urlParams.coid ? urlParams.coid : '';
            $state.go('cooperationNew.detail', {coid: coid});
            $timeout(function () {
                $scope.flag.LgDetailMode = true;
            }, 10);
            $scope.detailPage(coid);
        }

        //点击已选中的筛选项的click事件
        function filterTemplateEvent() {
            $('.filterOptions span').bind("click", function () {
                // $timeout(function(){
                $scope.scrollend = false;
                // });
                queryData.modifyTime = '';
                queryData.modifyTimeCount = 0;
                var type = $(this).attr('type');
                if (type == 601) {
                    $scope.flag.coTypeFilter = false;
                } else if (type == 606) {
                    $scope.flag.coAffiliation = false;
                } else if (type == 603) {
                    $scope.flag.coMarkFilter = false;
                } else if (type == 605) {
                    $scope.flag.coStatus = false;
                } else if (type == 607) {
                    $scope.flag.coCreateTime = false;
                }
                if (!$scope.flag.coTypeFilter || !$scope.flag.coAffiliation || !$scope.flag.coMarkFilter || !$scope.flag.coStatus || !$scope.flag.coCreateTime) {
                    $('.filter-close').show().addClass('filter-panel-active');
                }

                //移除当前节点
                $(this).remove();
                if ($('.filterOptions span').length <= 0 && !$scope.closeStause) {
                    $('.filter-close').hide();
                }
                var removeFilter = _.remove(queryData.groups, function (n) {
                    return n.type == type;
                });
                var removeFilter1 = _.remove(filterSessionOptions, function (n) {
                    return n.type == type;
                });
                if (!queryData.groups.length) {
                    $scope.flag.filterExist = false;
                    filterTableHeight = 0;
                } else {
                    filterTableHeight = $('.filter-tab').outerHeight();
                }
                //当前协同列表的高度
                $timeout(function () {
                    getCoListHeight();
                }, 20)
                $scope.getCooperation(queryData.groups);
                //将筛选条件放入session
                addSessionValue('filter');
                $('.detail-column').css({'top': ($('.filter-box').height() + 50) + 'px'})
            });
        }

        filterTemplateEvent();
        //清空筛选
        $scope.clearAllFiltertemplate = function () {
            $('.filterOptions span').remove();
            queryData.groups = [];
            filterSessionOptions = [];
            $scope.getCooperation(queryData.groups);
            $scope.flag.filterExist = false;
            $scope.flag.coTypeFilter = false;
            $scope.flag.coAffiliation = false;
            $scope.flag.coMarkFilter = false;
            $scope.flag.coStatus = false;
            $scope.flag.coCreateTime = false;
            sessionStorage.removeItem("groups");
            sessionStorage.removeItem("filterSessionOptions");
            if (!$scope.closeStause) {
                $('.filter-close').hide()
            }
            $('.detail-column').css({'top': ($('.filter-box').height()) + 'px'})
        }


        //组合删除项
        function ComDelItem() {
            delItems = [];//初始刷delItem
            angular.forEach($scope.cooperationList, function (value, key) {
                delItems.push(value.coid);
            });
        }

        //根据筛选生成选项template
        function createFilterTemplate(item, signal) {
            var items = [];
            var unit = {};
            //根据item的不同来源分别处理
            if (signal != 'rember') {
                unit.type = signal;
                unit.name = item.name;
                items.push(unit);
            } else {
                items = item;
            }
            var unique = _.uniqBy(items, 'type');
            angular.forEach(unique, function (value, key) {
                if (value.type == 601) {
                    $scope.flag.coTypeFilter = true;
                } else if (value.type == 606) {
                    $scope.flag.coAffiliation = true;
                } else if (value.type == 603) {
                    $scope.flag.coMarkFilter = true;
                } else if (value.type == 605) {
                    $scope.flag.coStatus = true;
                } else if (value.type == 607) {
                    $scope.flag.coCreateTime = true;
                }

                var filterOptionsTemp = '<span class="filter-criteria" style="clear:both;" type="' + value.type + '" title="' + value.name + '"><b class="substr" style="width:60px;display:inline-block;font-weight:normal;float:left">' + value.name + '</b><!--<a style="float:right;color:#69c080;">x</a>--><a href="javascript:;;" class="label-close" style="position:relative"><b class="glyphicon glyphicon-menu-right absol"></b><b class="glyphicon glyphicon-menu-left absol"></b></a></span>';
                if ($('.filterOptions').find('span').length) {
                    $('.filterOptions span:last').after(filterOptionsTemp);
                } else {
                    $('.filterOptions').append(filterOptionsTemp);
                }
            });
            if ($scope.flag.coTypeFilter && $scope.flag.coAffiliation && $scope.flag.coMarkFilter && $scope.flag.coStatus && $scope.flag.coCreateTime) {
                $('.filter-close').hide();
            } else {
                $('.filter-close').show().addClass('filter-panel-active');
            }
        }

        //获取动态筛选列表
        Cooperation.getCoQueryFilter().then(function (data) {
            data[0].list.shift();
            data[1].list.shift();
            data[2].list.shift();
            data[3].list.shift();
            $scope.coQueryType = data[0].list;//协作类型
            $scope.coAffiliation = data[1].list;//协作归属
            $scope.coMark = data[2].list;//协作标识
            $scope.coStatus = data[3].list;//协作状态
            $scope.coCreateTime = data[4].list;//协作发起时间
        });

        $scope.openNew = function () {
            //判断是否有新建权限
            var authority = Cooperation.verifyAccessCode(accessCode, 'create');
            if (!authority) {
                return;
            }
            $scope.openSignal = true;
            Cooperation.getTypeList().then(function (data) {
                countArray = data;
                $('.overlay').css('top', '0px');
                $('.overlay').css('height', 'calc(100vh - 65px)');
                $('.overlay').css('display', 'block');
                angular.forEach(data, function (value, key) {
                    if (value.name == '问题整改') {
                        data[key].typeImg = 1;
                    } else if (value.name == '阶段报告') {
                        data[key].typeImg = 2;
                    } else if (value.name == '方案报审') {
                        data[key].typeImg = 3;
                    } else if (value.name == '方案会签') {
                        data[key].typeImg = 4;
                    } else if (value.name == '现场签证') {
                        data[key].typeImg = 5;
                    } else if (value.name == '图纸变更') {
                        data[key].typeImg = 6;
                    }
                });
                $scope.typeList = data;
            });
        }

        var time = 0;
        $scope.isShowComboBox = function () {

            $scope.closeStause = !$scope.closeStause;
            if ((!$scope.flag.coTypeFilter || !$scope.flag.coAffiliation || !$scope.flag.coMarkFilter || !$scope.flag.coStatus || !$scope.flag.coCreateTime)) {
                $('.filter-close').show().addClass('filter-panel-active');
            } else {
                $('.filter-close').removeClass('filter-panel-active');
            }
            if ($scope.closeStause) {
                $('.double-arrow').css('transform', 'rotate(-180deg)');
                $('.filter-close').find('.filter-panel').text('收起筛选');

            } else {
                $('.double-arrow').css('transform', 'rotate(0deg)');
                $('.filter-close').find('.filter-panel').text('展开筛选');
                $('.filter-close').removeClass('filter-panel-active');
            }

            /**
             * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
             * 第五个参数为true的情况下需要传topicName
             * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
             */
            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.isShowComboBox, 0, '');

            $timeout(function () {
                getCoListHeight();
                // $('.detail-column').css('top',($('.filter-table').height()+49)+"px")
                $('.detail-column').css({'top': ($('.filter-box').height() + 50) + 'px'})
            }, 20)

        }
        /**
         * 协作主界面三栏两栏切换
         * @param event 事件源
         */
        //根据当前路由加入默认样式
        if ($state.current.name == "cooperationNew.threeCloumn") {
            $('.three-column').css({'background-position': '0px -298px'});
            $('.second-column').css({'background-position': '-31px -297px'})
        } else {
            $('.second-column').css({'background-position': '-31px -270px'});
            $('.three-column').css({'background-position': '0px -271px'})
        }
        $scope.menusColumn = function (event) {
            delItems = []; //切换路由清空删除项
            $scope.commentModel.comment = '';
            uploader2.queue = [];//回复上传内容清空
            $scope.isVisible = false;//回复错误框隐藏
            if ($(event.currentTarget).hasClass('three-column')) {
                $(event.currentTarget).css({'background-position': '0px -298px'});
                $('.second-column').css({'background-position': '-31px -297px'});
            }
            if ($(event.currentTarget).hasClass('second-column')) {
                $(event.currentTarget).css({'background-position': '-31px -270px'});
                $('.three-column').css({'background-position': '0px -271px'});
            }
            $scope.detailSignal = false; //隐藏主界面右侧详情栏
            // $scope.detailPage($scope.cooperationList[0].coid);//切换的时候触发第一条协作的详情
            $scope.getCooperation(queryData.groups);//三两栏切换刷新
        }
        //筛选条件
        if ($('.filter-tab').css('display') == 'block') {
            $('.filter-close').find('.filter-panel').text('展开筛选');
            $('.filter-close').removeClass('filter-panel-active');
        }
        $scope.filterPanel = function (event) {
            if ($('.filter-tab').css('display') == 'block') {
                if ($(event.currentTarget).hasClass('filter-panel-active')) {
                    $scope.closeStause = false;
                    $(event.currentTarget).removeClass('filter-panel-active');
                    $('.icon-arrow').css('background-position-x', '-62px')
                    $(event.currentTarget).find('.filter-panel').text('展开筛选');
                    $('.cooper-column').height(document.documentElement.clientHeight - 150 - $('.comboBox').outerHeight() - 36)
                } else {
                    $scope.closeStause = true;
                    $(event.currentTarget).addClass('filter-panel-active');
                    $('.icon-arrow').css('background-position-x', '-75px')
                    $(event.currentTarget).find('.filter-panel').text('收起筛选');
                }
            } else {
                $(event.currentTarget).hide();
                $scope.closeStause = false;
            }
            $timeout(function () {
                getCoListHeight();//自动计算中间栏的高度
                $('.detail-column').css({'top': ($('.filter-box').height() + 50) + 'px'})
            })
        };
        /**
         * 点击未关联工程
         * @param  {int} id 对应的deptId
         * @return {[type]}    [description]
         */
        $scope.link = function (id) {
            $(".operation").show();
            !$('.table-list').length ? "" : $('.table-list')[0].scrollTop = 0;
            $scope.coNoResult = false;
            $scope.deptNoCo = false;
            $scope.projNoCo = false;
            $scope.searchNoCo = false;
            $scope.noRelatedNoCo = false;
            $scope.flag.isDraft = false;
            $scope.deptIdOpenToken = 0;
            searId = id;
            $scope.initScrollend(id);
            $scope.projectInfoList = [];
            queryData.searchKey = $scope.flag.searchkey;
            if (id == -1) {
                queryData.deptId = -1;
                queryData.ppid = '';
            }

            Cooperation.getCollaborationList(queryData).then(function (data) {
                $scope.cooperationList = data.list;
                $scope.coItemsTotals = data.count;
                if (!$scope.cooperationList.length && queryData.groups.length) {
                    $scope.coNoResult = true;
                    //显示当前搜索无结果
                    $scope.searchNoCo = true;
                } else if (!$scope.cooperationList.length && !queryData.groups.length) {
                    $scope.coNoResult = true;
                    //当前无协作
                    $scope.noRelatedNoCo = true;
                }
                queryData.deptId = -1;
                queryData.ppid = '';
                if ($scope.cooperationList.length) {
                    if (!$scope.cooperationList[0].isRead) {
                        BimCo.ClearMsgData();
                        $scope.cooperationList[0].isRead = true;
                    }
                    $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].statusId, $scope.cooperationList[0].isRead);
                    deleteDetail([$scope.cooperationList[0]], null, 'isRemark');
                    angular.forEach($scope.cooperationList, function (val, key) {
                        $scope.cooperationList[key].updateformatTime = FormatDate(data.currentTime, val.updateTime);
                        $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2)
                    })
                }

            });

            if ($(".data_count").css('display') !== 'none') {
                $scope.comboxCount();
            }

            $(".general").removeClass('menusActive');
            $("#draft").removeClass('menusActive');
            $(".cop-filter, .cop-list, .btn_count").css("display", 'inline-block');
            $(".basic-project").show();
        }

        //点击蒙层隐藏筛选匡
        $scope.clicklay = function () {
            $scope.isCollapsed = false;
            $scope.detailSignal = false;
            $scope.openSignal = false;
            $('.overlay').css('display', 'none');
            $(".operation-mask").hide()
        }

        $scope.clicklay1 = function () {
            $scope.isCollapsed = false;
            $scope.detailSignal = false;
            $scope.openSignal = false;
            $('.overlay1').css('display', 'none');
            $(".operation-mask").hide()
        }

        //点击显示列表每条协作的详情
        $scope.openDetail = function (item) {
            $scope.detailSignal = true;
            $('.coo-detail').show();
            $('.overlay').css('top', '0px');
            $('.overlay').css('height', 'calc(100vh - 65px)');
            $('.overlay').css('display', 'block');
            if (item.deadline != null) {
                item.deadline = item.deadline.substr(0, 10);
            }
            $scope.everyDetail = item;
            detailDeptId = item.deptId;
            detailPpid = item.ppid;
        }
        /**
         * 新建
         * @param typeId   类型id
         * @param typeName 类型名称
         */
        $scope.trans = function (typeId, typeName) {
            $scope.clicklay();
            //关闭一开始的弹框
            modalInstance = $uibModal.open({
                windowClass: 'newcooper',
                backdrop: 'static',
                animation: false,
                keyboard: false,
                templateUrl: 'template/cooperation/cooperation_optimize/newcopper.html',
                controller: 'newCooperationCtrl',
                // size: 'lg',
                resolve: {
                    items: function () {
                        return {
                            'typeid': typeId,
                            'typename': typeName,
                            'deptId': queryData.deptId,
                            'ppid': queryData.ppid ? queryData.ppid : '',
                            // 'deptName': deptName,
                            'ppidName': ppidName ? ppidName : '',
                            // 'productId': productId?productId:''
                        };
                    }
                }
            });
            modalInstance.result.then(function (data) {
                fromNewCooperation = true;
                if (data.deptId && data.deptId != -1) {
                    //1.deptid相同
                    if (data.deptId == queryData.deptId) {
                        if (data.deptId && data.ppid) {
                            queryData.deptId = data.deptId;
                            queryData.ppid = data.ppid;
                            $timeout(function () {
                                $("span[id='projectbutton_" + queryData.ppid + "']").click();
                                $scope.getCooperation(queryData.groups);
                            }, 10);
                        }
                    } else {
                        //2.deptid不同
                        queryData.deptId = data.deptId;
                        queryData.ppid = data.ppid;
                        fromNewCooperationPpid = data.ppid
                        $timeout(function () {
                            $("#deptbutton_" + queryData.deptId).click();
                            $scope.getCooperation(queryData.groups);
                        }, 10);
                    }
                } else {
                    $scope.deptIdToken = 1;
                    $timeout(function () {
                        $('#no-relate').click();
                        $("#no-relate").addClass('menusActive');
                    })
                }
            }, function () {
            })
        }
        /**
         * getimgurl 左侧菜单图标icon
         * @param    treeItems 元素
         * @param    deptId    项目depteId
         */
        function getimgurl(treeItems, deptId) {
            //清空旧数据
            $("#dept_" + deptId).empty();
            for (var i = 0; i < treeItems.length; i++) {
                if (treeItems[i].projectType == "土建预算") {
                    treeItems[i].imgsrc = "imgs/icon/1.png";
                } else if (treeItems[i].projectType == "钢筋预算") {
                    treeItems[i].imgsrc = "imgs/icon/2.png";
                } else if (treeItems[i].projectType == "安装预算") {
                    treeItems[i].imgsrc = "imgs/icon/3.png";
                } else if (treeItems[i].projectType == "Revit") {
                    treeItems[i].imgsrc = "imgs/icon/4.png";
                } else if (treeItems[i].projectType == "Tekla") {
                    treeItems[i].imgsrc = "imgs/icon/5.png";
                } else if (treeItems[i].projectType == "PDF") {
                    treeItems[i].imgsrc = "imgs/icon/6.png";
                } else if (treeItems[i].projectType == "班筑家装") {
                    treeItems[i].imgsrc = "imgs/icon/8.png";
                } else if (treeItems[i].projectType == "场布预算") {
                    treeItems[i].imgsrc = "imgs/icon/9.png";
                }
                if (!!treeItems[i].count) {
                    $("#dept_" + deptId).append("<span id=projectbutton_" + treeItems[i].ppid + " title='" + treeItems[i].projectName + "' class='spanwidth'><img src='" + treeItems[i].imgsrc + "'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>" + treeItems[i].projectName + "</span>&nbsp;<b class='coop-countElement'>(" + treeItems[i].count + ")</b></span>")
                } else {
                    $("#dept_" + deptId).append("<span id=projectbutton_" + treeItems[i].ppid + " title='" + treeItems[i].projectName + "' class='spanwidth'><img src='" + treeItems[i].imgsrc + "'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>" + treeItems[i].projectName + "</span></span>")
                }
            }
            //工程列表的点击事件
            $("span[id^='projectbutton_']").bind("click", function (event) {
                $scope.flag.allSelected = false;//初始化全选按钮
                delItems = []; //初始化批量删除
                if (!$scope.coNoResult) {
                    var createindex = layer.load(0, {
                        shade: [0.5, '#000'], //0.1透明度的黑色背景
                    });
                }

                queryData.searchKey = $scope.flag.searchkey;
                $scope.flag.isDraft = false;
                $('.manage-menus').removeClass('menusActive');
                $("span[class*=ng-binding]").removeClass("menusActive");
                //获取当前元素
                $(this).addClass("menusActive").siblings().removeClass("menusActive");
                $(".table-list.basic-project").show();
                $scope.getCollaborationList($(this).attr("id").split("_")[1], $(this).find('.substr-sideMenus').text());
                setTimeout(function () {
                    layer.close(createindex)
                }, 200);

                if ($(".data_count").css('display') !== 'none') {
                    $scope.comboxCount();
                }
            });
        }

        //获取工程列表
        $scope.getprojectInfoList = function (deptId, open, itemDeptName) {
            publicDeptId = deptId;
            $scope.flag.allSelected = false;//初始化全选按钮
            delItems = []; //初始化批量删除
            ppidName = '';
            deptName = itemDeptName;
            $(".container-fluid .operation").show();
            !$('.table-list').length ? "" : $('.table-list')[0].scrollTop = 0;
            $scope.coNoResult = false;
            $scope.deptNoCo = false;
            $scope.projNoCo = false;
            $scope.searchNoCo = false;
            $scope.noRelatedNoCo = false;
            $scope.flag.isDraft = false;
            $('#deptbutton_' + deptId).parent().addClass('menusActive');
            // $('#deptbutton_'+deptId).parent().siblings().removeClass('menusActive');
            $(':not(#deptbutton_' + deptId + ')').parent().removeClass('menusActive');
            //初始化数据
            var createindex = layer.load(0, {
                shade: [0.5, '#000'], //0.1透明度的黑色背景
            });
            $scope.scrollend = false;
            queryData.modifyTime = '';
            queryData.modifyTimeCount = 0;
            queryData.ppid = '';
            sessionStorage.ppid = '';
            $scope.projectInfoList = [];
            queryData.searchKey = $scope.flag.searchkey;
            // queryData.groups=[];勿删
            $(".cop-filter, .cop-list, .btn_count").css("display", 'inline-block');
            $(".basic-project").show();
            if (!open) {
                //通知客户端页面已加载可跳转到详情(适用于切换企业且需要跳转详情的情况)
                var beTransSignal = BimCo.NotifyEndGetData();
                Cooperation.getProjectList(deptId).then(function (data) {
                    layer.close(createindex);
                    getimgurl(data, deptId);
                    if (fromNewCooperationPpid && fromNewCooperation) { //新建协作保存之后的操作
                        $("span[id='projectbutton_" + fromNewCooperationPpid + "']").click();
                        firstreackflag = false;
                        fromNewCooperation = false;
                    } else if (sessionStorage.ppid && firstreackflag && $scope.flag.fromManage) { //刷新页面的操作
                        $("span[id='projectbutton_" + sessionStorage.ppid + "']").click();
                        firstreackflag = false;
                        fromNewCooperation = false;
                    }
                });
                $scope.deptIdOpenToken = 0;
            } else {
                $scope.deptIdOpenToken = 1;
                layer.close(createindex);
            }

            if (!queryData.deptId) {
                queryData.deptId = deptId;
            }
            //如果进入的deptid不同
            if (queryData.deptId != deptId) {
                queryData.deptId = deptId;
            }
            if (!queryData.ppid) {
                $scope.cooperationList = [];
                Cooperation.getCollaborationList(queryData).then(function (data) {
                    $scope.cooperationList = data.list;
                    //计算当前协作总条数
                    $scope.coItemsTotals = data.count;
                    if (!$scope.cooperationList.length && queryData.groups.length) {
                        $scope.coNoResult = true;
                        //显示当前搜索无结果
                        $scope.searchNoCo = true;
                    } else if (!$scope.cooperationList.length && !queryData.groups.length) {
                        $scope.coNoResult = true;
                        //当前无协作
                        $scope.noRelatedNoCo = true;
                    }
                    $scope.deptIdToken = 1;
                    $scope.deptIdOpenToken = 0;
                    angular.forEach($scope.cooperationList, function (val, key) {
                        $scope.cooperationList[key].updateformatTime = FormatDate(data.currentTime, val.updateTime);
                    })
                    if ($scope.cooperationList.length && $scope.cooperationList[0].coid) {
                        if (!$scope.cooperationList[0].isRead) {
                            BimCo.ClearMsgData();
                            deleteDetail([$scope.cooperationList[0]],null, 'isRemark');//默认加载数据变化
                            $scope.cooperationList[0].isRead = true;
                        }
                        $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].statusId, $scope.cooperationList[0].isRead);
                        angular.forEach($scope.cooperationList, function (val, key) {
                            $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2);
                            val.createTime = $scope.formatDate(new Date(val.createTime), 2)
                            if (val.deadline) {
                                val.deadline = $scope.formatDate(new Date(val.deadline), 2)
                            }
                        })
                    } else {
                        return false;
                    }
                });
                if (!firstreackflag) {
                    $(".data_count").hide();
                }
                firstflag = false;
            }
            if ($(".data_count").css('display') !== 'none') {
                $scope.comboxCount();
            }
        }

        /*滚动加载防止多次提交请求问题start*/
        //可以查询
        var searchFlag;
        var pollingFlag = true;
        var checkSearchInterval;
        $scope.addMoreData = function () {
            if ($scope.deptIdToken == 0 || $scope.ppidToken == 1 || $scope.deptIdOpenToken == 1) {
                $scope.ppidToken = 0;
                return;
            }
            if (token == true) {
                token = false;
                return;
            }
            //是否有切换status,有切换，并且没有获取到数据，直接返回
            //主要针对来回切换
            if ($scope.status && !$scope.changeAttrToken) {
                $scope.status = false;
                return;
            }
            //主要是针对： 第一次进入滚动之后在切换其他状态（serchtype）滚动加载两次问题
            if ($scope.changeAttrToken) {
                $scope.changeAttrToken = false;
                return;
            }
            if ($scope.flag.filterOk) {
                return;
            }
            //如果第一次加载，没有20条语句，并且出现滚动条，导致srocllend不为true，可以继续滚动
            if ($scope.cooperationList.length < 20) {
                $scope.scrollend = true;
                return;
            }
            setSearchFlagFalse();
            if (pollingFlag) {
                pollingFlag = false;
                checkSearchInterval = setInterval(function () {
                    checkCanSearch()
                }, 100);
            }
            setTimeout(function () {
                setSearchFlagTrue()
            }, 150);


        };
        var setSearchFlagFalse = function () {
            searchFlag = false;
        }
        var setSearchFlagTrue = function () {
            searchFlag = true;
        }
        var checkCanSearch = function () {
            if (searchFlag) {
                clearInterval(checkSearchInterval);
                $scope.searchMoreData();
                pollingFlag = true;

            }
        }
        /*滚动加载只防止多次提交请求问题end*/

        /**
         * 当滚动加载到最后一页时候，$scope.scrollend全局变量为true
         * 导致切换工程时候不能进行滚动加载，需要初始化$scope.scrollend的值
         */
        $scope.initScrollend = function (id) {
            //如果当前工程id和切换的工程id不一样，初始化$scope.scrollend
            if (queryData.ppid != id) {
                $scope.scrollend = false;
                queryData.modifyTime = '';
                queryData.modifyTimeCount = 0;
            }
        }

        /**
         * 滚动加载下拉获取更多协同列表数据
         */
        $scope.searchMoreData = function () {

            //默认获取第一个项目部列表的工程列表
            //第一次queryData.modifyTime为空
            //第二次modifyTime为最后一次的数据的时间值
            if ($scope.cooperationList.length) {
                var count = 0;
                var size = $scope.cooperationList.length;
                queryData.modifyTime = $scope.cooperationList[size - 1].updateTime;
                for (var i = 0; i < size; i++) {
                    if (queryData.modifyTime == $scope.cooperationList[i].updateTime) {
                        count++;
                    }
                }
                queryData.modifyTimeCount = count;
            }
            Cooperation.getCollaborationList(queryData).then(function (data) {
                var dataIntact = data;
                var data = data.list;
                $scope.isVisible = false;
                if (!$scope.cooperationList.length) {
                    $scope.cooperationList = data;

                } else {
                    if (data.length) {
                        for (var j = 0; j < data.length; j++) {
                            $scope.cooperationList.push(data[j]);
                        }
                        angular.forEach($scope.cooperationList, function (val, key) {
                            $scope.cooperationList[key].updateformatTime = FormatDate(dataIntact.currentTime, val.updateTime);
                            $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2);
                            val.createTime = $scope.formatDate(new Date(val.createTime), 2)
                            if (val.deadline) {
                                val.deadline = $scope.formatDate(new Date(val.deadline), 2)
                            }
                            /*if(!val.isRead && Remarklist.indexOf(val.coid)){
                             Remarklist.push(val.coid)
                             }*/

                        })
                        if (data.length < 20) {
                            $scope.scrollend = true;
                        }
                    }

                    if (queryData.modifyTimeCount === 0) {
                        $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].status, $scope.cooperationList[0].isRead)
                    }
                    return;
                }
            });
        }

        $scope.$on('colistRepeatFinished', function (ngRepeatFinishedEvent) {
            $('div .three-coop:first-child').addClass('coopActive')
            // 如果在下拉工程中,当前全选是选中状态
            if ($scope.flag.allSelected) {
                // 1.界面全部选中
                $('.remove-signal').prop('checked', true);
                // 2.组合删除项
                ComDelItem();
            }
            $('.three-coop .three-coopThem').on('click', function () {
                $(this).parent().addClass('coopActive').siblings().removeClass('coopActive');
                $('.photo-list.swiper-wrapper').css({'transform':'translate3d(0px, 0px, 0px)'})
            })
            $('.three-coop .photo-themUrl').on('click', function (event) {
                $(this).parent().parent().addClass('coopActive').siblings().removeClass('coopActive');
                event.stopPropagation();
            })
            //路由跳转信息存储
            if (sessionStorage.getItem('colorMark') == 'true') {
                $('.dropdown-menus li').eq(0).find('label').find('input').prop('checked', true);
                $('.color-mark').show()
            } else {
                $('.dropdown-menus li').eq(0).find('label').find('input').prop('checked', false);
                $('.color-mark').hide()
            }
            if (sessionStorage.getItem('status') == 'true') {
                $('.dropdown-menus li').eq(1).find('label').find('input').prop('checked', true);
                $('.recify-status').show()
            } else {
                $('.dropdown-menus li').eq(1).find('label').find('input').prop('checked', false);
                $('.recify-status').hide()
            }
            $('.detail-column').css({'top': ($('.filter-box').height() + 50) + 'px'});
            $('.dropdown-menus>li').map(function () {
                if ($(this).index() == 0 && $(this).find('label').find('input').prop('checked')) {
                    $('.color-mark').show()
                } else if ($(this).index() == 1 && $(this).find('label').find('input').prop('checked')) {
                    $('.recify-status').show()
                } else if ($(this).index() == 0 && !$(this).find('label').find('input').prop('checked')) {
                    $('.color-mark').hide()
                } else if ($(this).index() == 1 && !$(this).find('label').find('input').prop('checked')) {
                    $('.recify-status').hide()
                } else if ($(this).find('label').find('input').prop('checked') && $(this).next().find('label').find('input').prop('checked')) {
                    $('.color-mark').show();
                    $('.recify-status').show()
                } else {
                    $('.color-mark').hide();
                    $('.recify-status').hide()
                }

            })
            $('.coopers').eq(0).addClass('cooper-active');
            $timeout(function () {
                getCoListHeight(); //设置默认协作列表的
            }, 20);
        });

        $scope.$on('ngRepeatFinishedDept', function (ngRepeatFinishedEvent) {
            if (firstreackflag) {
                //获取列表里面第一个项目部
                if (queryData.deptId && queryData.deptId != 0 && queryData.deptId != -1) {
                    if ($("#deptbutton_" + queryData.deptId).length > 0) {
                        $("#deptbutton_" + queryData.deptId).click();
                        $("#deptbutton_" + queryData.deptId).parent().addClass('menusActive');
                    } else {
                        //返回找不到项目部,就定位到第一个项目部(项目部下只有一个工程,且只有一条协作)
                        $("#deptbutton_" + firstdeptid).click();
                        $("#deptbutton_" + firstdeptid).parent().addClass('menusActive');
                    }
                } else if (queryData.deptId == -1) {
                    $scope.deptIdToken = 1;
                    $('#no-relate').click();
                    $("#no-relate").addClass('menusActive');
                } else if (queryData.deptId == 0) {
                    $scope.deptIdToken = 1;
                    $('#draft').click();
                    $("#draft").addClass('menusActive');
                }
            }
            $(".manage-menus").bind("click", function () {
                $("manage-menus").removeClass("menusActive");
                //获取当前元素
                $(this).addClass("menusActive").siblings().removeClass("menusActive");
            });
            $scope.flag.isVisible = true;
            $('body').click(function () {
                $('.dropdown-menus').hide().removeClass('is-open');
                $('.detail-icon-tool span').removeClass('detail-actives');
                $('[name=menusTool]').removeClass('menus-tools-active');
            })
        });

        // 判断路由跳转
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // 从mangage跳转到首页面
            // 获取项目部列表
            var isSiderLoaded = $(".manage_proList .spanwidth").length;
            if (fromState.name === 'manage' && toState.name === 'cooperationNew.detail') {
                $scope.flag.fromManage = true;
                return;
            } else if (fromState.name === '' && toState.name === 'cooperationNew.detail') {
                return;
            } else if ((fromState.name === 'cooperationNew.threeCloumn' || fromState.name === 'cooperationNew.secondCloumn') && (toState.name === 'cooperationNew.detail')) {
                return;
            } else if (fromState.name === 'cooperationNew.detail' && toState.name === 'cooperationNew.detail') {
                return;
            } else if (!isSiderLoaded) {
                Cooperation.getDeptInfo().then(function (data) {
                    $scope.deptInfoList = data;
                    firstdeptid = data[0].deptId;//确定第一个deptid
                    if (!queryData.deptId) {
                        queryData.deptId = firstdeptid;
                    }
                });
            }

            if (fromState.name == 'manage') {
                $scope.deptIdToken = 0;
                queryData.deptId = sessionStorage.deptId ? sessionStorage.deptId : '';
                queryData.ppid = sessionStorage.ppid ? sessionStorage.ppid : '';
            }

        });

        //判断路由跳转
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //从首页面跳转到manage
            if (toState.name == 'manage') {
                sessionStorage.deptId = queryData.deptId;
                sessionStorage.ppid = queryData.ppid;
            }
        });

        $('[name=menusTool]').map(function () {
            $(this).bind('click', function (event) {
                $('[name=menusTool]').removeClass('menus-tools-active');
                $(this).toggleClass('menus-tools-active');
                if (!($(this).hasClass('menus-tools-active'))) {
                    $(this).css('background-position-y', '0')
                }
                event.stopPropagation()
            })
        })
        //删除草稿箱的内容
        $scope.deleteProject = function (coid) {
            layer.confirm('是否删除该协作？', {
                btn: ['是', '否'], //按钮
                move: false
            }, function () {
                layer.closeAll();
                Cooperation.removeDraft(coid).then(function (data) {
                })
                $scope.drafts(0);
            });
        }

        var token = false;
        //点击工程获取协同列表
        $scope.getCollaborationList = function (ppid, projectName) {
            $(".container-fluid .operation").show();
            if (!$scope.coNoResult) {
                !$('.table-list').length ? "" : $('.table-list')[0].scrollTop = 0;
            }

            var createindex = layer.load(0, {
                shade: [0.5, '#000'], //0.1透明度的黑色背景
            });
            if (queryData.ppid == ppid && queryData.modifyTimeCount != 1) {
                layer.close(createindex);
                return;
            } else {
                if ($scope.scrollend == true && queryData.ppid != ppid) {
                    token = true;
                }
                $scope.ppidToken = 0;

                $scope.scrollend = false;
                queryData.modifyTime = '';
                queryData.modifyTimeCount = 0;

                $scope.coNoResult = false;
                $scope.deptNoCo = false;
                $scope.projNoCo = false;
                $scope.searchNoCo = false;
                $scope.noRelatedNoCo = false;
            }

            $scope.initScrollend(ppid);
            queryData.ppid = ppid;
            $scope.typeStatStr = [];
            if (queryData.searchType == 0) {
                queryData.searchType = '';
            }
            ppidName = projectName;
            Cooperation.getCollaborationList(queryData).then(function (data) {
                // debugger;
                $scope.cooperationList = data.list;
                //计算当前协作总条数
                $scope.coItemsTotals = data.count;
                $scope.coTotalCooper = data.count;
                if ($scope.cooperationList.length <= 0) {
                    $scope.coNoResult = true;
                    if (!$scope.cooperationList.length && queryData.groups.length) {
                        //显示当前无结果
                        $timeout(function () {
                            $scope.searchNoCo = true;
                        });
                    } else if (!$scope.cooperationList.length && !queryData.groups.length) {
                        //显示当前工程无协作
                        $timeout(function () {
                            $scope.projNoCo = true;
                        });
                    }
                } else {
                    angular.forEach($scope.cooperationList, function (val, key) {
                        $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2);
                        val.createTime = $scope.formatDate(new Date(val.createTime), 2)
                        if (val.deadline) {
                            val.deadline = $scope.formatDate(new Date(val.deadline), 2)
                        }
                        $scope.cooperationList[key].updateformatTime = FormatDate(data.currentTime, val.updateTime);
                    });
                    $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].statusId);
                }


                $scope.ppidToken = 1;
                layer.close(createindex);
            });
        }
        //筛选条件筛选
        $scope.changeFilter = function (item, signal) {
            changeFilterItem = item;
            changeFilterSignal = signal;
            //组合筛选项 用于存储session
            var unit1 = {};
            unit1.type = signal;
            unit1.name = item.name;
            filterSessionOptions.push(unit1)
            //显示筛选tab
            $scope.flag.filterExist = true;
            //1.根据signal确定隐藏的栏目2.根据item append template3.根据item组合group条件同时搜索
            createFilterTemplate(item, signal);

            //group组合的值
            var unit = {};
            unit.type = signal;
            unit.value = {key: item.key};
            queryData.groups.push(unit);

            $scope.scrollend = false;
            queryData.modifyTime = '';
            queryData.modifyTimeCount = 0;

            //延迟20ms执行,解决高度不生效的问题
            $timeout(function () {
                getCoListHeight();

            }, 20)
            if (queryData.groups) {
                $scope.flag.filterExist = true;
            }

            $scope.getCooperation(queryData.groups);
            //将筛选条件放入session
            addSessionValue('filter');
            filterTemplateEvent();//生成筛选绑定时间
            // clearAllFiltertemplate($('.noFilter'));
            // $('.right-content').height($(window).height()-($('.filter-table').height()+160));
            $('.detail-column').css({'top': ($('.filter-box').height() + 50) + 'px'})
            $('.noSearch').height($(window).height() - ($('.filter-box').height() + 116));
            $('.table-list .noSearch').height($(window).height() - ($('.filter-box').height() + 112));
            $('.table-list .noSearch  .noProject').css({left: '50%', top: '50%', 'margin-top': ' -135px'});
        }
        //协作列表
        $scope.getCooperation = function (groups, formArea) {
            $scope.scrollend = false;
            queryData.modifyTime = '';
            queryData.modifyTimeCount = 0;

            $scope.coNoResult = false;
            $scope.deptNoCo = false;
            $scope.projNoCo = false;
            $scope.searchNoCo = false;
            $scope.noRelatedNoCo = false;
            queryData.groups = groups;
            Cooperation.getCollaborationList(queryData).then(function (data) {
                //初始化scrollend值
                $scope.coItemsTotals = data.count;
                $scope.cooperationList = data.list;
                if ($scope.cooperationList.length) {
                    $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].status, $scope.cooperationList[0].isRead)
                }
                if ($scope.cooperationList.length <= 0) {
                    $scope.coNoResult = true;
                    $scope.searchNoCo = true;
                } else {
                    $scope.scrollend = false;
                }
                angular.forEach($scope.cooperationList, function (val, key) {
                    $scope.cooperationList[key].updateformatTime = FormatDate(data.currentTime, val.updateTime);
                    $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2);
                    val.createTime = $scope.formatDate(new Date(val.createTime), 2)
                    if (val.deadline) {
                        val.deadline = $scope.formatDate(new Date(val.deadline), 2)
                    }
                });

            });
        }

        //根据搜索框搜索
        $scope.getCollaborationListFun = function (source) {
            console.log(queryData.deptId,'deptId')
            queryData.deptId = publicDeptId;
            if(source){
                queryData.modifyTime = 0;
                queryData.modifyTimeCount = 0;
            }
            $scope.coNoResult = false;
            $scope.deptNoCo = false;
            $scope.projNoCo = false;
            $scope.searchNoCo = false;
            $scope.noRelatedNoCo = false;
            queryData.searchKey = $scope.flag.searchkey;

            Cooperation.getCollaborationList(queryData).then(function (data) {
                $scope.coItemsTotals = data.count;
                $scope.scrollend = false;
                queryData.modifyTime = '';
                queryData.modifyTimeCount = 0;
                $scope.cooperationList = data.list;
                if ($scope.cooperationList.length <= 0) {
                    $scope.coNoResult = true;
                    $scope.searchNoCo = true;
                }
                angular.forEach($scope.cooperationList, function (val, key) {
                    $scope.cooperationList[key].updateformatTime = FormatDate(data.currentTime, val.updateTime)
                    $scope.cooperationList[key].updateTimeCopy = $scope.formatDate(new Date(val.updateTime), 2);
                    val.createTime = $scope.formatDate(new Date(val.createTime), 2)
                    if (val.deadline) {
                        val.deadline = $scope.formatDate(new Date(val.deadline), 2)
                    }
                })
                if ($scope.cooperationList.length) {
                    $scope.detailPage($scope.cooperationList[0].coid, $scope.cooperationList[0].statusId, $scope.cooperationList[0].isRead)
                }
            });
            //将搜索框的内容存session
            addSessionValue('searchkey');
        }
        $scope.inputSearch = function () {
            if (searId == 0) {
                queryData.deptId = 0;
                $scope.getCollaborationListFun('search');
            } else if (searId == -1) {
                queryData.deptId = -1;
                $scope.getCollaborationListFun('search');
            } else {
                if (queryData.deptId == "") {
                    queryData.deptId = firstdeptid;
                }
                $scope.getCollaborationListFun('search');
            }
        }
        // 按enter键进行筛选
        $scope.searchEnter = function (e) {
            var keyCode = e.keyCode || e.which;
            if ($('#exampleInputName1').val() != '' && keyCode == 13) {
                $scope.inputSearch();
            } else if ($('#exampleInputName1').val() == '' && keyCode == 13) {
                $scope.cooperationList = [];
                if (searId == 0) {
                    queryData.deptId = searId;
                    $scope.getCollaborationListFun('search')
                } else {
                    if (queryData.deptId == "") {
                        queryData.deptId = firstdeptid;
                    }
                    $scope.getCollaborationListFun('search');
                }
            }
        };

        $scope.getCoCountInfo = [];
        var arr = [];
        $scope.arrString = [];
        var priorityArr = [];
        var arrCount = 0;

        var deadline = [];
        $scope.deadlineStr = [];
        var timeLim = [];
        var timeName = [];
        var deadlineCount = 0;

        var maker = [];
        $scope.makerStatStr = [];
        var blankId = [];
        var blankName = [];
        var makerCount = 0;

        var typeStatNub = [];
        $scope.typeStatStr = [];
        var coTypeObj = [];
        var coTypeName = [];
        var typeCount = 0;
        $('.draft-box').css('display', 'none');
        //统计页面
        var comboxCount = $("#comboBox_count");
        $scope.comboxCount = function () {
            windowWidth();
            $(".first-screen").hide();
            $(".data_count").show();
            // $('body').css('overflowX','hidden');
            //初始状态给的值
            compareTypeId(queryData.deptId, firstdeptid, queryData.ppid);

            /**
             * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
             * 第五个参数为true的情况下需要传topicName
             * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
             */
            Cooperation.writeLog(0, '', false, LogConfiguration.progressName.comboxCount, 0, '');
        }
        $(".data_back").click(function () {
            $('.data_count').hide();
            $(".first-screen").show();
            $('body').css('overflowX', 'auto');
        })
        /**
         * 点击统计的初始值
         * @param deptId       项目deptId
         * @param firstdeptid  第一个项目deptId
         * @param ppid         项目ppid
         */
        function compareTypeId(deptId, firstdeptid, ppid) {
            compareData = [];
            countArray = {};
            deptId ? firstdeptid : deptId;
            Cooperation.typeForCoStatistics({'deptId': deptId, 'ppid': ppid}).then(function (data) {
                compareData = data;
                if (data.length > 0) {
                    $('.data_list').show();
                    $('.noStatistics').hide();
                    Cooperation.getTypeList().then(function (data) {
                        countArray = data;
                        countArr(countArray, compareData);
                    });
                } else if (data.length == 0) {
                    $('.data_list').hide();
                    $('.noStatistics').show();
                    return;
                }

            });
        }

        /**
         * 统计菜单处理
         * @param obj         数据
         * @param compareData 菜单
         */
        function countArr(obj, compareData) {//统计列表处理
            $('.statistics-menus #count-menus').empty('.liList');
            var li = '';
            angular.forEach(obj, function (val, key) {
                if (compareData.indexOf(val.typeId) != -1) {
                    li += '<li class="liList" typeId="' + val.typeId + '">' + val.name + '</li>';
                }

            });

            $('.statistics-menus #count-menus').height($(window).height() - 112);
            $('.statistics-menus #count-menus').css({'background': '#f5f5f5', 'border-right': 'solid 1px #ddd'});
            $('.statistics-menus #count-menus').append(li);
            $('.statistics-menus #count-menus li').eq(0).css({
                'background': '#fff',
                'color': '#69c080',
                'width': '100.5%',
                'border-bottom': 'solid 1px #ddd'
            })

            $scope.typeId = $('.statistics-menus #count-menus li').eq(0).attr('typeid');
            $scope.typeId ? $('.statistics-menus #count-menus li').eq(0).attr('typeid') : $scope.typeId;
            $scope.getCoTotal(queryData.deptId, queryData.ppid, $scope.typeId);
        }

        $('.statistics-menus #count-menus').on('click', 'li', function () {
            $(this).css({
                'background': '#fff',
                'color': '#69c080',
                'width': '100.5%',
                'border-bottom': 'solid 1px #ddd',
                'border-top': 'solid 1px #ddd'
            }).stop().siblings().css({
                'background': '',
                'color': '',
                'cursor': 'pointer',
                'width': '100%',
                'border-bottom': '#f5f5f5',
                'border-top': '#f5f5f5'
            })
            $(this).parent().find('li:first').css('border-top', '#f5f5f5');
        });

        //判断窗口大小
        function windowWidth() {
            if ($(window).width() <= 1380) {//根据屏幕大小显示分割线
                $('.data_every ').height(($(window).height() - 124) / 2);
                $('.data_list .echart-shape .data_every').map(function (i, val) {
                    $('.data_list .echart-shape .data_every').css('border-right', 'none');
                    $('.data_list .echart-shape .data_every:last').css('border-bottom', 'none');
                    $('.data_list .echart-shape .data_every').eq(0).css({'border-bottom': 'solid 1px #ddd'});
                    $(this).height(300);
                    $(this).find('[id ^="data_graph"]').height(300);
                    $("#data_graph3").css('margin-left', '0px');
                })

            } else if ($(window).width() > 1380) {
                $("#data_graph3").css('margin-left', '10px');
                $('.data_every ').height($(window).height() - 124);
                $('.data_list .echart-shape .data_every').map(function (i, val) {
                    $(this).height($(window).height() - 112);
                    $(this).find('[id ^="data_graph"]').height(550);
                    if (i % 2 == 0) {
                        $('.data_list .echart-shape .data_every:even').css({
                            'border-right': '1px solid #ddd',
                            'border-bottom': 'none'
                        });
                        $('.data_list .echart-shape .data_every:odd').css({
                            'border-right': 'none',
                            'border-bottom': 'none'
                        });
                    }
                })


            }
        }

        $('#count-menus').on('click', 'li', function () {
            $scope.typeId = $(this).attr('typeid');
            $scope.getCoTotal(queryData.deptId, queryData.ppid, $scope.typeId);
        });
        $scope.getCoTotal = function (deptId, ppid, typeId) {
            //图标内容大小自适应
            priorityArr = [];
            timeLim = [];
            timeName = [];
            blankId = [];
            blankName = [];
            coTypeObj = [];
            coTypeName = [];
            $scope.makerStatStr = [];
            $scope.typeStatStr = [];
            //$(".data_count").children().hide();
            if (!queryData.ppid) {
                queryData.ppid = '';
            }
            $('.data_count').height($(window).height() - 62);
            Cooperation.getCoStatisticsInfo({'deptId': deptId, 'ppid': ppid, 'typeId': typeId}).then(function (data) {
                $scope.makerStat = data.data.makerStat;

                //协作类型
                $scope.typeStat = data.data.statusStat;
                //判断返回的数据类型是空或者是NaN,如果是把对应的div给移除掉
                //判断返回数据是否为空
                function isEmpty(obj) {
                    for (var key in obj) {
                        return false
                    }
                    return true
                }

                //判断数组的值是否为空
                function isEmptyArr(array) {
                    var count = 0;
                    for (var i = 0; i < array.length; i++) {
                        return count += array[i]
                    }
                }

                if (isEmpty($scope.makerStat)) {
                    $('.data_every.third').hide();
                } else {
                    $('.data_every.third').show();
                }
                if (isEmpty($scope.typeStat)) {
                    $('.data_every.forth').hide();
                } else {
                    $('.data_every.forth').show();
                }
                var isMakerStat = isEmpty($scope.makerStat);
                var istypeStat = isEmpty($scope.typeStat);
                if (isMakerStat) {
                    $("#data_graph3").parent().hide();
                } else {
                    $("#data_graph3").parent().show();
                }
                if (istypeStat) {
                    $("#data_graph4").parent().hide();
                } else {
                    $("#data_graph4").parent().show();
                }
                // 颜色与cooperation.css中 .data_count .data_every .data_titleInfo.first ul li:nth-of-type(1) span 的顺序对上即可
                var colorStyle1 = ["#5887FD", "#E6D055", "#73CC6C"];
                var typeColor = {
                    已拒绝: '#f4474d',
                    已结束: '#6d7072',
                    进行中: '#988be8',
                    已整改: '#82d782',
                    空: '#fae5c6',
                    整改中: "#709ff4",
                    未整改: '#fcc15b',
                    "不整改": '#f98171',
                    已通过: '#f3de7c',
                    待整改: '#81D4FC',
                    待确认: '#A9B8BE'
                }
                // 数据清零
                arr = [];
                arrCount = 0;
                for (var n in arr) {
                    arrCount += arr[n];
                }

                //标识
                angular.forEach($scope.makerStat, function (obj, key) {
                    maker.push(obj.count);
                    $scope.makerStatStr.push({name: key, color: obj.color, amount: obj.count});
                })
                for (var i in maker) {
                    makerCount += maker[i];
                }
                angular.forEach($scope.makerStat, function (obj, key) {
                    var blank = {
                        value: "",
                        name: "",
                        itemStyle: {
                            normal: {
                                color: ""
                            }
                        }
                    };
                    blank.value = obj.count;
                    blank.itemStyle.normal.color = obj.color;
                    if (isEmptyArr(maker) == 0) {
                        $("#data_graph3").parent().hide();
                    } else {
                        $("#data_graph3").parent().show();
                        blank.name = key;
                    }

                    blankId.push(blank);
                    blankName.push(key);
                });
                //解决双击协作类型，统计结果会显示两遍bug
                blankId = _.uniqBy(blankId, 'name');
                blankName = _.uniq(blankName);
                // 数据清零
                typeStatNub = [];
                typeCount = 0;
                //协作类型
                function typeStatus(data) {
                    var typeKey = {}
                    for (var key in data) {
                        typeKey[key] = {count: $scope.typeStat[key], color: typeColor[key]};
                    }
                    return typeKey;
                }

                $scope.typeStat = typeStatus($scope.typeStat);

                angular.forEach($scope.typeStat, function (obj, key) {
                    $scope.typeStatus = key;
                    typeStatNub.push(obj.count);
                    $scope.typeStatStr.push({name: key, color: obj.color, amount: obj.count});
                });
                $scope.typeStatus = arr;
                for (var k in typeStatNub) {
                    typeCount += typeStatNub[k]

                }
                angular.forEach($scope.typeStat, function (obj, key) {
                    var coType = {
                        value: "",
                        name: "",
                        itemStyle: {
                            normal: {
                                color: ""
                            }
                        }
                    };

                    coType.value = obj.count;
                    coType.itemStyle.normal.color = obj.color;
                    if (isEmptyArr(typeStatNub) == 0) {
                        $("#data_graph4").parent().hide()
                    } else {
                        $("#data_graph4").parent().show();
                        coType.name = key;

                    }
                    coTypeObj.push(coType);
                    coTypeName.push(key);

                });
                //解决双击协作类型，统计结果会显示两遍bug
                coTypeObj = _.uniqBy(coTypeObj, 'name');
                coTypeName = _.uniq(coTypeName)
                //优先级统计饼图
                var arrPriorityName = [];
                for (var i = 0; i < priorityArr.length; i++) {
                    arrPriorityName.push(priorityArr[i].name);
                }
                //echart 数据重新
                function setOption(mychart, obj) {
                    mychart.setOption(obj);
                };
                //循环数据调用setOption
                function optinForEach(myChart, min) {
                    function optionMap() {
                        for (var i = 0; i < myChart[0].length; i++) {
                            setOption(myChart[0][i], myChart[1][i]);
                        }
                    }

                    if (min > 299 && min <= 300) {
                        optionMap();
                    } else if (min >= 301 && min <= 550) {
                        optionMap();
                    }
                }

                //窗口改变的时候动态的给option对象改变半径和中心
                function setParams(myChart, fRadus, fCenter) {
                    for (var i = 0; i < myChart[0].length; i++) {
                        myChart[1][i].series[0].radius = fRadus;
                        myChart[1][i].series[0].center = fCenter;
                    }
                }

                //echart 图形重新绘制
                function setResize(myChart) {
                    for (var i = 0; i < myChart[0].length; i++) {
                        myChart[0][i].resize();
                    }
                }

                //设置饼型图的半径
                function echartRadiu() {
                    return [document.body.offsetWidth > 1380 ? '35%' : '45%', document.body.offsetWidth > 1380 ? '56%' : '70%'];
                }

                //设置饼型的位置
                function echartCenter() {
                    return ['58%', document.body.offsetWidth > 1380 ? '66.5%' : '50%'];
                }

                // 指定图表的配置项和数据
                var isNull = false;

                var tempName = '';
                for (var i = 0; i < blankName.length; i++) {
                    var name = blankName[i];
                    if (tempName.length < name.length) {
                        tempName = name;
                    }
                }

                function Compute(v) {
                    var d = document.getElementById('dvCompute');
                    //d.innerHTML = '&nbsp;';
                    d.innerHTML = v;
                    return {w: d.offsetWidth, h: d.offsetHeight};
                }

                var myChart3 = echarts.init(document.getElementById('data_graph3'));
                var option3 = {
                    tooltip: {  // 鼠标移上去显示的黑框
                        trigger: 'item',
                        formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
                        transitionDuration: 0,
                    },
                    title: {
                        text: '标识',
                        x: 'left',
                        y: '10',
                        left: 15,
                        padding: [11, 0, 0],
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'normal',
                            color: '#333',
                            fontFamily: 'Microsoft yahei'
                        }
                    },
                    legend: {   // 列表
                        width: 100,
                        orient: 'vertical',
                        x: 'left',
                        itemGap: 10,
                        itemWidth: 20,
                        itemHeight: 12,
                        left: 0,
                        data: blankName,
                        formatter: function (name) {
                            return echarts.format.truncateText(" " + name, 70, '14px Microsoft Yahei', '...');
                        },
                        tooltip: {
                            show: true
                        },
                        //height:240,
                        height: function () {
                            document.body.offsetWidth > 1380 ? document.body.offsetHeight : 240;
                        },
                        top: '47',
                        align: 'left',

                    },
                    series: [
                        {
                            type: 'pie',

                            radius: echartRadiu(),
                            avoidLabelOverlap: false,
                            center: echartCenter(),
                            label: {
                                normal: {show: false, position: 'center'},
                                emphasis: { // 鼠标移上去显示在中间的字
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold',
                                        fontFamily: 'Microsoft yahei',
                                        align: 'left',
                                    },
                                    //formatter: " {c} ({d}%)",
                                    formatter: "数量 : {c}\n\n比例 : {d}%",

                                }
                            },
                            labelLine: {normal: {show: true}},
                            data: blankId
                        }
                    ]
                };
                myChart3.setOption(option3);

                // 使用刚指定的配置项和数据显示图表。
                var myChart4 = echarts.init(document.getElementById('data_graph4'));
                var option4 = {

                    tooltip: {  // 鼠标移上去显示的黑框
                        trigger: 'item',
                        //formatter: "{b}, {c} ({d}%)"
                        formatter: "{b} <br/> 数量 : {c} <br/> 比例 : {d}%",
                        transitionDuration: 0,
                    },
                    title: {
                        text: '状态',
                        x: 'left',
                        y: '10',
                        left: 14,
                        padding: [11, 0, 0],
                        textStyle: {
                            fontSize: 18,
                            fontWeight: 'normal',
                            color: '#333',
                            fontFamily: 'Microsoft yahei'
                        }
                    },
                    legend: {   // 列表
                        orient: 'vertical',
                        x: 'left',
                        itemGap: 10,
                        left: 0,
                        //padding: [10,40,10,0],
                        itemWidth: 20,
                        itemHeight: 12,
                        data: coTypeName,
                        formatter: function (name) {
                            return echarts.format.truncateText("  " + name, 70, '14px Microsoft Yahei', '…');
                        },
                        tooltip: {
                            show: true
                        },
                        height: function () {
                            document.body.offsetWidth > 1380 ? document.body.offsetHeight : 30;
                        },
                        top: '47',
                        align: 'left'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: echartRadiu(),
                            center: echartCenter(),
                            avoidLabelOverlap: false,
                            label: {
                                normal: {show: false, position: 'center'},
                                emphasis: { // 鼠标移上去显示在中间的字
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold',
                                        fontFamily: 'Microsoft yahei',
                                    },
                                    formatter: "数量 : {c}\n\n比例 : {d}%",
                                }
                            },
                            labelLine: {normal: {show: true}},
                            data: coTypeObj

                        }

                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart4.setOption(option4);
                function defultWindowWidth() {//窗口默认宽度
                    if ($(window).width() <= 1380) {
                        $('.data_every ').height(($(window).height() - 124) / 2);
                        if ($('.data_every ').height() > 300) {
                            $(' div[id^=data_graph]').css({'margin-top': '40px'});
                        } else {
                            $(' div[id^=data_graph]').css({'margin-top': '0'});
                        }
                    } else {
                        $(' div[id^=data_graph]').css({'margin-top': '0'});
                        $('.data_every ').height($(window).height() - 124);
                    }
                }

                defultWindowWidth();
                var myChart = [[myChart3, myChart4], [option3, option4]];//将echart  生成的对象塞进数组
                window.onresize = function () {
                    var min = $('div[id ^=data_graph]').height();//窗口改变的时候动态获取画布的高度
                    var status = BimCo.GetWindowStatus();
                    if (status) {
                        $timeout(function () {
                            windowWidth();
                            optinForEach(myChart, min);//根据canvas（画布）的高度判断是否重绘图形
                            setParams(myChart, echartRadiu(), echartCenter());//echart  图形重绘时候设置的参数
                            setResize(myChart);//改变窗口的时候resize
                            option3.legend.height();
                            option4.legend.height();
                            defultWindowWidth();
                            $('.statistics-menus #count-menus').height($(window).height() - 112);
                        }, 100)
                    } else {
                        $timeout(function () {
                            windowWidth();
                            optinForEach(myChart, min);//根据canvas（画布）的高度判断是否重绘图形
                            setParams(myChart, echartRadiu(), echartCenter());//echart  图形重绘时候设置的参数
                            setResize(myChart);//改变窗口的时候resize
                            option3.legend.height();
                            option4.legend.height();
                            defultWindowWidth();
                            $('.statistics-menus #count-menus').height($(window).height() - 112);
                        }, 100)
                    }

                    optinForEach(myChart, min);//根据canvas（画布）的高度判断是否重绘图形
                    setParams(myChart, echartRadiu(), echartCenter());//echart  图形重绘时候设置的参数
                    setResize(myChart);//改变窗口的时候resize
                    windowWidth();
                    option3.legend.height();
                    option4.legend.height();
                    $('.data_count').height($(window).height() - 62);
                    $('.statistics-menus #count-menus').height($(window).height() - 112);
                    defultWindowWidth();
                }

            })
        }
        //跳转详情传filter值
        $scope.transCoDetail = function (currentItem) {
            //详情完整界面显示
            $scope.detailPage(currentItem.coid, currentItem.status, currentItem.isRead)
            $scope.flag.LgDetailMode = true;
        }

        /**
         * 向sessionStorage存值
         */
        function addSessionValue(source) {
            //当前筛选条件，存入sessionStorage,[]需要序列化
            if (source == 'filter') {
                sessionStorage.groups = JSON.stringify(queryData.groups);
                var unique = _.uniqBy(filterSessionOptions, 'type');
                sessionStorage.filterSessionOptions = JSON.stringify(unique);
            } else {
                //当前coopattr,当前搜索主题
                sessionStorage.searchkey = $scope.flag.searchkey;
            }
        }

        //判断是否是从协作助手右键(新建协作)过来
        if (urlParams.newcoop == 'frombe') {
            $timeout(function () {
                $('.new-file').click();
            });

        }
        //判断是否是从协作助手右键(统计协作)过来
        if (urlParams.statistics == 'frombe') {
            $timeout(function () {
                $('#comboBox_count').click();
            });
        }
        //判断是否是从be过来调用主界面
        $scope.transCoManage = function () {
            $scope.flag.LgDetailMode = false; //大屏详情标志位
            // alert($state.current.name);
            if ($state.current.name !== 'cooperationNew.secondCloumn') {
                document.location = '#/cooperationNew/threeCloumn?cooper=frombe';
            } else {
                document.location = '#/cooperationNew/secondCloumn?cooper=frombe';
            }
        }

        if ($stateParams.transignal == 'be') {
            $scope.openNew();
        }

        $scope.$on("ngRepeatFinished", function (ngRepeatFinishedEvent) {
            // 页面渲染完成后 设置左侧sidebar的高度
            $(".sidebar").css("height", document.documentElement.clientHeight - $("header").height() - 2);
            $(".manage-menus").click(function () {
                $(this).find('.menus-icon').toggleClass('rotate2');
            })
            if ($("#siderbar:has('#siderControl')").length == 0) {
                $('#siderbar').append('<div id="siderControl"></div>');
            }
            if ($('filter-box').height() > 0) {
                $('.three-columnMode').css({'height': calc(100 % -100) + 'px'})
            } else {
                $('.three-columnMode').css({'height': 'auto'})
            }
        });

        var filterRepeatEnd = 0;
        $scope.$on("ngProfit", function (ngRepeatFinishedEvent) {
            filterRepeatEnd++;
            if (filterRepeatEnd >= 5) {
                $timeout(function () {
                    $('.table-list .noSearch').height($(window).height() - ($('.filter-box').height() + 250));
                    getCoListHeight();
                }, 1000);
            }


        });

        /**
         * 删除协作 标记协作 公用
         * @param  obj  items  需要删除的协作
         * @param  string source  来源(单个删除or批量删除)
         * @param  string isRemark 标记已读未读||删除
         */
        function deleteDetail(items, source, isRemark) {
            var ReadedSignal = 0;  //未读个数
            var newrRemarkItems = []; //当前标记的未读数组
            if (source === 'single') {  //区分是批量删除or单个删除，区别处理
                var item = [];
                item.push(items);
            } else {
                var item = _.cloneDeep(items);
            }
            detailDeptId = item[0].deptId;  //当前项目部
            detailPpid = item[0].ppid;      //当前ppid
            if (isRemark === 'isRemark') {
                angular.forEach(items, function (val, key) {
                    if (val.isRead === false) {
                        newrRemarkItems.push(val);
                        ReadedSignal++
                    }
                })
                item = newrRemarkItems;
            } else {
                angular.forEach(item, function (val, key) {
                    $('tr[coid="' + val.coid + '"]').remove();//两栏删除协作
                    $('.three-coop[coid="' + val.coid + '"]').remove();//三栏删除协作
                    if (!val.isRead) {
                        newrRemarkItems.push(val);
                        ReadedSignal++
                    }
                });
                item = newrRemarkItems;
            }
            //删除后更新总数
            if ($scope.coItemsTotals && !isRemark) {
                $scope.coItemsTotals = $scope.coItemsTotals - items.length;
            }
            
            if (!item.length) return;
            
            updateCount(ReadedSignal,item);//更新左侧导航栏的更新数
        }
        //更新左侧导航栏的更新数
        function updateCount (ReadedSignal,item){
            var deptUpdataCount = $('.manage-menus span[id=deptbutton_' + detailDeptId + '] +i').text();//项目更新数
            var noRelateCount = $('#no-relate>i').text();
            var ppidUpdataCount = $('span[id=projectbutton_' + detailPpid + '] >b').text();//工程更新数

            if ((deptUpdataCount.length > 0 || ppidUpdataCount.length > 0) && ReadedSignal > 0) {//判断更新数石村存不存在

                deptUpdataCount = Number(deptUpdataCount.substr(1, deptUpdataCount.length - 2));//截取项目更新数据的数量转换成数字类型进行加减运算
                deptUpdataCount -= item.length;

                ppidUpdataCount = Number(ppidUpdataCount.substr(1, ppidUpdataCount.length - 2))
                ppidUpdataCount -= item.length;
                if (deptUpdataCount == 0 || deptUpdataCount < 0) {
                    $('.manage-menus span[id=deptbutton_' + detailDeptId + '] +i').text('');//如果更新数的值为0内容填充为空
                } else {
                    $('.manage-menus span[id=deptbutton_' + detailDeptId + '] +i').text('(' + deptUpdataCount + ')');//将参与运算的更新数的新值复制给对象
                }
                if (ppidUpdataCount == 0 || ppidUpdataCount < 0) {
                    $('span[id=projectbutton_' + detailPpid + '] >b').text('');
                } else {
                    $('span[id=projectbutton_' + detailPpid + '] >b').text('(' + ppidUpdataCount + ')')//将参与运算的更新数的新值复制给对象
                }
            } else if (noRelateCount.length > 0 && ReadedSignal > 0) {
                noRelateCount = Number(noRelateCount.substr(1, noRelateCount.length - 2));//截取项目更新数据的数量转换成数字类型进行加减运算
                noRelateCount -= item.length;
                $('#no-relate>i').text('(' + noRelateCount + ')');//将参与运算的更新数的新值复制给对象
                if (noRelateCount == 0 || noRelateCount < 0) {
                    $('#no-relate>i').text('');
                }
            }
        }

        $scope.updateSelection = function ($event, item) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, item);
            $scope.delItemsTotals = delItems.length;
            if (!item.isRead) {//判断当前选中的是否是已读状态，如果是已读状态执行下面的编辑数组
                if (Remarklist) {
                    var ndex = Remarklist.indexOf(item.coid);
                }
                if ($($event.currentTarget).prop('checked') && Remarklist.indexOf(item.coid) == -1) {
                    Remarklist.push(item.coid);
                } else if (!$($event.currentTarget).prop('checked')) {
                    Remarklist.splice(index, 1);
                }
            }
        }

        function updateSelected(action, item) {
            var findIndex = delItems.indexOf(item);
            if (action == 'add' && findIndex == -1) {
                delItems.push(item);
            }
            if (action == 'remove' && findIndex != -1) {
                delItems.splice(findIndex, 1);
            }
        }

        //批量删除功能
        $scope.removeAll = function () {
            //判断是否有删除权限
            var authority = Cooperation.verifyAccessCode(accessCode, 'delete');
            if (!authority) {
                return;
            }
            if (!delItems.length) {
                layer.msg('未选中任何协作！', {time: 1000,skin:'common-tips'});
                return;
            }
            layer.confirm('确认删除这' + delItems.length + '条协作吗？', {
                btn: ['确认', '取消'],
                move: false
            }, function () {
                layer.closeAll();
                //进行删除操作
                //组合coids
                var transCoids = [];
                var transCoidName = '';

                angular.forEach(delItems, function (val, key) {
                    transCoids.push(val.coid);
                    transCoidName += val.name + ',';
                });
                transCoidName = transCoidName.substring(0, transCoidName.length - 1);

                //批量删除调用后端接口
                //防止批量过慢增加loading加载层
                var currentTime = Date.parse(new Date());
                var createindexRemove = layer.load(0, {
                    shade: [0.5, '#000'], //0.1透明度的黑色背景
                });

                Cooperation.removeAll(transCoids).then(function (data) {
                    layer.closeAll();
                    var newcurrentTime = Date.parse(new Date());

                    //返回的coids跟delItems比较,去除返回coid
                    var realDelItems = _.filter(delItems, function (n) {
                        return data.indexOf(n.coid) == -1;
                    });
                    var checkOutItems = _.filter(delItems, function (n) {
                        return data.indexOf(n.coid) != -1;
                    })
                    //当前有返回,表示有签出的协作
                    if (data.length) {
                        layer.alert('部分协作因签出,未删除', {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        }, function () {
                            layer.closeAll();
                        });
                    }
                    deleteDetail(realDelItems);
                    if (!data.length) {
                        layer.msg("删除成功",{skin:'common-tips'});
                    }
                    //删除成功之后清空删除项
                    delItems = [];

                    //删除之后获取页面第一条的详情，保证三栏右侧详情页面渲染(三栏)
                    if($(".three-coop") && $(".three-coop").length){
                        $scope.detailPage($(".three-coop").first().attr("coid"));
                    }
                    /**
                     * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                     * 第五个参数为true的情况下需要传topicName
                     * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                     */
                    Cooperation.writeLog(0, '', false, LogConfiguration.progressName.removeAll, 1, transCoidName);

                }, function (error) {
                    layer.alert(error.message, {
                        title: '提示',
                        closeBtn: 0,
                        move: false
                    }, function () {
                        layer.closeAll();
                    });
                });
            });
        }

        //批量删除全选按钮
        $scope.allSelect = function () {
            Remarklist = [];
            if ($scope.flag.allSelected) {
                delItems = [];
                //1.当前界面上所有的协作状态选中2.遍历当前协同列表，组合delItems
                $('.remove-signal').prop('checked', true);
                angular.forEach($scope.cooperationList, function (value, key) {
                    delItems.push(value);
                    if (!value.isRead) {
                        Remarklist.push(value.coid)
                    }

                })
            } else {
                //1.选中状态清空2.delItems []
                $('.remove-signal').prop('checked', false);
                delItems = [];
                Remarklist = [];
            }
        }

        /**
         * @param currentTime 服务器当前时间
         * @param currentTime 服务器的更新时间
         * @returns  dateFormat 显示日期格式
         * @constructor collaborationList 协作列表
         */
        function FormatDate(currentTime, updateTime) {
            var formatTime, updateScoendTime;//更新时间
            var hours, second, Month, day;
            var updateTimes = new Date(updateTime);//显示的时间
            hours = updateTimes.getHours();
            second = updateTimes.getMinutes();
            Month = updateTimes.getMonth() + 1;
            day = updateTimes.getDate();
            if ((currentTime - updateTime) / 1000 < 86400) {//小于一天的时候显示：时分
                hours = updateTimes.getHours() < 10 ? "0" + hours : hours;
                second = updateTimes.getMinutes() < 10 ? "0" + second : second;
                formatTime = hours + ":" + second;
            } else if ((currentTime - updateTime) / 1000 > 86400 && (currentTime - updateTime) / 1000 < 31536000) {//小于一年的时候显示：月日
                Month = (updateTimes.getMonth() + 1) < 10 ? "0" + Month : Month;
                day = (updateTimes.getDate()) < 10 ? "0" + day : day;
                formatTime = Month + "." + day;
            } else if ((currentTime - updateTime) / 1000 > 31536000) {//大于一年的时候显示：年月日
                formatTime = updateTimes.getFullYear() + "." + (updateTimes.getMonth() + 1) + "." + updateTimes.getDate();
            }
            return formatTime;
        }

        /**
         * 切换整屏详情页
         * event:页面传过来的事件源对象
         */
        $scope.LgDetailMode = function (event) {
            //详情完整界面显示
            $timeout(function () {
                $('.selectpicker').selectpicker({
                    style: '',
                    size: 'auto'
                });
                $('.selectpicker').selectpicker('refresh');
                $('.selectpicker').selectpicker('val', $scope.statusCommon);

            }, 100);
            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.LgDetailMode, 0, '');
            $scope.flag.LgDetailMode = true;
        }
        /**
         * dropMenus下拉菜单
         * event:页面传过来的事件源对象
         */
        $scope.dropMenus = function (eve) {
            $(eve.currentTarget).toggleClass('is-open');
            if ($(eve.currentTarget).hasClass('is-open')) {
                $(eve.currentTarget).find('.dropdown-menus').stop().show();
            } else {
                $(eve.currentTarget).find('.dropdown-menus').stop().hide();
            }
            eve.stopPropagation()
            /**
             * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
             * 第五个参数为true的情况下需要传topicName
             * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
             */
            Cooperation.writeLog(1, $state.current.name, $scope.flag.LgDetailMode, LogConfiguration.progressName.showSetting, 0, '');

        }
        /**
         * 显示设置
         * dropMenus下拉菜单
         * type:类型
         * obj:要操作的对象
         * event事件源
         */
        $scope.dropMenusClick = function (type, obj, event) {
            var currentStatus = $(event.currentTarget).find('label').find('input').prop('checked');
            if (type == 0 && currentStatus) {
                $('.' + obj).show();
                sessionStorage.setItem('colorMark', currentStatus)
            } else if (type == 1 && currentStatus) {
                $('.' + obj).show();
                sessionStorage.setItem('status', currentStatus)
            } else if (type == 0 && !currentStatus) {
                $('.' + obj).hide();
                sessionStorage.setItem('colorMark', currentStatus)
            } else if (type == 1 && !currentStatus) {
                $('.' + obj).hide();
                sessionStorage.setItem('status', currentStatus)
            }
            var currentDisPlaySetting = {
                showStatus: sessionStorage.status,
                showMarker: sessionStorage.colorMark
            }
            //保存当前设置(保存到服务器跟随账号)
            Cooperation.saveDisPlaySetting(currentDisPlaySetting);
        };
        if ($('.filter-box').height() > 0) {
            $('.noSearch').height($(window).height() - 160);
        } else {
            $('.noSearch').height($(window).height() - 112);
        }

        $('.noSearch>dl').css('margin-top', '-100px');

        /**
         * remarkRead 标记为已读
         * @param Remarklist标记的列表
         */
        $scope.remarkRead = function () {
            if (!Remarklist.length) {
                return false;
            }
            Cooperation.remarkRead(Remarklist).then(function (data) {
                var isReadlist = [];
                for (var i = 0; i < $scope.cooperationList.length; i++) {
                    for (var j = 0; j < Remarklist.length; j++) {
                        if ($scope.cooperationList[i].coid == Remarklist[j]) {
                            isReadlist.push(i);
                        }
                    }
                }
                
                var realDelItems = _.filter(delItems, function (n) {
                    return data.indexOf(n.coid) == -1;
                });

                var checkOutItems = _.filter(delItems, function (n) {
                    return data.indexOf(n.coid) != -1;
                })

                deleteDetail(realDelItems, null, 'isRemark');

                for (var i = 0; i < isReadlist.length; i++) {
                    $scope.cooperationList[isReadlist[i]].isRead = true;
                    if($state.current.name==="cooperationNew.threeCloumn"){
                        $scope.detailPage(Remarklist[i])
                    }
                }

                //返回的coids跟delItems比较,去除返回coid

                layer.msg("标记成功",{skin:'common-tips'});
                /**
                 * 调用客户端记录日志 参数:defaultLog,route,isBigDetail,progressName,isSavePds,topicName
                 * 第五个参数为true的情况下需要传topicName
                 * defaultLog不区分两栏、三栏的情况 0：不区分 1：区分
                 */
                Cooperation.writeLog(0, '', false, LogConfiguration.progressName.remarkRead, 0, '');

                Remarklist = [];//清空标记数组
                isReadlist = [];
            }, function (error) {

            })
        }

        /**
         * 发表回复信息（添加更新）
         */
        var onCompleteAllSignal = false;
        $scope.uploadBegin = false;
        $scope.zhenggai = false;
        $scope.isUpdataOK = false;
        function defaultStatus(statusCommon) {
            switch (statusCommon) {
                case '空':
                    statusCommon = '11';
                    break;
                case '已整改':
                    statusCommon = '1';
                    break;
                case '整改中':
                    statusCommon = '2';
                    break;
                case '不整改':
                    statusCommon = '3';
                    break;
                case '待整改':
                    statusCommon = '4';
                    break;
                case '未整改':
                    statusCommon = '5';
                    break;
            }
            return statusCommon;
        }

        //详情展示页添加更新
        var date = Common.dateFormat1(new Date());
        var uploadResult = true;
        var errorUpload = "";

        //上传资料
        var uploader2 = $scope.uploader2 = new FileUploader({
            url: basePath + 'fileupload/upload.do'
        });

        //FILTERS
        uploader2.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 31;
            }
        });

        //点击上传资料按钮
        $scope.docsUpload = function () {
            if($state.current.name === 'cooperationNew.detail'){
                if($("#detailLg").length){$("#detailLg").remove();}//从消息推送过来的协作，页面特殊处理是，删除之前的详情页
            }
            $('.upload-docs').attr('uploader', 'uploader2');
            $('.upload-docs').attr('nv-file-select', '');
            $('.upload-docs').click();
        }

        uploader2.onAfterAddingFile = function (fileItem) {
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
                    closeBtn: 0
                });
            }
        }
        $scope.comments = function (common) {
            $scope.commentModel.comment = common;
        }
        $scope.commentsKeycoad = function(event){
            $scope.keyCode  = event.keyCode || event.which;
            if($(event.currentTarget).val().length>=500){
                $scope.commentModel.comment = $scope.commentModel.comment.substr(0,500)
            }
        }
        $scope.commentskeyUp = function(event){
            $scope.keyCode  = event.keyCode || event.which;
            if($(event.currentTarget).val().length>=500){
                $scope.commentModel.comment = $scope.commentModel.comment.substr(0,500)
            }
        }
        $scope.statusCommons = function (status) {
            $scope.statusCommon = status;
        }

        $scope.cancel = function () {
            // $uibModalInstance.dismiss('cancel');
        }
        $scope.isNotPreview = function () {
            layer.msg('文件暂时不支持预览！',{time:2000,skin:'common-tips'});
        }
        /**
         * 三栏详情页面的触摸动画
         * @param event 事件源
         * @param type  1：进入 2：离开
         * @param obj   操作对象名称
         */
        $scope.detailLg = function (event, type, obj) {
            if (type == 1) {
                if (!$scope.tgshow || !$scope.jjueshow) {
                    $(event.currentTarget).find("." + obj).removeClass('bottom-reverse-51')
                    $(event.currentTarget).find("." + obj).removeClass('bottom-51')
                    $(event.currentTarget).find("." + obj).addClass('bottom0')
                } else {
                    $(event.currentTarget).find("." + obj).removeClass('bottom0')
                    $(event.currentTarget).find("." + obj).removeClass('bottom-reverse-51')
                    $(event.currentTarget).find("." + obj).addClass('bottom-51')
                }
            } else if (type == 2) {
                if (!$scope.tgshow || !$scope.jjueshow) {
                    $(event.currentTarget).find("." + obj).removeClass('bottom0')
                    $(event.currentTarget).find("." + obj).removeClass('bottom-51')
                    $(event.currentTarget).find("." + obj).addClass('bottom-reverse-51')
                } else {
                    $(event.currentTarget).find("." + obj).removeClass('bottom-51')
                    $(event.currentTarget).find("." + obj).removeClass('bottom-reverse-51')
                    $(event.currentTarget).find("." + obj).addClass('bottom0')
                }
            }

        }



        $(window).resize(function () {        //当浏览器大小变化时
            var headerHeight = $("header").height();
            var allHeight = document.documentElement.clientHeight;
            // 设置左侧sidebar的高度
            $(".sidebar").css("height", allHeight - headerHeight - 2);
            $("#content-b1").css("height", allHeight - headerHeight - 2);
            $("#content-a3").css("height", allHeight - headerHeight - 2);
            // 设置统计页面四个饼图外层的div高度
            // setTimeout(function(){
            getCoListHeight();
            // $('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
            // });
            $(".data_list").css("height", allHeight - headerHeight - $(".data_Totle").height() - 2);
            $(".data_count").css("height", allHeight - headerHeight - $(".data_Totle").height() - 2);

            // $('.table-list .noSearch').height($(window).height()-($('.filter-table').height()+250));
        });

    }]);

/**
 * 拼接百分数 结果： xx.xx%
 * @param number
 * @returns {String}
 */
function parsePercent(number) {
    var persent = number * 10000;
    var strName = parseInt(persent) + "";
    var length = strName.length;
    var integer = strName.substr(0, length - 2);
    var decimal = strName.substr(length - 2, length);
    if (integer === "") {
        integer = "0";
    }
    if (decimal === "") {
        return integer + "%";
    }
    return integer + "." + decimal + "%";
}
