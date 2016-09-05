'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider) {
		
		$urlRouterProvider.otherwise('/cooperation');

		$stateProvider.
		 state('cooperation', {
			url:"/cooperation",
			templateUrl: 'template/cooperation/cooperation.html',
			controller: 'coopreationCtrl',
			data: {
				displayName: 'cooperation'
			},
			params: {
				'deptId': null,
				'ppid': null,
				'transignal': null
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
			templateUrl: 'template/cooperation/coop_detail.html',
			controller: 'coopdetailCtrl',
			data: {
				displayName: 'coopdetail'
			}
		}).state("editDetail",{
			'url':"/editdetail/?coid",
			templateUrl:"template/cooperation/coop_editdetail.html",
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

		//$locationProvider.html5Mode(true);

	}
]);