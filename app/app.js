'use strict';

angular.module('mytodoApp', [
    'backand',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.sortable',
    'mytodoApp.config.interceptors',
    'mytodoApp.config.consts'
])
    .config(['$stateProvider', '$httpProvider', '$urlRouterProvider', 'BackandProvider', 'CONSTS',
        function ($stateProvider, $httpProvider, $urlRouterProvider, BackandProvider, CONSTS) {
            BackandProvider.setAnonymousToken(CONSTS.anonymousToken)
                .setSignUpToken(CONSTS.signUpToken)
                .setAppName(CONSTS.appName);

            //By default in the SDK when signup is success it's automatically signin.
            //In this app we wanted to show all the process so we turned it off.
            BackandProvider.runSigninAfterSignup(false);

            $httpProvider.interceptors.push('todoHttpInterceptor');

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('main', {
                    url: '/',
                    abstract: true,
                    templateUrl: 'views/main/header.html',
                    controller: 'HeaderCtrl as header'
                })
                .state('todos', {
                    url: '',
                    parent: 'main',
                    templateUrl: 'views/main/todoList.html',
                    controller: 'TodoListCtrl as todoList'
                })
                .state('changePassword', {
                    url: 'changePassword',
                    parent: 'main',
                    templateUrl: 'views/auth/change-password.html',
                    controller: 'ChangePasswordCtrl as changePassword'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/auth/login.html',
                    controller: 'LoginCtrl as login',
                    params: {
                        error: null
                    }
                })
                .state('resetPassword', {
                    url: '/resetPassword',
                    templateUrl: 'views/auth/reset-password.html',
                    controller: 'ResetPasswordCtrl as resetPassword'
                });
        }]);
