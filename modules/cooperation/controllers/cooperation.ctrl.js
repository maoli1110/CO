'use strict';
/**
 * 协作管理
 */
angular.module('core').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer',
    function ($scope, $http, $uibModal, $httpParamSerializer) {
    console.log('1111');
    
    $scope.selectPerson = function () {
    	//alert('111');
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_responsible.html',
    		controller:'selectresponsibleCtrl'
    	});
    }
    
       
}]).controller('selectresponsibleCtrl',['$scope', '$http', '$uibModalInstance',
	function ($scope, $http, $uibModalInstance) {
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}

		//http请求
//		$http({
//	            method: 'get',
//	            data:{'projid':'','sn':''},
//	            url: 'http://172.16.21.69:8080/bimco/rs/co/typeList/'
//	          }).then(function(result){
//	        	  console.log(result);
//	          });
//		
//		$.ajax({
//	         type: "get",  
//	         
//	         url: 'http://172.16.21.69:8080/bimco/rs/co/typeList/', 
//	         data: '',    
//	         dataType: 'JSONP',
//	         success: function(result) {
//	             alert(result);        
//	         },     
//	         error: function(XMLHttpRequest, textStatus, errorThrown) {
//	             alert(XMLHttpRequest.status);
//	             alert(XMLHttpRequest.readyState);
//	             alert(textStatus);
//	         }
//	     }); 
		
//		$http.get('http://172.16.21.69:8080/bimco/rs/co/typeList/').
//        success(function(data) {
//        	console.log(data);
//            $scope.greeting = data;
//        });
		
		$.ajax({
		    url: "http://172.16.21.69:8080/bimco/rs/co/typeList/",
		    type: "GET",
		    dataType: 'JSONP',
		    success: function(result){
		        jsontree = result;
		    }
		});
		var obj = {ppid:123,projType:12};
		var obj1 = JSON.stringify(obj);
		console.log(obj1);
		$http.post('http://localhost:8080/bimco/rs/co/floorCompClassList',obj1,{
            transformRequest: angular.identity}).success(function(data) {
			console.log(data);
		});
//		$.ajax({
//			 contentType: "application/json; charset=utf-8",
//		 	 dataType : 'json',
//
//		    url: "http://localhost:8080/bimco/rs/co/floorCompClassList",
//		    type: "POST",
//		    data: obj1,
// 
//		    success: function(result){
//		        console.log(result);
//		    }
//		});
		
		
}]);