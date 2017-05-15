(function () {
  'use strict';

  angular
    .module('todoApp', [])
    .controller('ItemsController', ItemsController);

  function ItemsController($scope, $http) {

    var base_url = 'http://localhost:3005/'

      $http.get(base_url + 'tasks.json')
      .then(
        function (success) {
          $scope.tasks = success.data.reverse();
        },
        function (error) {
          console.log(error);
        }
      );

    $scope.addTask = function () {
      var data = {
        task: {
          description: $scope.description
        }
      }

      $http.post(base_url + 'tasks.json', data)
      .then(
        function (success) {
          $scope.tasks.unshift(success.data);
          $scope.description = '';
        },
        function (error) {
          console.log(error);
        }
      );
    };

    $scope.deleteTask = function (task) {
      $http.delete(base_url + 'tasks/' + task.id + '.json')
      .then(
        function (success) {
          var index = $scope.tasks.indexOf(task);
          $scope.tasks.splice(index, 1);
        },
        function (error) {
          console.log(error);
        }
      )
    };


    $scope.updateTask = function (task) {
      $http.patch(base_url + 'tasks/' + task.id + '.json', {task: task})
      .then(
        function (success) {
          console.log("Task was successfully updated!")
        },
        function (error) {
          console.log(error);
        }
      )
    };

    $scope.completed = function (task) {
      $http.patch(base_url + 'tasks/' + task.id + '.json', {task: task})
      .then(
        function (success) {
          console.log("Item was successfully completed!")
        },
        function (error) {
          console.log(error);
        }
      )
    };
  }
})();

