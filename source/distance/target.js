'use strict';

define(function() {
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
	
	return getTargetDist;
});