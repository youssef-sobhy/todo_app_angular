(function () {
  'use strict';

  angular
    .module('todoApp', ['ng-token-auth', 'ngRoute', 'toastr'])
    .controller('MainController', MainController)

    // Configuration

    .config(function ($authProvider, $routeProvider, $locationProvider) {
      $authProvider.configure({
        apiUrl: 'http://localhost:3005'
      });

      $routeProvider
      .when('/', {
        templateUrl: 'app/authentication/sign_in.html',
        controller: 'AuthController'
      })
      .when('/my_todos', {
        templateUrl: 'app/todos/todos.html',
        controller: 'TasksController'
      })
      .when('/sign_up', {
        templateUrl: 'app/authentication/sign_up.html',
        controller: 'AuthController'
      })
      .otherwise({
        redirectTo: '/'
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
})();
