'use strict';

define(['fmc/waypoints'], function (waypoints) {
	
	var route = waypoints.route;
	
	/**
	 * Turns the waypoints into an array
	 *
	 * @return {Array} The array of waypoint names
	 */
	function makeFixesArray () {
		var result = [];
		var departureVal = $('#departureInput').val();
		if (departureVal) result.push(departureVal);
		$('.waypoint td:first-child div > input').each(function() {
			result.push($(this).val());
		});
		var arrivalVal = $('#arrivalInput').val();
		if (arrivalVal) result.push(arrivalVal);
		
		return result;
	}
	
	/**
	 * Joins the fixes array into a string
	 *
	 * @return {String} All waypoints, each seperated by a space
	 */
	function toFixesString () {
		return makeFixesArray().join(" ");
	}
	
	/**
	 * Makes a sharable route
	 * 
	 * @return {String} A sharable route with airports and waypoints, 
	 * 					using <code>JSON.stringify</code> method
	 */
	function toRouteString () {
		return JSON.stringify ([
			$('#departureInput').val(), 
			$('#arrivalInput').val(), 
			$('#flightNumInput').val(), 
			route
		]);
	}
	
	/**
	 * Saves the waypoints data into localStorage
	 */
	function saveData () {
		if (route.length < 1 || !route[0][0]) {
			alert ("There is no route to save");
		} else {
			localStorage.removeItem('fmcWaypoints');
			var arr = toRouteString();
			localStorage.setItem ("fmcWaypoints", arr);
		}
	}

	/**
	 * Retrieves the saved data and adds to the waypoint list
	 *
	 * @param {String} arg The generated route
	 */
	function loadFromSave (arg) {
	
	/**
	 * The argument passed in [optional] or the localStorage is a 
	 * 3D array in String format. arr is the array after JSON.parse 
	 *	
	 * @param {String} arr[0] Departure input
	 * @param {String} arr[1] Arrival Input
	 * @param {String} arr[2] Flight Number
	 * @param {Array} arr[3] 2D array, the route
	 */
	
		arg = arg || localStorage.getItem('fmcWaypoints');
		var arr = JSON.parse(arg);
		localStorage.removeItem('fmcWaypoints');
	
		if (arr) {
			route = arr[3];
			var n = $('#waypoints tbody tr').length - 1;
			for (var i = 0; i < n; i++) {
				waypoints.removeWaypoint(1);
			}
			// JSON.stringify turns undefined into null; this loop turns it back
			route.forEach(function (wpt) {
				if (!wpt[3] || wpt[3] === null || wpt[3] === 0) wpt[3] = undefined;
			});
		
			if (arr[0]) $('#departureInput').val(arr[0]).change();
			if (arr[1]) $('#arrivalInput').val(arr[1]).change();
			if (arr[2]) $('#flightNumInput').val(arr[2]).change();
		
			for (var i = 0; i < route.length; i++) {
				waypoints.addWaypoint();
				$('#waypoints input.wpt:eq(' + i + ')').val(route[i][0]).change(); // Input the fix
			
				// If the waypoint is not eligible or a duplicate
				if (!route[i][4] || !$('#waypoints input.lat:eq(' + i + ')').val()) {
					$('#waypoints input.lat:eq(' + i + ')').val(route[i][1]).change(); // Input the lat.
					$('#waypoints input.lon:eq(' + i + ')').val(route[i][2]).change(); // Input the lon.
				}
			
				if (route[i][3]) // If there is an altitude restriction
					$('#waypoints input.alt:eq(' + i + ')').val(route[i][3]).change();
			}
			// Auto-saves the data once again
			waypoints.saveData();
		
		} else alert ("You did not save the waypoints or you cleared the browser's cache");
	}
	
	return {
		makeFixesArray: makeFixesArray,
		makeFixesString: toFixesString,
		makeRouteString: toRouteString,
		save: saveData,
		load: loadFromSave
	};
	
});