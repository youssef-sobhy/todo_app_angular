    // Auth Controller
angular
    .module('todoApp')
    .controller('AuthController', AuthController)

function AuthController($scope, $auth, $location, toastr, AuthService) {

  $scope.registerUser = function () {
    $auth.submitRegistration($scope.registrationForm)
    .then(function () {


    // $scope.loginForm = {
    //   email: $scope.registrationForm.email,
    //   password: $scope.registrationForm.password
    // }


      toastr.success('You have successfully registered!');
      // $scope.loginUser();
      $location.path('/my_todos');
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