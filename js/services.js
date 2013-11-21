'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('MemberDatabase', function($resource) {
		//var MemberDatabase = $resource('../Smorg-API/index.php/login/:username/:password');
		var MemberDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/login/:username/:password');
		return MemberDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		//var ActivityDatabase = $resource('../Smorg-API/index.php/activity/:id');
		var ActivityDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/activity/:id'); //include id if you want to get friend feed
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		//var FavoritesDatabase = $resource('../Smorg-API/index.php/favorites/:id');
		var FavoritesDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/favorites/:id');
		return FavoritesDatabase;
}).
	factory('ProfileDatabase', function($resource) {
		//var ProfileDatabase = $resource('../Smorg-API/index.php/profile/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/profile/:id');
		return ProfileDatabase;
}).	factory('ProfileDatabaseActivity', function($resource) {
		//var ProfileDatabaseActivity = $resource('../Smorg-API/index.php/profile_activities/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/profile_activities/:id');
		return ProfileDatabase;
}).
	factory('ProfileDatabaseFollowing', function($resource) {
		//var ProfileDatabaseFollowing = $resource('../Smorg-API/index.php/profile_following/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/Smorg-API/index.php/profile_following/:id');
		return ProfileDatabase;
}).
	factory('FindFriend', function($resource) {
		//var FindFriend = $resource('../Smorg-API/index.php/find_friend/:myId/:visitingId')
		var FindFriend = $resource('http://smorgasbored.com/Smorg-API/index.php/find_friend/:myId/:visitingId');
		return FindFriend;
}).	
	factory('FollowMember', function($resource) {
		//var FollowMember = $resource('../Smorg-API/index.php/follow_member');
		var FollowMember = $resource('http://smorgasbored.com/Smorg-API/index.php/follow_member');
		return FollowMember;
}).	
	factory('UnfollowMember', function($resource) {
		//var UnfollowMember = $resource('../Smorg-API/index.php/unfollow_member');
		var UnfollowMember = $resource('http://smorgasbored.com/Smorg-API/index.php/unfollow_member');
		return UnfollowMember;
}).
	factory('SearchTag', function($resource) {
		//var SearchTag = $resource('../Smorg-API/index.php/search_tag/:tag');
		var SearchTag = $resource('http://smorgasbored.com/Smorg-API/index.php/search_tag/:tag');
		return SearchTag;
}).
	factory('SearchResults', function($resource) {
		//var SearchResults = $resource('../Smorg-API/index.php/search_results/:array/:text');
		var SearchResults = $resource('http://smorgasbored.com/Smorg-API/index.php/search_results/:array/:text');
		return SearchResults;		
}).	
	factory('UpcomingActivities', function($resource) {
		//var UpcomingActivities = $resource('../Smorg-API/index.php/upcoming/:id');
		var UpcomingActivities = $resource('http://smorgasbored.com/Smorg-API/index.php/upcoming/:id');
		return UpcomingActivities;		
}).
	factory('SingleActivity', function($resource) {
		var SingleActivity = $resource('http://smorgasbored.com/Smorg-API/index.php/single_activity/:id');
		return SingleActivity;
}).
	factory('ShareActivity', function($resource) {
		var ShareActivity = $resource('http://smorgasbored.com/Smorg-API/index.php/share_activity');
		return ShareActivity;
});





