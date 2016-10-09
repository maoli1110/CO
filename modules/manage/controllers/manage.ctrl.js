'use strict';
/**
 * 协作管理
 */
angular.module('manage').controller('manageCtrl', ['$scope', '$http', '$uibModal', '$state','FileUploader','Manage','$stateParams',
    function ($scope, $http, $uibModal, $state, FileUploader,Manage,$stateParams) {
	var firstreackflag = true;//进入页面只加载一次定位
	var firstdeptid; //第一个项目部id
    var searchId = $stateParams.ppid?$stateParams.ppid:'';//工程ppid
	var deptId = $stateParams.deptId?$stateParams.deptId:'';
	var changeProj = false;
	$scope.docType = "1";
    $scope.deptInfoList = [];
    $scope.projectInfoList = [];
    $scope.openSignal = false;
    $scope.isNoSearchValue = false;//搜索无工程
    $scope.isNoSearchValueBook = false;//搜索资料
    $scope.isNoSearchValueReject = false;//搜索无结果
    $scope.openNew = function () {
    	$scope.openSignal = true;
    }

    $scope.closeNew = function () {
    	$scope.openSignal = false;
    }

    $scope.trans = function () {
    	var url = $state.href('newcopper', {parameter: "parameter"});
		window.open(url,'_blank');
    }
    //加载更多
    var moreTrents;
    var searchBox = $("#exampleInputName2").val();//项目部下面的工程搜索参数
    //获取项目部列表
    Manage.getDeptInfoList().then(function (data) {
        $scope.deptInfoList = data;
        if(!deptId){
        	 firstdeptid = data[0].deptId;
        }
    })

    $scope.initScrollend = function(id){
          //如果当前企业和切换的企业id不一样，初始化$scope.scrollend
          if(searchId != id){
                $scope.scrollend = false;
                lastUploadTime = '';
                lastUsername = '';
            }
     }
  
    //点击项目部追加工程列表，并且绑定click事件
    function getimgurl(treeItems,deptId){
    	$("#dept_"+deptId).empty();
		for(var i = 0 ; i< treeItems.length;i++){
			if(treeItems[i].projectType=="土建预算"){
				treeItems[i].imgsrc="imgs/icon/1.png";
			}else if(treeItems[i].projectType=="钢筋预算"){
				treeItems[i].imgsrc="imgs/icon/2.png";
			}else if(treeItems[i].projectType=="安装预算"){
				treeItems[i].imgsrc="imgs/icon/3.png";
			}else if(treeItems[i].projectType=="Revit"){
				treeItems[i].imgsrc="imgs/icon/4.png";
			}else if(treeItems[i].projectType=="Tekla"){
				treeItems[i].imgsrc="imgs/icon/5.png";
			};
			$("#dept_"+deptId).append("<span id=projectbutton_"+treeItems[i].ppid+" title='"+treeItems[i].projectName+"' class='spanwidth'><img src='"+treeItems[i].imgsrc+"'><span class='substr-sideMenus coop-menusSet' style='display:inline-block;'>"+treeItems[i].projectName+"</span>&nbsp;<b class='coop-countElement'>("+treeItems[i].count+")</b></span>")
        }
		
		$("span[id^='projectbutton_']").bind("click", function(){
             $(".manage-menus").removeClass("menusActive");
		   	  $("span").removeClass("menusActive");
		        //获取当前元素
		   	  $(this).addClass("menusActive").siblings().removeClass("menusActive");
		   	  $(" .data_count").hide();
              $scope.trentsListInfo = [];
              changeProj = true;
		   	  $scope.trentsList($(this).attr("id").split("_")[1]);
		});
	}
    
    //获取项目部下的工程列表
    $scope.childItems = function(id,$event,open){
        var searchBox = $("#exampleInputName2").val();
        $(".good_list").show();
        $(".pro_list").hide();
        $(".goodlist_left").show();
        $(".prolist_left").hide();
        $('.manage-menus').removeClass('menusActive');
        $("span.spanwidth").removeClass("menusActive");
        if( $scope.isNoSearchValue){
            $(".good_list").css({'display':'none'});
        }
        if(!open){
        	Manage.getProjectInfoList(id).then(function (data) {
            	getimgurl(data,id);
            });
            deptId = id;
            //获取项目统计列表
            var params = {deptId:id,searchText:searchBox};
            var obj = JSON.stringify(params);
            $scope.isNoSearchValue = false;
            $scope.isNoSearchValueReject = false;
            Manage.getProjectTrends(obj).then(function(data){
                $scope.trentsCount = data.data;
               if(data.data.length==0){
                    $scope.isNoSearchValue = true;
                    $scope.isNoSearchValueReject = false;
                    $(".good_list").css({'display':'none'});
                }else{
                   $scope.isNoSearchValue = false;
                   $(".good_list").css({'display':'block'})
               }
            });
        }
        if(!deptId){
            deptId = deptId;
        }
        if(deptId != deptId ){
           deptId = deptId;
        }
    }
        //项目统计列表搜索功能
        //搜索功能
        $scope.searchProject = function(deptId,searchBox){
            var params = {deptId:deptId,searchText:searchBox};
            var obj = JSON.stringify(params);
            Manage.getProjectTrends(obj).then(function(data){
                $scope.trentsCount = data.data;
                //setTimeout(addProjectStyle,100);
                if($scope.trentsCount.length==0){
                    $scope.isNoSearchValue = true;
                    $(".good_list").css({'display':'none'})
                }else{
                    $scope.isNoSearchValue = false;
                    $(".good_list").css({'display':'block'})
                }
            });
        }
        $scope.getDeptId = function(){
            if(!deptId){
                 deptId = firstdeptid;
            }
            else{
                 deptId = deptId;
            }
            var searchBox = $("#exampleInputName2").val();
            if(searchBox.length>0){
                $scope.searchProject(deptId,searchBox);

            }else if(searchBox.length==0){
                if(!deptId){
                    deptId = firstdeptid;
                }else{
                    deptId = deptId;
                }
                searchBox='';
                $scope.searchProject(deptId,searchBox);

            }
        }

        function addProjectStyle(){
            var searchTerm = $("#exampleInputName2").val();
            $('.project_name').removeHighlight();
            if (searchTerm) {
                $('.project_name').highlight(searchTerm);
            }
        }
        function addEpcStyle(){
            var searchTerm = $("#exampleInputName3").val();
            $('.menName').removeHighlight();
            if (searchTerm) {
                $('.menName').highlight(searchTerm);
            }
        }

        //图片预览效果
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var slid = $('ul.slide_box li')
            slid.addClass('none');
            slid.eq(0).removeClass('none');
            var slideindex = 0;
            function switchi() {
                if(slideindex == slid.length - 1){
                    slideindex = 0;
                }else {
                    slideindex = slideindex + 1;
                }
                slid.addClass('none');
                slid.eq(slideindex).removeClass('none');
            }
            var timer = setInterval(switchi, 3000);
            function options(indexs) {
                slid.addClass('none');
                slid.eq(indexs).removeClass('none');
            }
            //判断是第几页的内容
            //前进后退的效果
            //如果恒等于0的时候就等于三，执行减操作，执行上一个动作
            $('a.options').click(function(){
                var drec = $(this).data('drec');
                if(drec == 'pre') {
                    if(slideindex == 0) {
                        slideindex = 3;
                    }else {
                        slideindex = slideindex - 1;
                    }
                    //如果恒等于3的时候就等于0 ，执行加操作,执行下一个
                }else {
                    if(slideindex == 3) {
                        slideindex = 0;
                    }else {
                        slideindex = slideindex + 1;
                    }
                }
                clearInterval(timer);
                options(slideindex);
            });
            $('ul > li >.bx-controls >.img_list>.tools_bar>.bookSection').click(function(){
                slideindex = $(this).index();
                clearInterval(timer);
                options(slideindex);
                $(".mask").show();
                $(".showImg").show();
                $(".turnDown").show();
            });
            $(".turnDown").click(function(){
                $(this).hide();
                $(".mask").hide();
                $(".showImg").hide();
            })
         
            //下载弹出遮罩层和下载进度
            $(".pro-down").click(function(){
                $(".tools_bar>.pro_mask").animate({top:0});
                $(".bar").hide();
            })
            $(".proName").click(function(){
                if($(this).find(".panel-body").height()<=20){
                    //alert("子元素为空，没有子元素");
                    $(this).find(".panel-body").css("padding-bottom",'0px')
                }
            })
            $(".manage-menus").bind("click", function(){
                $("manage-menus").removeClass("menusActive");
                //获取当前元素
                $(this).addClass("menusActive").siblings().removeClass("menusActive");
            });

        });

        //动态列表搜索关键字
        $scope.trentsSearch = function(seacherKey){
            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:seacherKey,searchType:$scope.docType}).then(function(data){
                $scope.trentsListInfo = data.data;
                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
                angular.forEach(data.data, function (value, key) {
                    angular.forEach(value.docs, function (value1, key1) {
                        if(typeArr.indexOf(value1.fileType) == -1) {
                            $scope.trentsListInfo[key].docs[key1].fileType = 'other';
                            console.log( $scope.trentsListInfo[key].docs[key1].fileType );
                        }
                    });
                });
                //setTimeout(addEpcStyle,100);
                if(data.data.length==0 ){
                    $scope.isNoSearchValueReject =true;
                    $('.pro_list').css('display','none');
                }else{
                    $scope.isNoSearchValueReject =false;
                    $('.pro_list').css('display','block');
                }
            });
        }
        $scope.manageSeacher = function(){
            //获取搜索类型关键字
            $scope.trentsListInfo=[];
            $scope.seacherKey = $("#exampleInputName3").val();
            if(!$scope.docType){
                $scope.docType="1";
            }else{
                $scope.docType=$scope.docType;
            }
            $scope.trentsSearch( $scope.seacherKey)
        }

        $scope.changeAttr = function (docType) {
            $scope.trentsListInfo = [];
            $scope.seacherKey = $("#exampleInputName3").val();
            if(!$scope.docType){
                $scope.docType=1;
            }else{
                $scope.docType=$scope.docType;
            }
            Manage.getTrends({count:10,lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
                $scope.trentsListInfo = data.data;
                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
                angular.forEach(data.data, function (value, key) {
                    angular.forEach(value.docs, function (value1, key1) {
                        if(typeArr.indexOf(value1.fileType) == -1) {
                            $scope.trentsListInfo[key].docs[key1].fileType = 'other';
                            console.log( 'qqqqq',$scope.trentsListInfo[key].docs[key1].fileType );
                        }
                    });
                });
                //setTimeout(addEpcStyle,100);
                if(data.data.length==0){
                    $scope.isNoSearchValueReject = true;
                    $('.pro_list').css('display','none')
                }else{
                    $scope.isNoSearchValueReject =false;
                    $('.pro_list').css('display','block')
                }
            });
            //Manage.getTrends({lastUploadTime:"",lastUsername:"",ppid:searchId,searchKey:$scope.seacherKey,searchType:$scope.docType}).then(function(data){
            //    $scope.trentsListInfo = data.data;
            //});
        }
        //判断是否按下enter键进行搜索（动态工程列表页面）
        //工程列表enter键搜索
        $("#exampleInputName2").val();
        $scope.previewList = function(e){
            var keyCode = e.keyCode|| e.which;
            if($("#exampleInputName2").val()!="" && keyCode==13){
                $scope.getDeptId();
            }else if($("#exampleInputName2").val()==''){
                $scope.trentsCount=[];
                searchBox = $("#exampleInputName2").val();
                searchBox=''
                if(!deptId){
                    deptId = firstdeptid;
                }else{
                    deptId = deptId;
                }
                $scope.searchProject(deptId,searchBox);
            }
        }
        //判断是否按下enter键进行搜索（动态工程动态列表页面）
        //工程动态列表enter键搜索
        $scope.keyUp = function(e){
            var keyCode = e.keyCode|| e.which;
            if($("#exampleInputName3").val()!="" && keyCode==13){
                $scope.seacherKey = $("#exampleInputName3").val();
                $scope.manageSeacher();
            }else if($("#exampleInputName3").val()==''){
                var searchValue = $("#exampleInputName3").val();
                searchValue='';
                $scope.trentsListInfo=[];
                $scope.trentsSearch(searchValue)
            }
        }
        /*滚动加载只防止多次提交请求问题start*/
        //可以查询
        var searchFlag;
        var pollingFlag = true;
        var checkSearchInterval;
        //搜索高亮显示
        $scope.addMoreData = function (){
        	if(!changeProj){
        		setSearchFlagFalse();
                if(pollingFlag){
                    pollingFlag = false;
                    checkSearchInterval = setInterval(function() {checkCanSearch()},100);
         		}
         		setTimeout(function() {setSearchFlagTrue()},150);
        	}else{
        		changeProj = false;
        	}
            
        };
        var setSearchFlagFalse = function(){
        	console.log(false);
            searchFlag = false;
        }
        var setSearchFlagTrue = function(){
        	console.log(true);
            searchFlag = true;
        }
        var checkCanSearch = function(){
        	console.log("轮询");
            if(searchFlag){
            	console.log("chaxun");
                clearInterval(checkSearchInterval);
                $scope.trentsList(searchId);
                pollingFlag = true;
            }
        }
        /*滚动加载只防止多次提交请求问题end*/
        var lastUploadTime; //下一次请求的时间 第一次没有值
        var lastUsername;//下一次请求的用户名 第一次没有值
        $scope.trentsListInfo=[];
        $scope.scrollend= false;
        //点击右侧列表获取动态列表
        $scope.turnPage = function(id){
            $("span[id='projectbutton_"+id+"']").click();
        }
        //通过侧边栏的子元素去调出动态列表
        $scope.trentsList = function(id) {
            //如过却换工程 scrollend需要初始化设置
            $scope.isNoSearchValueReject = false;
            $(".manage-menus").removeClass("menusActive");
            //$scope.initScrollend(id);
            if(changeProj){
            	 $scope.scrollend = false;
                 lastUploadTime = '';
                 lastUsername = '';
                 //changeProj = false;
            }
        	if(!id){
        		console.log("无id,查询失败");
        		return;
        	}
            searchId = id;
            $(".good_list").hide();
            $(".pro_list").show();
            $(".goodlist_left").hide();
            $(".prolist_left").show();
            var createindex = layer.load(1, {
                shade: [0.1,'#000'] //0.1透明度的黑色背景
            });
            $scope.seacherKey = $("#exampleInputName3").val();
            if(!$scope.docType){
                $scope.docType =1;
            }else{
                $scope.docType = $scope.docType;
            }
            Manage.getTrends({
                count:10,
                lastUploadTime:lastUploadTime,
                lastUsername:lastUsername,
                ppid: id,
                searchKey:$scope.seacherKey,
                searchType:$scope.docType
            }).then(function (data) {
            	var size = 0;
                if(data.data.length==0){
                    $(".pro_list").css('display','none');
                    $scope.isNoSearchValueReject = true;
                } else{
                    $(".pro_list").css('display','block');
                    $scope.isNoSearchValueReject = false;
                }
                if(data.data.length!=0){
                    for(var i=0 ;i<data.data.length;i++){
                    	size++;
                        $scope.trentsListInfo.push(data.data[i])
                    }
                    lastUploadTime = data.data[data.data.length-1].updateTime;
                    lastUsername = data.data[data.data.length-1].username;
                    console.info('动态详情列表',$scope.trentsListInfo)
                }
                if(data.data.length<10){
                    $scope.scrollend = true;
                }
               // debugger;
                var lh = 0;
                if($scope.trentsListInfo.length > 10){
                	lh = $scope.trentsListInfo.length - size;
                }
                var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
                angular.forEach(data.data, function (value, key) {
                    angular.forEach(value.docs, function (value1, key1) {
                        if(typeArr.indexOf(value1.fileType) == -1) {
                        	var keys = lh + key;
                            $scope.trentsListInfo[keys].docs[key1].fileType = 'other';
                            //console.log( '格式数组',$scope.trentsListInfo[keys].docs[key1].fileType );
                        }
                    });
                });
                layer.close(createindex);
            });
            $scope.id = id;
        }


    $scope.getProjectList = function (index) {
        $scope.isOpen = !$scope.isOpen;
    }
        //通过动态列表的图片获取大图的资源路径
        $scope.transformBig = function(uuid,docName,isPreview){
            var data ={fileName:docName,uuid:uuid};
            if(isPreview == false){
                alert('该文件暂不支持预览')
                return;
            }
            Manage.getTrendsFileViewUrl(data).then(function (result) {
                $scope.previewimg = result;
                layer.open({
                        type: 2,
                        title: '预览',
                        fix: false,
                        shadeClose: true,
                        maxmin: true,
                        area: ['1000px', '500px'],
                        content: $scope.previewimg
                    });
            },function (data) {
                var obj = JSON.parse(data);
                console.log(obj);
                alert(obj.message);
            });
        }
        //回退按钮关闭列表页面
        $scope.listBack = function(){
            $(".good_list").show();
            $(".pro_list").hide();
            $(".goodlist_left").show();
            $(".prolist_left").hide();
           $state.go('manage',{'deptId':deptId,'ppid':searchId},{ location: 'replace'});
        }

        //更新资料和选中模块加阴影效果
        $scope.$on('shadowFinsh', function (ngRepeatFinishedEvent) {
            $scope.updataBook = function(adds){
                adds = adds;
                if(adds>0){
                    adds--
                }
                $(".good_list dl").click(function(){
                    $(this).find(".updateNub").text(adds);
                    $(this).addClass("dlActive").siblings().removeClass("dlActive")
                })
            }
        })
        
        $scope.$on('ngRepeatFinishedDept',function(ngRepeatFinishedEvent){
	    	if(firstreackflag){
				//获取列表里面第一个项目部
				if(deptId){
					$("#deptbutton_"+deptId).click();
				}else{
					$("#deptbutton_"+firstdeptid).click();
				}
				firstreackflag = false;
			}
		})

        //服务器时间
        $scope.currentTime= function(){
            Manage.getTrendsSystem({sysTime:"",sysWeek:""}).then(function(data){
                $scope.serviceTime = data.data;
            })
        }
        $scope.currentTime();

        $scope.transCooperation = function () {
            $state.go('cooperation', {'transignal':'be'});
        }
}]);