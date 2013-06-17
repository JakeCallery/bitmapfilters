/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
       var ThresholdFilter = {};

	    ThresholdFilter.filter = function($srcData, $dstData, $operation, $threshold, $replaceColor, $mask, $copySource){
			var color = -1;
		    var maskedColor = -1;
		    var goodColor = false;
		    if($copySource === undefined){$copySource=false;}

		    var replaceRed = $replaceColor >> 24 & 0xFF;
		    var replaceGreen = $replaceColor >> 16 & 0xFF;
		    var replaceBlue = $replaceColor >> 8 & 0xFF;
		    var replaceAlpha = $replaceColor & 0xFF;

		    var maskedThreshold = $threshold & $mask;

		    for(var i = 0, l = $srcData.length; i < l; i+=4){
				color = $srcData[i]<<24 | $srcData[i+1]<<16 | $srcData[i+2]<<8 | $srcData[i+3];
			    maskedColor = color & $mask;

			    if($operation === '<='){
				    if(maskedColor <= maskedThreshold) {
					    goodColor = true;
				    }
			    } else if($operation === '>='){
					if(maskedColor >= maskedThreshold) {
						goodColor = true;
					}
			    } else if($operation === '<'){
				    if(maskedColor < maskedThreshold) {
					    goodColor = true;
				    }

			    } else if($operation === '>'){
				    if(maskedColor > maskedThreshold) {
					    goodColor = true;
				    }
			    } else if($operation === '=='){
				    if(maskedColor == maskedThreshold) {
					    goodColor = true;
				    }
			    }

			    if(goodColor === true){
				    $dstData[i] = replaceRed;
				    $dstData[i+1] = replaceGreen;
				    $dstData[i+2] = replaceBlue;
				    $dstData[i+3] = replaceAlpha;
				    goodColor = false;
			    } else if($copySource === true){
				    $dstData[i] = $srcData[i];
				    $dstData[i+1] = $srcData[i+1];
				    $dstData[i+2] = $srcData[i+2];
				    $dstData[i+3] = $srcData[i+3];
			    }

			}

		    return $dstData;
	    };

        //Return constructor
        return ThresholdFilter;
    })();
});
