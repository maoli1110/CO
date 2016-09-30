'use strict';

angular.module('cooperation').service('Cooperation', function ($http, $q) {
    
    var url = basePath;
 
    //url="http://172.16.21.69:8080/bimco";
    /**
     *获取项目部列表
     */
    this.getDeptInfo = function () {
        var delay = $q.defer();
        var url_join= url+"rs/co/deptInfoList";
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    //获取新建页面项目部列表
    this.getDeptList = function () {
        var delay = $q.defer();
        var url_join= url+"rs/co/deptList";
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    //获取项目部下对应的联系人列表
    this.getUserList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'rs/co/pcUserList';
        var params = JSON.stringify(params);
        $http.post(url_join,params,{cache:true,transformRequest:angular.identity})
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
        });
        return delay.promise;
    }

    //获取项目部下工程列表
    this.projectList = function (params) {
        var delay = $q.defer();
        var url_join = url +'rs/co/projectList/'+ params;
        $http.get(url_join,{cache:false})
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    
    //获取项目下工程
    this.getProjectList = function(params){
        var delay = $q.defer();
        var url_join = url+'rs/co/projectInfoList/'+params;
        $http.get(url_join).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        })
        return delay.promise;
    }

    //获取bv
    this.getBVRectifyStatus = function(){
        var delay = $q.defer();
        var url_join = url+'rs/co/getBVRectifyStatus';
        $http.get(url_join,{cache:true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        })
        return delay.promise;
    }
    //获取协同列表
    this.getCollaborationList = function (params) {
        var params = JSON.stringify(params);
        var delay = $q.defer();
        var url_join = url + 'rs/co/collaborationList';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //选择BE资料-工程所属资料标签树
    this.getDocTagList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'rs/co/docTagList/' + params;
        $http.get(url_join)
            .success(function (data) {
            	// 添加全部跟节点
            	var allNode = {name:"全部", value:"全部", type:1, children:data};
                delay.resolve(allNode);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取工程对应资料列表
    this.getDocList = function (params) {
        var delay = $q.defer();
        var params = JSON.stringify(params);
        var url_join = url + 'rs/co/docList';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //获取工程树节点
    this.getProjectTree = function () {
        var delay = $q.defer();
        var url_join = url + 'rs/co/projectTree';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取构件
    this.getFloorCompClassList = function (params) {
        var delay = $q.defer();
        var url_join = url + 'rs/co/floorCompClassList';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //获取协作详情列表
    this.getCollaboration = function (coid) {
        var delay = $q.defer();
        // var url_join= tempUrl + 'detail/' + coid;
        var url_join= url + 'rs/co/detail/' + coid;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };

    //获取类型列表
    this.getTypeList = function () {
        var delay = $q.defer();
        var url_join= url + 'rs/co/typeList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    //获取选择表单列表
    this.getTemplateNode = function (params) {
        var delay = $q.defer();
        var url_join= url + 'rs/co/template/' + params + '/pdf';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }


    //创建协作
    this.createCollaboration = function (params) {
        var delay = $q.defer();
        var url_join = url + 'rs/co/collaboration';
        $http.post(url_join,params,{transformRequest: angular.identity, transformResponse: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }

    //获取标识
    this.getMarkerList = function (params) {
        var delay = $q.defer();
        var url_join= url + 'rs/co/markers';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    //获取优先级列表
    this.getPriorityList = function () {
        var delay = $q.defer();
        var url_join= url + 'rs/co/priorityList';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }
    //获取有相关功能的工程列表 
    this.getProjTipInfo = function (params) {
        var delay = $q.defer();
        var url_join = url + 'rs/co/getProjTipInfo';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }

    //获取筛选动态列表
    this.getCoQueryFilter = function (params) {
        var delay = $q.defer();
        var params = JSON.stringify({queryBvToPc:true});
        var url_join = url + 'rs/co/coQueryFilter';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    
    //编辑协作
    this.updateCollaboration = function (params) {
        var delay = $q.defer();
        var params = JSON.stringify(params);
        var url_join = url + 'rs/co/updateCollaboration';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data, status) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
    //协作详情右侧动态列表
    this.getOperationList = function (coid) {
        var delay = $q.defer();
        var url_join= url + 'rs/co/operation/' + coid;
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    
    //更新评论
    this.commentToCollaboration = function (params) {
        var delay = $q.defer();
        var params = JSON.stringify(params);
        var url_join = url + 'rs/co/commentToCollaboration';
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise; 
    }

    //获取系统时间
    this.getCurrentDate = function () {
        var cDate = new Date();
        //console.info($scope.date)
        var cYear = cDate.getFullYear();
        var cMouth = cDate.getMonth()+1;
        var cDay = cDate.getDate();
        var cWeekday=new Array(7);
        cWeekday[0]="星期日";
        cWeekday[1]="星期一";
        cWeekday[2]="星期二";
        cWeekday[3]="星期三";
        cWeekday[4]="星期四";
        cWeekday[5]="星期五";
        cWeekday[6]="星期六";
       var currentDate =  cYear+"年"+ cMouth+"月"+cDay+"日"+cWeekday[cDate.getDay()];
       return currentDate;
    }
    //统计页面获取数据
    this.getCoStatisticsInfo = function(params){
        var delay = $q.defer();
        var url_join = url + "rs/co/coStatistics";
        var params = JSON.stringify(params);
        $http.post(url_join,params,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
            //console.info("统计页面",data)
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }

    // 协作操作 PC/BV 签署／签名／通过／拒绝／结束 PC/BV
    this.doCollaboration = function(params){
        var delay = $q.defer();
        var url_join = url + "rs/co/doCollaboration";
        var params = JSON.stringify(params);
         $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }

    //获取签名uuid
    this.getSignature = function () {
       var delay = $q.defer();
        var url_join= url + 'rs/co/signature';
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    }

    // 获取服务器时间
    this.getTrendsSystem = function(params){
        var delay = $q.defer();
        var url_join = url + "rs/trends/system";
        var obj = JSON.stringify(params);
        $http.get(url_join,obj,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }

    //签入
    this.checkIn = function(coid){
        var delay = $q.defer();
        var url_join = url + "rs/co/checkIn/"+coid;
        var params = JSON.stringify(params);
        $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }

    //签出
    this.checkOut = function(coid){
        var delay = $q.defer();
        var url_join = url + "rs/co/checkOut/"+coid;
        var params;
        // var params={"coid":coid}
        // var params = JSON.stringify(params);
       $http.post(url_join,params,{transformRequest: angular.identity}).success(function (data) {
            delay.resolve(data);
        }).error(function (data) {
            delay.reject(data);
        });
        return delay.promise;
    }
//    草稿箱信息删除
    this.removeDraft = function(coid){
        var delay = $q.defer();
        var url_join = url + "rs/co/removeDraft/"+coid;
        var params;
        $http.get(url_join,params,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }
    //获取当前用户信息
    this.getCurrentUser = function(){
        var delay = $q.defer();
        var url_join = url + "rs/co/currentUser";
        $http.get(url_join,{},{transformRequest: angular.identity, transformResponse: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(err){
            delay.reject(err)
        })
        return delay.promise;
    }
    //选择分公司
    this.getOrgInfo = function(){
        var delay = $q.defer();
        var url_join = url+'rs/co/orgInfo';
        $http.get(url_join,{},{transformRequest: angular.identity, transformResponse: angular.identity}).success(function(data){
            delay.reject(data)
            console.info('rerrwrwr',data)
        }).error(function(err){
            delay.resolve(err)
        })
        return delay.promise;
    }
    //获取指定的UUID的下载地址
//    this.getDownFileUrl = function (uuids){
//    	var delay = $q.defer();
//    	var url_join = url + "rs/co/downFileUrl";
//    	$http.post(url_join,uuids,{transformRequest: angular.identity}).then(function(data){
//    		delay.resolve(data);
//    	},function(err){
//            delay.reject(err);
//        })
//        return delay.promise;
//    }
    
    // 树节点展开或关闭  e={type:"",operObj:"",level: 1}  
    // 展开e.type="expand"  收起e.type="collapse"		e.operObj对应树节点信息ul的id
    // e.level:当前展开到第几层 
    this.openOrClose = function (e){
    	var level = e.level;	// 当前展开到第几层
    	var type = e.type;	// 展开e.type="expand"  收起e.type="collapse"
    	var operObj = e.operObj;	// e.operObj对应树节点信息ul的id
    	
    	var zTree = $.fn.zTree.getZTreeObj(operObj);
    	var treeNodes = zTree.transformToArray(zTree.getNodes());
    	var flag=true;
    	var maxLevel=-1;	// 该树的最大层数
    	//点击展开、折叠的时候需要判断一下当前level的节点是不是都为折叠、展开状态
    	for (var i = 0;i < treeNodes.length; i++) {
    		if(treeNodes[i].level >= maxLevel){	// 获取状态树的深度
				maxLevel = treeNodes[i].level;
			}
    		if(treeNodes[i].level == level && treeNodes[i].isParent){
    			if (type == "expand" && !treeNodes[i].open) {
    				flag=false;
    				break;
    			} else if (type == "collapse" && treeNodes[i].open) {
    				flag=false;
    				break;
    			}
    		}
    	}
    	if(flag){
    		//说明当前level的节点都为折叠或者展开状态
    		if(type == "expand"){
    			if(level < maxLevel-1){
    				level++;
    			}
    		}else if(type == "collapse"){
    			if(level == 0){
    				return level;
    			}
    			level--;
    		}
    	}
    	for (var i = 0;i < treeNodes.length; i++) {
    		if(treeNodes[i].level == level && treeNodes[i].isParent){
    			if (type == "expand" && !treeNodes[i].open) {
    				zTree.expandNode(treeNodes[i], true, false, null, true);
    			} else if (type == "collapse" && treeNodes[i].open) {
    				zTree.expandNode(treeNodes[i], false, false, null, true);
    			}
    		}
    	}
    	return level;
    }
    
    // 展开全部节点，并返回当前展开层数 即最大层数
    this.expandAll = function(treeId) {
    	var treeObj = $.fn.zTree.getZTreeObj(treeId);
		//全部打开
		treeObj.expandAll(true);
		// 设置当前打开的层数
		var treeNodes = treeObj.transformToArray(treeObj.getNodes());
		for(var i = 0 ; i<treeNodes.length;i++){
			if(treeNodes[i].level >= maxLevel){
				maxLevel = treeNodes[i].level;
			}
		}
    	return maxLevel;
    }


});