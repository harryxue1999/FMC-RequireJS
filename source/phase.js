'use strict';

define(['fmc/waypoints', 'distance/route'], function (waypoints, getRouteDistance) {
	// Phase of flight
	var phase = "climb";
	
	/**
	 * Updates plane's phase of flying: climb, cruise, or descent
	 *
	 * @description Phase contains "climb," "cruise," and "descent"
	 * @param <restricted>[optional]{String} p Updates the phase to "p"
	 * @TODO add a better logic, especially near the cruise phase
	 */
	function updatePhase() {
		var cruise = waypoints.cruise;
		var route = waypoints.route;
		var tod = waypoints.tod;
		
		var currentAlt = 100 * Math.round(ges.aircraft.animationValue.altitude / 100);
		if (phase === "climb" && currentAlt === Number(cruise)) {
			$('#phaseBtn').click();
		} else if (phase === "cruise") {
			var dist = getRouteDistance(route.length + 1);
			if (currentAlt !== Number(cruise)) {
				$('#phaseBtn').click();
			} else if (dist <= tod) {
				$('#phaseBtn').click();
			}
		}
	}
	
	return {
		phase: phase,
		update: updatePhase
	};
});