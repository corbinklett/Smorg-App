'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('MemberDatabase', function($resource) {
		//var MemberDatabase = $resource('../api/index.php/login/:username/:password');
		var MemberDatabase = $resource('http://smorgasbored.com/api/index.php/login/:username/:password');
		return MemberDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		//var ActivityDatabase = $resource('../api/index.php/activity/:id');
		var ActivityDatabase = $resource('http://smorgasbored.com/api/index.php/activity/:id'); //include id if you want to get friend feed
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		//var FavoritesDatabase = $resource('../api/index.php/favorites/:id');
		var FavoritesDatabase = $resource('http://smorgasbored.com/api/index.php/favorites/:id');
		return FavoritesDatabase;
}).
	factory('ProfileDatabase', function($resource) {
		//var ProfileDatabase = $resource('../api/index.php/profile/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/api/index.php/profile/:id');
		return ProfileDatabase;
}).	factory('ProfileDatabaseActivity', function($resource) {
		//var ProfileDatabaseActivity = $resource('../api/index.php/profile_activities/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/api/index.php/profile_activities/:id');
		return ProfileDatabase;
}).
	factory('ProfileDatabaseFollowing', function($resource) {
		//var ProfileDatabaseFollowing = $resource('../api/index.php/profile_following/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/api/index.php/profile_following/:id');
		return ProfileDatabase;
}).
	factory('FindFriend', function($resource) {
		//var FindFriend = $resource('../api/index.php/find_friend/:myId/:visitingId')
		var FindFriend = $resource('http://smorgasbored.com/api/index.php/find_friend/:myId/:visitingId');
		return FindFriend;
}).	
	factory('FollowMember', function($resource) {
		//var FollowMember = $resource('../api/index.php/follow_member');
		var FollowMember = $resource('http://smorgasbored.com/api/index.php/follow_member');
		return FollowMember;
}).	
	factory('UnfollowMember', function($resource) {
		//var UnfollowMember = $resource('../api/index.php/unfollow_member');
		var UnfollowMember = $resource('http://smorgasbored.com/api/index.php/unfollow_member');
		return UnfollowMember;
}).
	factory('SearchTag', function($resource) {
		//var SearchTag = $resource('../api/index.php/search_tag/:tag');
		var SearchTag = $resource('http://smorgasbored.com/api/index.php/search_tag/:tag');
		return SearchTag;
}).
	factory('SearchResults', function($resource) {
		//var SearchResults = $resource('../api/index.php/search_results/:array/:text');
		var SearchResults = $resource('http://smorgasbored.com/api/index.php/search_results/:array/:text');
		return SearchResults;		
}).	
	factory('UpcomingActivities', function($resource) {
		//var UpcomingActivities = $resource('../api/index.php/upcoming/:id');
		var UpcomingActivities = $resource('http://smorgasbored.com/api/index.php/upcoming/:id');
		return UpcomingActivities;		
});






