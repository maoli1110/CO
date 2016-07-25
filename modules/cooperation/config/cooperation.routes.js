'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/cooperation');

		$stateProvider.
		 state('cooperation', {
			url:"/cooperation",
			templateUrl: 'template/cooperation/cooperation.html',
			controller: 'manageCtrl',
			data: {
				displayName: 'cooperation'
			}
		})
		.state('newcopper', {
			'url':"/newcopper",
			templateUrl: 'template/cooperation/newcopper.html',
			controller: 'coopreationCtrl',
			data: {
				displayName: 'newcopper'
			}
		});
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