/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Rectangle object
         * @param {Number} $x
         * @param {Number} $y
         * @param {Number} $width
         * @param {Number} $height
         * @constructor
         */
        function Rectangle($x, $y, $width, $height){
            this.x = $x;
	        this.y = $y;
	        this.width = $width;
	        this.height = $height;
        }

	    Rectangle.prototype.getTop = function(){
		    return this.y;
	    };

	    Rectangle.prototype.getBottom = function(){
		    return this.y + this.height;
	    };

	    Rectangle.prototype.getLeft = function(){
		    return this.x;
	    };

	    Rectangle.prototype.getRight = function(){
		    return this.x + this.width;
	    };

	    Rectangle.prototype.intersectsRect = function($rect){
			var xOverlap = false;
		    var yOverlap = false;

		    if((this.x >= $rect.x && this.x <= $rect.x + $rect.width) ||
			    $rect.x >= this.x && $rect.x <= this.x + this.width){
			    xOverlap = true;
		    }

		    if((this.y >= $rect.y && this.y <= $rect.y + $rect.height) ||
			    $rect.y >= this.y && $rect.y <= this.y + this.height){
			    yOverlap = true;
		    }

		    return xOverlap && yOverlap;

	    };

        //Return constructor
        return Rectangle;
    })();
});
