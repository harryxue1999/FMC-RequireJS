'use strict';

define(['phase'], function(phase) {
	var isMach = $('#Qantas94Heavy-ap-spd span:last-child').text().trim() === 'M.';
	
	// Switches mode between Mach. and KIAS
	function switchMode() {
		$('#Qantas94Heavy-ap-spd span:last-child').click();
	}
	
	// @returns vertical speed and speed of aircraft
	function getFlightParameters (aircraft) {
		var spd, vs;
		var gndElev = ges.groundElevation * metersToFeet;
		var a = ges.aircraft.animationValue.altitude;
		

		// CLIMB
		if (phase == "climb") {
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
				case "170":
				case "172":
				case "183":
				case "187":
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
				case "170":
				case "172":
				case "183":
				case "187":
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
				case "170":
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
				case "170":
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
				case "170":
				case "183":
				case "187":
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
				case "170":
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
			if (a > cruise - 100 && cruise > 18000) {
				if (!isMach) switchMode();
				switch (aircraft) {
				case "162":
				case "166":
				case "170":
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
		else if (phase == "descent") {
			if (a > cruise - 700) {
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
					case "170":
					case "187":
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
					case "170":
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
					case "170":
					case "172":
					case "183":
					case "187":
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
	
	return getFlightParameters;
});