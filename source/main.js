// jshint unused:false
/*global requirejs*/

'use strict';

require(['fmc/math', 'fmc/waypoints', 'LNAV', 'VNAV', 'log', 'progress', 'distance/route'], 
function (math, waypoints, updateLNAV, updateVNAV, log, updateProgress, getRouteDistance) {
	var cruise = waypoints.cruise;
	
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
		log.update();
		clearInterval(logTimer);
		if (ges.aircraft.animationValue.altitude > 18000) {
			logTimer = setInterval(tLog, 120000);
		} else logTimer = setInterval(tLog, 30000);
	};
		
	/**
	 * Enables VNAV if not activated, disables if activated
	 */
	function toggleVNAV () {
		if (waypoints.VNAV) {
			waypoints.VNAV = false;
			$('#vnavButton').removeClass('btn btn-warning').addClass('btn');
			clearInterval(VNAVTimer);
		} else if (cruise) {
			waypoints.VNAV = true;
			$('#vnavButton').removeClass('btn').addClass('btn btn-warning');
			VNAVTimer = setInterval(updateVNAV, 5000);
		} else alert('Please enter a cruising altitude.');
	}	
	
	/**
	 * Enables or disables the speed control in VNAV
	 */
	function toggleSpeed() {
		if ($('#tSpd').hasClass('btn-warning')) {
			$('#tSpd').removeClass('btn-warning').addClass('btn-default').text('OFF');
			waypoints.spdControl = false;
		
		} else {
			$('#tSpd').removeClass('btn-default').addClass('btn-warning').text('ON');
			waypoints.spdControl = true;
		}
	}
		
	// Adds a confirm window to prevent accidental reset
	ges.resetFlight = function () {
		if (window.confirm('Reset Flight?')) {
			if (ges.lastFlightCoordinates) {
				ges.flyTo(ges.lastFlightCoordinates, true);
				log.update('Flight reset');
			}
		}
	};

	// Tracks pause event to log
	ges.togglePause = function () {
		if (!ges.pause) {
			log.update('Flight paused');
			ges.doPause();
		} else {
			ges.undoPause();
			log.update('Flight resumed');
		}
	};
	
	// Hides backdrop for the modal	
	$('#fmcModal').modal({
		backdrop: false,
		show: false
	});

	// Stops immediate keyup actions in the FMC Modal
	$('#fmcModal').keyup(function(event) {
		event.stopImmediatePropagation();
	});

	// Initializes to 1 waypoint input field on load
	waypoints.addWaypoint();	
	
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
