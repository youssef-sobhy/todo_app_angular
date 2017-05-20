// Tasks Controller
angular
  .module('todoApp')
  .controller('TasksController', TasksController);

function TasksController($scope, $http, $log, toastr, AuthService) {
  var vm = this;
  var baseUrl = 'http://localhost:3005/';
  vm.currentUser = AuthService.currentUser;

  $scope.$on('currentUser', function () {
    vm.currentUser = AuthService.currentUser;
  });

  AuthService.signIn(true);

  $http.get(baseUrl + 'tasks.json')
    .then(
      function (success) {
        vm.tasks = success.data.reverse();
      },
      function (error) {
        $log.error(error);
      }
    );

  vm.addTask = function () {
    var data = {
      task: {
        user_id: vm.currentUser.id,
        description: vm.description
      }
    };

    $http.post(baseUrl + 'tasks.json', data)
    .then(
      function (success) {
        vm.tasks.unshift(success.data);
        vm.description = '';
      },
      function (error) {
        $log.error(error);
      }
    );
  };

  vm.deleteTask = function (task) {
    $http.delete(baseUrl + 'tasks/' + task.id + '.json')
    .then(
      function () {
        var index = vm.tasks.indexOf(task);
        vm.tasks.splice(index, 1);
      },
      function (error) {
        $log.error(error);
      }
    );
  };

  vm.updateTask = function (task) {
    $http.patch(baseUrl + 'tasks/' + task.id + '.json', {task: task})
    .then(
      function () {
        toastr.success('Task was successfully updated!');
      },
      function (error) {
        $log.error(error);
      }
    );
  };

  vm.completed = function (task) {
    $http.patch(baseUrl + 'tasks/' + task.id + '.json', {task: task})
    .then(
      function () {
      },
      function (error) {
        $log.error(error);
      }
    );
  };
}
