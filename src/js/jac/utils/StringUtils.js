/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var StringUtils = {};

	    /**
	     * Formats seconds into Hours:Minutes:Seconds
	     * @param {Number} $seconds
	     * @param {String} [$delim=':']
	     * @returns {String}
	     */
	    StringUtils.formatSecondsToHMS = function($seconds, $delim){
			$delim = ($delim !== undefined)?':':$delim;

		    var hours = '';
		    var min = '';
		    var sec = '';

		    var finalString = '';

		    var hn = Math.floor($seconds / 60 / 60);
		    var mn = Math.floor($seconds / 60) % 60;

		    if(hn > 0){
			    hours = hn.toString();
			    finalString += hours + $delim;
		    }

		    min = (hn>0)?StringUtils.padNumWithZeros(mn,2):mn.toString();
		    finalString += min + $delim;

		    sec = StringUtils.padNumWithZeros($seconds % 60, 2);
		    finalString += sec;

		    return finalString;
	    };

	    /**
	     * Pads a number out to a number of zero places if needed
	     * @param {Number} $num
	     * @param {int} $numPlaces
	     * @returns {String} string with the number having been padded with leading zeros
	     */
        StringUtils.padNumWithZeros = function($num, $numPlaces){
	        var diff = $numPlaces - $num.toString().length;
	        var str = '';

	        if (diff > 0)
	        {//add zeros
		        for (var i = 0; i < diff; i++)
		        {//add zeros
			        str += '0';
		        }//add zeros
	        }//add zeros

	        str += $num;

	        return str;
        };

	    /**
	     * Removes carriage returns and new lines all throughout a string
	     * @param {String} $string
	     * @param {String} $replaceWith
	     * @returns {String}
	     */
	    StringUtils.stripNewLines = function($string, $replaceWith){
		    $replaceWith = ($replaceWith !== undefined)?$replaceWith:'';
		    var str = $string;
		    str = str.replace(/(\r|\n)/g,$replaceWith);
		    return str;

	    };

	    /**
	     * Removes all whitespace from within a string
	     * @param {String} $string
	     * @returns {String}
	     */
	    StringUtils.stripWhiteSpace = function($string){
		    var str = $string;
		    str = str.replace(/\s/g,'');
		    return str;
	    };

	    /**
	     * Removes the leading and trailing whitespace from a string
	     * @param {String} $string
	     * @returns {String}
	     */
	    StringUtils.stripSurroundingWhiteSpace = function($string){
		    var str = $string;
		    str = str.replace(/^\s+|\s$/g,'');
		    return str;
	    };

	    /**
	     * Converts a string (must be "true" or "false") to an honest boolean
	     * @param $boolString
	     * @returns {boolean}
	     */
	    StringUtils.toBoolean = function($boolString){
		    var bs = $boolString.toLowerCase();

		    if (bs === "true")
		    {//true
			    return true;
		    }//true
		    else if (bs === "false")
		    {//false
			    return false;
		    }//false
		    else
		    {//bad input
			    throw new Error("toBoolean Bad Input: " + $boolString);
		    }//bad input
	    };

	    StringUtils.formatNumWithDelim = function($num, $delim, $positionsPerDelim){
		    $delim = ($delim !== undefined)?$delim:',';
		    $positionsPerDelim = ($positionsPerDelim !== undefined)?$positionsPerDelim:3;

		    var numStr = $num.toString();
		    var tmp = '';
		    var partial = '';

		    if (numStr.indexOf(".") != -1)
		    {//split
			    var tokens = numStr.split(".");
			    partial = tokens[1];
			    numStr = tokens[0];
		    }//split

		    if (numStr.length <= $positionsPerDelim)
		    {//no need
			    return $num.toString();
		    }//no need

		    for (var i = numStr.length; i >= 0; i -= $positionsPerDelim)
		    {//grab sets
			    if (i - $positionsPerDelim >= 0)
			    {//
				    var s = $delim + numStr.substr(i - $positionsPerDelim, $positionsPerDelim);
				    tmp = s + tmp;
			    }//
			    else
			    {//done
				    var s1 = numStr.substr(0, i);
				    tmp = s1 + tmp;
			    }//done
		    }//grab sets

		    if (tmp.charAt(0) === $delim)
		    {//remove
			    tmp = tmp.substring(1);
		    }//remove

		    if(partial !== ''){
			    tmp += '.' + partial;
		    }

		    return tmp;
	    };

        //Return constructor
        return StringUtils;
    })();
});
