'use strict';

var ApplicationConfiguration = (function(){
	// 应用程序名和依赖
	var applicationModuleName = 'appname';
	var applicationModuleVendorDependencies = ['ui.router', 'ui.bootstrap', 'angularFileUpload', 'i18n', 'alert', 'z.breadcrumbs'];

	// 添加新模块
	var registerModule = function(moduleName, dependencies) {
		angular.module(moduleName, dependencies || []);
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	var urls = {
        apiUrl: 'http://172.16.21.69:8080/bimco/rs/co/',
        //coUrl: 'http://172.16.21.69:8080/bimco/'
        // wwwUrl: 'https://www.suncloud.cn',
        // panelApiUrl: 'https://panel.suncloud.cn/api/index.php?r=',
        // loginUrl: 'https://passport.suncloud.cn/index.php?client_id=panel'
    };

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,
		urls:urls

	};


})();