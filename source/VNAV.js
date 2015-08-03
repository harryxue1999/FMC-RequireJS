'use strict';

define(['fmc/waypoints', 'fmc/math', 'phase', 'distance/route'], function (waypoints, math, flightPhase, getRouteDistance) {
	/**
 	 * Controls VNAV, plane's vertical navigation, set on a timer
	 *
 	 * @TODO VNAV bugs fix + new implementation: ALMOST DONE
 	 */
	function updateVNAV () {
		var route = waypoints.route;
		var tod = waypoints.tod;
		var todCalc = waypoints.todCalc;
		var cruise = waypoints.cruise;
		var phase = flightPhase.phase;
		var fieldElev = waypoints.fieldElev;
	
		var params = getFlightParameters();
	
		var next = getNextWaypointWithAltRestriction();
		var hasRestriction = next !== -1;
	
		var currentAlt = ges.aircraft.animationValue.altitude;
		var targetAlt, deltaAlt, nextDist, targetDist;
		if (hasRestriction) {
			targetAlt = route[next - 1][3];
			deltaAlt = targetAlt - currentAlt;
			nextDist = getRouteDistance(next);
			targetDist = getTargetDist(deltaAlt);
			console.log('targetAlt: ' + targetAlt + ', deltaAlt: ' + deltaAlt + ', nextDist: ' + nextDist + ', targetDist: ' + targetDist);
		}
	
		var spd, vs, alt;
		var tSpd = $('#tSpd').hasClass('btn-warning');
		if (tSpd) spd = params[0];

		// If the aircraft is climbing
		if (phase == "climb") {
	
			// If there is an altitude restriction somewhere on the route
			if (hasRestriction) {
				var totalDist = getTargetDist(cruise - currentAlt) + getTargetDist(targetAlt - cruise);
		
				// Checks to see if the altitude restriction is on the climbing phase or descent phase
				if (nextDist < totalDist) {
					if (nextDist < targetDist) vs = math.getClimbrate(deltaAlt, nextDist);
					else vs = params[1];
					alt = targetAlt;
				} else {
					vs = params[1];
					alt = cruise;
				}
			}
	
			// If there are no altitude restrictions left on the route
			else {
				vs = params[1];
				alt = cruise;
			}
		} 

		// If the aircraft is on descent
		else if (phase == "descent") {
	
			// If there is an altitude restriction somewhere on the route
			if (hasRestriction) {

				// If targetDist has been reached
				if (nextDist < targetDist) {
					vs = math.getClimbrate(deltaAlt, nextDist);
					alt = targetAlt;
				}
			
				// If targetDist hasn't been reached do nothing until it has been reached
			} 
	
			// If there are no altitude restrictions left on the route
			else {
			    vs = params[1];
				if (currentAlt > 12000 + fieldElev) alt = 12000 + fieldElev;
			}
		}
	
		// Calculates Top of Descent
		if (todCalc || !tod) {
			if (hasRestriction) {
				tod = getRouteDistance(route.length) - nextDist;
				tod += getTargetDist(targetAlt - cruise);
			} else {
				tod = getTargetDist(fieldElev - cruise);
			}
			tod = Math.round(tod);
			$('#todInput').val('' + tod).change();
			console.log('TOD changed to ' + tod);
		}
	
		// Updates SPD, VS, and ALT in Autopilot++ if new values exist
		if (spd) $('#Qantas94Heavy-ap-spd > input').val('' + spd).change();
		if (vs) $('#Qantas94Heavy-ap-vs > input').val('' + vs).change();
		if (alt) $('#Qantas94Heavy-ap-alt > input').val('' + alt).change();
	
		// Updates flight phase
		flightPhase.update();
	}
	
	/**
	 * Gets each plane's flight parameters, for VNAV
	 *
	 * @param {String} aircraft The aircraft name
	 * @return {Array} vertical speed and speed
	 */
	function getFlightParameters (aircraft) {
		var spd, vs;
		var gndElev = ges.groundElevation * metersToFeet;
		var a = ges.aircraft.animationValue.altitude;
		var isMach = $('#Qantas94Heavy-ap-spd span:last-child').text().trim() === 'M.';
		var switchMode = function() {
			$('#Qantas94Heavy-ap-spd span:last-child').click();
		};

		// CLIMB
		if (flightPhase.phase == "climb") {
			if (a > 1500 + gndElev && a <= 4000 + gndElev) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "a380":
				case "md11":
				case "concorde":
				case "156":
				case "161":
				case "162":
				case "164":
				case "166":
				case "167":
				case "172":
				case "183":
				case "187":
				case "200":
					spd = 210;
					vs = 3000;
					break;
				default:
					break;
				}
			} else if (a > 4000 + gndElev && a <= 10000 + gndElev) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "a380":
				case "md11":
				case "concorde":
				case "156":
				case "161":
				case "162":
				case "164":
				case "166":
				case "167":
				case "172":
				case "183":
				case "187":
				case "200":
					spd = 245;
					vs = 2500;
					break;
				default:
					break;
				}
			} else if (a > 10000 + gndElev && a <= 18000) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "a380":
				case "md11":
				case "concorde":
				case "156":
				case "161":
				case "164":
				case "167":
				case "172":
				case "183":
				case "187":
					spd = 295;
					vs = 2200;
					break;
				case "162":
				case "166":
				case "200":
					spd = 290;
					vs = 2200;
					break;
				default:
					break;
				}
			} else if (a > 18000 && a <= 24000) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "concorde":
				case "a380":
				case "156":
				case "161":
				case "167":
				case "172":
				case "183":
					spd = 310;
					vs = 1800;
					break;
				case "md11":
				case "164":
				case "187":
					spd = 300;
					vs = 1800;
					break;
				case "162":
				case "166":
				case "200":
					spd = 295;
					vs = 1800;
					break;
				default:
					break;
				}
			} else if (a > 24000 && a <= 26000) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "a380":
				case "156":
				case "161":
				case "167":
				case "172":
					vs = 1500;
					break;
				default:
					break;
				}
			} else if (a > 26000 && a <= 28000) {
				if (isMach) switchMode();
				switch (aircraft) {
				case "md11":
				case "162":
				case "164":
				case "166":
				case "183":
				case "187":
				case "200":
					vs = 1500;
					break;
				default:
					break;
				}
			} else if (a > 29500) {
				if (!isMach) switchMode();
				switch (aircraft) {
				case "162":
				case "166":
				case "200":
					spd = 0.76;
					break;
				case "a380":
				case "156":
				case "161":
				case "167":
				case "172":
					spd = 0.82;
					break;
				case "md11":
				case "164":
				case "187":
					spd = 0.78;
					vs = 1200;
					break;
				case "183":
					spd = 0.80;
					break;
				default:
					break;
				}
			}
			if (a > waypoints.cruise - 100 && waypoints.cruise > 18000) {
				if (!isMach) switchMode();
				switch (aircraft) {
				case "162":
					spd = 0.785;
					break;
				case "166":
				case "200":
					spd = 0.78;
					break;
				case "161":
				case "172":
					spd = 0.84;
					break;
				case "a380":
				case "156":
				case "167":
					spd = 0.85;
					break;
				case "md11":
				case "164":
				case "187":
					spd = 0.80;
					break;
				case "183":
					spd = 0.82;
					break;
				case "concorde":
					spd = 2;
					break;
				default:
					break;
				}
			}
		}

		// DESCENT
		else if (flightPhase.phase == "descent") {
			if (a > waypoints.cruise - 700) {
				if (!isMach) switchMode();
				vs = -1000;
			} else {
				if (a > 45000) {
					if (!isMach) switchMode();
					switch (aircraft) {
					case "concorde":
						spd = 1.5;
						vs = -2000;
						break;
					default:
						break;
					}
				} else if (a > 30000 && a <= 45000) {
					if (!isMach) switchMode();
					switch (aircraft) {
					case "concorde":
						vs = -3600;
						break;
					case "a380":
					case "156":
					case "161":
					case "167":
					case "172":
						spd = 0.83;
						vs = -2400;
						break;
					case "183":
						spd = 0.81;
						vs = -2300;
						break;
					case "md11":
					case "162":
					case "164":
					case "166":
					case "187":
					case "200":
						spd = 0.77;
						vs = -2300;
						break;
					default:
						break;
					}
				} else if (a > 18000 && a <= 30000) {
					if (isMach) switchMode();
					switch (aircraft) {
					case "162":
					case "166":
					case "200":
						spd = 295;
						vs = -2100;
						break;
					case "a380":
					case "md11":
					case "156":
					case "161":
					case "164":
					case "167":
					case "172":
					case "183":
					case "187":
						spd = 310;
						vs = -2200;
						break;
					case "concorde":
						spd = 330;
						vs = -2400;
						break;
					default:
						break;
					}
				} else if (a > 12000 + gndElev && a <= 18000) {
					if (isMach) switchMode();
					switch (aircraft) {
					case "a380":
					case "md11":
					case "concorde":
					case "156":
					case "161":
					case "162":
					case "164":
					case "166":
					case "167":
					case "172":
					case "183":
					case "187":
					case "200":
						spd = 280;
						vs = -1800;
						break;
					default:
						break;
					}
				}
			}
		}

		return [spd, vs];
	}
	
	/**
	 * Computes the distance needed to climb or descend to a certain altitude from current altitude
	 * 
	 * @param {Number} deltaAlt The altitude difference
	 * @return {Number} The distance
	 */
	function getTargetDist (deltaAlt) {
		var targetDist;
		if (deltaAlt < 0) {
			targetDist = deltaAlt / -1000 * 3.4;
		} else {
			targetDist = deltaAlt / 1000 * 2.5;
		}
		return targetDist;
	}
	
	/**
	 * Gets the next waypoint that has an altitude restriction
	 *
	 * @return The index of the waypoint if eligible,
	 * 		   -1 if not eligible
	 */
	function getNextWaypointWithAltRestriction () {
		for (var i = waypoints.nextWaypoint; i <= waypoints.route.length; i++) {
			if (waypoints.route[i - 1][3]) return i;
		}
		return -1;
	}
	
	return updateVNAV;
	
});