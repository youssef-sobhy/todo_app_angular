    // Auth Controller
angular
    .module('todoApp')
    .controller('AuthController', AuthController);

function AuthController($scope, $auth, $location, $log, toastr, AuthService) {
  var vm = this;

  vm.registerUser = function () {
    $auth.submitRegistration($scope.registrationForm)
    .then(function () {
    // $scope.loginForm = {
    //   email: $scope.registrationForm.email,
    //   password: $scope.registrationForm.password
    // }
      toastr.success('You have successfully registered!');
      // $scope.loginUser();
      $location.path('/');
    }).catch(function (response) {
      $log.error(response);
    });
  };

  vm.loginUser = function () {
    $auth.submitLogin($scope.loginForm)
    .then(function (user) {
      AuthService.signIn(true);
      AuthService.getCurrentUser(user);
      toastr.success('You have successfully logged in!');
      $location.path('/my_todos');
    }).catch(function (err) {
      $log.log(err);
      toastr.error('Wrong email or password', 'ERROR!');
    });
  };
}
