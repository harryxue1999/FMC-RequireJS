'use strict';

define(['helperMethods'], function (helper) {
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
			var time = helper.formatTime(helper.timeCheck(h, m));
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

	return updateLog;
});