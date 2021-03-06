'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/cooperation');

		$stateProvider.
		 state('manage', {
			url:"/manage",
			templateUrl: 'template/manage/manage.html',
			controller: 'manageCtrl',
			data: {
				displayName: 'manage'
			},
			params: {
				'deptId': null,
				'ppid': null
			}
		});
		// .state('home.part', {
		// 	'url':"/part",
		// 	templateUrl: 'template/home/part.html',
		// 	controller: 'homeCtrl',
		// 	data: {
		// 		displayName: 'part'
		// 	}
		// })
		// .state('home.all', {
		// 	'url': "/all",
		// 	templateUrl: 'template/home/all.html',
		// 	controller: 'allCtrl',
		// 	data: {
		// 		displayName: 'all'
		// 	}
		// });
	}
]);