'use strict';


// Declare app level module which depends on filters, and services
//angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  
var smorg = angular.module('smorg', ['ui.bootstrap', 'services', 'ngCookies', 'directives', 'imageupload', 'ngUpload', 'ui.select2', 'LocalStorageModule']);

smorg.config(function($routeProvider, $compileProvider) {
$routeProvider.    
    when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
    when('/signup', {templateUrl: 'partials/signup.html', controller: SignupCtrl}).
    when('/following', {templateUrl: 'partials/following.html', controller: FollowingCtrl}).
    when('/city', {templateUrl: 'partials/city.html', controller: CityCtrl}).
    when('/profile/:id', {templateUrl: 'partials/profile.html', controller: ProfileCtrl}).
    when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl}).    
    when('/search_results/:search_tags/:tag_text', {templateUrl: 'partials/search_results.html', controller:SearchResCtrl}).
    when('/upload', {templateUrl: 'partials/upload.html', controller: UploadCtrl}).
    otherwise({redirectTo: '/login'});
  
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  });


/*
smorg.config(['$routeProvider', function($routeProvider) {
$routeProvider.    
    when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
    when('/signup', {templateUrl: 'partials/signup.html', controller: SignupCtrl}).
    when('/following', {templateUrl: 'partials/following.html', controller: FollowingCtrl}).
    when('/city', {templateUrl: 'partials/city.html', controller: CityCtrl}).
    when('/profile/:id', {templateUrl: 'partials/profile.html', controller: ProfileCtrl}).
    when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl}).    
    when('/search_results/:search_tags/:tag_text', {templateUrl: 'partials/search_results.html', controller:SearchResCtrl}).
    when('/upload', {templateUrl: 'partials/upload.html', controller: UploadCtrl}).
    otherwise({redirectTo: '/login'});
  }]);
*/
/*
angular.module('App', []).config(function ($routeProvider, $compileProvider) {

    $routeProvider.when('/test', {
        controller: TestCtrl,
        template: '<h1> {{ test }} </h1>'        
    });
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});
*/