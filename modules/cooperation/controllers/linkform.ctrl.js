/**
 * linkformCtrl
 */
angular.module('cooperation').controller('linkformCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items','$timeout',
	 function ($scope, $http, $uibModalInstance,Cooperation,items,$timeout) {
//	 	console.log(items);
	 	//默认模版类型
	 	$scope.selectedTypeId = items.typeid;
	 	Cooperation.getTypeList().then(function (data) {
	 		$scope.typeList = data;
	 		$timeout(function(){
	 			$('.selectpicker').selectpicker({
	 				style:'',
	 				size:'auto'
	 			});
	 		});
	 	});

	 	Cooperation.getTemplateNode(items.typeid).then(function (data) {
	 		$scope.templateNode = data;
	 	});
	 	
	 	$scope.switchType = function (selectedTypeId) {
	 		Cooperation.getTemplateNode(selectedTypeId).then(function (data) {
		 		$scope.templateNode = data;
		 	});
	 	}

	 	//选中表单中需要上传的资料
	 	var a = _.cloneDeep(items.formSelectedList);
	 	var formSelected = a?a:[];
        var updateSelected = function(action,id,name){
        	var findIndex = _.findIndex(formSelected,id);
            if(action == 'add' && findIndex == -1){
               formSelected.push(id);
           	}
             if(action == 'remove' && findIndex!=-1){
                formSelected.splice(findIndex,1);
             }
         }
 
        $scope.updateSelection = function($event, id){
        	//debugger;
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
//            console.log(formSelected);
        }
 
        $scope.isSelected = function(id){
//        	console.log('_.findIndex(formSelected,id)',_.findIndex(formSelected,id));
            return _.findIndex(formSelected,id)>=0;
        }

        $scope.ok = function () {
        	$uibModalInstance.close(formSelected);
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}
		$scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
			$(".tab-tr").on("click",function(){
				$(this).css('background',"#eceef0").siblings().css("background",'#fff')
			})
		})
}]);