'use strict';

define(function() {
	return {
		// Computes and returns the ground speed of the aircraft
		getGroundSpeed: function() {
			var tas = ges.aircraft.animationValue.ktas;
			var vs = (60 * ges.aircraft.animationValue.climbrate) * feetToNM;
			console.log("tas: " + tas + ", vs: " + vs);
			return Math.sqrt(tas * tas - vs * vs);
		}, 
		
		// Computes and returns the climb rate of the aircraft
		getClimbrate: function (deltaAlt, nextDist) {
			var gs = getGroundSpeed();
			var vs = 100 * Math.round((gs * (deltaAlt / (nextDist * nmToFeet)) * nmToFeet / 60) / 100);
			return vs;
		}, 
		
		// Returns the distance between two sets of coordinates
		getDistance: function (lat1, lon1, lat2, lon2) {
			var dlat = toRadians(lat2 - lat1);
			var dlon = toRadians(lon2 - lon1);
			lat1 = toRadians(lat1);
			lat2 = toRadians(lat2);
			var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			return earthRadiusNM * c;
		}, 
		
		// Retuns the bearing between two coordinates
		getBearing: function (lat1, lon1, lat2, lon2) {
			lat1 = toRadians(lat1);
			lat2 = toRadians(lat2);
			lon1 = toRadians(lon1);
			lon2 = toRadians(lon2);
			var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
			var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
			var brng = toDegrees(Math.atan2(y, x));
			return brng;
		}, 
		
		toRadians: function (degrees) {
			return degrees * Math.PI / 180;
		},
		
		toDegrees: function (radians) {
			return radians * 180 / Math.PI;
		},
		
		earthRadiusNM: 3440.06
	};
});