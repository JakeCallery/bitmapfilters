/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define(['jac/events/JacEvent','jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){
        /**
         * Creates a LogEvent object
         * @param {String} $type
         * @extends {JacEvent}
         * @constructor
         */
        function LogEvent($type){
            //super
            JacEvent.call(this, $type);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(LogEvent,JacEvent);


	    /** @const */
		LogEvent.TARGET_UPDATED = 'logTargetUpdatedEvent';


        //Return constructor
        return LogEvent;
    })();
});
