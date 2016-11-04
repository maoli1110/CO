'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider) {
		
		$urlRouterProvider.otherwise('/cooperation');

		$stateProvider.
		 state('cooperation', {
			url:"/cooperation?deptId&ppid&source",
			templateUrl: 'template/cooperation/cooperation.html',
			controller: 'coopreationCtrl',
			data: {
				displayName: 'cooperation'
			},
			params: {
				'deptId': null,
				'ppid': null,
				'status':null,
				'transignal': null,
				'source':null
			}
		})
		.state('newcopper', {
			'url':"/newcopper?typeid",
			templateUrl: 'template/cooperation/newcopper.html',
			controller: 'newcoopreationCtrl',
			data: {
				displayName: 'newcopper'
			},
			params:{
				typeid:null,
				typename:null,
				deptId:null,
				ppid:null,
				deptName:null,
				ppidName:null
			}
		})
		.state('coopdetail', {
			'url':"/coopdetail/?coid",
			templateUrl: 'template/cooperation/coop_detail.html',
			controller: 'coopdetailCtrl',
			data: {
				displayName: 'coopdetail'
			},
			params: {
				'deptId':null,
				'ppid':null,
				'coid':null
			}
		}).state("editdetail",{
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
])
// .run(function($rootScope){
// 	$rootScope
//         .$on('$viewContentLoading',
//             function(event, viewConfig){ 
//                 console.log("View Load: the view is loading, and DOM rendered!");
//         });

//     $rootScope
//         .$on('$viewContentLoaded',
//             function(event, viewConfig){ 
//                 console.log("View Load: the view is loaded, and DOM rendered!");
//                 alert('9090')
//         });
// });