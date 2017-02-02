(function () {
    angular.module('mytodoApp')
        .service('AuthService', ['Backand', AuthService]);

    function AuthService(Backand) {

        var self = this;
        self.currentUser = {};

        loadUserDetails();

        function loadUserDetails() {

            return Backand.user.getUserDetails()
                .then(function (response) {
                    var data = response.data;
                    self.currentUser.details = data;
                    if(data !== null)
                    {
                        self.currentUser.name = data.username;
                    }
                    else {
                      Backand.useAnonymousAuth(true);
                    }
                });

        }

        self.getSocialProviders = function () {
            return Backand.getSocialProviders()
        };

        self.socialSignin = function (provider) {
            //by default Backand doesn't run sign-in if the user is not sign-up, the 4th parameter true force it to
          // sign-up the user
            return Backand.socialSignin(provider, null, true)
                .then(function (response) {
                    loadUserDetails();
                    return response;
                });
        };

        self.socialSignup = function (provider, email) {
            return Backand.socialSignUp(provider, null, null, email)
                .then(function (response) {
                  loadUserDetails();
                  return response;
                });
        };

        self.signin = function (username, password) {
            return Backand.signin(username, password)
                .then(function (response) {
    console.log('signin succeeded with user:' + response.data.username);
                    loadUserDetails();
                    Backand.useAnonymousAuth(false);
                    return response.data;
                });
        };

        self.signup = function (firstName, lastName, username, password, parameters) {
            return Backand.signup(firstName, lastName, username, password, password, parameters)
                .then(function (signUpResponse) {
                    if (signUpResponse.data.currentStatus === 1) {
                        return self.signin(username, password)
                            .then(function () {
                                return signUpResponse;
                            });

                    } else {
                        return signUpResponse;
                    }
                });
        };

        self.changePassword = function (oldPassword, newPassword) {
            return Backand.changePassword(oldPassword, newPassword)
        };

        self.requestResetPassword = function (username) {
            return Backand.requestResetPassword(username)
        };

        self.resetPassword = function (password, token) {
            return Backand.resetPassword(password, token)
        };

        self.logout = function () {
            Backand.signout().then(function () {
                angular.copy({}, self.currentUser);
                Backand.useAnonymousAuth(true);
            });
        };

    }

}());
