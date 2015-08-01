'use strict';

define(['fmc/waypoints'], function (waypoints) {
	// Phase of flight
	var phase = "climb";
	
	/**
	 * Updates plane's phase of flying: climb, cruise, or descent
	 *
	 * @description Phase contains "climb," "cruise," and "descent"
	 * @param <restricted>[optional]{String} p Updates the phase to "p"
	 * @TODO add a better logic, especially near the cruise phase
	 */
	function updatePhase (p) {
		if ($('#phaseLock').hasClass('btn-danger')) return; // locked
		if (p) {
			phase = p;
			console.log('Phase set to ' + phase);
			$('#phaseBtn').text(phase.substring(0,1).toUpperCase() + phase.substring(1));
			return;
		}
		var original = phase;
		var alt = 100 * Math.round(ges.aircraft.animationValue.altitude / 100);
		if (ges.aircraft.groundContact) {
			phase = "climb";
		} else {
			if (phase != "cruise" && alt == waypoints.cruise) {
				phase = "cruise";
			} else if (phase == "cruise" && alt != waypoints.cruise) {
				phase = "descent";
			}
		}
		if (original !== phase) updatePhase(phase);
	}
	
	return {
		phase: phase,
		update: updatePhase
	};
});