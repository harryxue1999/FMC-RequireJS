'use strict';

define(['fmc/waypoints', 'fmc/math', 'distance/route', 'helperMethods'], function (waypoints, math, getRouteDistance, helper) {
	/**
	 * Updates the plane's progress during flying
	 */
	function updateProgress () {
		var lat1 = ges.aircraft.llaLocation[0] || 0;
		var lon1 = ges.aircraft.llaLocation[1] || 0;
		var lat2 = waypoints.arrival[1] || 0;
		var lon2 = waypoints.arrival[2] || 0;
		var times = ["--", "--", "--", "--", "--"]; // flightete, flighteta, todete, todeta, nextete
		var nextdist = getRouteDistance(waypoints.nextWaypoint);
		if (nextdist < 10) {
			nextdist = (Math.round(10 * nextdist)) / 10;
		} else nextdist = Math.round(nextdist);
		var flightdist;
		for (var i = 0, test = true; i < waypoints.route.length; i++) {
			if (!waypoints.route[i][1]) test = false;
		}
		if (test) flightdist = getRouteDistance(waypoints.route.length + 1);
		else flightdist = math.getDistance(lat1, lon1, lat2, lon2);

		if (!ges.aircraft.groundContact && waypoints.arrival) {
			times[0] = getete(flightdist, true);
			times[1] = geteta(times[0][0], times[0][1]);
			times[4] = getete(nextdist, false);
			if ((flightdist - waypoints.tod) > 0) {
				times[2] = getete((flightdist - waypoints.tod), false);
				times[3] = geteta(times[2][0], times[2][1]);
			}
		}
		printInfo (flightdist, nextdist, times);
	}
	
	/**
	 * Prints plane's progress to the UI
	 *
	 * @param {Number} flightdist The total flight distance
	 * @param {Number} nextdist The distance to the next waypoint
	 * @param {Array} times An array of the time: [hours, minutes]
	 */
	function printInfo (flightdist, nextdist, times) {
		for (var i = 0; i < times.length; i++) {
			times[i] = helper.formatTime(times[i]);
		}
		if (flightdist < 10) {
			flightdist = Math.round(flightdist * 10) / 10;
		} else flightdist = Math.round(flightdist);
		$('#flightete').text('ETE: ' + times[0]);
		$('#flighteta').text('ETA: ' + times[1]);
		$('#todete').text('ETE: ' + times[2]);
		$('#todeta').text('ETA: ' + times[3]);
		$('#flightdist').text(flightdist + ' nm');
		$('#externaldist').text(flightdist + ' nm');
		$('#toddist').text((flightdist - waypoints.tod) + ' nm');
		$('#nextDist').text(nextdist + ' nm');
		$('#nextETE').text(times[4]);
	}
	
	/**
	 * Gets "Estimated Time En-Route"
	 *
	 * @param {Number} The distance to the destination
	 * @param {Boolean} a Is the aircraft in arrival
	 * @return {Array} The time after <code>helper.timeCheck(h, m)</code>
	 */
	function getete (d, a) {
		var hours = d / ges.aircraft.animationValue.ktas;
		var h = parseInt(hours);
		var m = Math.round(60 * (hours - h));
		if (a) m += Math.round(ges.aircraft.animationValue.altitude / 4000);
		return helper.timeCheck(h, m);
	}
	
	/**
	 * Gets "Estimated Time of Arrival"
	 *
	 * @param {Number} hours Hours
	 * @param {Number} minutes Minutes
	 * @return {Array} The timer after <code>helper.timeCheck(hours, minutes)</code>
	 */
	function geteta (hours, minutes) {
		var date = new Date();
		var h = date.getHours();
		var m = date.getMinutes();
		h += hours;
		m += Number(minutes);
		return helper.timeCheck(h, m);
	}
	
	return updateProgress;
});