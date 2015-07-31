'use strict';

define(function() {
	return {
		input: "",
		route: [],
		nextWaypoint: "",
		
		makeFixesArray: function() {
			var result = [];
			var departureVal = $('#departureInput').val();
			if (departureVal) result.push(departureVal);
			$('.waypoint td:first-child div > input').each(function() {
				result.push($(this).val());
			});
			var arrivalVal = $('#arrivalInput').val();
			if (arrivalVal) result.push(arrivalVal);
			
			return result;
		},
		
		toFixesString: function() {
			return makeFixesArray().join(" ");
		}, 
		
		toRouteString: function() {
			return JSON.stringify ([
				$('#departureInput').val(), 
				$('#arrivalInput').val(), 
				$('#flightNumInput').val(), 
				route
			]); // .replace(/null/g, 'undefined');
		},
		
		getCoords : function (wpt) {
			if (autopilot_pp.require('icaoairports')[wpt]) {
				return autopilot_pp.require('icaoairports')[wpt];
			} else if (autopilot_pp.require('waypoints')[wpt]) {
				return autopilot_pp.require('waypoints')[wpt];
			} else return false;
		},

		// Helper method, format the coordinates
		formatCoords : function (a) {
			if (a.indexOf(' ') > -1) {
				var array = a.split(' ');
				var d = Number(array[0]);
				var m = Number(array[1]) / 60;
				var coords;
				if (d < 0) coords = d - m;
				else coords = d + m;
				return coords;
			} else return Number(a);
		},

		// Turn a skyvector link or a normal waypoint input (seperated by spaces) to waypoints
		toRoute : function (url) {
			if (url.indexOf('["') === 0) loadFromSave(url);
			else {
				var index = url.indexOf('fpl=');
				var isSkyvector = url.indexOf('skyvector.com') !== -1 && index !== -1;
				var isWaypoints = true;
				var departure = $('#wptDeparture')[0].checked;
				var arrival = $('#wptArrival')[0].checked;
				var n = $('#waypoints tbody tr').length - 1;
				var a;
				var str = [];

				if (isSkyvector) str = url.substring(index + 4).trim().split(" ");
				else {
					str = url.trim().toUpperCase().split(" ");
					for (var i = 0; i < str.length; i++)
						if (str[i].length > 5 || str[i].length < 1 || !(/^\w+$/.test(str[i])))
							isWaypoints = false;
				}

				if (isSkyvector || isWaypoints) {
					for (var i = 0; i < n; i++) {
						removeWaypoint(1);
					}
					route = [];

					if (departure) {
						var wpt = str[0];
						$('#departureInput').val(wpt).change();
						a = 1;
					} else {
						a = 0;
						$('#departureInput').val("").change();
					}
					for (var i = 0; i + a < str.length; i++) {
						addWaypoint();
						var wpt = str[i + a];
						$('#waypoints input.wpt:eq(' + i + ')').val(wpt).change();
					}
					if (arrival) {
						var wpt = str[str.length - 1];
						$('#arrivalInput').val(wpt).change();
					}
				} else {
					if (!isWaypoints) {
						if (!isSkyvector) alert("Invalid Skyvector Link");
						else alert("Invalid Waypoints Input");
					}
				}
			}
		},

		// Adds waypoint input field
		addWaypoint : function() {
			route.length++;
			var n = route.length;
			route[route.length - 1] = [];
			$('<tr>')
				.addClass('waypoint')
				.append(

					// Waypoint
					$('<td>')
					.append(
						$('<div>')
						.addClass('input-prepend input-append')
						.append(
							$('<input>')
							.addClass('input-medium')
							.addClass('wpt')
							.css('width', '75px')
							.attr('type', 'text')
							.attr('placeholder', 'Fix/Apt.')
							.change(function() {
								var n = $(this).val();
								var coords = getCoords(n);
								var index = $(this).parents().eq(2).index() - 1;
								if (!coords) {
									route[index][0] = n;
									route[index][4] = false;
								} else {
									$(this).parents().eq(2).children('.position').children('div').children('.lat').val(coords[0]);
									$(this).parents().eq(2).children('.position').children('div').children('.lon').val(coords[1]);
									route[index] = [n, coords[0], coords[1], undefined, true];
								}
							})
						)
					)

					// Position
					, $('<td>')
					.addClass('position')
					.append(
						$('<div>')
						.addClass('input-prepend input-append')
						.append(
							$('<input>')
							.addClass('input-medium lat')
							.css('width', '80px')
							.attr({
								'type': 'text',
								'tabindex': '-1'
							})
							.change(function() {
								var index = $(this).parents().eq(2).index() - 1;
								route[index][1] = formatCoords($(this).val());
								route[index][4] = false;
							}), $('<input>')
							.addClass('input-medium lon')
							.css('width', '80px')
							.attr({
								'type': 'text',
								'tabindex': '-1'
							})
							.change(function() {
								var index = $(this).parents().eq(2).index() - 1;
								route[index][2] = formatCoords($(this).val());
								route[index][4] = false;
							})
						)
					)

					// Altitude
					, $('<td>')
					.addClass('altitude')
					.append(
						$('<div>')
						.addClass('input-prepend input-append')
						.append(
							$('<input>')
							.addClass('input-medium alt')
							.css('width', '40px')
							.attr({
								'type': 'text',
								'tabindex': '-1',
								'placeholder': 'Ft.'
							})
							.change(function() {
								var index = $(this).parents().eq(2).index() - 1;
								route[index][3] = Number($(this).val());
							})
						)
					)

					// Actions
					, $('<td>')
					.append(
						$('<div>')
						.addClass('input-prepend input-append')
						.append(

							// Activate
							$('<button>')
							.attr('type', 'button')
							.addClass('btn btn-standard activate')
							.text('Activate')
							.click(function() {
								var n = $(this).parents().eq(2).index();
								activateLeg(n);
							})

							// Shift up
							, $('<button>')
							.attr('type', 'button')
							.addClass('btn btn-info')
							.append($('<i>').addClass('icon-arrow-up'))
							.click(function() {
								var row = $(this).parents().eq(2);
								shiftWaypoint(row, row.index(), "up");
							})

							// Shift down
							, $('<button>')
							.attr('type', 'button')
							.addClass('btn btn-info')
							.append($('<i>').addClass('icon-arrow-down'))
							.click(function() {
								var row = $(this).parents().eq(2);
								shiftWaypoint(row, row.index(), "down");
							})

							// Remove
							, $('<button>')
							.attr('type', 'button')
							.addClass('btn btn-danger')
							.append($('<i>').addClass('icon-remove'))
							.click(function() {
								var n = $(this).parents().eq(2).index();
								removeWaypoint(n);
							})
						)
					)
				).appendTo('#waypoints');
		},

		// Remove waypoint at index n
		removeWaypoint : function (n) {
			$('#waypoints tr:nth-child(' + (n + 1) + ')').remove();
			route.splice((n - 1), 1);
			if (nextWaypoint == n) {
				nextWaypoint = null;
			}
		},

		// Saves the waypoints data into localStorage
		saveData : function() {
			if (route.length < 1 || !route[0][0]) {
				alert ("There is no route to save");
			} else {
				localStorage.removeItem('fmcWaypoints');
				var arr = toRouteString();
				localStorage.setItem ("fmcWaypoints", arr);
			}
		},

		// Retrieves the saved data and adds to the waypoint list
		loadFromSave : function (arg) {
	
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
			var waypoints = fmc.waypoints;
			var arr = JSON.parse(arg);
			localStorage.removeItem('fmcWaypoints');
	
			if (arr) {
				route = [];
				var route = arr[3];
				var n = $('#waypoints tbody tr').length - 1;
				for (var i = 0; i < n; i++) {
					removeWaypoint(1);
				}
				// JSON.stringify turns undefined into null; this loop turns it back
				route.forEach(function (wpt) {
					if (!wpt[3] || wpt[3] == null || wpt[3] == 0) wpt[3] = undefined;
				});
		
				if (arr[0]) $('#departureInput').val(arr[0]).change();
				if (arr[1]) $('#arrivalInput').val(arr[1]).change();
				if (arr[2]) $('#flightNumInput').val(arr[2]).change();
		
				for (var i = 0; i < route.length; i++) {
					addWaypoint();
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
				saveData();
		
			} else alert ("You did not save the waypoints or you cleared the browser's cache");
		}
	};
});