'use strict';

define(['fmc/waypoints', 'fmc/math'], function (waypoints, math) {
	/**
	 * Computes the full route distance with waypoints until index
 	 * 
 	 * @param {Number} end The index of the end of the route to be calculated
	 * @return {Number} The route distance
 	 */
	function getRouteDistance (end) {
		var loc = ges.aircraft.llaLocation || [0, 0, 0];
		var start = waypoints.nextWaypoint || 0;
		var total;
		if (waypoints.route.length === 0 || !waypoints.nextWaypoint) {
			total = math.getDistance(loc[0], loc[1], waypoints.arrival[1], waypoints.arrival[2]);
		} else {
			total = math.getDistance(loc[0], loc[1], waypoints.route[start - 1][1], waypoints.route[start - 1][2]);
			for (var i = start; i < end && i < waypoints.route.length; i++) {
				total += math.getDistance(waypoints.route[i - 1][1], waypoints.route[i - 1][2], waypoints.route[i][1], waypoints.route[i][2]);
			}
			if (end > waypoints.route.length) {
				total += math.getDistance(waypoints.route[waypoints.route.length - 1][1], waypoints.route[waypoints.route.length - 1][2], waypoints.arrival[1], waypoints.arrival[2]);
			}
		}
		return total;
	}
	
	return getRouteDistance;
});