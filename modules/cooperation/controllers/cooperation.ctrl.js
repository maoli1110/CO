'use strict';
/**
 * 协作管理
 */
angular.module('cooperation').controller('coopreationCtrl', ['$scope', '$http', '$uibModal','$httpParamSerializer','FileUploader','Cooperation',
    function ($scope, $http, $uibModal, $httpParamSerializer,FileUploader,Cooperation) {
    console.log('1111');
    
    $scope.selectPerson = function () {
    	//alert('111');
    	var modalInstance = $uibModal.open({
    		backdrop : 'static',
    		templateUrl: 'template/cooperation/select_person_responsible.html',
    		controller:'selectresponsibleCtrl'
    	});
    }

    var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php',
   			queueLimit: 2
        });
    
    $scope.fileUpload = function () {
    	$('.upload-img').attr('uploader', 'uploader');
    	$('.upload-img').attr('nv-file-select', '');
    	$('.upload-img').click();
    }
       
}]).controller('selectresponsibleCtrl',['$scope', '$http', '$uibModalInstance','Cooperation',
	function ($scope, $http, $uibModalInstance,Cooperation) {

		//设置默认值
		$scope.selectedOption = {};
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.userList = [];
		
		
		//获取项目部
		Cooperation.getDeptInfo().then(function (data) {
			console.log(data);
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0];
		});


		$http.get('a.json').then(function (data) {
			console.log(data.data)
			$scope.userList = data.data;
		});

		$scope.switchUsers = function (params) {
			var deptId = params.deptId;
			Cooperation.getUserList(deptId).then(function (data) {
				$scope.userList = data;
			});
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		}

		$scope.changeStaus = function (id, pid, user) {

			angular.forEach($scope.userList, function(value,key) {
					for(var i = 0; i< value.users.length;i++){
						if(key == pid && i == id){
							value.users[i].add = true;
						} else {
							value.users[i].add = false;
						}
					}
			});
			console.log('userList',$scope.userList);
			
		}
		


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
		
		// $.ajax({
		//     url: "http://172.16.21.69:8080/bimco/rs/co/userList/1",
		//     type: "GET",
		//     success: function(result){
		//       console.log(result);
		//     }
		// });

		var obj = {ppid:123,projType:12};
		var obj1 = JSON.stringify(obj);
		console.log(obj1);
		// $http.post('http://localhost:8080/bimco/rs/co/floorCompClassList',obj1,{
  //           transformRequest: angular.identity}).success(function(data) {
		// 	console.log(data);
		// });


		// $.ajax({
		// 	contentType: "application/json; charset=utf-8",
		// 	data: '{"ppid":123,"projType":12}',
		//  	dataType : 'json',
		//     url: "http://172.16.21.69:8080/bimco/rs/co/floorCompClassList",
		//     type: "POST",
		//     success: function(result){
		//         console.log(result);
		//     }
		// });
		
		//传true false
		// $.ajax({
		// 	contentType: "text/plain; charset=utf-8",
		// 	data: '{"queryFromBV": true}',
		//  	dataType : 'json',
		//     url: "http://172.16.21.69:8080/bimco/rs/co/coQueryFilter",
		//     type: "POST",
		//     success: function(result){
		//         console.log(result);
		//     }
		// });
		
		
}]);