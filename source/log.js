'use strict';

define(function() {
	/**
	 * Updates plane's flight log
	 *
	 * @param [optional]{String} other Updates the log with other as extra info
	 */
	function updateLog (other) {
		if (!ges.pause && !flight.recorder.playing && !flight.recorder.paused) {
			var spd = Math.round(ges.aircraft.animationValue.ktas);
			var hdg = Math.round(ges.aircraft.animationValue.heading360);
			var alt = Math.round(ges.aircraft.animationValue.altitude);
			var fps = ges.debug.fps;
			var lat = (Math.round(10000*ges.aircraft.llaLocation[0]))/10000;
			var lon = (Math.round(10000*ges.aircraft.llaLocation[1]))/10000;
			var date = new Date();
			var h = date.getUTCHours();
			var m = date.getUTCMinutes();
			var time = formatTime(timeCheck(h, m));
			other = other || "none";
			$('<tr>')
				.addClass('data')
				.append(
				$('<td>'+time+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+spd+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+hdg+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+alt+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+lat+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+lon+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+fps+'</td>')
					.css('padding','0px 10px 0px 10px')
			,	$('<td>'+other+'</td>')
					.css('padding','0px 10px 0px 10px')
				).appendTo('#logData');
		}
	}
	
	/**
	 * Helper method to make sure that a time is eligible
	 *
	 * @param {Number} h The hours
	 * @param {Number} m The minutes
	 * @return {Array} Array of eligible time, [h, m]
	 */
	function timeCheck (h, m) {
		if (m >= 60) {
			m -= 60;
			h++;
		}
		if (h >= 24) h -= 24;
		return [h, m];
	}
	
	/**
	 * Helper method for log, formats the time
	 * 
	 * @param {Array} time An array of the time: [hours, minutes]
	 * @return {String} Formatted time: "hours : minutes"
	 */
	function formatTime (time) {
		time[1] = checkZeros(time[1]);
		return time[0] + ":" + time[1];
	}
	
	/**
	 * Helper method, format zeros
	 *
	 * @param {Number} i The number to be checked
	 * @return {String} The original number with 0's added
	 */
	function checkZeros (i) {
		if (i < 10) i = "0" + i;
		return i;
	}
	
	return updateLog;
});