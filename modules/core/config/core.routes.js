'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/cooperation');

		$stateProvider.
		 state('login', {
			url:"/",
			templateUrl: 'template/core/login.html',
			data: {
				displayName: 'login'
			}
		});
	}
]);