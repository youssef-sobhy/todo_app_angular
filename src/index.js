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
        controller: 'AuthController',
        controllerAs: 'vm'
      })
      .when('/my_todos', {
        templateUrl: 'app/todos/todos.html',
        controller: 'TasksController',
        controllerAs: 'vm'
      })
      .when('/sign_up', {
        templateUrl: 'app/authentication/sign_up.html',
        controller: 'AuthController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope, $location, AuthService) {
      $rootScope.$on('$routeChangeStart', function () {
        if (AuthService.signedIn === false) {
          $location.path('/');
        }
      });
    });

  // Main Controller

  function MainController($scope, $auth, $location, toastr, AuthService) {
    var vm = this;

    vm.signedIn = AuthService.signedIn;
    vm.currentUser = AuthService.currentUser;

    $scope.$on('signedIn', function () {
      vm.signedIn = AuthService.signedIn;
    });
    $scope.$on('currentUser', function () {
      vm.currentUser = AuthService.currentUser;
    });

    vm.logOut = function () {
      $auth.signOut()
      .then(function () {
        toastr.success('You have successfully logged out!');
        $location.path('/');
        AuthService.signIn(false);
      }).catch(function () {
        toastr.error('Sorry, you cannot sign out :D');
      });
    };
  }
})();
