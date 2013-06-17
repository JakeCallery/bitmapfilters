/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
	    /**
	     * @interface
	     */
        var IPoolable = {};

        IPoolable.init = function($args){};
	    IPoolable.recycle = function(){};

        //Return constructor
        return IPoolable;
    })();
});
