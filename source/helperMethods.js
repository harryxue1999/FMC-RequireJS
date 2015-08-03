'use strict';

define(function() {	
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
	
	return {
		timeCheck: timeCheck,
		formatTime: formatTime, 
		checkZeros: checkZeros
	};
});