'use strict';

define(['distance/route', 'fmc/waypoints', 'fmc/math'], function (getRouteDistance, waypoints, math) {
	/**
	 * Controls LNAV, plane's lateral navigation
 	 */
	function updateLNAV () {
		var d = getRouteDistance(waypoints.nextWaypoint);
		if (d <= getTurnDistance(60)) {
			waypoints.activateLeg(waypoints.nextWaypoint + 1);
		}
	}
	
	/**
	 * Computes the turning distance to next waypoint for an aircraft to be on course
	 * 
	 * @param {Number} angle Angle of turning
	 * @return {Number} The turning distance
	 */
	function getTurnDistance(angle) {
		var v = ges.aircraft.animationValue.kcas;
		var r = 0.107917 * Math.pow(Math.E, 0.0128693 * v);
		var a = math.toRadians(angle);
		return r * Math.tan(a / 2) + 0.20;
	}
	
	return updateLNAV;
});