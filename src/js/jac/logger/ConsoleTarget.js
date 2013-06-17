/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/logger/BaseTarget', 'jac/utils/ObjUtils', 'jac/logger/events/LogEvent'],
function(BaseTarget, ObjUtils, LogEvent){
    return (function(){
        /**
         * Creates a ConsoleTarget object
         * @extends {BaseTarget}
         * @constructor
         */
        function ConsoleTarget(){

	        //super
	        BaseTarget.call(this);

	        //Private
	        var _hasConsoleLog = (('console' in window) && ('log' in window.console));

	        //Privileged Methods
	        this.getHasConsoleLog = function(){
		        return _hasConsoleLog;
	        };
        }

		//Inherit / Extend
	    ObjUtils.inheritPrototype(ConsoleTarget, BaseTarget);

	    /**
	     * Prints args to the browser console.  Dispatchers LogEvent.TARGET_UPDATED when done
	     * @param {...} $args variadic args
	     * @override
	     */
	    ConsoleTarget.prototype.output = function($args){
		    if(this.isEnabled){
			    var self = this;
		        ConsoleTarget.superClass.output.call(self, $args);
				if(this.getHasConsoleLog()){
					var list = Array.prototype.slice.call(arguments);
					var str = list.join(',');
					console.log(str);

					this.dispatchEvent(new LogEvent(LogEvent.TARGET_UPDATED));
				}
		    }
	    };

        //Return constructor
        return ConsoleTarget;
    })();
});
