// Tasks Controller
angular
  .module('todoApp')
  .controller('TasksController', TasksController)

function TasksController($scope, $http, AuthService) {
  var baseUrl = 'http://localhost:3005/';
  $scope.current_user = AuthService.current_user;

  $scope.$on('current_user', function () {
    $scope.current_user = AuthService.current_user;
  });

  AuthService.sign_in(true);

  $http.get(baseUrl + 'tasks.json')
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
        user_id: $scope.current_user.id,
        description: $scope.description
      }
    };

    $http.post(baseUrl + 'tasks.json', data)
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
    $http.delete(baseUrl + 'tasks/' + task.id + '.json')
    .then(
      function (success) {
        var index = $scope.tasks.indexOf(task);
        $scope.tasks.splice(index, 1);
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.updateTask = function (task) {
    $http.patch(baseUrl + 'tasks/' + task.id + '.json', {task: task})
    .then(
      function (success) {
        toastr.success('Task was successfully updated!');
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.completed = function (task) {
    $http.patch(baseUrl + 'tasks/' + task.id + '.json', {task: task})
    .then(
      function (success) {
        console.log('Item was successfully completed!');
      },
      function (error) {
        toastr.error(error)
      }
    );
  };
}