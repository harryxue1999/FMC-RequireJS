// jshint unused:false
/* global window, nmToFeet, feetToNM*/

'use strict';

define(function() {
	
	// Assume window variables defined: feetToNM, nmToFeet
	
	var earthRadiusNM = 3440.06;
	
	/**
	 * Turns degrees to radians
	 * 
	 * @param {Number} degrees The degree to be converted
	 * @return {Number} Radians of the degree
	 */
	function toRadians (degrees) {
		return degrees * Math.PI / 180;
	}
	
	/**
	 * Turns radians to degrees
	 * 
	 * @param {Number} radians The radian to be converted
	 * @return {Number} Degree of the radian
	 */
	function toDegrees (radians) {
		return radians * 180 / Math.PI;
	}
	
	/**
	 * Computes the ground speed of the aircraft
	 * 
	 * @return {Number} The ground speed of the aircraft
	 */
	function getGroundSpeed () {
		var tas = ges.aircraft.animationValue.ktas;
		var vs = (60 * ges.aircraft.animationValue.climbrate) * feetToNM;
		console.log("tas: " + tas + ", vs: " + vs); // DEBUG
		return Math.sqrt(tas * tas - vs * vs);
	}
	
	/**
	 * Computes the climb rate with an altitude restriction
	 * 
	 * @param {Number} deltaAlt The altitude difference
	 * @param {Number} nextDist The distance to the restriction point
	 * @return {Number} The climb rate necessary to attain the restriction
	 */
	function getClimbrate (deltaAlt, nextDist) {
		var gs = getGroundSpeed();
		var vs = 100 * Math.round((gs * (deltaAlt / (nextDist * nmToFeet)) * nmToFeet / 60) / 100);
		return vs;
	}

	/**
	 * Computes the distance between two sets of coordinates
	 * 
	 * @param {Number} lat1 Latitude of first coordinate
	 * @param {Number} lon1 Longetude of first coordinate
	 * @param {Number} lat2 Latitude of second coordinate
	 * @param {Number} lon2 Longetude of second coordinate
	 * @return {Number} The distance computed, in nautical miles
	 */
	function getDistance (lat1, lon1, lat2, lon2) {
		var dlat = toRadians(lat2 - lat1);
		var dlon = toRadians(lon2 - lon1);
		lat1 = toRadians(lat1);
		lat2 = toRadians(lat2);
		var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusNM * c;
	}
	
	/**
	 * Computes the bearing between two sets of coordinates
	 * 
	 * @param {Number} lat1 Latitude of first coordinate
	 * @param {Number} lon1 Longetude of first coordinate
	 * @param {Number} lat2 Latitude of second coordinate
	 * @param {Number} lon2 Longetude of second coordinate
	 * @return {Number} The bearing computed, in degrees 360 format
	 */
	function getBearing (lat1, lon1, lat2, lon2) {
		lat1 = toRadians(lat1);
		lat2 = toRadians(lat2);
		lon1 = toRadians(lon1);
		lon2 = toRadians(lon2);
		var y = Math.sin(lon2 - lon1) * Math.cos(lat2);
		var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
		var brng = toDegrees(Math.atan2(y, x));
		return brng;
	}
	
	return {
		earthRadiusNM: earthRadiusNM, 
		toRadians: toRadians,
		toDegrees: toDegrees, 
		getGroundSpeed: getGroundSpeed, 
		getClimbrate: getClimbrate, 
		getDistance: getDistance,
		getBearing: getBearing
	};
});