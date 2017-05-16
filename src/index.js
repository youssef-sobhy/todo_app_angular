(function () {
  'use strict';

  angular
    .module('todoApp', ['ng-token-auth', 'ngRoute', 'toastr'])
    .controller('TasksController', TasksController)
    .controller('UsersController', UsersController)
    .controller('MainController', MainController)

    // Configuration

    .config(function ($authProvider, $routeProvider, $locationProvider) {
      $authProvider.configure({
        apiUrl: 'http://localhost:3005'
      });
      $routeProvider
      .when('/', {
        templateUrl: 'app/user/sign_in.html',
        controller: 'UsersController'
      })
      .when('/my_todos', {
        templateUrl: 'app/todos/todos.html',
        controller: 'TasksController'
      })
      .when('/sign_up', {
        templateUrl: 'app/user/sign_up.html',
        controller: 'UsersController'
      })
      $locationProvider.html5Mode(true);
    });

  // Main Controller

  function MainController($scope, $auth, $location, toastr, AuthService) {
    $scope.signed_in = AuthService.signed_in;
    $scope.current_user = AuthService.current_user;

    $scope.$on('signed_in', function () {
      $scope.signed_in = AuthService.signed_in;
    });
    $scope.$on('current_user', function () {
      $scope.current_user = AuthService.current_user;
    });

    $scope.logOut = function () {
      $auth.signOut()
      .then(function () {
        toastr.success('You have successfully logged out!');
        $location.path('/');
        AuthService.sign_in(false);
      }).catch(function () {
        toastr.error('Sorry, you cannot sign out :D');
      });
    };
  }

  // Tasks Controller

  function TasksController($scope, $http, AuthService) {
    var baseUrl = 'http://localhost:3005/';
    $scope.current_user = AuthService.current_user;

    $scope.$on('current_user', function () {
      $scope.current_user = AuthService.current_user;
    });

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
          console.log('Task was successfully updated!');
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

  // Users Controller

  function UsersController($scope, $auth, $location, toastr, AuthService) {
    $scope.registerUser = function () {
      $auth.submitRegistration($scope.registrationForm)
      .then(function () {
        toastr.success('You have successfully registered!');
        $location.path('/');
      }).catch(function (response) {
        toastr.error(response);
      });
    };

    $scope.loginUser = function () {
      $auth.submitLogin($scope.loginForm)
      .then(function (user) {
        AuthService.sign_in(true);
        AuthService.get_current_user(user);
        toastr.success('You have successfully logged in!');
        $location.path('/my_todos');
      }).catch(function (err) {
        console.log(err);
        toastr.error('Wrong email or password', 'ERROR!');
      });
    };
  }
})();
