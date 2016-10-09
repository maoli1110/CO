/**
 * linkbeCtrl
 */
var level = 0;	// 当前树状态树展开、折叠深度
//var checkAll = 0; // 是否全选 
angular.module('cooperation').controller('linkbeCtrl', ['$scope', '$http', '$uibModalInstance','Cooperation','items','$timeout',
	 function ($scope, $http, $uibModalInstance,Cooperation,items,$timeout) {
	 	$scope.selectedOption = {};
	 	$scope.projectOption = null;
	 	$scope.projectSelected = {};
		$scope.currentPage = 1; //默认第一页
		$scope.deptInfo = {
			availableOptions:[]
		};
		$scope.projectList = {
			availableOptions:[]
		};
		$scope.totalItems = 0;
		var deptId, ppid;
		var setting = {  
			view:{
				selectedMulti: false
			},
			check: {
				enable: true
			},
			callback:{
				onCheck: onCheck,
				onCollapse: function (event, treeId, treeNode) {
				    level=treeNode.level;
				},
				onExpand: function (event, treeId, treeNode) {
				    level=treeNode.level;
				}
			}
         };
	     var treeObj,nodes,params;
	     var selectedItem = [];
	     //组合查询条件
	     var queryData = {
	     	ppid: '',
	     	tagids:[],
	     	searchText:'',
	     	pageInfo:{}
	     };

        //获取项目部
		Cooperation.getDeptList().then(function (data) {
			$scope.deptInfo.availableOptions = data;
			$scope.selectedOption = $scope.deptInfo.availableOptions[0].deptId+'';
			//默认工程列表
			deptId = $scope.selectedOption;
			if(deptId){
                        $timeout(function() {
                            $('.selectpicker1').selectpicker({
                                style: '',
                                size: 'auto'
                            });
                        },0);
                     }
			Cooperation.projectList(deptId).then(function (data) {
					$scope.projectList.availableOptions = data;
					$scope.projectOption = $scope.projectList.availableOptions[0].ppid+'';
					ppid = data[0].ppid;
					if(ppid){
                        $timeout(function() {
                            $('.selectpicker2').selectpicker({
                                style: '',
                                size: 'auto'
                            });
                        },0);
                     }
                    initProjectSelected(data[0]);
					//获取BE资料树
					//getDocTagList(ppid);
			});
		});

        //根据条件获取资料列表
        var getDocList = function () {
			//组合搜索条件
			queryData.ppid = $scope.projectOption;
			queryData.tagids = selectedItem;
			queryData.searchText = $scope.searchname;
			queryData.pageInfo = {
				currentPage:$scope.currentPage?$scope.currentPage:1,
				pageSize:10
			};
			Cooperation.getDocList(queryData).then(function (data) {
				$scope.docList = data.result;
				var typeArr = ['txt','doc','pdf','ppt','docx','xlsx','xls','pptx','jpeg','bmp','PNG','GIF','JPG','TXT','DOC','PDF','PPT','DOCX','XLSX','PPTX','JPEG','BMP','png','jpg','gif','dwg','rar','zip','avi','mp4','mov','flv','swf','wmv','mpeg','mpg','mp3'];
				angular.forEach(data.result, function (value, key) {
						if(typeArr.indexOf(value.fileType) == -1) {
							value.fileType = 'other';
						}

				});
				$scope.totalItems = data.pageInfo.totalNumber;
			});
	 	}

	 	//分页显示
	 	$scope.pageChanged = function () {
	 		getDocList();
	 	}

        function onCheck (event, treeId, treeNode) {
			treeObj = $.fn.zTree.getZTreeObj("tree");
			//选中节点(check)
			nodes = treeObj.getCheckedNodes(true);
			//type=2的节点
			var unit = _.filter(nodes, function(o){
				return o.type === 2
			});
//			console.log(unit)
			var tempselectedItem = [];
			angular.forEach(unit, function(value,key) {
				//左侧树选中的节点
				tempselectedItem.push(value.value);
			});
			selectedItem = tempselectedItem;
			if(selectedItem.length){
				getDocList();
			} else {
				$scope.$apply(function() {
					$scope.totalItems = 0;
					$scope.docList = [];
				});
			}
			
	 	}
	 	//选中需要上传的资料
	 	var a = _.cloneDeep(items);
	 	//var docSelected = [];
	 	var docSelected = a?a:[];
        var updateSelected = function(action,id,name){
        	var findIndex = _.findIndex(docSelected,id);
            if(action == 'add' && findIndex == -1){
               docSelected.push(id);
           	}
            if(action == 'remove' && findIndex!=-1){
                var idx = docSelected.indexOf(id);
                docSelected.splice(findIndex,1);
            }
         }
 
        $scope.updateSelection = function($event, id){
        	//debugger;
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id,checkbox.name);
            console.log(docSelected);
        }
 
        $scope.isSelected = function(id){
//        	console.log('id', _.findIndex(docSelected,id))
            return _.findIndex(docSelected,id)>=0;
        }

        $scope.docSearch = function () {
        	getDocList(queryData);
        }

        $scope.ok = function () {
		    $uibModalInstance.close(docSelected);
		};
		//根据deptId取工程列表
	 	$scope.switchDept = function (params) {
	 		deptId = params;
			Cooperation.projectList(params).then(function (data) {
				//debugger
				$scope.projectList.availableOptions = data;
				$scope.projectOption = data[0].ppid+'';
				//getDocTagList(data[0].ppid);
				initProjectSelected(data[0]);
			  	
			});
	 	}

	 	$scope.changeSelected = function(item) {
	 		initProjectSelected(item);
	 		$scope.isCollapsed = false;
	 	}

	 	function initProjectSelected(data) {
	 		$scope.projectSelected.projectName = data.projectName;
			$scope.projectOption = data.ppid;
				if(data.projectType=='土建预算'){
					$scope.projectSelected.typeImg = 'imgs/icon/1.png';
				} else if(data.projectType=='钢筋预算') {
						$scope.projectSelected.typeImg = 'imgs/icon/2.png';
				} else if(data.projectType=='安装预算') {
						$scope.projectSelected.typeImg = 'imgs/icon/3.png';
				} else if(data.projectType=='Revit') {
						$scope.projectSelected.typeImg = 'imgs/icon/4.png';
				} else if(data.projectType=='Tekla') {
						$scope.projectSelected.typeImg = 'imgs/icon/5.png';
				} 

	 	}



	 	//选择BE资料-工程所属资料标签树
	 	var getDocTagList = function (params) {
	 		Cooperation.getDocTagList(params).then(function (data) {
	 			var treeObj = $.fn.zTree.init($("#tree"), setting, data);
				//全部打开
//				treeObj.expandAll(false);
	 			// 只打开第一层节点
	 			treeObj.expandNode(treeObj.transformToArray(treeObj.getNodes())[0],true,false,true,false)
	 		});
	 	}
	 	$scope.switchPpid = function (projectOption) {
			ppid = projectOption;
			getDocTagList(ppid);
		}
	 	

	 	$scope.$watch('projectOption',function(newVal,oldVal){
	 		if(newVal != null){
	 			$scope.switchPpid($scope.projectOption);
	 		}
		});

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			 $('.check-now').click(function(){
				$(this).css('background',"#eceef0").siblings().css("background",'#fff')
			 })

		});
		
		// 展开树节点
	 	$scope.expand = function () {
	 		var obj = {type:"expand",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 		$('#content-a6')[0].scrollTop=0;
	 	}
	 	
	 	// 收起树节点
	 	$scope.collapse = function () {
	 		var obj = {type:"collapse",operObj:"tree", level: level};
	 		level = Cooperation.openOrClose(obj);
	 		$('#content-a6')[0].scrollTop=0;
	 	}
	 	
	 	//全选
	 	/*$scope.checkAllNodes = function() {
	        var treeObj = $.fn.zTree.getZTreeObj("tree");
	        if(checkAll % 2 == 0) {
	        	treeObj.checkAllNodes(true);
	        } else {
	        	treeObj.checkAllNodes(false);
	        }
	        checkAll++;
	    }*/
	 	$scope.myKeyup = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13 || $('#linkbeSear').val()==''){
            	$scope.docSearch();
            }
        };

}]);
