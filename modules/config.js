'use strict';
//增强版模块模式
var ApplicationConfiguration = (function () {
    // 应用程序名和依赖
    var refreshId;
    var applicationModuleName = 'appname';
    var applicationModuleVendorDependencies = ['ui.router', 'ui.bootstrap', 'angularFileUpload', 'i18n', 'alert', 'infinite-scroll'];

    // 添加新模块
    var registerModule = function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    var urls = {
        apiUrl: 'http://localhost:8080/bimco',
        trendUrl: 'http://localhost:8080/bimco'
        //apiUrl: 'http://192.168.13.222:8080/bimco',
        //coUrl: 'http://172.16.21.69:8080/bimco/'
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule,
        urls: urls
    };
})();
// 协作--新建--添加资料
// 协作--新建--更改负责人
// 协作--新建--添加相关人
// 协作--新建--提交
// 协作--统计
// 协作--筛选
// 协作--已读
// 协作--删除

// 协作--三栏--显示设置
// 协作--三栏--反查至BIM模型
// 协作--三栏--资料预览
// 协作--三栏--资料预览--签署意见
// 协作--三栏--资料预览--电子签名
// 协作--三栏--资料预览--清空
// 协作--三栏--资料预览--提交
// 协作--三栏--待签字/已签字
// 协作--三栏--待签字/已签字--签署意见
// 协作--三栏--待签字/已签字--电子签名
// 协作--三栏--待签字/已签字--清空
// 协作--三栏--待签字/已签字--提交
// 协作--三栏--下载
// 协作--三栏--发表
// 协作--三栏--编辑
// 协作--三栏--编辑--提交
// 协作--三栏--结束
// 协作--三栏--导出
// 协作--三栏--通过
// 协作--三栏--拒绝
// 协作--三栏--展开
// 协作--两栏/三栏展开查看--反查至BIM模型
// 协作--两栏/三栏展开查看--资料预览
// 协作--两栏/三栏展开查看--资料预览--签署意见
// 协作--两栏/三栏展开查看--资料预览--电子签名
// 协作--两栏/三栏展开查看--资料预览--清空
// 协作--两栏/三栏展开查看--资料预览--提交
// 协作--两栏/三栏展开查看--待签字/已签字
// 协作--两栏/三栏展开查看--待签字/已签字--签署意见
// 协作--两栏/三栏展开查看--待签字/已签字--电子签名
// 协作--两栏/三栏展开查看--待签字/已签字--清空
// 协作--两栏/三栏展开查看--待签字/已签字--提交
// 协作--两栏/三栏展开查看--下载
// 协作--两栏/三栏展开查看--发表
// 协作--两栏/三栏展开查看--编辑
// 协作--两栏/三栏展开查看--编辑--提交
// 协作--两栏/三栏展开查看--结束
// 协作--两栏/三栏展开查看--删除
// 协作--两栏/三栏展开查看--导出
// 协作--两栏/三栏展开查看--通过
// 协作--两栏/三栏展开查看--拒绝
// 动态--下载
// 动态--预览


//记录日志-流程文字描述基本配置
var LogConfiguration = (function () {
    var progressPrefix = {
        default: '协作',
        threeCloumn: '协作→三栏',
        secondCloumn: '协作→两栏/三栏展开查看',
        manage:'动态'
    }
    var progressName = {
        newCoop: '→新建→关联BIM',
        addDocs: '→新建→添加资料',
        selectResponsible: '→新建→更改负责人',
        selectRelated: '→新建→添加相关人',
        save: '→新建→提交',
        comboxCount: '→统计',
        isShowComboBox: '→筛选',
        remarkRead: '→已读',
        removeAll: '→删除',

        showSetting: '→显示设置',
        checkModel: '→反查至BIM模型',
        previewSign: '→资料预览',
        addApprove: '→待签字/已签字',

        downDocs: '→下载',
        submitCommon: '→发表',
        allowEditTrans: '→编辑',
        editSave: '→编辑→提交',
        doCollaboration8: '→结束',
        deleteCoop: '→删除',
        doExport: '→导出',
        doCollaboration6: '→通过',
        doCollaboration7: '→拒绝',
        LgDetailMode: '→展开',

        manageDownload:'→下载',
        managePreview:'→预览'

    };

    var previewSignName = {
        signComment: '→签署意见',
        signElectronic: '→电子签名',
        signEmpty: '→清空',
        submitAll: '→提交'
    }
    return {
        progressPrefix: progressPrefix,
        progressName: progressName,
        previewSignName:previewSignName
    }
})();

//增强版模块模式(正式发版注释掉)
// var BimCo = (function () {
//     var GetAuthCode = function () {
//         return '';
//     }
//     var GetWindowStatus = function () {
//         return '';
//     }
//     var SubmitAll = function () {
//         return '';
//     }
//     var PdfSign = function () {
//         return true;
//     }
//     var IsModify = function () {
//         return true;
//     }
//     var MessageBox = function () {
//         return true;
//     }
//     var PdfSign = function () {
//         return true;
//     }
//     var CommentSign = function () {
//         return true;
//     }
//     var IsModify = function () {
//         return true;
//     }
//     var ElectronicSign = function () {
//         return true;
//     }
//     var IsShowProgressBar = function () {
//         return true;
//     }
//     var SignCancel = function () {
//         return true;
//     }
//     var CancelSubmitAll = function () {
//         return true;
//     }
//     var LocateComponent = function () {
//         return true;
//     }
//     var GetCurrentUserInfo = function () {
//         return true;
//     }
//     var WriteLog = function () {
//         return true;
//     }
//     var CreateCoSucceed = function () {
//         return true;
//     }
//     var SignSubmit=function () {
//         return true;
//     }
//     var SignEmpty=function () {
//         return true;
//     }
//     var ExportCooperation=function () {
//         return true;
//     }
//     var GetSaveState = function(){
//         return true;
//     }
//     var ClearMsgData = function(){
//         return true;
//     }
//     var IsEncryptionDoc = function(){
//         return true;
//     }
//     var NotifyStartGetData = function(){
//         return true;
//     }
//     var NotifyEndGetData = function(){
//         return false;
//     }
//     return {
//         GetAuthCode: GetAuthCode,
//         GetWindowStatus: GetWindowStatus,
//         SubmitAll: SubmitAll,
//         PdfSign: PdfSign,
//         IsModify: IsModify,
//         MessageBox: MessageBox,
//         PdfSign: PdfSign,
//         CommentSign: CommentSign,
//         IsModify: IsModify,
//         ElectronicSign: ElectronicSign,
//         IsShowProgressBar: IsShowProgressBar,
//         SignCancel: SignCancel,
//         CancelSubmitAll: CancelSubmitAll,
//         LocateComponent: LocateComponent,
//         GetCurrentUserInfo: GetCurrentUserInfo,
//         WriteLog: WriteLog,
//         CreateCoSucceed: CreateCoSucceed,
//         SignSubmit:SignSubmit,
//         SignEmpty:SignEmpty,
//         ExportCooperation:ExportCooperation,
//         GetSaveState:GetSaveState,//退登弹出框的交互
//         ClearMsgData:ClearMsgData,//客户端点击未读悬浮球未读减少
//         IsEncryptionDoc:IsEncryptionDoc,
//         NotifyStartGetData:NotifyStartGetData,
//         NotifyEndGetData:NotifyEndGetData
//     };

// })();

var client = function () {

    //rendering engines
    var engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,

        //complete version
        ver: null
    };

    //browsers
    var browser = {

        //browsers
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,

        //specific version
        ver: null
    };


    //platform/device/OS
    var system = {
        win: false,
        mac: false,
        x11: false,

        //mobile devices
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        //game systems
        wii: false,
        ps: false
    };

    //detect rendering engines/browsers
    var ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);

        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100) {
                safariVersion = 1;
            } else if (engine.webkit < 312) {
                safariVersion = 1.2;
            } else if (engine.webkit < 412) {
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }

            browser.safari = browser.ver = safariVersion;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);

        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp["$1"];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    //detect browsers
    browser.ie = engine.ie;
    browser.opera = engine.opera;


    //detect platform
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    //detect windows operating systems
    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp["$1"] == "NT") {
                switch (RegExp["$2"]) {
                    case "5.0":
                        system.win = "2000";
                        break;
                    case "5.1":
                        system.win = "XP";
                        break;
                    case "6.0":
                        system.win = "Vista";
                        break;
                    case "6.1":
                        system.win = "7";
                        break;
                    default:
                        system.win = "NT";
                        break;
                }
            } else if (RegExp["$1"] == "9x") {
                system.win = "ME";
            } else {
                system.win = RegExp["$1"];
            }
        }
    }

    //mobile devices
    system.iphone = ua.indexOf("iPhone") > -1;
    system.ipod = ua.indexOf("iPod") > -1;
    system.ipad = ua.indexOf("iPad") > -1;
    system.nokiaN = ua.indexOf("NokiaN") > -1;

    //windows mobile
    if (system.win == "CE") {
        system.winMobile = system.win;
    } else if (system.win == "Ph") {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            ;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }


    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1) {
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }

    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }

    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);

    //return it
    return {
        engine: engine,
        browser: browser,
        system: system
    };

}();
//判断pc or bv
if (client.system.winMobile || client.system.wii || client.system.ps || client.system.android || client.system.ios || client.system.iphone || client.system.ipod || client.system.ipad || client.system.nokiaN) {
    var device = true;
}
//权限码全局配置文件
var accessCodeConfig = {
    createCode: '33012001',
    updateCode: '33012002',
    deleteCode: '33012003',
    coManageCode: '33012004'
};
//从客户端获取权限码（正式代码不注释）
var accessCode;

var jPlayerAndroidFix = (function ($) {
    var fix = function (id, media, options) {
        this.playFix = false;
        this.init(id, media, options);
    };
    fix.prototype = {
        init: function (id, media, options) {
            var self = this;

            // Store the params
            this.id = id;
            this.media = media;
            this.options = options;

            // Make a jQuery selector of the id, for use by the jPlayer instance.
            this.player = $(this.id);

            // Make the ready event to set the media to initiate.
            /*
             // 此处绑定结束事件没用 self.setMedia(self.media);这句话还会导致播放完后音频重复加载
             this.player.bind($.jPlayer.event.ready, function(event) {
             // Use this fix's setMedia() method.
             self.setMedia(self.media);
             });*/

            // Apply Android fixes
            if ($.jPlayer.platform.android) {

                // Fix playing new media immediately after setMedia.
                this.player.bind($.jPlayer.event.progress, function (event) {
                    if (self.playFixRequired) {
                        self.playFixRequired = false;

                        // Enable the contols again
                        // self.player.jPlayer('option', 'cssSelectorAncestor', self.cssSelectorAncestor);

                        // Play if required, otherwise it will wait for the normal GUI input.
                        if (self.playFix) {
                            self.playFix = false;
                            $(this).jPlayer("play");
                        }
                    }
                });
                // Fix missing ended events.
                /*
                 // 此处绑定结束事件没用 self.setMedia(self.media);这句话还会导致播放完后音频重复加载
                 this.player.bind($.jPlayer.event.ended, function(event) {
                 if(self.endedFix) {
                 self.endedFix = false;
                 setTimeout(function() {
                 self.setMedia(self.media);
                 },0);
                 // what if it was looping?
                 }
                 });*/
                this.player.bind($.jPlayer.event.pause, function (event) {
                    if (self.endedFix) {
                        var remaining = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
                        if (event.jPlayer.status.currentTime === 0 || remaining < 1) {
                            // Trigger the ended event from inside jplayer instance.
                            setTimeout(function () {
                                self.jPlayer._trigger($.jPlayer.event.ended);
                            }, 0);
                        }
                    }
                });
            }

            // Instance jPlayer
            this.player.jPlayer(this.options);

            // Store a local copy of the jPlayer instance's object
            this.jPlayer = this.player.data('jPlayer');

            // Store the real cssSelectorAncestor being used.
            this.cssSelectorAncestor = this.player.jPlayer('option', 'cssSelectorAncestor');

            // Apply Android fixes
            this.resetAndroid();

            return this;
        },
        setMedia: function (media) {
            this.media = media;

            // Apply Android fixes
            this.resetAndroid();

            // Set the media
            this.player.jPlayer("setMedia", this.media);
            return this;
        },
        play: function () {
            // Apply Android fixes
            if ($.jPlayer.platform.android && this.playFixRequired) {
                // Apply Android play fix, if it is required.
                this.playFix = true;
                this.player.jPlayer("play");
            } else {
                // Other browsers play it, as does Android if the fix is no longer required.
                this.player.jPlayer("play");
            }
        },
        resetAndroid: function () {
            // Apply Android fixes
            if ($.jPlayer.platform.android) {
                this.playFix = false;
                this.playFixRequired = true;
                this.endedFix = true;
                // Disable the controls
                // this.player.jPlayer('option', 'cssSelectorAncestor', '#NeverFoundDisabled');
            }
        }
    };
    return fix;
})(jQuery);

/**
 * 检测系统的版本(mac/win7/win10)
 */
var detectOSInfo = (function(){
    var detectOS = function(){
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        }
        return "other";
    }
    return{
        detectOS:detectOS
    }
})();

