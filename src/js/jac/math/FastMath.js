/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
       var FastMath = {};

	    FastMath.abs = function($value){
		    return ($value ^ (value >> 31)) - ($value >> 31);
	    };
        
        //Return constructor
        return FastMath;
    })();
});
