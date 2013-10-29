'use strict';

/* Controllers */

function MainCtrl($scope) {

} //--- End of Main Control

//--- Controller for partials/login.html
function LoginCtrl($scope, $location, MemberDatabase, localStorageService) {

  if (localStorageService.get('id_member') !== null) {$location.path('/following');}

  //--- Function for Sign Up button
  $scope.signUpClick = function() {
    $location.path('/signup');
  }

  //--- Function for Log In click
  $scope.memberLogin = function() {
    $scope.member = MemberDatabase.get({username:$scope.member.username, password:$scope.member.password},
      function(data){
        if (data.user) {
          localStorageService.add('user', data.user);
          localStorageService.add('firstname', data.firstname);
          localStorageService.add('lastname', data.lastname);
          localStorageService.add('id_member', data.id_member);
          $location.path('/following');
        }
        else {
          $scope.member.loginErr = 'Incorrect Username/Password';
          alert($scope.member.loginErr);
        } 
      });
    }
} //--- End of Login Control

//--- Controller for partials/signup.html
function SignupCtrl($scope, $location, MemberDatabase, localStorageService) {
  if(localStorageService.get('id_member') !== null) {$location.path('/following');}

  //--- Function for Sign Up button
  $scope.signUp = function() {
    MemberDatabase.get({username:$scope.member.username},
        function(data){ //check to see if username exists
         if (data.user) {
            $scope.member.signupErr = 'Username already exists';
            alert($scope.member.signupErr);
         }
         else {
            //create a new member
            var pobject = new MemberDatabase(); 
            pobject.username = $scope.member.username; 
            pobject.password = $scope.member.password; 
            pobject.firstname = $scope.member.firstname;
            pobject.lastname = $scope.member.lastname;
            pobject.email = $scope.member.email; 
            pobject.$save( {}, function(data, headers) {
              localStorageService.add('user', $scope.member.username);
              localStorageService.add('firstname', $scope.member.firstname);
              localStorageService.add('lastname', $scope.member.lastname);
              localStorageService.add('id_member', data.id_member);
              $location.path('/following');  
            });  
         }
    });
  }

  $scope.loginClick = function() {
    $location.path('/login');
  }

} //--- End of Sign Up Controller

function FollowingCtrl($scope, ActivityDatabase, $location, $http, FavoritesDatabase, SearchTag, localStorageService) {
  var user_id = localStorageService.get('id_member');
  if(user_id == null) { $location.path('/login'); }

  $scope.activities = ActivityDatabase.query({id: user_id});
  $scope.isCollapsed = true;

  //--- Function for the 'favorite item' star button
  $scope.favoriteItem = function(id) {
  //check and see if it exists, if not insert it
   var saveObject = new FavoritesDatabase(); 
      saveObject.id_activity = id; 
      saveObject.user =  localStorageService.get('user'); 
      saveObject.$save(); 
      var button_id = 'star_' + id;
      var img = document.getElementById(button_id);
      img.setAttribute("src", "http://smorgasbored.com/img/icons/star_yellow.png");
  }

  //--- Function for the profile headshot buttons
  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }

  //--- Function for the Search button
  $scope.showSearch = function() {
    var search_div = $('.smorg-search');
    if (search_div.css("visibility") === "hidden") {
      search_div.css("visibility","visible");
    }
    else {
      search_div.css("visibility","hidden");
    }  
  }

  //--- Search feature using Select2 
  $scope.tags = [];
  $scope.select2Options = {
    minimumInputLength: 1,
    maximumSelectionSize: 3,
    query: function(query) {
      var data = {results: []};
      $http.get('http://smorgasbored.com/Smorg-API/index.php/search_tag/' + query.term).success(function(info) {
        angular.forEach(info, function(value, key) {
          data.results.push({id: value["id_tag"], text: value["tag_text"]});
        });
      query.callback(data); 
      });
    }  
  }

  $scope.submitSearch = function(tags) {
    var search_tags = [];
    var tag_text = [];
    angular.forEach(tags, function(value, key) {
      search_tags.push(value["id"]);
      tag_text.push(value["text"]);
    });
    $location.path('/search_results/' + search_tags + '/' + tag_text);
  }
  //--- End of Search feature

} //--- End of Following Controller

function CityCtrl($scope, $location, $http, ActivityDatabase, FavoritesDatabase, SearchTag, localStorageService) {
 if(localStorageService.get('id_member') == null) { $location.path('/login'); }
 
 $scope.activities = ActivityDatabase.query();
 $scope.isCollapsed = true;
 $scope.scroll = 0;

 $scope.showSearch = function() {
    var search_div = $('.smorg-search');
    if (search_div.css("visibility") === "hidden") {
      search_div.css("visibility","visible");
  }
  else {
    search_div.css("visibility","hidden");
  }
}

$scope.tags = [];

$scope.select2Options = {
  minimumInputLength: 1,
  maximumSelectionSize: 3,
  query: function(query) {
    var data = {results: []};
    $http.get('http://smorgasbored.com/api/index.php/search_tag/' + query.term).success(function(info) {
      angular.forEach(info, function(value, key) {
        data.results.push({id: value["id_tag"], text: value["tag_text"]});
      });
    query.callback(data); 
    });
  }  
}

$scope.submitSearch = function(tags) {
  var search_tags = [];
  var tag_text = [];
  angular.forEach(tags, function(value, key) {
    search_tags.push(value["id"]);
    tag_text.push(value["text"]);
  });
  $location.path('/search_results/' + search_tags + '/' + tag_text);
}

  $scope.favoriteItem = function(id) {
    
//check and see if it exists, if not insert it
     var saveObject = new FavoritesDatabase(); 
        saveObject.id_activity = id; 
        saveObject.user =  localStorageService.get('user'); 
        saveObject.$save(); 
        
        var button_id = 'star_' + id;
        var img = document.getElementById(button_id);
        img.setAttribute("src", "http://smorgasbored.com/img/icons/star_yellow.png");
  }

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }
}

function ProfileCtrl($scope, $cookies, $routeParams, FavoritesDatabase, $location, localStorageService, ProfileDatabase, ProfileDatabaseActivity, ProfileDatabaseFollowing, FindFriend, FollowMember, UnfollowMember) {
  if(localStorageService.get('id_member') == null) { $location.path('/login'); }
  var profile_id = $routeParams.id;
  $scope.memberdata = ProfileDatabase.get({id: profile_id});
  /*$scope.activities = [
    {"id_activity": "3", "title":"Title"},
    {"id_activity": "1", "title":"Title2"},
    {"id_activity": "2", "title":"Title3"},
    {"id_activity": "4", "title":"Title4"},
    {"id_activity": "7", "title":"Title5"},
    {"id_activity": "6", "title":"Title6"}
  ]; */
  
  $scope.activities = ProfileDatabaseActivity.query({id: profile_id});
  $scope.following = ProfileDatabaseFollowing.query({id: profile_id});
  /*$scope.following = [
    {"id_member_friend": "27"},
    {"id_member_friend": "28"},
    {"id_member_friend": "29"},
    {"id_member_friend": "30"},
    {"id_member_friend": "31"},
    {"id_member_friend": "32"}
  ]; */
  //determine whose profile this is for follow button
  FindFriend.get({myId: $cookies.id_member, visitingId: profile_id}, function(data) {
    if (profile_id == $cookies.id_member) {
      $scope.whoami = [];
    }
    else if (data.id_member_friend == profile_id) {
      $scope.whoami = "following";
    }
    else {
      $scope.whoami = "notfollowing"; 
    }
  });

  $scope.followMember = function() {
    $scope.whoami = "following";
    var pobject = new FollowMember(); 
    pobject.id_member = $cookies.id_member; 
    pobject.id_member_friend = profile_id;  
    pobject.$save();

  }
  $scope.unfollowMember = function() {
    $scope.whoami = "notfollowing";
    var pobject = new UnfollowMember(); 
    pobject.id_member = $cookies.id_member; 
    pobject.id_member_friend = profile_id;  
    pobject.$save();
  }
}

function HomeCtrl($scope, $cookies, $routeParams, $location, FavoritesDatabase, UpcomingActivities, localStorageService) {
  var id_user = localStorageService.get('id_member');
  if(id_user == null) { $location.path('/login'); }
  
  $scope.favorites = FavoritesDatabase.query({id: id_user}); 
  $scope.upcoming = UpcomingActivities.query({id: id_user});

  $scope.logoutClick = function() {
    localStorageService.clearAll();
    $location.path('/login');
  }
}

function SearchResCtrl($scope, $routeParams, $cookies, $location, SearchResults, FavoritesDatabase, localStorageService) {
  if(localStorageService.get('id_member') == null) { $location.path('/login'); }

  var tags = $routeParams.tag_text;
  $scope.activities = SearchResults.query({array: $routeParams.search_tags, text:tags});
  $scope.isCollapsed = true;
  $scope.tags = tags.replace(',', ', ');

  $scope.favoriteItem = function(id) {
      
    var saveObject = new FavoritesDatabase(); 
    saveObject.id_activity = id; 
    saveObject.user =  $cookies.user; 
    saveObject.$save(); 
    
    var button_id = 'star_' + id;
    var img = document.getElementById(button_id);
    img.setAttribute("src", "http://smorgasbored.com/img/icons/star_yellow.png");
  }

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }
}

function PostCtrl($scope, $rootScope, localStorageService, $cookies, $location) {
  if(localStorageService.get('id_member') == null) { $location.path('/login'); }

  //Post2 photo upload page
  /*
  var capture = navigator.device.capture;
  alert('hello!!');
  alert(capture.supportedImageModes);
  */
  //post2 picture size
  $scope.newimage = '';
  var winWidth = window.innerWidth;
  var photoHeight = .75*winWidth;
  $(".smorg-post-photo").css('height', photoHeight);
  $(".smorg-photo-label").css('line-height', photoHeight + "px");
  $("#resize_input").attr("resize-max-width", winWidth);  
  $("#resize_input").attr("resize-max-height", photoHeight);
  // $scope.maxWidth = winWidth;
  // $scope.maxHeight = photoHeight;

  $scope.nextClick = function(data) {
    //make this more efficient
    var urlStr = $scope.$parent.$parent.uploadPage;
    var urlNum = urlStr.split('/');
    urlNum = (urlNum[urlNum.length - 1]).split('.');
    urlNum = urlNum[0].replace(/^\D+/g, '');
    localStorageService.add(urlNum, data);
    urlNum++;
    $scope.$parent.$parent.uploadPage = "partials/upload/post" + urlNum + ".html";
  }
  
  $scope.exitPage = function() {
    $scope.$parent.$parent.uploadPage = '';
  }

}

function UploadCtrl($scope, $cookies, SearchTag) {
    $scope.id_member = $cookies.id_member;

    /* From ngUpload directive */
   $scope.uploadComplete = function (content, completed) {
    if (completed && content.length > 0) {
      $scope.response = JSON.parse(content); // Presumed content is a json string!
      $scope.response.style = {
        color: $scope.response.color,
        "font-weight": "bold"
      };

      // Clear form (reason for using the 'ng-model' directive on the input elements)
      $scope.fullname = '';
      $scope.gender = '';
      $scope.color = '';
      // Look for way to clear the input[type=file] element
    }
  };

  $scope.searchTag = function() {
    if ($scope.tag) {
    $scope.tag_results = SearchTag.query({tag: $scope.tag});
    }
    else {
      $scope.tag_results = [];
    }
  }

}