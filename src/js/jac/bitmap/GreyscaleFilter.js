/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var GreyscaleFilter = {};

	    GreyscaleFilter.filter = function($srcData, $targetData){
		    var r = null;
		    var g = null;
		    var b = null;
		    var a = null;

		    for(var i = 0, l = $srcData.length; i < l; i+=4){
				r = $srcData[i];
			    g = $srcData[i+1];
			    b = $srcData[i+2];
				a = $srcData[i+3];

			    //rgb
			    $targetData[i] = $targetData[i+1] = $targetData[i+2] = 0.2126*r + 0.7152*g + 0.0722*b;

			    //alpha
			    $targetData[i+3] = $srcData[i+3];
		    }

		    return $targetData;

	    };
        
        
        //Return constructor
        return GreyscaleFilter;
    })();
});
