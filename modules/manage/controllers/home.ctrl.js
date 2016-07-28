'use strict';
/**
 * 概况
 */
angular.module('home').controller('homeCtrl', ['$scope', 'Home', '$http',
    function ($scope, Home, $http) {

       $scope.resultList = [];
       $scope.cycleList = [1, 2, 3, 4, 5];
       $scope.cycle = $scope.cycleList[4]; // 周期数
       
       $scope.year = {
        list: [2012, 2013, 2014, 2015, 2016],
        init: 2012
       };

       $scope.$watch('cycle', function (val) {
        $scope.cycleCount = new Array(val);
       });

        //获取数据
        $scope.getTest = function () {
          console.log('success');
          var data= {"name": "彭佳佳", "age": 25, "birthDate": 694742400000, "tel": "15221113063"};
          Home.getData(data).then(function(res) {
            console.log('data is update');
          })
        };

        var x = 0;
        $http.get('../data.json').success(function (data) {
          for (var i = 0; i < data.length; i++) {
            flatten(data[i], null, $scope.resultList);
          }
          console.log($scope.resultList); // 最终循环数组
          // addSerial($scope.resultList);
          resetArray($scope.resultList);

        });

        // function addSerial(array) {
        //   var s = 1;
        //   for (var i = 0; i < array.length; i++) {
        //     if (array[i].level === 1) {
        //       array[i].s = s;
        //       s++;
        //     }
        //   }
        // }

        /**
         * originArray: 需要打平的原数据
         * result: 结果数组
         * serial: 每个一级分类下的序列 初始为0
         */
        function flatten(originArray, parentNode, result, serial) {
          var newNode = _.cloneDeep(_.omit(originArray, 'children'));
          
          if (parentNode) {
            newNode.parent = parentNode;
            newNode.level = parentNode.level + 1;
          } else {
            newNode.level = 0;
          }

          if (newNode.level === 1) {
            newNode.serial = x;
          }

          result.push(newNode);
          if (originArray.children && originArray.children.length) {
            for (var i = 0; i < originArray.children.length; i++) {
              if (newNode.level === 0) {
                x++;
              }
              var childNode = originArray.children[i];
              flatten(childNode, newNode, result, x);
            }
          }
        }

        //var resetArray = $scope.resultList;

        function resetArray(array) {
            for (var i = 0; i<array.length; i++){
              //console.log(array[i]);
              if(array[i].dataSet){
                array[i].sum = eval(array[i].dataSet.join('+'));
               // console.log('dataSet on');
              }
            }
        }
        console.log('look');
        console.log($scope.data);


        $scope.save = function() {
            console.log('hihihi i am save');
            console.log($scope.resultList);
        }
    }]);