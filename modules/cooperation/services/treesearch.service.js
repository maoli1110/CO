'use strict';

angular.module('cooperation').service('TreeSearch', function ($http, $q, Cooperation) {
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
    //根据全部专业分类ppid
    this.projTypeSwitch = function (n) {
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


});