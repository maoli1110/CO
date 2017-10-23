	<!DOCTYPE html>
		<html lang="zh-CN">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8; IE=edge"/>
		<meta name="renderer" content="webkit">
		<!--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">-->
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"">
		<title></title>
		<!-- 阻止faviocn.ico -->
		<link rel="icon" href="data:image/ico;base64,aWNv">
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" href="./lib/bootstrap/dist/css/bootstrap.min.css">
		<!-- Bootstrap select CSS	-->
		<link rel="stylesheet" href="./lib/bootstrap-select/dist/css/bootstrap-select.css">
		<!-- ztree -->
		<link rel="stylesheet" href="./lib/ztree/css/zTreeStyle_new.css">

		<!-- project core CSS -->
		<link rel="stylesheet" href="./css/cooperation.css">
		<link rel="stylesheet" href="./css/main.css">
		<link rel="stylesheet" href="./css/coopdetail.css">
		<link rel="stylesheet" href="./css/cooper-column.css">
		<!-- gulp 压缩 整合 -->
		<!-- <link rel="stylesheet" href="./release/main.min.css"> -->
		<!-- 动画css插件加载 -->
		<link rel="stylesheet" href="./css/animate.min.css">

		<!--滚动条-->
		<!-- custom scrollbar stylesheet -->
		<link rel="stylesheet" href="./css/jquery.mCustomScrollbar.css">
		<link rel="stylesheet" href="./lib/swiper/dist/css/swiper.min.css">
		<script type="text/javascript">
		<%@page pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
		<%
		    String path = request.getContextPath();
		    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
		%>
		</script>

		<script>
			var basePath = "<%=basePath %>";
		</script>
		
		</head>
		<body>

		<div class="content-main" ui-view>
		</div> 
		<!-- vendor -->
		<script type="text/javascript" src="./lib/jquery/dist/jquery.min.js"></script>
		<!--<script src="js/jquery-1.9.0.js" type="text/javascript"></script>-->
		<script type="text/javascript" src="./lib/angular/angular.min.js"></script>
		<script type="text/javascript" src="./lib/angular-ui-router/release/angular-ui-router.min.js"></script>
		<!-- layer -->
		<script type="text/javascript" src="./lib/layer/layer.min.js"></script>
		<script type="text/javascript" src="./lib/angular-i18n.js"></script>
		<script type="text/javascript" src="./lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls-2.0.0.min.js"></script>
		<script type="text/javascript" src="./lib/bootstrap/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="./lib/nginfinite/ng-infinite-scroll.min.js"></script>
		<script src="./lib/jquery.scrollLoading.js"></script>
		<!-- select -->
		<script type="text/javascript" src="./lib/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
		<!-- main -->
		<script type="text/javascript" src="./modules/config.js"></script>
		<script type="text/javascript" src="./modules/application.js"></script>
		<!-- core -->
		<script type="text/javascript" src="./modules/core/core.module.js"></script>
		<script type="text/javascript" src="./modules/core/config/core.routes.js"></script>
		<script type="text/javascript" src="./modules/core/directives/directive.js"></script>
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
		<!-- <script type="text/javascript" src="./modules/cooperation/controllers/cooperation.ctrl.js"></script> -->
		<script type="text/javascript" src="./modules/cooperation/controllers/cooperationNew.ctrl.js"></script>

		<!-- 非第三方插件 可延迟 -->
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/newcooperation.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/coopeditpc.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/selectperson.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/coopdetail.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/updatecomment.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/coopeditdetail.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/linkproject.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/linkcomponent.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/linkbe.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/controllers/defer/linkform.ctrl.js" defer></script>
		<script type="text/javascript" src="./modules/cooperation/services/cooperation.service.js" defer></script>
		
		<!-- core manage cooperation js gulp 整合 -->
		<!-- <script type="text/javascript" src="./release/init.min.js" defer></script> -->
		<!-- core manage cooperation js gulp 整合 -->
		<!-- <script type="text/javascript" src="./release/defer.min.js" defer></script> -->
		
		<!-- 第三方插件 可延迟 -->
		<!-- lodash -->
		<script src="./lib/lodash.min.js"></script>
		<!-- ztree -->
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.core-3.5.min.js" defer></script>
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.excheck-3.5.min.js" defer></script>
		<script type="text/javascript" src="./lib/ztree/js/jquery.ztree.exhide-3.5.js" defer></script>
		<!-- echart -->
		<script type="text/javascript" src="./lib/echart/echarts.min.js" defer></script>

		<!-- audio -->
		<script type="text/javascript" src="./lib/audio1/jquery.jplayer.min.js" defer></script>
		<!-- upload -->
		<script type="text/javascript" src="./lib/angular-upload/angular-upload.min.js" defer></script>
		<script type="text/javascript" src="./lib/plugin/i18n.js" defer></script>
		<script type="text/javascript" src="./lib/plugin/alert.js" defer></script>

		<!--滚动条-->
		<script src="js/jquery.mCustomScrollbar.js" defer></script>
		<script src="js/jquery.mousewheel.min.js" defer></script>
		<%--swiper--%>
		<script src="./lib/swiper/dist/js/swiper.jquery.min.js"></script>
		<!--autosize(多行文本高度自适应)-->
		<script	src="./js/autosize.min.js"></script>
		
		<script>
		//显示大图标
		function Restore  (status) {
			$('#w-max').addClass('maxStates');
			if($('#w-max').hasClass('maxStates')){
				$('#w-middle').css('display','none');
				$('#w-max').css('display','inline-block');
				$('#w-middle2').css('display','none');
				$('#w-max2').css('display','inline-block');
				$('#w-middle-inner').css('display','none');
				$('#w-max-inner').css('display','inline-block');
			}
		}
		//显示小图标
		function Zoom  (status) {
			$('#w-middle').css('display','inline-block');
			$('#w-max').css('display','none');
			$('#w-middle2').css('display','inline-block');
			$('#w-max2').css('display','none');
			$('#w-middle-inner').css('display','inline-block');
			$('#w-max-inner').css('display','none');
		    $('#w-max').removeClass('maxStates');
		}
		</script>
		</body>
		</html>