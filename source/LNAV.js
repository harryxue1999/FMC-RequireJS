'use strict';

define(['distance/route', 'distance/turn', 'fmc/waypoints'], function (getRouteDist, getTurnDist, waypoints) {
	/**
	 * Controls LNAV, plane's lateral navigation
 	 */
	function updateLNAV () {
		var d = getRouteDist(waypoints.nextWaypoint);
		if (d <= getTurnDist(60)) {
			waypoints.activateLeg(waypoints.nextWaypoint + 1);
		}
	}
	
	return updateLNAV;
});