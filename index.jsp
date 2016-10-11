	<!DOCTYPE html>
		<html lang="zh-CN">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8; IE=edge"/>
		<meta name="renderer" content="webkit">
		<!--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">-->
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title></title>
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" href="./lib/bootstrap/dist/css/bootstrap.min.css">
		<!-- Bootstrap select CSS	-->
		<link rel="stylesheet" href="./lib/bootstrap-select/dist/css/bootstrap-select.css">
		<!-- ztree -->
		<link rel="stylesheet" href="./lib/ztree/css/zTreeStyle_new.css">
		<!-- project core CSS -->
		<link rel="stylesheet" href="./css/main.css">
		<link rel="stylesheet" href="./css/trend.css">
		<link rel="stylesheet" href="./css/cooperation.css">
		<link rel="stylesheet" href="./css/animate.css">
		<!--滚动条-->
		<!-- custom scrollbar stylesheet -->
		<link rel="stylesheet" href="./css/jquery.mCustomScrollbar.css">

		<script type="text/javascript">
		<%@page pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
		<%
		    String path = request.getContextPath();
		    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
		%>
		</script>

		<script>
			var basePath = "<%=basePath %>";
			//console.log(basePath);
		</script>
		
		</head>
		<body>

		<div class="content-main" ui-view>
			
		</div> 
		
		
		<!-- 警告弹框 -->
		<!-- <div style="position: absolute; width:270px; right:30px; top:128px; z-index:100;" ng-repeat="alert in alerts" class="alert {{alert.type}}">
		    <alert>
		        <span ng-bind="alert.msg"></span>
		    </alert>
		</div> -->

		<!-- <div ng-repeat="alert in alerts" class="alert {{alert.type}}">
		    <alert>
		       <span ng-bind="alert.msg"></span>
		    </alert>
		</div> -->

		<!-- vendor -->
		<script src="./lib/lodash.min.js"></script>
		<!-- <script src="//cdn.bootcss.com/lodash.js/4.15.0/lodash.js"></script> -->
		<script type="text/javascript" src="./lib/jquery/dist/jquery.js"></script>
		<!--<script src="js/jquery-1.9.0.js" type="text/javascript"></script>-->
		<script type="text/javascript" src="./lib/angular/angular.min.js"></script>
		
		<script type="text/javascript" src="./lib/angular-ui-router/release/angular-ui-router.min.js"></script>
		<script type="text/javascript" src="./lib/angular-i18n.js"></script>
		<script type="text/javascript" src="./lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls-2.0.0.min.js"></script>
		<script type="text/javascript" src="./lib/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./lib/echart/echarts.min.js"></script>
		<script type="text/javascript" src="./lib/nginfinite/ng-infinite-scroll.js"></script>
		<script type="text/javascript" src="./lib/layer/layer.js"></script>
		<script type="text/javascript" src="./lib/audio1/jquery.jplayer.js"></script>
		<!-- select -->
		<script type="text/javascript" src="./lib/bootstrap-select/dist/js/bootstrap-select.js"></script>

		<!-- upload -->
		<script type="text/javascript" src="./lib/angular-upload/angular-upload.min.js"></script>
		<script type="text/javascript" src="./lib/plugin/i18n.js"></script>
		<script type="text/javascript" src="./lib/plugin/alert.js"></script>
		<script type="text/javascript" src="./lib/plugin/breadcrumbs.js"></script>
		<!-- ztree -->
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.core-3.5.min.js"></script>
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.excheck-3.5.min.js"></script>
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.exhide-3.5.js"></script>

		<!-- main -->
		<script type="text/javascript" src="./modules/config.js"></script>
		<script type="text/javascript" src="./modules/application.js"></script>
		<!-- core -->
		<script type="text/javascript" src="./modules/core/core.module.js"></script>
		<script type="text/javascript" src="./modules/core/config/core.routes.js"></script>
		<script type="text/javascript" src="./modules/core/directives/directive.js"></script>
		<script type="text/javascript" src="./modules/core/directives/directive1.js"></script>
		<script type="text/javascript" src="./modules/core/services/common.service.js"></script>
		<script	 type="text/javascript" src="./modules/core/controller/header.ctrl.js"></script>
		<script type="text/javascript" src="./modules/core/services/header.service.js"></script>
		<!-- manage -->
		<script type="text/javascript" src="./modules/manage/manage.module.js"></script>
		<script type="text/javascript" src="./modules/manage/config/manage.routes.js"></script>
		<script type="text/javascript" src="./modules/manage/controllers/manage.ctrl.js"></script>
		<script type="text/javascript" src="./modules/manage/services/manage.service.js"></script>

		<!-- cooperation -->
		<script type="text/javascript" src="./modules/cooperation/cooperation.module.js"></script>
		<script type="text/javascript" src="./modules/cooperation/config/cooperation.routes.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/cooperation.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/newcooperation.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/selectperson.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/coopdetail.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/updatecomment.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/coopeditdetail.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/linkproject.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/linkcomponent.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/linkbe.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/linkform.ctrl.js"></script>
		<script type="text/javascript" src="./modules/cooperation/services/cooperation.service.js"></script>
		<script type="text/javascript" src="./modules/cooperation/services/treesearch.service.js"></script>
		<!--滚动条-->
		<script src="js/jquery.mCustomScrollbar.js"></script>
		<script src="js/jquery.mousewheel.min.js"></script>
		<!--autosize(多行文本高度自适应)-->
		<script	src="./js/autosize.min.js" ></script>
		<script>
		    //客户端点击协作管理调出bimco （当前定位代码注释--勿删）
		    function transCoManage (deptId,ppid) {
		        //pc跳转传递deptId, ppid 定位到当前工程---勿删
				   	// $('#deptId_formbe').val(deptId);
			     	//   if(ppid <= 0){
					// $('#deptId_formbe').val("");
				   	// }
			     	//   $('#ppid_formbe').val(ppid);
			     	//   $('#deptId_formbe').click();
		    }
		</script>
		</body>
		</html>