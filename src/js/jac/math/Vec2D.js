/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 *
 * Modified version of http://www.cgrats.com/javascript-2d-vector-library.html
 * written by Tudor Nita | cgrats.com
 *
 */

define([
'jac/math/FastMath',
'jac/math/Vec2DObj'],
function(FastMath, Vec2DObj){
    return (function(){
	    /**
	     * Static library for some 2D Vector Math stuff
	     * @static
	     */
	    var Vec2D = {};

	    Vec2D.multScalar = function($targetVec2D, $value){
		    $targetVec2D.x *= $value;
		    $targetVec2D.y *= $value;
	    };

	    Vec2D.multVector = function($targetVec2D, $vec2D){
		    $targetVec2D.x *= $vec2D.x;
		    $targetVec2D.y *= $vec2D.y;
	    };

	    Vec2D.divScalar = function($targetVec2D, $value){
			$targetVec2D.x /= $value;
			$targetVec2D.y /= $value;
	    };

	    Vec2D.addScalar = function($targetVec2D, $value){
		    $targetVec2D.x += $value;
		    $targetVec2D.y += $value;
	    };

	    Vec2D.addVector = function($targetVec2D, $vec2D){
		    $targetVec2D.x += $vec2D.x;
		    $targetVec2D.y += $vec2D.y;
	    };

	    Vec2D.subScalar = function($targetVec2D, $value){
		    $targetVec2D.x -= $value;
		    $targetVec2D.y -= $value;
	    };

	    Vec2D.subVector = function($targetVec2D, $vec2D){
		    $targetVec2D.x -= $vec2D.x;
		    $targetVec2D.y -= $vec2D.y;
	    };

	    Vec2D.abs = function($targetVec2D){
		    $targetVec2D.x = FastMath.abs($targetVec2D.x);
		    $targetVec2D.y = FastMath.abs($targetVec2D.y);
	    };

	    Vec2D.normalize = function($vec2D){
			var len = Vec2D.lengthOf($vec2D);
		    $vec2D.x = $vec2D.x / len;
		    $vec2D.y = $vec2D.y / len;
	    };

	    Vec2D.duplicate = function($vec2D){
		    return new Vec2DObj($vec2D.x, $vec2D.y, $vec2D.xOffset, $vec2D.yOffset);
	    };

	    Vec2D.dot = function($vec2Da, $vec2Db){
		    return ($vec2Da.x * $vec2Db.x) + ($vec2Da.y * $vec2Db.y);
	    };

	    Vec2D.scaledDot = function($vec2Da, $vec2Db){
		    var len = Vec2D.lengthOf($vec2Db);
		    return ($vec2Da.x * ($vec2Db.x / len) + ($vec2Da.y * ($vec2Db.y / len)));
	    };

	    Vec2D.projectVectorOnVector = function($targetVec2D, $vec2Da, $vec2Db){
		    var dot = Vec2D.scaledDot($vec2Da, $vec2Db);
		    var len = Vec2D.lengthOf($vec2Db);
		    $targetVec2D.x = dot * ($vec2Db.x/len);
		    $targetVec2D.y = dot * ($vec2Db.y/len);
	    };

	    Vec2D.calcLeftNormal = function($targetVec2D, $vec2D){
			$targetVec2D.x = $vec2D.y;
		    $targetVec2D.y = -$vec2D.x;
	    };

	    Vec2D.calcRightNormal = function($targetVec2D, $vec2D){
			$targetVec2D.x = -$vec2D.y;
		    $targetVec2D.y = $vec2D.x;
	    };

	    Vec2D.lengthOf = function($vec2D){
			return Math.sqrt(($vec2D.x * $vec2D.x) + ($vec2D.y * $vec2D.y));
	    };

	    Vec2D.lengthSqrOf = function($vec2D){
			return (($vec2D.x * $vec2D.x) + ($vec2D.y * $vec2D.y));
	    };

	    Vec2D.lerp = function($targetVec2D, $vec2Da, $vec2Db, $value){
			$targetVec2D.x = $vec2Da.x + ($vec2Db.x-$vec2Da.x) * $value;
		    $targetVec2D.y = $vec2Da.y + ($vec2Db.y - $vec2Da.y) * $value;
	    };

	    Vec2D.move = function($targetVec2D, $xOffset, $yOffset){
		    $targetVec2D.xOffset = $xOffset;
		    $targetVec2D.yOffset = $yOffset;
	    };

	    Vec2D.vecFromLineSeg = function($targetVec2D, $x1, $y1, $x2, $y2){
		    var xDiff = $x2 - $x1;
		    var yDiff = $y2 - $y1;

		    $targetVec2D.x = xDiff;
		    $targetVec2D.y = yDiff;
		    $targetVec2D.xOffset = $x1;
		    $targetVec2D.yOffset = $y1;
	    };

	    //Return constructor
        return Vec2D;
    })();
});
