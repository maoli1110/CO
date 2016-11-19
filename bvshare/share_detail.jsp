<!DOCTYPE html>
<html lang="zh-CN" ng-app="bvShare">
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8; IE=edge"/>
        <meta name="renderer" content="webkit">
        <!--<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">-->
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"">
        <title></title>
        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="./lib/bootstrap/dist/css/bootstrap.min.css">
        <!-- project core CSS -->
        <link rel="stylesheet" href="./css/cooperation.css">
        <link rel="stylesheet" href="./css/main.css">

        <!-- 动画css插件加载 -->
        <link rel="stylesheet" href="./css/animate.min.css">

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
            alert(basePath)
        </script>
        
    <link href="./lib/audio1/css/jplayer.blue.monday.css" rel="stylesheet" type="text/css"/>
    <!--header-->
    <link rel="stylesheet" href="css/coopdetail.css">
</head>
<!--<div class="mobile-mark"></div>-->
<!--顶部播放声音的插件-->
<body ng-controller="sharedetailCtrl">
    <style>
            body{
                position:relative;
            }
            .detail-voice{
                line-height:120px;
                display:none;
                position:absolute;
                top:0;
                left:0;
                right:0;
            }
            .jp-audio .jp-time-holder {
                top: 30px !important;
                right: 67px !important;
                left: 300px !important;
            }
            .jp-audio .jp-type-single .jp-time-holder {
                left: 110px;
                width: 40px!important;
            }
             .jp-duration {
                color: #fff;
            }
            .jp-interface {
                background-color: transparent!important
            }
             .jp-audio, .jp-audio-stream, .jp-video {
                border: none !important;
                background-color:transparent!important;
            }
            .jp-audio .jp-type-single .jp-progress {
                left: 101px!important;
                width: 186px;
                height: 10px;
                border-radius: 10px;
                top: 32px;
            }
            img{
                vertical-align:0;
            }
            .btn-fix {
                position: fixed;
                bottom: 0px;
                left: 50%;
                margin-left: -64px;
            }
        </style>
        <div style="position:relative;top:0;left:0;z-index:101;"  class="detail-voice">
            <div class="play-audio-mask"></div>
            <div>
            <div class="palys">
                <div id="jquery_jplayer_1" class="jp-jplayer"></div>
                <div id="jp_container_1" class="jp-audio" role="application" aria-label="media player">
                    <div class="jp-type-single">
                        <div class="jp-gui jp-interface">
                            <div class="jp-controls">
                                <button class="jp-play" role="button" tabindex="0"></button>
                            </div>
                            <div class="jp-progress">
                                <div class="jp-seek-bar" style="background:#fff;border-radius:5px;width:100%!important">
                                    <div class="jp-play-bar" style=""></div>
                                </div>
                            </div>
                            <div class="jp-time-holder">
                                <div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="audio-close detail-close"><span class="glyphicon glyphicon-remove" style="top:-55px;right: 23px;font-size: 22px" ng-click="audioClose()"></span></div>
        </div>
        <div>ewr</div>
        <!--电脑端-->
        <!-- <div ng-include="'template/cooperation/coop_detail_pc.html'" scope="" onload="" ng-if="!device"></div> -->
        <!--手机端-->
        <div ng-include="'./coop_detail_bv2.html'" scope="" onload=""></div>
        <!-- vendor -->
        <script src="./lib/lodash.min.js"></script>
        <!-- <script src="//cdn.bootcss.com/lodash.js/4.15.0/lodash.js"></script> -->
        <script type="text/javascript" src="./lib/jquery/dist/jquery.min.js"></script>
        <!--<script src="js/jquery-1.9.0.js" type="text/javascript"></script>-->
        <script type="text/javascript" src="./lib/angular/angular.min.js"></script>
        <script type="text/javascript" src="./lib/angular-ui-router/release/angular-ui-router.min.js"></script>
        
        <script type="text/javascript" src="./lib/angular-i18n.js"></script>
        <script type="text/javascript" src="./lib/angular-ui-bootstrap/dist/ui-bootstrap-tpls-2.0.0.min.js"></script>
        <script type="text/javascript" src="./lib/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="./lib/nginfinite/ng-infinite-scroll.min.js"></script>
        <script type="text/javascript" src="./lib/layer/layer.min.js"></script>
        <script type="text/javascript" src="./lib/audio1/jquery.jplayer.min.js"></script>
        <script src="./lib/jquery.scrollLoading.js"></script>
        
        <script src="./module/config.js"></script>
        <script src="./module/controller/sharedetail.ctrl.js"></script>
        <script src="./module/service/share.service.js"></script>

</body>
</html>

