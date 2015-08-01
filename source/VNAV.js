'use strict';

define(['fmc/waypoints', 'fmc/math', 'phase', 'distance/route'], function (waypoints, math, flightPhase, getRouteDistance) {
	/**
 	 * Controls VNAV, plane's vertical navigation, set on a timer
	 *
 	 * @TODO VNAV bugs fix + new implementation: ALMOST DONE
 	 */
	function updateVNAV () {
		var aircraft = ges.aircraft.name;
		var next = getNextWaypointWithAltRestriction();
		var currentAlt = ges.aircraft.animationValue.altitude;
	
		if (next < 1) var targetAlt = currentAlt;
		else var targetAlt = waypoints.route[next - 1][3];
	
		var deltaAlt = targetAlt - currentAlt;
		var nextDist = getRouteDistance(next);
		var targetDist = getTargetDist(deltaAlt);

		var params = getFlightParameters(aircraft);
	
		var spd = params[0];
		var vs, alt;
	
		var hasRestriction = next !== -1;
		var targetReached = targetDist >= nextDist;
	
		// Manual override, is toggled
		var tSpd = $('#tSpd').hasClass('btn-primary');
		var tAlt = $('#tAlt').hasClass('btn-primary'); 
		var tVS = $('#tVS').hasClass('btn-primary');
		
		console.log('SPD Toggled: ' + tSpd + ', ALT Toggled: ' + tAlt + ', V/S Toggled: ' + tVS);
	
		// If there is an altitude restriction
		if (hasRestriction) {
			console.log('Next Waypoint with Altitude Restriction: ' + waypoints.route[next - 1][0] + ' @ ' + waypoints.route[next - 1][3]);
			console.log('deltaAlt: ' + deltaAlt + ', targetDist: ' + targetDist + ', nextDist: ' + nextDist);
			// If target is not reached
			if (!targetReached) {
				// If phase is climb
				if (flightPhase.phase == "climb") {
					// Total distance it takes from current altitude to waypoints.cruise and from waypoints.cruise down to the next target altitude
					var upAndDownDist = getTargetDist(waypoints.cruise - currentAlt) + getTargetDist(targetAlt - waypoints.cruise);
					var incursionSetting = nextDist < upAndDownDist;
					console.log('upAndDownDist: ' + upAndDownDist + ", Altitude incursion protection: " + incursionSetting);
				
					// If the current altitude approaches the restriction
					// Given that the distance to next restricted waypoint is smaller than upAndDownDist
					if (Math.abs(currentAlt - targetAlt) < 300 && incursionSetting) {
						alt = targetAlt; 
						vs = 1500;
					}
					// Normal conditions: 
					else {
						alt = waypoints.cruise;
						vs = params[1];
					}
				}
				// if phase is descent, keep current altitude until target is reached
			
				/* Alternative solution: 
				if (flightPhase.phase == "descent") {
					// If target altitude approached prematurely
					if (Math.abs(currentAlt - targetAlt) < 300) {
						alt = targetAlt; 
						vs = -1000;
					}
					else {
						// If still in VNAV controlled descent altitude
						if (currentAlt > 11000) {
							alt = 11000;
							vs = params[1];
						}
					}
				}*/
			}
		
			// If target is reached
			else {
				alt = targetAlt;
				vs = math.getClimbrate(deltaAlt, nextDist);
				console.log('VS: ' + vs + ' fpm');
			}
		} /*End of hasRestriction block*/
	
		// If there is not an altitude restriction
		else {
			vs = params[1];
			if (flightPhase.phase == "climb") {
				alt = waypoints.cruise;
			} else if (flightPhase.phase == "descent" && currentAlt > 11000) {
				alt = 11000;
			}
		}
	
		// Checks Top of Descent
		if (waypoints.todCalc || !waypoints.tod) {
			if (hasRestriction) {
				waypoints.tod = getRouteDistance(waypoints.route.length) - nextDist;
				waypoints.tod += targetDist;
			} else {
				waypoints.tod = getTargetDist(waypoints.cruise - waypoints.arrivalAlt);
			}
			waypoints.tod = Math.round(waypoints.tod);
			$('#todInput').val('' + waypoints.tod).change();
		}

		if (spd && tSpd) $('#Qantas94Heavy-ap-spd > input').val('' + spd).change();
		if (vs && tVS) $('#Qantas94Heavy-ap-vs > input').val('' + vs).change();
		if (alt && tAlt) $('#Qantas94Heavy-ap-alt > input').val('' + alt).change();

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