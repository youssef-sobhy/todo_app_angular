angular
.module('todoApp').factory('AuthService', function ($rootScope){
  return {
    signed_in: false,
    sign_in: function(value) {
      this.signed_in = value;
      $rootScope.$broadcast("signed_in");
    },
    get_current_user: function(user) {
    	this.current_user = user;
    	$rootScope.$broadcast("current_user");
    }
  }
})

