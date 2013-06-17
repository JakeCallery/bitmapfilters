/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/EventDispatcher','jac/utils/ObjUtils'],
function(EventDispatcher,ObjUtils){
    return (function(){
        /**
         * Creates a BaseTarget object
         * @extend {EventDispatcher)
         * @constructor
         */
        function BaseTarget(){

	        //super
	        EventDispatcher.call(this);

	        //public
	        this.isEnabled = true;
        }

	    //Inherit / Extend
	    ObjUtils.inheritPrototype(BaseTarget,EventDispatcher);

	    /**
	     * File output of items to be logged.  This is mean to be overridden
	     * @param $args {...} varadic args
	     */
	    BaseTarget.prototype.output = function($args){
		  //OVERRIDE ME
	    };

        //Return constructor
        return BaseTarget;
    })();
});
