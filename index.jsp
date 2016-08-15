<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8; IE=edge"/>
	<meta name="renderer" content="webkit">
	<!-- <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"> -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	<!-- Bootstrap core CSS -->
	<link rel="stylesheet" href="./lib/bootstrap/dist/css/bootstrap.min.css">
	<!--  Bootstrap select CSS	-->
	<link rel="stylesheet" href="./lib/bootstrap-select/dist/css/bootstrap-select.css">
	<link rel="stylesheet" href="./lib/ztree/css/zTreeStyle_new.css">
	<!-- project core CSS -->
	<link rel="stylesheet" href="./css/main.css">
	<link rel="stylesheet" href="./css/goods.css">
	<link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="./css/cooperation.css">
    <link rel="stylesheet" href="./css/cooperation.css">
	<link rel="stylesheet" href="./lib/font-awesome-4.5.0/css/font-awesome.min.css">
	<!--滚动条-->
	<!-- stylesheet for demo and examples -->
	<!-- custom scrollbar stylesheet -->
	<link rel="stylesheet" href="./css/jquery.mCustomScrollbar.css">
	<script type="text/javascript"> 
		var basePath = "http://192.168.13.222:8080/bimco";
		//alert("basePath:"+basePath);
	</script>
 
</head>
<body>
<!-- <header ng-include="'core/header.html'"></header>
<div class="container-fluid">
	<div class="row">
		<div class="col-sm-2 col-md2 sidebar" ng-include="'core/sidebar.html'"></div>
		<div class="col-sm10 col-md-10">
			<breadcrumbs display-name="data.displayName" front-msg="当前页面"></breadcrumbs>
			<div class="content-main" ui-view></div>
		</div>
	</div> 
</div> -->
<div class="content-main" ui-view></div>

<!-- vendor -->
<script src="./lib/lodash.min.js"></script>
<script type="text/javascript" src="./lib/jquery/dist/jquery.js"></script>
<!--<script src="js/jquery-1.9.0.js" type="text/javascript"></script>-->
<script type="text/javascript" src="./lib/angular/angular.min.js"></script>
<script type="text/javascript" src="./lib/angular-ui-router/release/angular-ui-router.min.js"></script>
<script type="text/javascript" src="./lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls-2.0.0.min.js"></script>
<script type="text/javascript" src="./lib/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="lib/echart/echarts.min.js"></script>
<script src="./lib/nginfinite/ng-infinite-scroll.min.js"></script>
<!-- <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.js"></script> -->
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
<script type="text/javascript" src="./modules/cooperation/controllers/coopdetail.ctrl.js"></script>
<script type="text/javascript" src="./modules/cooperation/controllers/newcooperlink.ctrl.js"></script>
<script type="text/javascript" src="./modules/cooperation/services/cooperation.service.js"></script>
<script type="text/javascript" src="./modules/cooperation/services/treesearch.service.js"></script>


<!--滚动条-->
<script src="js/jquery.mCustomScrollbar.js"></script>

</body>
</html>