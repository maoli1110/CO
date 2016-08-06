'use strict';

angular.module('cooperation').service('Treesearch', function ($http, $q, Cooperation) {
    var url = ApplicationConfiguration.urls.apiUrl;
    var coUrl = ApplicationConfiguration.urls.coUrl;
    var tempUrl = 'http://192.168.13.222:8080/bimco/rs/co/';

    //即时搜索
    function searchByText(){
         var shownodes = treeObj.getNodesByFilter(filterchild);
         var TextSearchPpid=[];
         for(var i=0;i<shownodes.length;i++){
            var str2 = shownodes[i].value.split("-")[2];
            TextSearchPpid.push(str2);
         }
         return TextSearchPpid;
    }
    //筛选出type=3的所有节点
    function filterhidechild(node) {
        return (node.type == 3);
    }
    //根据type=3,ppid来筛选
    function filterbyppid(node) {
        return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
    }
    
    this.treesearchCommon = function (treeObj,type,nodelist,projtype,functionOption,formText,projTypeSearchPpid,initPpid,TextSearchPpid,functionSearchPpid,searchPpid,tjnodestore,gjnodestore,aznodestore,revitnodestore,teklanodestore,pdfppidstore,maxlevel) {
        treeObj.showNodes(nodelist);
        console.log(initPpid.length);
            //根据专业查询对应子节点
            //debugger;
            if(type==1){
                if(projtype==0){
                    projTypeSearchPpid  = initPpid;
                }else{
                    projTypeSearchPpid = projTypeSwitch(parseInt(projtype));
                }
            }
            //根据功能进行同步请求查询对应子节点
            if(type==2){
                if(functionOption==0){
                    functionSearchPpid = initPpid;
                }else{
                    var projTypeTextPpid = _.intersection(projTypeSearchPpid,TextSearchPpid);
                    functionSearchPpid =[];
                    functionFilter(projTypeTextPpid);
                }
                
            }
            //根据条件查询对应子节点
            if(type==3){
                if(formText==""||formText==null||formText=="underfined"){
                    TextSearchPpid = initPpid;
                }else{
                    TextSearchPpid = searchByText();
                }
            }
            searchPpid =  _.intersection(projTypeSearchPpid,functionSearchPpid,TextSearchPpid);
            var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
            var hidenodes = treeObj.getNodesByFilter(filterhidechild);
            treeObj.hideNodes(hidenodes);
            treeObj.showNodes(showchildnodes);
            hideparentnode();

            function projTypeSwitch (n) {
            switch(n)
                {
                case 0:
                    return null;
                case 1:
                    return tjnodestore;
                    break;
                case 2:
                    return gjnodestore;
                    break;
                case 3:
                    return aznodestore;
                    break;
                case 4:
                    return revitnodestore;
                    break;
                case 5:
                    return teklanodestore;
                    break;
                case 6:
                    return pdfppidstore;
                    break;
                }
            }
            //工程分类处理（按专业）
            function categoryprojtype(node){
                //debugger;
                if(maxlevel<node.level){//获取最大层级
                    maxlevel = node.level;
                }
                
                var str0 = node.value.split("-")[0];
                var str1 = node.value.split("-")[1];
                var str2 = node.value.split("-")[2];
                initPpid.push(str2);
                projTypeSearchPpid.push(str2);
                TextSearchPpid.push(str2);
                functionSearchPpid.push(str2);
                if(str1=='2'){
                    pdfppidstore.push(str2);
                }else if(str0=="1"){
                    tjnodestore.push(str2);
                }else if(str0=="2"){
                    gjnodestore.push(str2);
                }else if(str0=="3"){
                    aznodestore.push(str2);
                }else if(str0=="4"){
                    revitnodestore.push(str2);
                }else if(str0=="5"){
                    teklanodestore.push(str2);
                }
        }

        function searchByText(){
             var shownodes = treeObj.getNodesByFilter(filterchild);
             var TextSearchPpid=[];
             for(var i=0;i<shownodes.length;i++){
                var str2 = shownodes[i].value.split("-")[2];
                TextSearchPpid.push(str2);
             }
             return TextSearchPpid;
        }

        function filterbyppid(node) {
            return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[2])>-1);
        }

        var selectlevel;
        function hideparentnode(){
            for(var i=maxlevel-1;i>0;i--){
                selectlevel = i;
                var parentnodes = treeObj.getNodesByFilter(filterbylevel);
                var needhidenods = [];
                for(var j=0;j<parentnodes.length;j++){
                    var childnodes = parentnodes[j].children;
                    var ishide = true;
                    if(childnodes!=null){
                        for(var n=0;n<childnodes.length;n++){
                            if(childnodes[n].isHidden){
                                continue;
                            }else{
                                ishide=false;
                            }
                        }
                    }else{
                        ishide = true;
                    }
                    if(ishide){
                        needhidenods.push(parentnodes[j]);
                    }
                }
                treeObj.hideNodes(needhidenods);
            }
        }

        function filterbylevel(node) {
            return (node.level==selectlevel&&node.type!=3);
        }

        //全部功能筛选树结构
        function functionFilter (projTypeTextPpid) {
            var ppids = [];
            var data = {};
            var infoType = parseInt('1200'+ functionOption);
            data.infoType = infoType;
            data.ppids = projTypeTextPpid;
            data = JSON.stringify(data);
            // Cooperation.getProjTipInfo(data).then(function (data) {
            //  console.log(data);
            //  return data
            // });

            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType : 'json',
                type: "post",
                data:data,
                url: 'http://172.16.21.69:8080/bimco/rs/co/getProjTipInfo',
                async : false,
                success: function (data) {
                    for(var i=0;i<data.length;i++){
                        var ppid = data[i]+"";
                        functionSearchPpid.push(ppid);
                    }
                },
                error: function () {
                }
            });
        }

        function filterchild(node) {
            var searchname = formText;
            return (node.type == 3 && node.name.indexOf(searchname)>-1);
        }
        
    }

});