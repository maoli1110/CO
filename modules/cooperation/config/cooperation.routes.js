'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider) {
		
		$urlRouterProvider.otherwise('/cooperationNew/threeCloumn');

		$stateProvider
		.state('cooperationNew', { //(新)3栏，2栏的父级路由(新增协作路由及页面,之前的路由保留)
			url:"/cooperationNew?deptId&ppid&source",
			templateUrl: 'template/cooperation/cooperationNew.html',
			controller: 'coopreationNewCtrl',
			data: {
				displayName: 'coopercolumnModeCtrl' 
			},
			params: {
				'deptId': null,
				'ppid': null,
				'status':null,
				'transignal': null,
				'source':null
			}
		})
		.state('cooperationNew.threeCloumn', {   //三栏
			url:"/threeCloumn",
			templateUrl: 'template/cooperation/three_cloumn.html',
			data: {
				displayName: 'threeCloumn'
			}
		})
		.state('cooperationNew.secondCloumn', {  //两栏
			url:"/secondCloumn",
			templateUrl: 'template/cooperation/second_cloumn.html',
			data: {
				displayName: 'secondCloumn'
			}
		})
		.state('cooperationNew.detail', {  //详情
			url:"/detail/?coid&source",
			templateUrl: 'template/cooperation/coop_detail_pc.html',
			data: {
				displayName: 'detail'
			},
			params: {
				'deptId':null,
				'ppid':null,
				'coid':null
			}
		})
		.state('coopdetail', {
			url:"/coopdetail/?coid&source",
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
			url:"/editdetail/?coid",
			templateUrl:"template/cooperation/coop_editdetail.html",
			controller:"editdetailCtrl"
		}).state('sharedetail', {
			url:"/sharedetail/?coid",
			templateUrl: 'template/cooperation/share_detail.html',
			controller: 'sharedetailCtrl',
			data: {
				displayName: 'sharedetail'
			},
			params: {
				'deptId':null,
				'ppid':null,
				'coid':null
			}
		})
	}
]);