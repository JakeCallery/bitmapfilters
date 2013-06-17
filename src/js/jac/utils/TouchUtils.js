/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var TouchUtils = {};

	    /**
	     * Returns and object with x and y properties that contain the relative x/y coords of the click
	     * @param {Object} $domTarget
	     * @param {Event} $clickEvent
	     * @param {Object} [$propObj] you can provide your own object for .x and .y to be set on.  good to keep the number of new objects to a min
	     * @returns {Object} this object has .x and .y props
	     */
	    TouchUtils.getRelCoords = function($domTarget, $clickEvent, $propObj){
		    var returnObj = $propObj || {};

		    if($clickEvent.offsetX !== undefined && $clickEvent.offsetY !== undefined){
			    returnObj.x = $clickEvent.offsetX;
			    returnObj.y = $clickEvent.offsetY;
			    return returnObj;
		    } else {
			    var totalOffsetX = 0;
			    var totalOffsetY = 0;
			    var currentElement = $domTarget;

			    do {
				    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
				    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
			    } while(currentElement = currentElement.offsetParent);

			    returnObj.x = $clickEvent.pageX - totalOffsetX;
			    returnObj.y = $clickEvent.pageY - totalOffsetY;
			    return returnObj;
		    }
	    };

	    /**
	     * Find the index of a touch in a list of touches
	     * @param {Array.<Touch>} $touchList
	     * @param {string} $id
	     * @returns {number}
	     */
        TouchUtils.getTouchIndex = function($touchList, $id){
	        for(var i = 0, l = $touchList.length; i < l; i++){
				if($id === $touchList[i].identifier){
					return i;
				}
	        }
	        return -1;
        };

        //Return constructor
        return TouchUtils;
    })();
});
