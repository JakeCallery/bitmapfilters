/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Vec2DObj object (for use with Vec2D.js)
         * @param {Number} $x
         * @param {Number} $y
         * @param {Number} [$xOffset=0]
         * @param {Number} [$yOffset=0]
         * @constructor
         */
        function Vec2DObj($x, $y, $xOffset, $yOffset){
	        if($xOffset === undefined){$xOffset = 0;}
	        if($yOffset === undefined){$yOffset = 0;}
	        this.x = $x;
	        this.y = $y;
	        this.xOffset = $xOffset;
	        this.yOffset = $yOffset;
        }

	    /**
	     *
	     * @returns {{x1: {Number}, y1: {Number}, x2: {Number}, y2: {Number}}}
	     */
	    Vec2DObj.prototype.getLineSeg = function(){
		    return {x1:this.xOffset, y1:this.yOffset, x2:(this.x + this.xOffset), y2:(this.y + this.yOffset)};
	    };

	    Vec2DObj.prototype.updateFromLineSeg = function($x1, $y1, $x2, $y2){
		    this.xOffset = $x1;
		    this.yOffset = $y1;
		    this.x = $x2 - $x1;
		    this.y = $y2 - $y1;
	    };

        //Return constructor
        return Vec2DObj;
    })();
});
