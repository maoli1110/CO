'use strict';
var bvShare = angular.module('bvShare',['ui.router','infinite-scroll']).config( [
    '$compileProvider',function( $compileProvider ){
        //bv4phone的安全性验证
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|bv4phone|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]).config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push(['$q',
                function($q) {
                    return {
                        // status < 300
                        response: function(response) {
                            var data = response.data;
                            // 统一处理result为false的情况
                            if (data.result && data.result == "false" && data.errormsg) {
                                alertService.add('danger', data.errormsg);
                            }
                            //if(!navigator.onLine){
                            //    layer.alert('网络出错了!')
                            //}
                            return response;
                        },
                        // status >= 400
                        responseError: function(rejection) {
                            switch (rejection.status) {
                                // 401 Unauthorized: jump to login page
                                //case 401:
                                //    location.pathname = membersysConfig.loginPage;
                                //    break;
                                case 404:
                                    layer.confirm('网络出错啦！', {
                                        btn: ['确定','取消'] //按钮
                                    }, function() {
                                        layer.closeAll();
                                    })
                                    // other Error
                                default:
                                    //alertService.add('danger', i18n.get('error.message'));
                            }

                            return $q.reject(rejection);
                        }
                    };
                }
            ]);
        }
    ]).filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            //angular信任机制
            return $sce.trustAsHtml(text); 
        };
    }]);

    var client = function(){

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
    if (window.opera){
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)){
        engine.ver = RegExp["$1"];
        engine.webkit = parseFloat(engine.ver);
        
        //figure out if it's Chrome or Safari
        if (/Chrome\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.safari = parseFloat(browser.ver);
        } else {
            //approximate version
            var safariVersion = 1;
            if (engine.webkit < 100){
                safariVersion = 1;
            } else if (engine.webkit < 312){
                safariVersion = 1.2;
            } else if (engine.webkit < 412){
                safariVersion = 1.3;
            } else {
                safariVersion = 2;
            }   
            
            browser.safari = browser.ver = safariVersion;        
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
        engine.ver = browser.ver = RegExp["$1"];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){    
        engine.ver = RegExp["$1"];
        engine.gecko = parseFloat(engine.ver);
        
        //determine if it's Firefox
        if (/Firefox\/(\S+)/.test(ua)){
            browser.ver = RegExp["$1"];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)){    
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
    if (system.win){
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
            if (RegExp["$1"] == "NT"){
                switch(RegExp["$2"]){
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
            } else if (RegExp["$1"] == "9x"){
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
    if (system.win == "CE"){
        system.winMobile = system.win;
    } else if (system.win == "Ph"){
        if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
            system.win = "Phone";
            system.winMobile = parseFloat(RegExp["$1"]);
        }
    }
    
    
    //determine iOS version
    if (system.mac && ua.indexOf("Mobile") > -1){
        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
            system.ios = parseFloat(RegExp.$1.replace("_", "."));
        } else {
            system.ios = 2;  //can't really detect - so guess
        }
    }
    
    //determine Android version
    if (/Android (\d+\.\d+)/.test(ua)){
        system.android = parseFloat(RegExp.$1);
    }
    
    //gaming systems
    system.wii = ua.indexOf("Wii") > -1;
    system.ps = /playstation/i.test(ua);
    
    //return it
    return {
        engine:     engine,
        browser:    browser,
        system:     system        
    };

}();


var jPlayerAndroidFix = (function($) {
    var fix = function(id, media, options) {
        this.playFix = false;
        this.init(id, media, options);
    };
    fix.prototype = {
        init: function(id, media, options) {
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
            if($.jPlayer.platform.android) {

                // Fix playing new media immediately after setMedia.
                this.player.bind($.jPlayer.event.progress, function(event) {
                    if(self.playFixRequired) {
                        self.playFixRequired = false;

                        // Enable the contols again
                        // self.player.jPlayer('option', 'cssSelectorAncestor', self.cssSelectorAncestor);

                        // Play if required, otherwise it will wait for the normal GUI input.
                        if(self.playFix) {
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
                this.player.bind($.jPlayer.event.pause, function(event) {
                    if(self.endedFix) {
                        var remaining = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
                        if(event.jPlayer.status.currentTime === 0 || remaining < 1) {
                            // Trigger the ended event from inside jplayer instance.
                            setTimeout(function() {
                                self.jPlayer._trigger($.jPlayer.event.ended);
                            },0);
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
        setMedia: function(media) {
            this.media = media;

            // Apply Android fixes
            this.resetAndroid();

            // Set the media
            this.player.jPlayer("setMedia", this.media);
            return this;
        },
        play: function() {
            // Apply Android fixes
            if($.jPlayer.platform.android && this.playFixRequired) {
                // Apply Android play fix, if it is required.
                this.playFix = true;
                this.player.jPlayer("play");
            } else {
                // Other browsers play it, as does Android if the fix is no longer required.
                this.player.jPlayer("play");
            }
        },
        resetAndroid: function() {
            // Apply Android fixes
            if($.jPlayer.platform.android) {
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
