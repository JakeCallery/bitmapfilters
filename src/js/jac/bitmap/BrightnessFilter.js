/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var BrightnessFilter = {};

	    /**
	     * Adjust the brightness
	     * @param $srcData
	     * @param $dstData
	     * @param $adjustment -100 to 100 (Darker to Ligher)
	     */
	    BrightnessFilter.filter = function($srcData, $dstData, $adjustment){
		    var adjust = Math.floor(255 * $adjustment/100);
		    var r, g, b, a;
		    for(var i = 0, l = $srcData.length; i < l; i += 4){
				r = $srcData[i] + adjust;
			    if(r > 255){
				    r=255;
			    } else if (r < 0){
				    r = 0;
			    }

			    g = $srcData[i+1] + adjust;
			    if(g > 255){
				    g=255;
			    } else if (g < 0){
				    g = 0;
			    }

			    b = $srcData[i+2] + adjust;
			    if(b > 255){
				    b=255;
			    } else if (b < 0){
				    b = 0;
			    }

			    a = $srcData[i+3];

			    $dstData[i] = r;
			    $dstData[i+1] = g;
			    $dstData[i+2] = b;
			    $dstData[i+3] = a;


		    }
	    };
        
        
        //Return constructor
        return BrightnessFilter;
    })();
});
