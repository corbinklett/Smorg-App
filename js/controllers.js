'use strict';

/* Controllers */

function MainCtrl($scope) {

} //--- End of Main Control

//--- Controller for partials/login.html
function LoginCtrl($scope, $location, MemberDatabase, localStorageService) {

  if (localStorageService.get('id_member') !== null) {$location.path('/following');}

  // --- Temporary for testing
          localStorageService.add('user', 'corbinklett');
          localStorageService.add('firstname', 'Corbin');
          localStorageService.add('lastname', 'Klett');
          localStorageService.add('id_member', 26);
          $location.path('/following');


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

  $scope.toSharePage = function(id) {
    localStorageService.add('id_activity_shared', id);
    $scope.sharePage = "partials/share/share.html";
  }

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

function ProfileCtrl($scope, $routeParams, FavoritesDatabase, $location, localStorageService, ProfileDatabase, ProfileDatabaseActivity, ProfileDatabaseFollowing, FindFriend, FollowMember, UnfollowMember) {
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
  var visitorId = localStorageService.get('id_member');
  FindFriend.get({myId: visitorId, visitingId: profile_id}, function(data) {
    if (profile_id == visitorId) {
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
    pobject.id_member = visitorId; 
    pobject.id_member_friend = profile_id;  
    pobject.$save();

  }
  $scope.unfollowMember = function() {
    $scope.whoami = "notfollowing";
    var pobject = new UnfollowMember(); 
    pobject.id_member = visitorId; 
    pobject.id_member_friend = profile_id;  
    pobject.$save();
  }

  $scope.activityClick = function(activity) {
    $location.path('/activity/' + activity.id_activity);
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

function PostCtrl($scope, $rootScope, localStorageService, $location, $http) {
  if(localStorageService.get('id_member') == null) { $location.path('/login'); }

  //Post2 photo upload page

  var winWidth = window.innerWidth;
  var photoHeight = .75*winWidth;
  $(".smorg-post-photo").css('height', photoHeight);
  $(".smorg-photo-label").css('line-height', photoHeight + "px");
  $("#resize_input").attr("resize-max-width", winWidth);  
  $("#resize_input").attr("resize-max-height", photoHeight);


// ---end photo upload page

  $scope.nextClick = function(data) {
    //make this more efficient
    var urlStr = $scope.$parent.$parent.uploadPage;
    var urlNum = urlStr.split('/');
    urlNum = (urlNum[urlNum.length - 1]).split('.');
    urlNum = urlNum[0].replace(/^\D+/g, '');
    localStorageService.add("activity" + urlNum, data);
    urlNum++;
    $scope.$parent.$parent.uploadPage = "partials/upload/post" + urlNum + ".html";
  }

  $scope.postActivity = function(data) { //posts user inputs about activity to database and saves photo on server
    //save tags in local storage
    var urlStr = $scope.$parent.$parent.uploadPage;
    var urlNum = urlStr.split('/');
    urlNum = (urlNum[urlNum.length - 1]).split('.');
    urlNum = urlNum[0].replace(/^\D+/g, '');
    localStorageService.add("activity" + urlNum, data);

    // post local storage info to server
    var postData = {
      'title': localStorageService.get('activity1'),
      'image': localStorageService.get('activity2'),
      'tags': localStorageService.get('activity3'),
      'user': localStorageService.get('id_member')
    };

    $http({
      method:'POST', 
      url:'http://smorgasbored.com/Smorg-API/smorg_post_activity.php',
      data:postData, 
    }).
      success(function(response) {
        localStorageService.remove('activity1');
        localStorageService.remove('activity2');
        localStorageService.remove('activity3');
      }).
      error(function(response) {
        console.log('error');
      });

    $scope.$parent.$parent.uploadPage = ''; //get rid of post pages
  }
  
  $scope.exitPage = function() {
    $scope.$parent.$parent.uploadPage = '';
  }


  // ---for tags page
  $scope.select2Options = {
    minimumInputLength: 1,
    maximumSelectionSize: 4,
    query: function(query) {
      var data = {results: []};
      $http.get('http://smorgasbored.com/Smorg-API/index.php/search_tag/' + query.term).success(function(info) {
        angular.forEach(info, function(value, key) {
          data.results.push({id: value["id_tag"], text: value["tag_text"]});
        });
      query.callback(data); 
      });
    },
    dropdownCssClass: "testclass",
    createSearchChoice: function(term, query) { 
          console.log(query);
          return {id:term, text:term};
    },
    tokenSeparators: [',', ' ']
  }

  $scope.clearChoice = function(tagid) {
    var deleteIndex;
    var index = 0;
    angular.forEach($scope.activity.tags, function(value, key) {
      if (value["id"] == tagid) {
        deleteIndex = index;
      }
      index++;
    });
    $scope.activity.tags.splice(deleteIndex,1);
  }

  // ---end tags page

}

function SearchCtrl($scope, $http, $location) {
  
  $scope.exitPage = function() {
    $scope.$parent.$parent.searchPage = '';
  }

  // --- code for Choices ---//
  $scope.tags = [];

  $scope.select2Options = {
    minimumInputLength: 1,
    maximumSelectionSize: 4,
    query: function(query) {
      var data = {results: []};
      $http.get('http://smorgasbored.com/Smorg-API/index.php/search_tag/' + query.term).success(function(info) {
        angular.forEach(info, function(value, key) {
          data.results.push({id: value["id_tag"], text: value["tag_text"]});
        });
      query.callback(data); 
      });
    },
    dropdownCssClass: "testclass"
  }

  $scope.clearChoice = function(tagid) {
    var deleteIndex;
    var index = 0;
    angular.forEach($scope.tags, function(value, key) {
      if (value["id"] == tagid) {
        deleteIndex = index;
      }
      index++;
    });
    $scope.tags.splice(deleteIndex,1);
  }

  // --- end code for Choices ---//

  $scope.submitSearch = function(tags) {
    var search_tags = [];
    var tag_text = [];
    angular.forEach(tags, function(value, key) {
      search_tags.push(value["id"]);
      tag_text.push(value["text"]);
    });
    $location.path('/search_results/' + search_tags + '/' + tag_text);
  }

}

function ShareCtrl($scope, $http, $location, $rootScope, localStorageService, ShareActivity) {
  $scope.exitPage = function() {
    $scope.$parent.$parent.sharePage = '';
  }

  $scope.sharedActivityId = localStorageService.get('id_activity_shared');


  // --- code for Choices ---//
  $scope.invitees = [];

  var currentUser = localStorageService.get('id_member');
  $scope.select2Options = {
    minimumInputLength: 1,
    maximumSelectionSize: 20,
    query: function(query) {
      var data = {results: []};
      $http.get('http://smorgasbored.com/Smorg-API/index.php/search_friends/' + currentUser + '/' + query.term).success(function(info) {
        angular.forEach(info, function(value, key) {
          data.results.push({id: value["id_member"], text: value["user"]});
        });
      query.callback(data); 
      });
    },
    dropdownCssClass: "testclass"
  }

  $scope.clearChoice = function(inviteeId) {
    var deleteIndex;
    var index = 0;
    angular.forEach($scope.invitees, function(value, key) {
      if (value["id"] == inviteeId) {
        deleteIndex = index;
      }
      index++;
    });
    $scope.invitees.splice(deleteIndex,1);
  }
  // --- end code for Choices ---//

  $scope.nextClick = function(invitees) {
    localStorageService.add('invitees', invitees);
    $scope.$parent.$parent.sharePage = "partials/share/share2.html";
  }

  $scope.shareActivity = function(message) {
    //share activity/conversation then delete local storage items
    var invitees = localStorageService.get('invitees');
    var id_activity_shared = localStorageService.get('id_activity_shared');
    var invitee_ids = [];

    //just get ID's of invitees 
    angular.forEach(invitees, function(value, key) {
      invitee_ids.push(parseInt(value["id"]));
    });

    //save shared activity data in database
    var pobject = new ShareActivity(); 
    pobject.invitee_ids = invitee_ids; 
    pobject.id_activity_shared = id_activity_shared; 
    pobject.message = message;
    pobject.$save( {}, function(data, headers) {
      localStorageService.remove('invitees');
      localStorageService.remove('id_activity_shared');
      $scope.$parent.$parent.sharePage = ''; //get rid of share pages
      $location.path('/following');  
    });  
  }

  // $scope.submitSearch = function(tags) {
  //   var search_tags = [];
  //   var tag_text = [];
  //   angular.forEach(tags, function(value, key) {
  //     search_tags.push(value["id"]);
  //     tag_text.push(value["text"]);
  //   });
  //   $location.path('/search_results/' + search_tags + '/' + tag_text);
  // }

}

function ActivityCtrl($scope, localStorageService, SingleActivity, $routeParams, SearchResults, $location) {
  if(localStorageService.get('id_member') == null) { $location.path('/login'); }
  //page that show selected activity and similar activities
  $scope.activity = [];
  $scope.activity.tags = [];

  SingleActivity.query({id: $routeParams.id}, function(data) {
    $scope.activity.id_activity = data[0].id_activity;
    $scope.activity.title = data[0].title;
    angular.forEach(data, function(value, key) {
      $scope.activity.tags.push({"tag_text": value["tag_text"], "id_tag": value["id_tag"]});
    });

    //get list of similar activities and their tags based off of tags extracted above
    var id_array = [];
    var text_array = [];
    angular.forEach($scope.activity.tags, function(value, key) {
      id_array.push(value["id_tag"]);
      text_array.push(value["tag_text"]);
    });
    
    //don't repeat an activity!
    $scope.similarActivities = [];
    SearchResults.query({array: id_array, text:text_array}, function(data) {
      angular.forEach(data, function(value, key) {
        if (value["id_activity"] !== $scope.activity.id_activity) {
          $scope.similarActivities.push(value);
        }
      });
    });
  });

}

// --- Experimental Upload Control
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