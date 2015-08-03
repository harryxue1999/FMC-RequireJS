// jshint unused:false
/*global requirejs*/

'use strict';

require(['fmc/math', 'fmc/waypoints', 'LNAV', 'VNAV', 'log', 'progress', 'distance/route'], 
function (math, waypoints, updateLNAV, updateVNAV, updateLog, updateProgress, getRouteDistance) {
	
	/**
	 * Updates progress, on a timer
	 */
	var progTimer = setInterval(updateProgress, 5000);
	
	/**
	 * Updates LNAV, on a timer
	 */
	var LNAVTimer = setInterval(tLNAV, 5000);
	var tLNAV = function() {
		var d = getRouteDistance(waypoints.nextWaypoint);
		updateLNAV();
		clearInterval(LNAVTimer);
		if (d < ges.aircraft.animationValue.kias / 60) LNAVTimer = setInterval(tLNAV, 5000);
		else LNAVTimer = setInterval(tLNAV, 30000);
	};
	
	/**
	 * Updates VNAV, on a timer
	 * @description Interval to be defined after elements load
	 */
	var VNAVTimer;
	
	/**
	 * Updates log, on a timer
	 */
	var logTimer = setInterval(tLog, 120000);
	var tLog = function() {
		updateLog();
		clearInterval(logTimer);
		if (ges.aircraft.animationValue.altitude > 18000) {
			logTimer = setInterval(tLog, 120000);
		} else logTimer = setInterval(tLog, 30000);
	}
	
		
	/** 
	 * Defines Array prototype to move an array
	 *
	 * @param {Number} index1 The start index
	 * @param {Number} index2 The end/target index
	 */
	Array.prototype.move = function (index1, index2) {
		if (index2 >= this.length) {
			var k = index2 - this.length;
			while ((k--) + 1) {
				this.push(undefined);
			}
		}
		this.splice(index2, 0, this.splice(index1, 1)[0]);
		return this;
	};
	
	window.fmc = {
		require: require,
		define: define,
		requirejs: requirejs,
		version: ""
	};
});
