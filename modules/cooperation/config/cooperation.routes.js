'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/manage');

		$stateProvider.
		 state('cooperation', {
			url:"/cooperation",
			templateUrl: 'template/cooperation/cooperation.html',
			controller: 'coopreationCtrl',
			data: {
				displayName: 'cooperation'
			}
		})
		.state('newcopper', {
			'url':"/newcopper/:typeid",
			templateUrl: 'template/cooperation/newcopper.html',
			controller: 'newcoopreationCtrl',
			data: {
				displayName: 'newcopper'
			}
		})
		.state('coopdetail', {
			'url':"/coopdetail/?coid",
			templateUrl: 'template/cooperation/coop-detail.html',
			controller: 'coopdetailCtrl',
			data: {
				displayName: 'coopdetail'
			}
		}).state("editDetail",{
			'url':"/editdetail/?coid",
			templateUrl:"template/cooperation/coopeditdetail.html",
			controller:"editdetailCtrl"
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