/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */
define(['jac/events/JacEvent', 'jac/utils/ObjUtils'],
	function(JacEvent, ObjUtils){
    return (function(){

        /**
         * Creates a ServReqEvent object
         * @param {String} $type
         * @param {XMLHttpRequest} $request
         * @extends {JacEvent}
         * @constructor
         */
        function ServReqEvent($type, $request){

	        //super
	        JacEvent.call(this, $type);

	        //Public vars
	        /** @type {XMLHttpRequest} */
	        this.request = $request;
	        /** @type {String} */
	        this.status = null;
	        /** @type {Boolean} */
	        this.isSuccess = false;
	        /** @type {Object} */
	        this.response = null;
	        /** @type {String} */
	        this.error = null;

	        if($request.hasOwnProperty('status')){this.status = $request.status;}
	        if($request.hasOwnProperty('status') && $request.status === 200){this.isSuccess = true;}
	        if($request.hasOwnProperty('responseText')){this.response = $request.responseText;}
        }

	    //inherit / extend
	    ObjUtils.inheritPrototype(ServReqEvent, JacEvent);

	    /** @const */
	    ServReqEvent.COMPLETE = 'servReqCompleteEvent';
	    /** @const */
	    ServReqEvent.READY_STATE_0 = 'servReqReadyState0Event';
	    /** @const */
	    ServReqEvent.READY_STATE_1 = 'servReqReadyState1Event;';
	    /** @const */
	    ServReqEvent.READY_STATE_2 = 'servReqReadyState2Event;';
	    /** @const */
	    ServReqEvent.READY_STATE_3 = 'servReqReadyState3Event;';

        //Return constructor
        return ServReqEvent;
    })();
});